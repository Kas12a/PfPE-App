import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { colors, space, type } from '../../src/theme/colors';
import { OnboardingScreenShell } from '../../src/components/onboarding/ScreenShell';
import { useProfile } from '../../src/hooks/useProfile';

const TOPICS = [
  { label: 'Nature & Outdoors', icon: '🌱', gradient: ['#133D2D', '#1F4A33'] },
  { label: 'Energy Saver', icon: '⚡', gradient: ['#37330D', '#52481B'] },
  { label: 'Movement & Transport', icon: '🚲', gradient: ['#13253D', '#23405C'] },
  { label: 'Waste & Recycling', icon: '♻️', gradient: ['#214126', '#2D5933'] },
  { label: 'Community & Action', icon: '🤝', gradient: ['#3D2313', '#553526'] },
  { label: 'Mindful Living', icon: '🧘', gradient: ['#261F40', '#3B2D5C'] },
];

export default function Interests() {
  const [sel, setSel] = useState<string[]>([]);
  const router = useRouter();
  const { profile } = useProfile();
  const canContinue = sel.length >= 3;

  useEffect(() => {
    if (!profile.isSignedIn) {
      router.replace('/auth/get-started');
    }
  }, [profile.isSignedIn, router]);

  const toggle = (topic: string) =>
    setSel((s) => (s.includes(topic) ? s.filter((x) => x !== topic) : s.length < 3 ? [...s, topic] : s));

  const goNext = () => router.push('/onboarding/permissions');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreenShell>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Preferences</Text>
          <Text style={styles.title}>What do you care about most?</Text>
          <Text style={styles.subtitle}>Choose 3 topics to personalize your eco quests.</Text>
          <Text style={[styles.counter, { color: canContinue ? '#DBF262' : colors.textMuted }]}>{sel.length}/3 selected</Text>
        </View>

        <View style={styles.grid}>
          {TOPICS.map((topic) => {
            const active = sel.includes(topic.label);
            return (
              <Pressable key={topic.label} style={styles.topicWrap} onPress={() => toggle(topic.label)}>
                <LinearGradient colors={topic.gradient} style={[styles.card, active && styles.cardActive]}>
                  <Text style={styles.cardIcon}>{topic.icon}</Text>
                  <Text style={styles.cardLabel}>{topic.label}</Text>
                  <View style={[styles.badge, active && styles.badgeActive]}>
                    {active ? <Feather name="check" size={14} color="#051A23" /> : <View style={styles.badgeDot} />}
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.ctaTrack, !canContinue && styles.ctaDisabled]}>
          <Pressable style={styles.primaryCta} disabled={!canContinue} onPress={goNext}>
            <Text style={styles.primaryCtaText}>Continue</Text>
          </Pressable>
          <Pressable style={styles.ctaCircle} disabled={!canContinue} onPress={goNext}>
            <Feather name="arrow-up-right" size={20} color="#141B34" />
          </Pressable>
        </View>

        <Pressable onPress={goNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </Pressable>
      </OnboardingScreenShell>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.md,
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
    marginTop: 8,
  },
  counter: {
    marginTop: space.sm,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.md,
  },
  topicWrap: {
    width: '48%',
  },
  card: {
    borderRadius: 24,
    padding: 18,
    minHeight: 150,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardActive: {
    borderColor: '#DBF262',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
  },
  badgeActive: {
    backgroundColor: '#DBF262',
    borderColor: '#DBF262',
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
  skip: {
    paddingVertical: 16,
  },
  skipText: {
    textAlign: 'center',
    color: colors.textMuted,
  },
});
