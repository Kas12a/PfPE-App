import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { OnboardingHeroScreen } from '../../src/components/onboarding/HeroScreen';
import { useProfile } from '../../src/hooks/useProfile';

const hero = { uri: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80' };

export default function Intro2() {
  const router = useRouter();
  const { save } = useProfile();
  const goToAuth = () => {
    save({ hasSeenIntro: true });
    router.replace('/auth/get-started?mode=login');
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingHeroScreen
        image={hero}
        title={"Turn your daily habits\ninto climate impact."}
        subtitle="Join challenges, earn eco points, and climb the leaderboard."
        buttonLabel="Next"
        onNext={() => router.push('/onboarding/intro3')}
        footerLabel="Already have an account?"
        footerActionLabel="Log in"
        onFooterPress={goToAuth}
      />
    </>
  );
}
