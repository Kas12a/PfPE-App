import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { Button, Card, ProgressBar, Screen, SectionHeader } from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";
import { questFilters, QuestDefinition } from "../../src/data/quests";
import { useQuests } from "../../src/hooks/useQuests";

const FILTERS = ["All", ...questFilters];

export default function QuestsScreen() {
  const [active, setActive] = useState("All");
  const [draftProofs, setDraftProofs] = useState<Record<string, string>>({});
  const [uploadingQuest, setUploadingQuest] = useState<string | null>(null);
  const { profile } = useProfile();
  const { showToast } = useToast();
  const { dailyQuests, evergreenQuests, completions, loading, submitProof, completeQuest } = useQuests();
  const speechLocale = profile?.language === "es" ? "es-ES" : "en-US";

  const allQuests = useMemo(() => [...dailyQuests, ...evergreenQuests], [dailyQuests, evergreenQuests]);
  const filtered = useMemo(
    () => (active === "All" ? allQuests : allQuests.filter((q) => q.category === active)),
    [active, allQuests],
  );

  const weeklyProgress = {
    done: profile?.questsCompletedThisWeek ?? 0,
    target: profile?.weeklyTarget ?? 15,
  };

  const handleProofUpload = async (quest: QuestDefinition) => {
    try {
      setUploadingQuest(quest.id);
      const picker = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: quest.type === "photo" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        quality: 0.7,
      });
      if (picker.canceled) {
        setUploadingQuest(null);
        return;
      }
      const asset = picker.assets?.[0];
      if (!asset?.uri) throw new Error("Unable to read file.");
      const mimeType = asset.mimeType ?? (quest.type === "photo" ? "image/jpeg" : "video/mp4");
      const url = await submitProof(quest, asset.uri, mimeType);
      setDraftProofs((prev) => ({ ...prev, [quest.id]: url }));
      showToast("Proof uploaded");
    } catch (error: any) {
      showToast(error?.message ?? "Could not upload proof.");
    } finally {
      setUploadingQuest(null);
    }
  };

  const handleComplete = async (quest: QuestDefinition) => {
    if (completions[quest.id]) {
      showToast("Already submitted.");
      return;
    }
    const proofUrl = quest.type === "check" ? undefined : draftProofs[quest.id];
    try {
      await completeQuest(quest, proofUrl);
      setDraftProofs((prev) => {
        const next = { ...prev };
        delete next[quest.id];
        return next;
      });
      showToast(quest.type === "check" ? "Quest completed!" : "Submitted for review 🚀");
    } catch (error: any) {
      showToast(error?.message ?? "Unable to submit quest.");
    }
  };

  const speakQuest = (quest: QuestDefinition) => {
    const message = `${quest.title}. ${quest.instructions}`;
    try {
      Speech.stop();
      Speech.speak(message, { language: speechLocale });
    } catch {
      showToast("Unable to start text-to-speech right now.");
    }
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

      <SectionHeader title="Available Today" subtitle="Some quests need proof, others are instant" />
      {loading && filtered.length === 0 ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.neon} />
          <Text style={styles.loadingText}>Loading quests…</Text>
        </View>
      ) : null}
      {filtered.map((quest) => {
        const completion = completions[quest.id];
        const needsProof = quest.type !== "check";
        const proofAdded = Boolean(draftProofs[quest.id] || completion?.proofUrl);
        const isUploading = uploadingQuest === quest.id;
        const disabled =
          Boolean(completion) || (needsProof && !proofAdded);
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
            <Pressable style={styles.ttsButton} onPress={() => speakQuest(quest)} accessibilityRole="button">
              <Text style={styles.ttsText}>{profile?.language === "es" ? "🔊 Escuchar instrucciones" : "🔊 Hear instructions"}</Text>
            </Pressable>
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
                  title={
                    completion
                      ? completion.status === "pending"
                        ? "Pending review"
                        : "Approved"
                      : proofAdded
                        ? "Proof added"
                        : quest.requiresEvidenceLabel ?? "Add proof"
                  }
                  variant={proofAdded ? "secondary" : "primary"}
                  size="sm"
                  onPress={() => handleProofUpload(quest)}
                  disabled={Boolean(completion)}
                  style={styles.button}
                />
              ) : null}
              {isUploading ? (
                <View style={[styles.button, styles.uploading]}>
                  <ActivityIndicator color={colors.background} />
                </View>
              ) : (
                <Button
                  title={completion ? (completion.status === "pending" ? "Submitted" : "Completed") : "Mark complete"}
                  size="sm"
                  variant={completion ? "secondary" : "primary"}
                  disabled={disabled}
                  onPress={() => handleComplete(quest)}
                  style={styles.button}
                />
              )}
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
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: space.lg, marginBottom: space.md },
  loadingText: { color: colors.textDim },
  questCard: { marginHorizontal: space.lg, marginBottom: space.md, padding: space.lg },
  questHeader: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  questTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
  questSubtitle: { color: colors.textDim, marginTop: 4 },
  questMeta: { alignItems: "flex-end" },
  questPoints: { color: colors.neon, fontWeight: "900" },
  questCategory: { color: colors.textDim, fontSize: 12 },
  questInstructions: { color: colors.textDim, marginTop: 12, lineHeight: 20 },
  ttsButton: { marginTop: space.xs },
  ttsText: { color: colors.neon, fontSize: 13, fontWeight: "700" },
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
  uploading: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
