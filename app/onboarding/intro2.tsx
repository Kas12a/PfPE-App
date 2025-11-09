// app/onboarding/intro2.tsx
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, space, type } from '../../src/theme/colors';

export default function Intro2() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: space.lg, justifyContent: 'flex-end' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={[type.h1, { color: colors.text, marginBottom: space.sm }]}>
        Turn your daily habits{'\n'}into climate impact.
      </Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.xl }}>
        Join challenges, earn eco points, and climb the leaderboard.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/onboarding/intro3')}
        style={{ backgroundColor: colors.limeYellow, borderRadius: radii.pill, paddingVertical: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#0E160F', fontWeight: '800' }}>Next</Text>
      </TouchableOpacity>
      <View style={{ height: space.md }} />
    </View>
  );
}
