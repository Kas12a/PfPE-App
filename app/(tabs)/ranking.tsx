import { router } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, ListItem, ProgressBar, Screen, SectionHeader } from "../../components/ui";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { generateLeagueStandings, getLeagueTier } from "../../src/data/leagues";

function daysUntilReset() {
  const today = new Date();
  const day = today.getDay(); // 0 Sunday
  const daysUntilMonday = (8 - day) % 7 || 7;
  return daysUntilMonday;
}

type StandingRow = ReturnType<typeof generateLeagueStandings>[number] & { isYou?: boolean };

export default function RankingScreen() {
  const { profile } = useProfile();
  const tier = getLeagueTier(profile?.league);
  const userName = profile?.name?.trim() || "You";
  const userPoints = profile?.points ?? 0;
  const userRank = profile?.rank ?? 0;

  const standings = useMemo<StandingRow[]>(() => {
    const base = generateLeagueStandings(profile?.league);
    const mapped = base.map<StandingRow>((member) => {
      if (member.name.toLowerCase().includes("you")) {
        return { ...member, name: `${userName} (YOU)`, points: userPoints, isYou: true };
      }
      return member;
    });
    const exists = mapped.some((m) => m.isYou);
    if (!exists) {
      mapped.push({ id: "you", name: `${userName} (YOU)`, points: userPoints, rank: userRank || mapped.length + 1, isYou: true });
    }
    return mapped.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  }, [profile?.league, userName, userPoints, userRank]);

  return (
    <Screen>
      <SectionHeader title="Ranking" subtitle="Track your league and global progress" />

      <Card style={styles.rankCard}>
        <View style={styles.rankRow}>
          <View>
            <Text style={styles.rankNo}>{userRank ? `#${userRank}` : "—"}</Text>
            <Text style={styles.rankCaption}>Your ranking this week</Text>
          </View>
          <Text style={styles.trophy}>🏆</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <ProgressBar progress={userRank && userRank <= 3 ? 1 : 0.65} />
          <Text style={styles.progressNote}>{userRank && userRank <= 3 ? "You’re in the promotion zone!" : "Reach top 3 to secure promotion."}</Text>
        </View>
        <Button title="View Your Stats" onPress={() => router.push("/ranking-detail")} style={{ marginTop: 12 }} />
      </Card>

      <Card style={styles.leagueCard}>
        <Text style={styles.leagueTitle}>
          {tier.emoji} {tier.name}
        </Text>
        <Text style={styles.leagueDesc}>{tier.description}</Text>
        <View style={styles.leagueMeta}>
          <Text style={styles.leagueMetaText}>Top {tier.promotionSlots} move up</Text>
          <Text style={styles.leagueMetaText}>Bottom {tier.demotionSlots} drop down</Text>
        </View>
        <Text style={styles.resetText}>League resets in {daysUntilReset()} days</Text>
      </Card>

      <SectionHeader title="League Standings" subtitle="Updated hourly" />
      {standings.map((member) => (
        <ListItem
          key={member.id}
          title={member.name}
          subtitle={`#${member.rank}`}
          right={
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.pointsRight}>{member.points.toLocaleString()} pts</Text>
              {!member.isYou ? <Text style={styles.viewBtn}>View profile</Text> : null}
            </View>
          }
        />
      ))}

      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rankCard: { marginHorizontal: space.lg, padding: space.lg },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rankNo: { color: colors.text, fontSize: 28, fontWeight: "900" },
  rankCaption: { color: colors.textDim, marginTop: 4 },
  trophy: { fontSize: 36 },
  progressNote: { marginTop: 6, color: colors.textDim },
  leagueCard: { marginHorizontal: space.lg, marginTop: space.lg, padding: space.lg, borderColor: "rgba(255,255,255,0.08)", borderWidth: 1 },
  leagueTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  leagueDesc: { color: colors.textDim, marginTop: 6 },
  leagueMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  leagueMetaText: { color: colors.text, fontWeight: "600" },
  resetText: { color: colors.textDim, marginTop: 10 },
  pointsRight: { color: colors.neon, fontWeight: "900" },
  viewBtn: { marginTop: 6, color: colors.textDim, fontSize: 12 },
});
