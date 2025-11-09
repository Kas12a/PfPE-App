import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { OnboardingHeroScreen } from '../../src/components/onboarding/HeroScreen';
import { useProfile } from '../../src/hooks/useProfile';

const hero = { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80' };

export default function Welcome() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const goToAuth = () => {
    setProfile?.((prev) => ({ ...prev, hasSeenIntro: true }));
    router.replace('/auth/get-started?mode=login');
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingHeroScreen
        image={hero}
        title={"Welcome to Play for\nPlanet Earth"}
        subtitle="Turn your daily actions into real impact for the planet."
        buttonLabel="Get Started"
        onNext={() => router.push('/onboarding/intro2')}
        footerLabel="Already have an account?"
        footerActionLabel="Log in"
        onFooterPress={goToAuth}
      />
    </>
  );
}
