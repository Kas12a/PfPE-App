// app/onboarding/permissions.tsx
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { colors, radii, space, type } from '../../src/theme/colors';

export default function Permissions() {
  const [loc, setLoc] = useState(true);
  const [noti, setNoti] = useState(false);
  const router = useRouter();

  const finish = () => {
    router.replace('/(tabs)'); // straight to tabs
  };

  const Card = ({ title, desc, value, onChange }: any) => (
    <View style={{ backgroundColor: colors.card, borderRadius: radii.lg, padding: 14, borderWidth: 1, borderColor: '#2A3437', marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: colors.text, fontWeight: '800' }}>{title}</Text>
        <Switch value={value} onValueChange={onChange} />
      </View>
      <Text style={{ color: colors.textMuted }}>{desc}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: space.lg }}>
      <Stack.Screen options={{ title: '' }} />
      <Text style={[type.h1, { color: colors.text, marginBottom: space.sm }]}>Help us make your{'\n'}experience better</Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.lg }}>You can change these anytime in Profile.</Text>

      <Card title="Allow Location" desc="Used to verify outdoor quests and find local challenges." value={loc} onChange={setLoc} />
      <Card title="Enable Notifications" desc="Get reminders and leaderboard updates." value={noti} onChange={setNoti} />

      <Pressable onPress={finish} style={{ backgroundColor: colors.limeYellow, borderRadius: radii.pill, paddingVertical: 16, marginTop: space.xl }}>
        <Text style={{ textAlign: 'center', color: '#0E160F', fontWeight: '800' }}>Continue</Text>
      </Pressable>

      <Pressable onPress={finish} style={{ paddingVertical: 16 }}>
        <Text style={{ textAlign: 'center', color: colors.textMuted }}>Skip</Text>
      </Pressable>
    </View>
  );
}
