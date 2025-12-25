import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { space, type } from '../../src/theme/colors';
import { OnboardingScreenShell } from '../../src/components/onboarding/ScreenShell';
import { useProfile } from '../../src/hooks/useProfile';

const MODES = [
  {
    id: 'individual',
    title: 'Play as an Individual',
    subtitle: 'Track your own progress and join the global leaderboard.',
    icon: 'user',
  },
  {
    id: 'group',
    title: 'Join a group',
    subtitle: 'Connect with your school, city, or community to complete quests together.',
    icon: 'users',
  },
];

export default function StartMode() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { save, profile } = useProfile();

  useEffect(() => {
    if (!profile.isSignedIn) {
      router.replace('/auth/get-started');
    }
  }, [profile.isSignedIn, router]);

  const continueNext = () => {
    if (!selected) return;
    save({ playMode: selected as "individual" | "group" });
    router.push('/onboarding/interests');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreenShell>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Mode</Text>
          <Text style={styles.title}>How do you want to get started?</Text>
          <Text style={styles.subtitle}>You can switch or join a group later in Profile.</Text>
        </View>

        {MODES.map((mode) => {
          const active = selected === mode.id;
          return (
            <Pressable key={mode.id} onPress={() => setSelected(mode.id)} style={{ marginBottom: space.md }}>
              <LinearGradient
                colors={['rgba(28,97,234,0.22)', 'rgba(219,242,98,0.22)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.modeCard, active && styles.modeCardActive]}
              >
                <View style={styles.modeCardTop}>
                  <View style={styles.modeIcon}>
                    <Feather name={mode.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  {active && <Feather name="check-circle" size={20} color="#DBF262" />}
                </View>
                <Text style={styles.modeTitle}>{mode.title}</Text>
                <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}

        <View style={[styles.ctaTrack, !selected && styles.ctaDisabled]}>
          <Pressable style={styles.primaryCta} disabled={!selected} onPress={continueNext}>
            <Text style={styles.primaryCtaText}>Continue</Text>
          </Pressable>
          <Pressable style={styles.ctaCircle} disabled={!selected} onPress={continueNext}>
            <Feather name="arrow-up-right" size={20} color="#141B34" />
          </Pressable>
        </View>
      </OnboardingScreenShell>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.lg,
  },
  eyebrow: {
    color: '#9EA9B0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
    marginBottom: 6,
  },
  title: {
    ...type.h1,
    color: '#FFFFFF',
  },
  subtitle: {
    color: '#D9D9D9',
    marginTop: 6,
  },
  modeCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(5,26,35,0.6)',
  },
  modeCardActive: {
    borderColor: '#DBF262',
  },
  modeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  },
  modeSubtitle: {
    color: '#E6E8EA',
    lineHeight: 20,
  },
  ctaTrack: {
    marginTop: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    padding: 4,
    gap: 6,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  primaryCta: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ctaCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DBF262',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
