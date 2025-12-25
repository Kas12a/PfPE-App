-- Off-chain credits ledger + utility tables for Play for Planet Earth
create extension if not exists "pgcrypto";

create type public.credit_transaction_type as enum (
  'EARN',
  'REDEEM',
  'DONATE',
  'SPONSOR_TOPUP',
  'PENALTY',
  'REVERSAL'
);

create table if not exists public.sponsor_pools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sponsor_name text,
  description text,
  total_budget numeric(14,2) not null default 0,
  remaining_budget numeric(14,2) not null default 0,
  currency text not null default 'credits',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  balance numeric(14,2) not null default 0,
  total_earned numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint credit_accounts_user_unique unique (user_id)
);

create table if not exists public.credit_rules (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  description text,
  base_reward numeric(12,2) not null,
  confidence_tier text not null check (confidence_tier in ('low', 'medium', 'high')),
  confidence_multiplier numeric(4,2) not null check (confidence_multiplier >= 0 and confidence_multiplier <= 5),
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint credit_rules_code_tier_unique unique (code, confidence_tier)
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.credit_accounts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type public.credit_transaction_type not null,
  amount numeric(14,2) not null,
  balance_after numeric(14,2) not null,
  source_type text not null check (char_length(source_type) > 0),
  verification_confidence numeric(5,4) not null default 1 check (verification_confidence >= 0 and verification_confidence <= 1),
  metadata jsonb not null default '{}'::jsonb,
  client_request_id text not null,
  proof_hash text,
  sponsor_pool_id uuid references public.sponsor_pools (id),
  redemption_id uuid,
  related_transaction_id uuid references public.credit_transactions (id),
  created_at timestamptz not null default now(),
  constraint credit_transactions_amount_nonzero check (amount <> 0)
);

