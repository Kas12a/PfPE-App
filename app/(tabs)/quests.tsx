import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Button, Card, ProgressBar, Screen, SectionHeader } from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";
import { dailyQuests, evergreenQuests, questFilters, QuestDefinition } from "../../src/data/quests";

const FILTERS = ["All", ...questFilters];
type QuestState = "todo" | "proof" | "completed";

export default function QuestsScreen() {
  const [active, setActive] = useState("All");
  const [proofs, setProofs] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Record<string, QuestState>>({});
  const { setProfile, profile } = useProfile();
  const { showToast } = useToast();

  const allQuests = useMemo(() => [...dailyQuests, ...evergreenQuests], []);
  const filtered = active === "All" ? allQuests : allQuests.filter((q) => q.category === active);

  const handleEvidence = (quest: QuestDefinition) => {
    setProofs((prev) => ({ ...prev, [quest.id]: true }));
    setStatus((prev) => ({ ...prev, [quest.id]: "proof" }));
    showToast(quest.type === "photo" ? "Photo saved (mock)" : "Video saved (mock)");
  };

  const handleComplete = (quest: QuestDefinition) => {
    if (quest.type !== "check" && !proofs[quest.id]) {
      showToast("Add evidence first.");
      return;
    }
    setStatus((prev) => ({ ...prev, [quest.id]: "completed" }));
    setProfile?.((prev) => ({
      ...prev,
      points: (prev.points ?? 0) + quest.points,
      questsCompletedThisWeek: (prev.questsCompletedThisWeek ?? 0) + 1,
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(`+${quest.points} pts added`);
  };

  const weeklyProgress = {
    done: profile?.questsCompletedThisWeek ?? 0,
    target: profile?.weeklyTarget ?? 15,
  };

  return (
    <Screen>
      <SectionHeader title="Quests" subtitle="Pick a quest and earn points" right={<Text style={styles.viewAll}>Need help?</Text>} />

      <View style={styles.pills}>
        {FILTERS.map((f) => {
          const isOn = f === active;
          return (
            <Pressable key={f} onPress={() => setActive(f)} style={[styles.pill, isOn && styles.pillOn]}>
              <Text style={[styles.pillText, isOn && styles.pillTextOn]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.weekCard}>
        <Text style={styles.weekTitle}>Weekly Goal</Text>
        <Text style={styles.weekSub}>
          Complete {weeklyProgress.target} quests • You’ve done {weeklyProgress.done}
        </Text>
        <ProgressBar progress={weeklyProgress.target === 0 ? 0 : weeklyProgress.done / weeklyProgress.target} />
      </Card>

      <SectionHeader title="Available Today" subtitle="Some quests need proof, some are instant" />
      {filtered.map((quest) => {
        const currentState = status[quest.id] ?? "todo";
        const needsProof = quest.type !== "check";
        const proofAdded = Boolean(proofs[quest.id]);
        return (
          <Card key={quest.id} style={styles.questCard}>
            <View style={styles.questHeader}>
              <View>
                <Text style={styles.questTitle}>{quest.title}</Text>
                <Text style={styles.questSubtitle}>{quest.subtitle}</Text>
              </View>
              <View style={styles.questMeta}>
                <Text style={styles.questPoints}>+{quest.points} pts</Text>
                <Text style={styles.questCategory}>{quest.category}</Text>
              </View>
            </View>
            <Text style={styles.questInstructions}>{quest.instructions}</Text>
            <View style={styles.actionRow}>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>
                  {quest.type === "photo" ? "📷 photo required" : quest.type === "video" ? "🎥 video required" : "✅ instant quest"}
                </Text>
              </View>
              <Text style={styles.dueText}>{quest.due ?? "Anytime"}</Text>
            </View>
            <View style={styles.buttonRow}>
              {needsProof ? (
                <Button
                  title={proofAdded ? "Proof added" : quest.requiresEvidenceLabel ?? "Add proof"}
                  variant={proofAdded ? "secondary" : "primary"}
                  size="sm"
                  onPress={() => handleEvidence(quest)}
                  style={styles.button}
                />
              ) : null}
              <Button
                title={currentState === "completed" ? "Completed" : "Mark complete"}
                size="sm"
                variant={currentState === "completed" ? "secondary" : "primary"}
                disabled={currentState === "completed"}
                onPress={() => handleComplete(quest)}
                style={styles.button}
              />
            </View>
          </Card>
        );
      })}

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewAll: { color: colors.neon, fontWeight: "700" },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: space.lg,
    marginBottom: space.md,
  },
  pill: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  pillOn: {
    backgroundColor: "rgba(217,255,63,0.16)",
    borderColor: colors.neon,
  },
  pillText: { color: colors.text },
  pillTextOn: { color: colors.neon, fontWeight: "700" },
  weekCard: { marginHorizontal: space.lg, padding: space.lg },
  weekTitle: { color: colors.text, fontWeight: "800", fontSize: 16, marginBottom: 6 },
  weekSub: { color: colors.textDim, marginBottom: 10 },
  questCard: { marginHorizontal: space.lg, marginBottom: space.md, padding: space.lg },
  questHeader: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  questTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
  questSubtitle: { color: colors.textDim, marginTop: 4 },
  questMeta: { alignItems: "flex-end" },
  questPoints: { color: colors.neon, fontWeight: "900" },
  questCategory: { color: colors.textDim, fontSize: 12 },
  questInstructions: { color: colors.textDim, marginTop: 12, lineHeight: 20 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  typePill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  typePillText: { color: colors.textDim, fontWeight: "600" },
  dueText: { color: colors.textDim },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  button: { flex: 1 },
});
