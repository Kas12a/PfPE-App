import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { OnboardingHeroScreen } from '../../src/components/onboarding/HeroScreen';
import { useProfile } from '../../src/hooks/useProfile';

const hero = { uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80' };

export default function Intro3() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const goToAuth = (mode: 'login' | 'signup' = 'signup') => {
    setProfile?.((prev) => ({ ...prev, hasSeenIntro: true }));
    router.replace(mode === 'login' ? '/auth/get-started?mode=login' : '/auth/get-started');
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingHeroScreen
        image={hero}
        title="Join a movement that matters."
        subtitle="Together, we can play for the planet."
        buttonLabel="Continue"
        onNext={() => goToAuth('signup')}
        footerLabel="Already have an account?"
        footerActionLabel="Log in"
        onFooterPress={() => goToAuth('login')}
      />
    </>
  );
}
