# Credits Verification Checklist

Use this script whenever shipping credits features. Replace any placeholder UUIDs with a real `auth.users.id`.

## 1. Database setup

1. Apply the migration:
   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/migrations/20250219_offchain_credits.sql
   ```
2. Confirm base data:
   ```sql
   select code, confidence_tier, base_reward, confidence_multiplier
   from public.credit_rules
   order by code, confidence_tier;
   ```

## 2. Earn → Redeem → Balance walk-through

```sql
-- Replace with an actual UUID from auth.users
select public.ensure_credit_account('00000000-0000-0000-0000-000000000000');

-- Simulate an earn (service-role required because this hits the private helper).
select public.private_record_credit_transaction(
  '00000000-0000-0000-0000-000000000000',
  'EARN',
  150,
  'quest_basic',
  1,
  jsonb_build_object('rule_code','quest_basic', 'note','demo earn'),
  'demo-earn-001'
);

-- Seed a redemption stub + redeem it atomically.
with seeded as (
  insert into public.credit_redemptions (account_id, user_id, kind, item_id, item_name, cost, status, metadata, client_request_id)
  values (
    (select id from credit_accounts where user_id = '00000000-0000-0000-0000-000000000000'),
    '00000000-0000-0000-0000-000000000000',
    'marketplace',
    'demo-reward',
    'Demo Reward',
    100,
    'completed',
    jsonb_build_object('partner','demo partner'),
    'demo-redemption-001'
  )
  returning id
)
select public.private_record_credit_transaction(
  '00000000-0000-0000-0000-000000000000',
  'REDEEM',
  -100,
  'marketplace',
  1,
  jsonb_build_object('seeded', true),
  'demo-redemption-001',
  (select id from seeded)
);

select balance, total_earned from public.credit_accounts where user_id = '00000000-0000-0000-0000-000000000000';
```

## 3. Sponsor pool top-up (service key)

```sql
select public.sponsor_pool_top_up(
  (select id from sponsor_pools where name = 'Youth Climate Fund'),
  500,
  jsonb_build_object('note','demo top-up')
);
```

## 4. RLS guardrail check

Use the SQL editor (or `psql`) with different simulated JWT subjects.

```sql
select set_config('request.jwt.claim.sub', 'USER_A_UUID', true);
select count(*) from public.credit_transactions; -- returns user A rows

select set_config('request.jwt.claim.sub', 'USER_B_UUID', true);
select count(*) from public.credit_transactions; -- returns 0 because user B has no access to user A rows
```

## 5. App level smoke test

1. `npm install` (first run).
2. `npx tsc --noEmit`.
3. `npx expo start` and verify:
   - Rewards tab shows the Impact Credits card.
   - `/credits` screen loads balance + transactions.
   - `/credits/redeem` allows a redeem & donation, each producing a toast and updating balance.