create table if not exists public.credit_redemptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.credit_accounts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('marketplace', 'donation')),
  item_id text not null,
  item_name text not null,
  cost numeric(14,2) not null check (cost > 0),
  status text not null default 'completed' check (status in ('pending', 'completed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  client_request_id text not null,
  transaction_id uuid unique,
  created_at timestamptz not null default now()
);

alter table public.credit_transactions
  add constraint credit_transactions_redemption_id_fkey
  foreign key (redemption_id) references public.credit_redemptions (id);

alter table public.credit_redemptions
  add constraint credit_redemptions_transaction_fk
  foreign key (transaction_id) references public.credit_transactions (id);

create index if not exists sponsor_pools_active_idx on public.sponsor_pools (is_active, remaining_budget);
create index if not exists credit_accounts_user_idx on public.credit_accounts (user_id);
create index if not exists credit_transactions_user_created_idx on public.credit_transactions (user_id, created_at desc);
create unique index if not exists credit_transactions_user_request_idx on public.credit_transactions (user_id, client_request_id);
create index if not exists credit_redemptions_user_created_idx on public.credit_redemptions (user_id, created_at desc);
create unique index if not exists credit_redemptions_user_request_idx on public.credit_redemptions (user_id, client_request_id);

alter table public.credit_accounts enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.credit_redemptions enable row level security;
alter table public.credit_rules enable row level security;

drop policy if exists credit_accounts_rls_select on public.credit_accounts;
create policy credit_accounts_rls_select on public.credit_accounts
  for select
  using (auth.uid() = user_id);

drop policy if exists credit_transactions_rls_select on public.credit_transactions;
create policy credit_transactions_rls_select on public.credit_transactions
  for select
  using (auth.uid() = user_id);

drop policy if exists credit_redemptions_rls_select on public.credit_redemptions;
create policy credit_redemptions_rls_select on public.credit_redemptions
  for select
  using (auth.uid() = user_id);

drop policy if exists credit_rules_rls_select on public.credit_rules;
create policy credit_rules_rls_select on public.credit_rules
  for select
  using (true);

create or replace function public.ensure_credit_account(p_user_id uuid default null)
returns public.credit_accounts
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user uuid := coalesce(p_user_id, auth.uid());
  account_record public.credit_accounts;
begin
  if target_user is null then
    raise exception 'auth-required';
  end if;

  select *
  into account_record
  from public.credit_accounts
  where user_id = target_user
  for update;

  if not found then
    insert into public.credit_accounts (user_id)
    values (target_user)
    returning * into account_record;
  end if;

  return account_record;
end;
$$;

create or replace function public.private_record_credit_transaction(
  p_user_id uuid,
  p_transaction_type public.credit_transaction_type,
  p_amount numeric,
  p_source_type text,
  p_verification_confidence numeric,
  p_metadata jsonb default '{}'::jsonb,
  p_client_request_id text,
  p_redemption_id uuid default null,
  p_proof_hash text default null,
  p_sponsor_pool_id uuid default null,
  p_related_transaction_id uuid default null
) returns public.credit_transactions
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  account_row public.credit_accounts;
  tx_row public.credit_transactions;
  current_balance numeric(14,2);
  new_balance numeric(14,2);
  safe_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
  existing_tx public.credit_transactions;
  pool_row public.sponsor_pools;
  normalized_amount numeric(14,2) := round(p_amount::numeric, 2);
begin
  if p_user_id is null then
    raise exception 'missing-user';
  end if;

  select *
  into existing_tx
  from public.credit_transactions
  where user_id = p_user_id
    and client_request_id = p_client_request_id;

  if found then
    return existing_tx;
  end if;

  select *
  into account_row
  from public.credit_accounts
  where user_id = p_user_id
  for update;

  if not found then
    insert into public.credit_accounts (user_id)
    values (p_user_id)
    returning * into account_row;
  end if;

  current_balance := account_row.balance;
  new_balance := current_balance + normalized_amount;

  if normalized_amount = 0 then
    raise exception 'amount-must-be-nonzero';
  end if;

  if normalized_amount < 0 and new_balance < 0 then
    raise exception 'insufficient_balance';
  end if;

  if p_verification_confidence < 0 or p_verification_confidence > 1 then
    raise exception 'verification_confidence_out_of_bounds';
  end if;

  if p_sponsor_pool_id is not null then
    if normalized_amount <= 0 then
      raise exception 'sponsor_pool_requires_positive_amount';
    end if;

    select *
    into pool_row
    from public.sponsor_pools
    where id = p_sponsor_pool_id
      and is_active = true
    for update;

    if not found then
      raise exception 'sponsor_pool_not_found';
    end if;

    if pool_row.remaining_budget < normalized_amount then
      raise exception 'sponsor_pool_insufficient_budget';
    end if;

    update public.sponsor_pools
    set remaining_budget = remaining_budget - normalized_amount,
        updated_at = now(),
        metadata = metadata || jsonb_build_object('last_allocation_at', now())
    where id = pool_row.id;

    safe_metadata := safe_metadata || jsonb_build_object(
      'sponsor_pool_id', pool_row.id,
      'sponsor_pool_name', pool_row.name,
      'sponsor_funded', true
    );
  end if;

  update public.credit_accounts
  set balance = new_balance,
      total_earned = total_earned + greatest(normalized_amount, 0),
      updated_at = now()
  where id = account_row.id
  returning * into account_row;

  insert into public.credit_transactions (
    account_id,
    user_id,
    type,
    amount,
    balance_after,
    source_type,
    verification_confidence,
    metadata,
    client_request_id,
    proof_hash,
    sponsor_pool_id,
    redemption_id,
    related_transaction_id
  )
  values (
    account_row.id,
    p_user_id,
    p_transaction_type,
    normalized_amount,
    new_balance,
    p_source_type,
    p_verification_confidence,
    safe_metadata,
    p_client_request_id,
    p_proof_hash,
    p_sponsor_pool_id,
    p_redemption_id,
    p_related_transaction_id
  )
  returning * into tx_row;

  return tx_row;
end;
$$;

create or replace function public.earn_credits_with_rule(
  p_rule_code text,
  p_confidence_tier text,
  p_source_type text,
  p_client_request_id text,
  p_verification_confidence numeric default 1,
  p_metadata jsonb default '{}'::jsonb,
  p_proof_hash text default null,
  p_sponsor_pool_id uuid default null
) returns public.credit_transactions
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  rule_row public.credit_rules;
  calculated_amount numeric(14,2);
  merged_metadata jsonb;
begin
  if uid is null then
    raise exception 'auth-required';
  end if;

  select *
  into rule_row
  from public.credit_rules
  where code = p_rule_code
    and confidence_tier = p_confidence_tier
    and is_active = true
  limit 1;

  if not found then
    raise exception 'credit-rule-missing';
  end if;

  calculated_amount := round(rule_row.base_reward * rule_row.confidence_multiplier, 2);

  if calculated_amount <= 0 then
    raise exception 'invalid-rule-amount';
  end if;

  merged_metadata := coalesce(p_metadata, '{}'::jsonb)
    || jsonb_build_object('rule_id', rule_row.id, 'rule_code', rule_row.code, 'confidence_tier', rule_row.confidence_tier);

  return public.private_record_credit_transaction(
    uid,
    'EARN',
    calculated_amount,
    p_source_type,
    coalesce(p_verification_confidence, rule_row.confidence_multiplier),
    merged_metadata,
    p_client_request_id,
    null,
    p_proof_hash,
    p_sponsor_pool_id,
    null
  );
end;
$$;

create or replace function public.redeem_credits(
  p_item_id text,
  p_item_name text,
  p_cost numeric,
  p_client_request_id text,
  p_metadata jsonb default '{}'::jsonb
) returns public.credit_transactions
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  redemption_row public.credit_redemptions;
  tx_row public.credit_transactions;
  ensured_account public.credit_accounts;
  safe_metadata jsonb;
begin
  if uid is null then
    raise exception 'auth-required';
  end if;

  if p_cost <= 0 then
    raise exception 'cost-must-be-positive';
  end if;

  select *
  into redemption_row
  from public.credit_redemptions
  where user_id = uid
    and client_request_id = p_client_request_id
  limit 1;

  if not found then
    ensured_account := public.ensure_credit_account(uid);

    insert into public.credit_redemptions (
      account_id,
      user_id,
      kind,
      item_id,
      item_name,
      cost,
      status,
      metadata,
      client_request_id
    )
    values (
      ensured_account.id,
      uid,
      'marketplace',
      p_item_id,
      p_item_name,
      p_cost,
      'completed',
      coalesce(p_metadata, '{}'::jsonb),
      p_client_request_id
    )
    returning * into redemption_row;
  end if;

  safe_metadata := coalesce(p_metadata, '{}'::jsonb)
    || jsonb_build_object('redemption_id', redemption_row.id, 'item_id', redemption_row.item_id, 'item_name', redemption_row.item_name);

  tx_row := public.private_record_credit_transaction(
    uid,
    'REDEEM',
    p_cost * -1,
    'marketplace',
    1,
    safe_metadata,
    p_client_request_id,
    redemption_row.id,
    null,
    null,
    null
  );

  update public.credit_redemptions
  set transaction_id = tx_row.id
  where id = redemption_row.id;

  return tx_row;
end;
$$;

create or replace function public.donate_credits(
  p_project_id text,
  p_project_name text,
  p_amount numeric,
  p_client_request_id text,
  p_metadata jsonb default '{}'::jsonb
) returns public.credit_transactions
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  redemption_row public.credit_redemptions;
  tx_row public.credit_transactions;
  ensured_account public.credit_accounts;
  safe_metadata jsonb;
begin
  if uid is null then
    raise exception 'auth-required';
  end if;

  if p_amount <= 0 then
    raise exception 'donation-must-be-positive';
  end if;

  select *
  into redemption_row
  from public.credit_redemptions
  where user_id = uid
    and client_request_id = p_client_request_id
  limit 1;

  if not found then
    ensured_account := public.ensure_credit_account(uid);

    insert into public.credit_redemptions (
      account_id,
      user_id,
      kind,
      item_id,
      item_name,
      cost,
      status,
      metadata,
      client_request_id
    )
    values (
      ensured_account.id,
      uid,
      'donation',
      p_project_id,
      p_project_name,
      p_amount,
      'completed',
      coalesce(p_metadata, '{}'::jsonb),
      p_client_request_id
    )
    returning * into redemption_row;
  end if;

  safe_metadata := coalesce(p_metadata, '{}'::jsonb)
    || jsonb_build_object('donation_id', redemption_row.id, 'project_id', redemption_row.item_id, 'project_name', redemption_row.item_name);

  tx_row := public.private_record_credit_transaction(
    uid,
    'DONATE',
    p_amount * -1,
    'donation',
    1,
    safe_metadata,
    p_client_request_id,
    redemption_row.id,
    null,
    null,
    null
  );

  update public.credit_redemptions
  set transaction_id = tx_row.id
  where id = redemption_row.id;

  return tx_row;
end;
$$;

create or replace function public.sponsor_pool_top_up(
  p_pool_id uuid,
  p_amount numeric,
  p_metadata jsonb default '{}'::jsonb
) returns public.sponsor_pools
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  pool_row public.sponsor_pools;
begin
  if p_amount <= 0 then
    raise exception 'topup-must-be-positive';
  end if;

  update public.sponsor_pools
  set total_budget = total_budget + p_amount,
      remaining_budget = remaining_budget + p_amount,
      metadata = metadata || jsonb_build_object('last_top_up', now()) || coalesce(p_metadata, '{}'::jsonb),
      updated_at = now()
  where id = p_pool_id
  returning * into pool_row;

  if not found then
    raise exception 'sponsor-pool-not-found';
  end if;

  return pool_row;
end;
$$;

revoke all on function public.private_record_credit_transaction(uuid, public.credit_transaction_type, numeric, text, numeric, jsonb, text, uuid, text, uuid, uuid) from public;
revoke all on function public.private_record_credit_transaction(uuid, public.credit_transaction_type, numeric, text, numeric, jsonb, text, uuid, text, uuid, uuid) from authenticated;
revoke all on function public.private_record_credit_transaction(uuid, public.credit_transaction_type, numeric, text, numeric, jsonb, text, uuid, text, uuid, uuid) from anon;
grant execute on function public.private_record_credit_transaction(uuid, public.credit_transaction_type, numeric, text, numeric, jsonb, text, uuid, text, uuid, uuid) to service_role;

grant execute on function public.ensure_credit_account(uuid) to authenticated, service_role;
grant execute on function public.earn_credits_with_rule(text, text, text, text, numeric, jsonb, text, uuid) to authenticated, service_role;
grant execute on function public.redeem_credits(text, text, numeric, text, jsonb) to authenticated, service_role;
grant execute on function public.donate_credits(text, text, numeric, text, jsonb) to authenticated, service_role;
revoke all on function public.sponsor_pool_top_up(uuid, numeric, jsonb) from public;
revoke all on function public.sponsor_pool_top_up(uuid, numeric, jsonb) from authenticated;
revoke all on function public.sponsor_pool_top_up(uuid, numeric, jsonb) from anon;
grant execute on function public.sponsor_pool_top_up(uuid, numeric, jsonb) to service_role;

insert into public.credit_rules (code, description, base_reward, confidence_tier, confidence_multiplier, metadata)
values
  ('quest_basic', 'Baseline verified quest completion', 100, 'low', 0.30, jsonb_build_object('signal', 'photo_review')),
  ('quest_basic', 'Baseline verified quest completion', 100, 'medium', 0.60, jsonb_build_object('signal', 'photo_review')),
  ('quest_basic', 'Baseline verified quest completion', 100, 'high', 1.00, jsonb_build_object('signal', 'partner_confirmation')),
  ('movement_steps', 'Steps synced via wearable', 20, 'low', 0.30, jsonb_build_object('signal', 'device_sync')),
  ('movement_steps', 'Steps synced via wearable', 20, 'medium', 0.60, jsonb_build_object('signal', 'device_sync')),
  ('movement_steps', 'Steps synced via wearable', 20, 'high', 1.00, jsonb_build_object('signal', 'device_sync')),
  ('mobility_cycle', 'Cycling commute logging', 40, 'low', 0.30, jsonb_build_object('signal', 'location_hint')),
  ('mobility_cycle', 'Cycling commute logging', 40, 'medium', 0.60, jsonb_build_object('signal', 'location_hint')),
  ('mobility_cycle', 'Cycling commute logging', 40, 'high', 1.00, jsonb_build_object('signal', 'partner_confirmation'))
on conflict (code, confidence_tier) do update
set base_reward = excluded.base_reward,
    confidence_multiplier = excluded.confidence_multiplier,
    description = excluded.description,
    metadata = excluded.metadata,
    updated_at = now();

insert into public.sponsor_pools (name, sponsor_name, description, total_budget, remaining_budget, metadata)
values (
  'Youth Climate Fund',
  'City Climate Office',
  'Public pool used to sponsor verified quests',
  10000,
  10000,
  jsonb_build_object('contact', 'climate-office@example.org')
)
on conflict (id) do nothing;

alter table if exists public.profiles
  add column if not exists wallet_address text;
