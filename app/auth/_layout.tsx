import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { useProfile } from "../../src/hooks/useProfile";

export default function AuthLayout() {
  const { profile, hydrated } = useProfile();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={Colors.neon} />
      </View>
    );
  }

  if (profile.isSignedIn) {
    if (profile.hasOnboarded) {
      return <Redirect href="/(tabs)" />;
    }
    return <Redirect href="/onboarding" />;
  }

  if (!profile.hasSeenIntro && !profile.hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
