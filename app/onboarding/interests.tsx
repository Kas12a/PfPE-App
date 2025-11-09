import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, radii, space, type } from '../../src/theme/colors';

const TOPICS = [
  'Nature & Outdoors',
  'Energy Saver',
  'Movement & Transport',
  'Waste & Recycling',
  'Community & Action',
  'Mindful Living',
];

export default function Interests() {
  const [sel, setSel] = useState<string[]>([]);
  const router = useRouter();
  const canContinue = sel.length >= 3;

  const toggle = (t: string) =>
    setSel(s => (s.includes(t) ? s.filter(x => x !== t) : [...s, t]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: space.lg }}>
      <Stack.Screen options={{ title: '' }} />
      <Text style={[type.h1, { color: colors.text, marginBottom: 2 }]}>What do you care{'\n'}about most?</Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.md }}>
        Choose 3 topics to personalize your eco quests.
      </Text>
      <Text style={{ color: canContinue ? colors.limeYellow : colors.textMuted, marginBottom: space.lg }}>
        {sel.length}/3 selected
      </Text>

      {TOPICS.map(t => (
        <Pressable
          key={t}
          onPress={() => toggle(t)}
          style={{
            backgroundColor: sel.includes(t) ? colors.mutedSeafoam : colors.card,
            borderRadius: radii.lg, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.grey30,
          }}>
          <Text style={{ color: colors.text, fontWeight: '700' }}>{t}</Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => router.push('/onboarding/permissions')}
        disabled={!canContinue}
        style={{
          backgroundColor: canContinue ? colors.limeYellow : colors.grey10,
          borderRadius: radii.pill, paddingVertical: 16, marginTop: space.lg, opacity: canContinue ? 1 : 0.6,
        }}>
        <Text style={{ textAlign: 'center', color: canContinue ? '#0E160F' : colors.textMuted, fontWeight: '800' }}>
          Continue
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/onboarding/permissions')} style={{ paddingVertical: 16 }}>
        <Text style={{ textAlign: 'center', color: colors.textMuted }}>Skip for Now</Text>
      </Pressable>
    </View>
  );
}
