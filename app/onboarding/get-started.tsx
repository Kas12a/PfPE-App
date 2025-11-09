// app/onboarding/get-started.tsx
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors, radii, space } from '../../src/theme/colors';

export default function GetStarted() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: space.lg }}>
      <Stack.Screen options={{ title: '' }} />
      <View style={{ backgroundColor: '#141B1D', borderRadius: radii.pill, padding: 4, flexDirection: 'row', marginBottom: space.lg }}>
        {(['signup', 'login'] as const).map(k => (
          <Pressable
            key={k}
            onPress={() => setMode(k)}
            style={{
              flex: 1, paddingVertical: 12, borderRadius: radii.pill, alignItems: 'center',
              backgroundColor: mode === k ? '#7AA5A7' : 'transparent',
            }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{k === 'signup' ? 'Sign Up' : 'Log In'}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@email.com"
        placeholderTextColor="#7C8A90"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 12, borderRadius: radii.md, marginBottom: space.md }}
      />

      <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Password</Text>
      <TextInput
        value={pwd}
        onChangeText={setPwd}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor="#7C8A90"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 12, borderRadius: radii.md, marginBottom: space.xl }}
      />

      <Pressable
        onPress={() => router.replace('/onboarding/create-profile')}
        style={{ backgroundColor: colors.limeYellow, borderRadius: radii.pill, paddingVertical: 16 }}>
        <Text style={{ textAlign: 'center', color: '#0E160F', fontWeight: '800' }}>
          {mode === 'signup' ? 'Sign Up' : 'Log In'}
        </Text>
      </Pressable>
    </View>
  );
}
