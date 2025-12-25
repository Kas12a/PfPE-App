import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../supabase", () => {
  return {
    __esModule: true,
    default: {
      rpc: vi.fn(),
    },
  };
});

import supabase from "../supabase";
import { redeemCredits } from "../creditsService";

afterEach(() => {
  (supabase.rpc as any).mockReset();
});

describe("redeemCredits", () => {
  it("throws when balance is insufficient", async () => {
    (supabase.rpc as any)
      .mockResolvedValueOnce({ data: { balance: 20 }, error: null });

    await expect(
      redeemCredits({ itemId: "test", itemName: "Reward", cost: 50, clientRequestId: "abc" })
    ).rejects.toThrow(/Insufficient/);
  });

  it("redeems when balance is available", async () => {
    (supabase.rpc as any)
      .mockResolvedValueOnce({ data: { balance: 120 }, error: null })
      .mockResolvedValueOnce({ data: { balance_after: 40 }, error: null });

    const tx = await redeemCredits({ itemId: "reward", itemName: "Reward", cost: 80, clientRequestId: "xyz" });
    expect(tx.balance_after).toBe(40);
    expect((supabase.rpc as any).mock.calls[1][0]).toBe("redeem_credits");
  });
});
