import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button, Card, ListItem, Screen, SectionHeader } from "../../components/ui";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import type { CreditAccount, CreditTransaction } from "../../src/lib/creditsService";
import { getBalance, listTransactions } from "../../src/lib/creditsService";

const confidenceTiers = [
  { label: "High confidence", multiplier: "1.0x", description: "Partner confirmation / QR or geo locks" },
  { label: "Medium confidence", multiplier: "0.6x", description: "Photo evidence + spot checks" },
  { label: "Foundation", multiplier: "0.3x", description: "Self-report or basic device ping" },
] as const;

export default function CreditsOverviewScreen() {
  const { profile } = useProfile();
  const { showToast } = useToast();
  const [account, setAccount] = useState<CreditAccount | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!profile?.userId) return;
    setLoading(true);
    try {
      const [acct, txs] = await Promise.all([getBalance(), listTransactions({ limit: 20 })]);
      setAccount(acct);
      setTransactions(txs);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to load credits");
    } finally {
      setLoading(false);
    }
  }, [profile?.userId, showToast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!profile?.userId) return;
      try {
        const [acct, txs] = await Promise.all([getBalance(), listTransactions({ limit: 20 })]);
        if (!cancelled) {
          setAccount(acct);
          setTransactions(txs);
        }
      } catch (err) {
        if (!cancelled) {
          showToast(err instanceof Error ? err.message : "Unable to load credits");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.userId, showToast]);

  const handleRefresh = async () => {
    await loadData();
  };
  const openRedeem = () => router.push("/credits/redeem" as never);

  const renderTransaction = (tx: CreditTransaction) => {
    const amount = tx.amount;
    const isPositive = amount > 0;
    const formattedAmount = `${isPositive ? "+" : ""}${amount.toFixed(0)}`;
    const metadata = tx.metadata ?? {};
    const secondaryLabel =
      typeof metadata.item_name === "string"
        ? metadata.item_name
        : typeof metadata.project_name === "string"
        ? metadata.project_name
        : typeof metadata.rule_code === "string"
        ? metadata.rule_code.replace(/_/g, " ")
        : tx.source_type;
    const dateLabel = new Date(tx.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    return (
      <ListItem
        key={tx.id}
        title={`${tx.type} • ${secondaryLabel}`}
        subtitle={`${dateLabel} • confidence ${(tx.verification_confidence ?? 0).toFixed(2)}`}
        right={<Text style={[styles.amount, isPositive ? styles.amountPositive : styles.amountNegative]}>{formattedAmount}</Text>}
        style={styles.listItem}
      />
    );
  };

  if (!profile?.userId) {
    return (
      <Screen>
        <SectionHeader title="Impact Credits" subtitle="Sign in to start earning." />
        <Card>
          <Text style={styles.emptyTitle}>You need to be signed in</Text>
          <Text style={styles.emptySubtitle}>Sign in through the Profile tab to unlock credits and rewards.</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Impact Credits"
        subtitle="Track, redeem, and donate your closed-loop credits."
        right={<Button title="Redeem" size="sm" variant="secondary" onPress={openRedeem} />}
      />

      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available credits</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceValue}>{(account?.balance ?? 0).toFixed(0)}</Text>
          <Text style={styles.balanceUnit}>credits</Text>
        </View>
        <Text style={styles.balanceMeta}>Lifetime earned: {(account?.total_earned ?? 0).toFixed(0)}</Text>
        <Button title={loading ? "Refreshing..." : "Refresh wallet"} onPress={handleRefresh} disabled={loading} style={styles.refreshBtn} />
      </Card>

      <Card style={styles.confidenceCard}>
        <Text style={styles.sectionTitle}>Verification confidence tiers</Text>
        {confidenceTiers.map((tier) => (
          <View key={tier.label} style={styles.tierRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tierLabel}>{tier.label}</Text>
              <Text style={styles.tierDescription}>{tier.description}</Text>
            </View>
            <View style={styles.tierChip}>
              <Text style={styles.tierMultiplier}>{tier.multiplier}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.tierHint}>Future verification signals (QR, geofence, partner attestations) plug into this multiplier model.</Text>
      </Card>

      <SectionHeader title="Recent transactions" subtitle="Immutable ledger – append-only." />
      {loading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.neon} />
        </View>
      )}
      {!loading && transactions.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No credits yet</Text>
          <Text style={styles.emptySubtitle}>Complete quests, verified movement, or partner actions to earn your first credits.</Text>
          <Button title="View quests" variant="secondary" onPress={() => router.push("/(tabs)/quests")} style={styles.emptyCta} />
        </Card>
      ) : (
        transactions.slice(0, 6).map(renderTransaction)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  balanceLabel: {
    color: colors.textDim,
    fontWeight: "600",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: "900",
    color: colors.text,
  },
  balanceUnit: {
    marginLeft: space.sm,
    color: colors.textDim,
    fontWeight: "600",
  },
  balanceMeta: {
    color: colors.textDim,
    marginTop: 4,
  },
  refreshBtn: {
    marginTop: space.md,
  },
  confidenceCard: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: space.md,
  },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.md,
  },
  tierLabel: {
    color: colors.text,
    fontWeight: "700",
  },
  tierDescription: {
    color: colors.textDim,
    marginTop: 4,
  },
  tierChip: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cardBorder,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    marginLeft: space.md,
    backgroundColor: colors.card,
  },
  tierMultiplier: {
    color: colors.neon,
    fontWeight: "800",
  },
  tierHint: {
    color: colors.textDim,
    fontSize: 12,
  },
  listItem: {
    marginBottom: space.sm,
  },
  amount: {
    fontWeight: "800",
    fontSize: 16,
  },
  amountPositive: {
    color: colors.neon,
  },
  amountNegative: {
    color: "#FF6262",
  },
  loadingWrap: {
    marginHorizontal: space.lg,
    marginBottom: space.md,
    paddingVertical: space.md,
  },
  emptyCard: {
    marginHorizontal: space.lg,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
  },
  emptySubtitle: {
    color: colors.textDim,
    marginTop: 6,
  },
  emptyCta: {
    marginTop: space.md,
  },
});
