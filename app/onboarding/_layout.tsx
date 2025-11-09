// app/onboarding/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../src/theme/colors';
import { useProfile } from '../../src/hooks/useProfile';

export default function OnboardingLayout() {
  const { profile, hydrated } = useProfile();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.neon ?? '#D9FF3F'} />
      </View>
    );
  }

  if (profile.hasOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        gestureEnabled: true,
      }}
    />
  );
}
