import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { space, type } from '../../src/theme/colors';
import { useProfile } from '../../src/hooks/useProfile';
import { OnboardingScreenShell } from '../../src/components/onboarding/ScreenShell';

const AVATARS = ['🌲', '🌳', '🌴', '🌿', '🌾', '🌱'];
const AGE_OPTIONS = ['Under 18', '18-24', '25-34', '35-44', '45+'];

export default function CreateProfile() {
  const { profile, setProfile } = useProfile();
  const router = useRouter();
  const [avatar, setAvatar] = useState(profile.avatar ?? AVATARS[0]);
  const [name, setName] = useState(profile.name ?? '');
  const [ageRange, setAgeRange] = useState(profile.ageRange ?? '');
  const [showAgePicker, setShowAgePicker] = useState(false);

  useEffect(() => {
    if (!profile.isSignedIn) {
      router.replace('/auth/get-started');
    }
  }, [profile.isSignedIn, router]);

  const onContinue = () => {
    if (!name.trim()) return;
    setProfile?.((prev) => ({
      ...prev,
      name: name.trim(),
      avatar,
      ageRange,
      level: prev.level ?? 1,
      league: prev.league ?? 'sprout',
    }));
    router.push('/onboarding/start-mode');
  };

  const disabled = !name.trim();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreenShell>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.title}>Create your profile</Text>
            <Text style={styles.subtitle}>Your name helps teammates find you in community challenges.</Text>
          </View>

          <LinearGradient colors={['rgba(219,242,98,0.25)', 'rgba(28,97,234,0.2)']} style={styles.avatarRing}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
            <Pressable style={styles.cameraButton}>
              <Feather name="camera" size={18} color="#051A23" />
            </Pressable>
          </LinearGradient>

          <LinearGradient colors={['rgba(28,97,234,0.25)', 'rgba(219,242,98,0.25)']} style={styles.avatarRail}>
            {AVATARS.map((item) => (
              <Pressable
                key={item}
                style={[styles.avatarOption, avatar === item && styles.avatarOptionActive]}
                onPress={() => setAvatar(item)}
              >
                <Text style={styles.avatarOptionEmoji}>{item}</Text>
              </Pressable>
            ))}
          </LinearGradient>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Display Name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="How should we call you?"
                placeholderTextColor="#6E7A83"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Age Range (optional)</Text>
            <Pressable style={styles.inputRow} onPress={() => setShowAgePicker((prev) => !prev)}>
              <Text style={[styles.inputValue, !ageRange && styles.placeholder]}>
                {ageRange || 'Select your age range'}
              </Text>
              <Feather name={showAgePicker ? 'chevron-up' : 'chevron-down'} size={18} color="#818B91" />
            </Pressable>
            {showAgePicker && (
              <View style={styles.dropdown}>
                {AGE_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    style={styles.dropdownRow}
                    onPress={() => {
                      setAgeRange(option);
                      setShowAgePicker(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{option}</Text>
                    {ageRange === option && <Feather name="check" size={16} color="#DBF262" />}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.ctaTrack, disabled && styles.ctaTrackDisabled]}>
            <Pressable style={styles.primaryCta} disabled={disabled} onPress={onContinue}>
              <Text style={styles.primaryCtaText}>Continue</Text>
            </Pressable>
            <Pressable style={styles.ctaCircle} disabled={disabled} onPress={onContinue}>
              <Feather name="arrow-up-right" size={20} color="#141B34" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
    color: '#E6E8EA',
    marginTop: 8,
  },
  avatarRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.lg,
  },
  avatarEmoji: {
    fontSize: 70,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#DBF262',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRail: {
    borderRadius: 999,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space.lg,
  },
  avatarOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  avatarOptionActive: {
    borderWidth: 2,
    borderColor: '#DBF262',
  },
  avatarOptionEmoji: {
    fontSize: 22,
  },
  fieldGroup: {
    marginBottom: space.md,
  },
  label: {
    color: '#E6E8EA',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    backgroundColor: 'rgba(29,47,55,0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputValue: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholder: {
    color: '#6E7A83',
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(5,26,35,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 15,
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
  ctaTrackDisabled: {
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
    fontSize: 16,
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
