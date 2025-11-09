import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { colors, space, type } from '../../src/theme/colors';
import { useProfile } from '../../src/hooks/useProfile';
import { OnboardingScreenShell } from '../../src/components/onboarding/ScreenShell';

export default function Permissions() {
  const [loc, setLoc] = useState(true);
  const [noti, setNoti] = useState(false);
  const router = useRouter();
  const { setProfile, profile } = useProfile();

  useEffect(() => {
    if (!profile.isSignedIn) {
      router.replace('/auth/get-started');
    }
  }, [profile.isSignedIn, router]);

  const finish = () => {
    setProfile?.((prev) => ({ ...prev, isSignedIn: true, hasOnboarded: true }));
    router.replace('/(tabs)');
  };

  const Card = ({
    title,
    desc,
    value,
    onChange,
    icon,
  }: {
    title: string;
    desc: string;
    value: boolean;
    onChange: (val: boolean) => void;
    icon: keyof typeof Feather.glyphMap;
  }) => (
    <LinearGradient colors={['rgba(28,97,234,0.2)', 'rgba(219,242,98,0.2)']} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.cardIcon}>
            <Feather name={icon} size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ true: '#1C61EA', false: '#B4BBBD' }}
          thumbColor="#FFFFFF"
        />
      </View>
      <Text style={styles.cardDesc}>{desc}</Text>
    </LinearGradient>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreenShell>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Permissions</Text>
          <Text style={styles.title}>Help us make your experience better</Text>
          <Text style={styles.subtitle}>You can change these settings anytime in your profile.</Text>
        </View>

        <Card
          icon="map-pin"
          title="Allow Location"
          desc="Used only to verify outdoor quests and find local challenges."
          value={loc}
          onChange={setLoc}
        />
        <Card
          icon="bell"
          title="Enable Notifications"
          desc="Get reminders and leaderboard updates."
          value={noti}
          onChange={setNoti}
        />

        <View style={styles.ctaTrack}>
          <Pressable style={styles.primaryCta} onPress={finish}>
            <Text style={styles.primaryCtaText}>Finish setup</Text>
          </Pressable>
          <Pressable style={styles.ctaCircle} onPress={finish}>
            <Feather name="arrow-up-right" size={20} color="#141B34" />
          </Pressable>
        </View>
        <Pressable style={styles.skip} onPress={finish}>
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
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  cardDesc: {
    color: '#FFFFFF',
    opacity: 0.85,
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
    color: colors.textMuted,
    textAlign: 'center',
  },
});
