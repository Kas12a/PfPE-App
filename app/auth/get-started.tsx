import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { googleClientConfig, hasGoogleSignInConfig } from '../../src/config/google';
import { radii, space, type } from '../../src/theme/colors';
import { useProfile } from '../../src/hooks/useProfile';
import { OnboardingScreenShell } from '../../src/components/onboarding/ScreenShell';
import { signInWithEmail, signInWithGoogleIdToken, signUpWithEmail } from '../../src/lib/supabaseApi';

WebBrowser.maybeCompleteAuthSession();

type Mode = 'signup' | 'login';

function getAuthErrorMessage(error: unknown) {
  const rawMessage = typeof error === 'string' ? error : (error as Error)?.message;
  if (!rawMessage) {
    return 'Something went wrong. Please try again.';
  }

  if (/already/i.test(rawMessage) && /exist|register|use/i.test(rawMessage)) {
    return 'That email is already registered. Try logging in.';
  }
  if (/invalid/i.test(rawMessage) && /credential|password/i.test(rawMessage)) {
    return 'Invalid email or password.';
  }
  if (/not|found/i.test(rawMessage) && /user|account/i.test(rawMessage)) {
    return 'No account found. Double check your email or sign up.';
  }
  if (/network/i.test(rawMessage)) {
    return 'Network error. Please try again.';
  }
  return rawMessage;
}

