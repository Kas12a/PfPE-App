import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, SectionHeader } from "../../../components/ui";
import { colors, space } from "../../theme/colors";
import { useStore, type ActionType } from "../../hooks/useStore";
import { useToast } from "../../hooks/useToast";
import { useProfile } from "../../hooks/useProfile";
import { useTranslation } from "../../hooks/useTranslation";

const QUICK_ACTIONS: { type: ActionType; icon: string; labelKey: string; descriptionKey: string }[] = [
  { type: "cycle", icon: "🚲", labelKey: "actions.cycle", descriptionKey: "actions.cycle_desc" },
  { type: "refuse_plastic", icon: "🥤", labelKey: "actions.plastic", descriptionKey: "actions.plastic_desc" },
  { type: "recycle", icon: "♻️", labelKey: "actions.recycle", descriptionKey: "actions.recycle_desc" },
  { type: "energy_save", icon: "💡", labelKey: "actions.energy", descriptionKey: "actions.energy_desc" },
  { type: "plant_tree", icon: "🌱", labelKey: "actions.tree", descriptionKey: "actions.tree_desc" },
];

function timeAgo(ts: number) {
  const delta = Date.now() - ts;
  const minutes = Math.max(0, Math.floor(delta / 60000));
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hr ago";
  return `${hours} hrs ago`;
}

export function ActionLogger() {
  const { addAction, actions, streak, todayTotal, loaded } = useStore();
  const { save } = useProfile();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [loggingType, setLoggingType] = useState<ActionType | null>(null);

  const recent = useMemo(() => actions.slice(0, 3), [actions]);

  const handleLog = (type: ActionType) => {
    try {
      setLoggingType(type);
      const result = addAction({ type });
      save((prev) => ({
        points: (prev.points ?? 0) + result.pts,
        streak: result.streak,
      }));
      showToast(t("actions.logged_toast", "Action logged!"));
    } finally {
      setLoggingType(null);
    }
  };

  return (
    <View style={styles.wrapper}>
      <SectionHeader title={t("actions.title", "Log today’s eco-actions")} subtitle={t("actions.subtitle", "Quickly capture what you’ve done")} />
      <Card style={styles.card}>
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.type}
              style={[styles.quickButton, loggingType === action.type && styles.quickButtonActive]}
              onPress={() => handleLog(action.type)}
              accessibilityRole="button"
              disabled={Boolean(loggingType)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{t(action.labelKey, action.type)}</Text>
              <Text style={styles.actionDesc}>{t(action.descriptionKey, "")}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.miniStats}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>{t("actions.streak", "Day streak")}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{todayTotal}</Text>
            <Text style={styles.statLabel}>{t("actions.today", "Points today")}</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title={t("actions.recent_title", "Recent activity")} subtitle={t("actions.recent_subtitle", "Offline-safe history")} />
      <Card>
        {!loaded ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.neon} />
            <Text style={styles.loadingText}>{t("actions.loading", "Loading your offline log…")}</Text>
          </View>
        ) : null}
        {recent.map((entry) => (
          <View key={entry.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyTitle}>{t(`actions.${entry.type}`, entry.type)}</Text>
              <Text style={styles.historySubtitle}>{timeAgo(entry.at)}</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyPts}>+{entry.pts}</Text>
              <Text style={styles.historySync}>{entry.synced ? t("actions.synced", "Synced") : t("actions.pending_sync", "Pending sync")}</Text>
            </View>
          </View>
        ))}
        {loaded && recent.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t("actions.empty", "No actions logged yet")}</Text>
            <Text style={styles.emptySubtitle}>{t("actions.empty_subtitle", "Use the quick actions above to start a streak.")}</Text>
            <Button title={t("actions.log_first", "Log an action")} size="sm" onPress={() => handleLog("cycle")} />
          </View>
        ) : null}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: space.lg,
    gap: space.md,
  },
  card: {
    marginHorizontal: space.lg,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  quickButton: {
    flexBasis: "48%",
    borderRadius: 18,
    padding: space.md,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  quickButtonActive: {
    borderWidth: 1,
    borderColor: colors.neon,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    color: colors.text,
    fontWeight: "700",
  },
  actionDesc: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  miniStats: {
    flexDirection: "row",
    marginTop: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardBorder,
    paddingTop: space.md,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 20,
  },
  statLabel: {
    color: colors.textDim,
    marginTop: 4,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingVertical: space.sm,
  },
  loadingText: {
    color: colors.textDim,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardBorder,
  },
  historyTitle: {
    color: colors.text,
    fontWeight: "700",
  },
  historySubtitle: {
    color: colors.textDim,
    fontSize: 12,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyPts: {
    color: colors.neon,
    fontWeight: "800",
  },
  historySync: {
    color: colors.textDim,
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: space.lg,
    gap: space.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: "800",
  },
  emptySubtitle: {
    color: colors.textDim,
    textAlign: "center",
    paddingHorizontal: space.lg,
  },
});

export default ActionLogger;
