import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useProfile } from '../src/hooks/useProfile';
import { Colors } from '../src/theme/colors';

export default function Index() {
  const { profile, hydrated } = useProfile();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.neon} />
      </View>
    );
  }

  if (!profile.isSignedIn) {
    const shouldShowIntro = !profile.hasSeenIntro && !profile.hasOnboarded;
    const authRoute = profile.hasOnboarded ? '/auth/get-started?mode=login' : '/auth/get-started';
    return <Redirect href={shouldShowIntro ? '/onboarding' : authRoute} />;
  }

  if (!profile.hasOnboarded) {
    return <Redirect href="/onboarding/create-profile" />;
  }

  return <Redirect href="/(tabs)" />;
}