export default function AuthGetStarted() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const initialMode: Mode = params.mode === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { profile, save } = useProfile();

  useEffect(() => {
    if (params.mode === 'login') {
      setMode('login');
    }
  }, [params.mode]);

  const trimmedEmail = email.trim().toLowerCase();
  const formValid = !!trimmedEmail && password.length >= 6;
  const submitDisabled = !formValid || loading;
  const openPolicy = (url: string) => {
    Linking.openURL(url).catch(() => setError('Unable to open link.'));
  };

  const resolvedClientId =
    googleClientConfig.expoClientId ??
    googleClientConfig.webClientId ??
    googleClientConfig.iosClientId ??
    googleClientConfig.androidClientId ??
    'dummy-app-client-id.apps.googleusercontent.com';
  const [_request, response, promptAsync] = Google.useAuthRequest({
    clientId: resolvedClientId,
    iosClientId: googleClientConfig.iosClientId,
    androidClientId: googleClientConfig.androidClientId,
    webClientId: googleClientConfig.webClientId,
    responseType: 'id_token',
    selectAccount: true,
  });

  useEffect(() => {
    const continueWithGoogle = async () => {
      if (response?.type !== 'success') {
        if (response) {
          setGoogleLoading(false);
        }
        return;
      }
      const idToken = response.params?.id_token;
      if (!idToken) {
        setGoogleLoading(false);
        setError('Google sign-in failed. Please try again.');
        return;
      }
      try {
        const user = await signInWithGoogleIdToken(idToken);
        save((prev) => ({
          userId: user?.id ?? prev.userId,
          email: user?.email ?? prev.email,
          isSignedIn: Boolean(user),
          name: prev.name || "Explorer",
          avatar: prev.avatar || "🌿",
          level: prev.level ?? 1,
          points: prev.points ?? 0,
          rank: prev.rank ?? 0,
          streak: prev.streak ?? 0,
        }));
        router.replace(profile.hasOnboarded ? '/(tabs)' : '/onboarding/create-profile');
      } catch (err) {
        setError(getAuthErrorMessage(err));
      } finally {
        setGoogleLoading(false);
      }
    };
    continueWithGoogle();
  }, [response, profile.hasOnboarded, router, save]);

  const handleSubmit = async () => {
    if (!formValid) {
      setError('Enter a valid email and 6+ character password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(trimmedEmail, password);
        save((prev) => ({
          hasOnboarded: false,
          isSignedIn: true,
          email: user?.email ?? trimmedEmail,
          userId: user?.id ?? prev.userId,
          name: prev.name || "Explorer",
          avatar: prev.avatar || "🌿",
          level: prev.level ?? 1,
          points: prev.points ?? 0,
          rank: prev.rank ?? 0,
          streak: prev.streak ?? 0,
        }));
        router.push('/onboarding/create-profile');
      } else {
        const user = await signInWithEmail(trimmedEmail, password);
        save((prev) => ({
          isSignedIn: true,
          email: user?.email ?? trimmedEmail,
          userId: user?.id ?? prev.userId,
          name: prev.name || "Explorer",
          avatar: prev.avatar || "🌿",
          level: prev.level ?? 1,
          points: prev.points ?? 0,
          rank: prev.rank ?? 0,
          streak: prev.streak ?? 0,
        }));
        router.replace(profile.hasOnboarded ? '/(tabs)' : '/onboarding/create-profile');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = async () => {
    if (!hasGoogleSignInConfig) {
      setError('Google sign-in is not configured yet.');
      return;
    }
    setError('');
    setGoogleLoading(true);
    await promptAsync();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreenShell showQuarterAccent={false}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Welcome</Text>
            <Text style={styles.title}>Play for Planet Earth</Text>
            <Text style={styles.subtitle}>
              {mode === 'signup' ? 'Create an account to track your impact.' : 'Log back in to continue your quests.'}
            </Text>
          </View>

          <View style={styles.segment}>
            {(['signup', 'login'] as const).map((tab) => (
              <Pressable
                key={tab}
                style={styles.segmentButton}
                onPress={() => {
                  setMode(tab);
                  setError('');
                }}
              >
                <View style={[styles.segmentInner, mode === tab && styles.segmentInnerActive]}>
                  <Text style={[styles.segmentText, mode === tab && styles.segmentTextActive]}>
                    {tab === 'signup' ? 'Sign Up' : 'Log In'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setError('');
                }}
                placeholder="Email"
                placeholderTextColor="#6E7A83"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                returnKeyType="next"
              />
              <Feather name="inbox" size={18} color="#6E7A83" />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setError('');
                }}
                placeholder="Password"
                placeholderTextColor="#6E7A83"
                secureTextEntry
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Feather name="lock" size={18} color="#818B91" />
            </View>
            <Text style={styles.helper}>Use at least 6 characters.</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={[styles.ctaTrack, submitDisabled && styles.ctaTrackDisabled]}>
            <Pressable style={styles.primaryCta} disabled={submitDisabled} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryCtaText}>{mode === 'signup' ? 'Create account' : 'Continue'}</Text>
              )}
            </Pressable>
            <Pressable style={styles.ctaCircle} disabled={submitDisabled} onPress={handleSubmit}>
              {loading ? <ActivityIndicator color="#141B34" /> : <Feather name="arrow-up-right" size={20} color="#141B34" />}
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={[styles.googleButton, (!_request || googleLoading) && styles.googleDisabled]}
            onPress={handleGooglePress}
            disabled={!_request || googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#051A23" />
            ) : (
              <>
                <Text style={styles.googleIcon}>ⓖ</Text>
                <Text style={styles.googleText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.legal}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink} onPress={() => openPolicy('https://playearth.co.uk/privacy')}>
              privacy policy
            </Text>{' '}
            and{' '}
            <Text style={styles.legalLink} onPress={() => openPolicy('https://playearth.co.uk/terms')}>
              terms & conditions
            </Text>
            .
          </Text>
        </KeyboardAvoidingView>
      </OnboardingScreenShell>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: space.lg,
  },
  title: {
    ...type.h1,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  eyebrow: {
    color: '#9EA9B0',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
    marginBottom: 6,
  },
  subtitle: {
    color: '#D9D9D9',
  },
  segment: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.pill,
    marginBottom: space.lg,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  segmentInner: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radii.pill,
  },
  segmentInnerActive: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  segmentText: {
    color: '#9EA9B0',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  fieldGroup: {
    marginBottom: space.md,
  },
  label: {
    color: '#E6E8EA',
    fontWeight: '600',
    marginBottom: 8,
  },
  helper: {
    color: '#6E7A83',
    fontSize: 12,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29,47,55,0.9)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  error: {
    color: '#FF6B6B',
    marginTop: 4,
    marginBottom: space.sm,
  },
  ctaTrack: {
    marginTop: space.lg,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: space.lg,
    gap: 12,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F2A31',
  },
  dividerText: {
    color: '#B4BBBD',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 14,
  },
  googleDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    fontSize: 18,
    color: '#141B34',
  },
  googleText: {
    color: '#141B34',
    fontWeight: '600',
    fontSize: 16,
  },
  legal: {
    color: '#9EA9B0',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: space.lg,
  },
  legalLink: {
    color: '#DBF262',
    textDecorationLine: 'underline',
  },
});
