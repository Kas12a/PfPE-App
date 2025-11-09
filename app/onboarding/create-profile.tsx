// app/onboarding/create-profile.tsx
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';
import { useProfile } from '../../src/hooks/useProfile';
import { colors, radii, space, type } from '../../src/theme/colors';

const AVATARS = ['🌳','🌿','🌲','🌴','🌵','🍀'];

export default function CreateProfile() {
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [name, setName] = useState('');
  const router = useRouter();
  const { save } = useProfile();

  const handleContinue = async () => {
    await save({ name: name.trim(), avatar });
    router.replace('/onboarding/interests'); // continue onboarding
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: space.lg }}>
      <Stack.Screen options={{ title: '' }} />
      <Text style={[type.h1, { color: colors.text, marginBottom: space.sm }]}>Create your profile</Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.lg }}>Your name helps teammates find you.</Text>

      <Text style={{ fontSize: 60, alignSelf: 'center', marginBottom: space.md }}>{avatar}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: space.lg }}>
        {AVATARS.map(a => (
          <Pressable
            key={a}
            onPress={() => setAvatar(a)}
            style={{
              width: 56, height: 56, borderRadius: 28, marginRight: 12,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: a === avatar ? '#7AA5A7' : colors.card,
              borderWidth: 1, borderColor: '#2A3437',
            }}>
            <Text style={{ fontSize: 28 }}>{a}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Display Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="How should we call you?"
        placeholderTextColor="#7C8A90"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 12, borderRadius: radii.md, marginBottom: space.xl }}
      />

      <Pressable
        disabled={!name.trim()}
        onPress={handleContinue}
        style={{
          backgroundColor: name.trim() ? colors.limeYellow : '#141B1D',
          borderRadius: radii.pill, paddingVertical: 16, opacity: name.trim() ? 1 : 0.6,
        }}>
        <Text style={{ textAlign: 'center', color: name.trim() ? '#0E160F' : '#9FA4A6', fontWeight: '800' }}>
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}
