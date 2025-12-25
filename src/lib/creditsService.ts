import supabase from "./supabase";

export type CreditTransactionType =
  | "EARN"
  | "REDEEM"
  | "DONATE"
  | "SPONSOR_TOPUP"
  | "PENALTY"
  | "REVERSAL";

export type ConfidenceTier = "low" | "medium" | "high";

export type CreditAccount = {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  created_at: string;
  updated_at: string;
};

export type CreditTransaction = {
  id: string;
  account_id: string;
  user_id: string;
  type: CreditTransactionType;
  amount: number;
  balance_after: number;
  source_type: string;
  verification_confidence: number;
  metadata: Record<string, unknown>;
  client_request_id: string;
  proof_hash?: string | null;
  sponsor_pool_id?: string | null;
  redemption_id?: string | null;
  related_transaction_id?: string | null;
  created_at: string;
};

type EarnCreditsInput = {
  ruleCode: string;
  confidenceTier?: ConfidenceTier;
  sourceType: string;
  verificationConfidence?: number;
  metadata?: Record<string, unknown>;
  sponsorPoolId?: string | null;
  proofHash?: string | null;
  clientRequestId: string;
};

type RedeemCreditsInput = {
  itemId: string;
  itemName: string;
  cost: number;
  metadata?: Record<string, unknown>;
  clientRequestId: string;
};

type DonateCreditsInput = {
  projectId: string;
  projectName: string;
  amount: number;
  metadata?: Record<string, unknown>;
  clientRequestId: string;
};

type ListTransactionsOptions = {
  limit?: number;
  offset?: number;
};

const DEFAULT_CONFIDENCE: ConfidenceTier = "medium";

function sanitizeMetadata(meta?: Record<string, unknown>): Record<string, unknown> {
  if (!meta) return {};
  try {
    return JSON.parse(JSON.stringify(meta));
  } catch {
    return {};
  }
}

export function generateClientRequestId(prefix: string) {
  const safePrefix = prefix.replace(/[^a-z0-9-_]/gi, "").slice(0, 24) || "credits";
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${safePrefix}-${Date.now().toString(36)}-${randomPart}`;
}

async function ensureAccount(): Promise<CreditAccount> {
  const { data, error } = await supabase.rpc("ensure_credit_account");
  if (error) {
    throw new Error(error.message ?? "Unable to load credits wallet");
  }
  return data as CreditAccount;
}

export async function getBalance() {
  return ensureAccount();
}

export async function listTransactions(options: ListTransactionsOptions = {}) {
  const { limit = 20, offset = 0 } = options;
  const { data, error } = await supabase
    .from("credit_transactions")
    .select(
      "id, account_id, user_id, type, amount, balance_after, source_type, verification_confidence, metadata, client_request_id, proof_hash, sponsor_pool_id, redemption_id, related_transaction_id, created_at"
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message ?? "Unable to load credits transactions");
  }

  return (data ?? []) as CreditTransaction[];
}

export async function earnCredits({
  ruleCode,
  confidenceTier = DEFAULT_CONFIDENCE,
  sourceType,
  verificationConfidence = 1,
  metadata,
  sponsorPoolId,
  proofHash,
  clientRequestId,
}: EarnCreditsInput) {
  if (!clientRequestId) {
    throw new Error("clientRequestId is required for idempotent earn credits calls");
  }

  const { data, error } = await supabase.rpc("earn_credits_with_rule", {
    p_rule_code: ruleCode,
    p_confidence_tier: confidenceTier,
    p_source_type: sourceType,
    p_client_request_id: clientRequestId,
    p_verification_confidence: verificationConfidence,
    p_metadata: sanitizeMetadata(metadata),
    p_proof_hash: proofHash ?? null,
    p_sponsor_pool_id: sponsorPoolId ?? null,
  });

  if (error) {
    throw new Error(error.message ?? "Unable to earn credits");
  }

  return data as CreditTransaction;
}

export async function redeemCredits({
  itemId,
  itemName,
  cost,
  metadata,
  clientRequestId,
}: RedeemCreditsInput) {
  if (!clientRequestId) {
    throw new Error("clientRequestId is required to prevent duplicate redemptions");
  }

  if (cost <= 0) {
    throw new Error("Cost must be positive");
  }

  const account = await ensureAccount();
  if (account.balance < cost) {
    throw new Error("Insufficient credits");
  }

  const { data, error } = await supabase.rpc("redeem_credits", {
    p_item_id: itemId,
    p_item_name: itemName,
    p_cost: cost,
    p_client_request_id: clientRequestId,
    p_metadata: sanitizeMetadata(metadata),
  });

  if (error) {
    throw new Error(error.message ?? "Unable to redeem credits");
  }

  return data as CreditTransaction;
}

export async function donateCredits({
  projectId,
  projectName,
  amount,
  metadata,
  clientRequestId,
}: DonateCreditsInput) {
  if (!clientRequestId) {
    throw new Error("clientRequestId is required for donations");
  }

  if (amount <= 0) {
    throw new Error("Donation amount must be positive");
  }

  const account = await ensureAccount();
  if (account.balance < amount) {
    throw new Error("Insufficient credits");
  }

  const { data, error } = await supabase.rpc("donate_credits", {
    p_project_id: projectId,
    p_project_name: projectName,
    p_amount: amount,
    p_client_request_id: clientRequestId,
    p_metadata: sanitizeMetadata(metadata),
  });

  if (error) {
    throw new Error(error.message ?? "Unable to donate credits");
  }

  return data as CreditTransaction;
}
