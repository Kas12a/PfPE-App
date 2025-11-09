import React, { useState } from "react";
import { Image, Linking, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Button, Card, ListItem, ModalSheet, Screen, SectionHeader } from "../../components/ui";
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";
import { space } from "../../src/theme/spacing";
import { useProfile } from "../../src/hooks/useProfile";
import { useToast } from "../../src/hooks/useToast";
import { signOut } from "firebase/auth";
import { auth } from "../../src/lib/firebase";

export default function ProfileScreen() {
  const [notify, setNotify] = useState(false);
  const [loc, setLoc] = useState(true);
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const { profile, setProfile } = useProfile();
  const router = useRouter();
  const [editName, setEditName] = useState(profile?.name ?? "");
  const [editAvatar, setEditAvatar] = useState(profile?.avatar ?? "");
  const [sheet, setSheet] = useState<
    null | { title: string; body: string; primaryText?: string; onPrimary?: () => void | Promise<void> }
  >(null);
  const { showToast } = useToast();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => showToast("Unable to open link"));
  };

  const openSheet = (type: string) => {
    switch (type) {
      case "password":
        setSheet({ title: "Change Password", body: "Password management is coming soon. We\'ll notify you once it\'s ready." });
        break;
      case "privacy":
        setSheet({ title: "Privacy & Data", body: "Review data usage and export your information from the web dashboard." });
        break;
      case "logout":
        setSheet({
          title: "Log Out",
          body: "Logging out will require signing back in on this device.",
          primaryText: "Log Out",
          onPrimary: async () => {
            try {
              await signOut(auth);
            } catch {}
            setProfile?.((prev) => ({ ...prev, isSignedIn: false }));
            showToast("Logged out");
            router.replace("/auth/get-started?mode=login");
          },
        });
        break;
      case "help":
        setSheet({ title: "Help Center", body: "Visit playearth.co.uk for FAQs, field guides, and community updates." });
        break;
      case "contact":
        setSheet({ title: "Contact Us", body: "Email hello@playforplanet.earth and we\'ll respond within 1 business day." });
        break;
      case "about":
        setSheet({ title: "About", body: "Play for Planet Earth v1.0 — learn more at playearth.co.uk." });
        break;
      default:
        setSheet(null);
    }
  };

  return (
    <Screen>
      {/* Stats banner */}
      <Card style={styles.banner}>
        <Text style={styles.name}>{profile?.name ?? "Profile"}</Text>
        <Text style={styles.email}>Joined 2025</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12 days</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>23 days</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>8 quests</Text>
            <Text style={styles.statLabel}>Average / week</Text>
          </View>
        </View>
        <Button title="Add Friends" onPress={() => {}} style={{ marginTop: space.md }} />
      </Card>

      {/* Preferences */}
      <SectionHeader title="Preferences" />
      <Card style={styles.prefRow}>
        <Text style={styles.prefText}>Allow Notifications</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </Card>
      <Card style={styles.prefRow}>
        <Text style={styles.prefText}>Allow Location Access</Text>
        <Switch value={loc} onValueChange={setLoc} />
      </Card>

      {/* Play Mode */}
      <SectionHeader title="Play Mode" />
      <View style={styles.playMode}>
        <Card style={[styles.modeCard, mode === 'individual' && styles.modeOn]}>
          <Text style={styles.modeTitle} onPress={() => setMode('individual')}>Play as an{"\n"}Individual</Text>
        </Card>
        <Card style={[styles.modeCard, mode === 'group' && styles.modeOn]}>
          <Text style={styles.modeTitle} onPress={() => setMode('group')}>Join a{"\n"}group</Text>
        </Card>
      </View>

      {/* Account & Security */}
      <SectionHeader title="Account & Security" />
      <ListItem title="Change Password" onPress={() => openSheet('password')} />
      <ListItem title="Privacy & Data" onPress={() => openSheet('privacy')} />
      <ListItem title="Log Out" right={<Text style={{ color: "#F66" }}>→</Text>} onPress={() => openSheet('logout')} />

      {/* Help & Support */}
      <SectionHeader title="Help & Support" />
      <ListItem title="Help Center" onPress={() => openSheet('help')} />
      <ListItem title="Contact Us" onPress={() => openSheet('contact')} />
      <ListItem title="About" onPress={() => openSheet('about')} />

      <SectionHeader title="Legal" />
      <ListItem title="Privacy Policy" onPress={() => openLink("https://playearth.co.uk/privacy")} />
      <ListItem title="Terms & Conditions" onPress={() => openLink("https://playearth.co.uk/terms")} />

      {/* Edit profile */}
      <SectionHeader title="Edit Profile" />
      <Card style={{ marginHorizontal: space.lg, padding: space.lg }}>
        <Text style={styles.prefText}>Display Name</Text>
        <TextInput
          value={editName}
          onChangeText={setEditName}
          placeholder="Your name"
          placeholderTextColor={colors.textDim}
          style={styles.input}
        />
        <Text style={styles.prefText}>Avatar URL (optional)</Text>
        <TextInput
          value={editAvatar as string}
          onChangeText={setEditAvatar}
          placeholder="https://..."
          placeholderTextColor={colors.textDim}
          autoCapitalize="none"
          keyboardType="url"
          style={styles.input}
        />
        {!!editAvatar && (
          <Image
            source={{ uri: editAvatar as string }}
            style={{ width: 96, height: 96, borderRadius: 48, alignSelf: "center", marginBottom: space.md }}
          />
        )}
        <Button
          title="Save Changes"
          onPress={() => {
            const name = editName.trim();
            setProfile?.((prev) => ({
              ...prev,
              name: name || prev.name,
              avatar: editAvatar?.toString().trim() || null,
            }));
            showToast("Profile updated");
          }}
          style={{ marginTop: space.md }}
        />
      </Card>

      <View style={{ height: space.xl }} />

      <ModalSheet
        visible={!!sheet}
        title={sheet?.title ?? ""}
        onClose={() => setSheet(null)}
        primaryText={sheet?.primaryText}
        onPrimary={async () => {
          if (sheet?.onPrimary) {
            await sheet.onPrimary();
          }
          setSheet(null);
        }}
      >
        <Text style={styles.sheetBody}>{sheet?.body}</Text>
      </ModalSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { marginHorizontal: space.lg, padding: space.lg },
  name: { color: colors.text, fontSize: 22, fontWeight: "900" },
  email: { color: colors.textDim, marginTop: 6 },
  stats: { flexDirection: "row", marginTop: 12 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: colors.text, fontWeight: "900" },
  statLabel: { color: colors.textDim, marginTop: 4, textAlign: "center" },
  prefRow: {
    marginHorizontal: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space.md,
  },
  prefText: { color: colors.text, fontWeight: "600" },
  playMode: { flexDirection: "row", paddingHorizontal: space.lg, marginBottom: space.lg },
  modeCard: { flex: 1, marginRight: 8, padding: space.lg },
  modeOn: { borderWidth: 2, borderColor: colors.neon },
  modeTitle: { color: colors.text, fontWeight: "800", fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.card,
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    fontSize: 16,
    marginTop: 8,
    marginBottom: space.md,
  },
  sheetBody: {
    color: colors.text,
    lineHeight: 20,
  },
});

