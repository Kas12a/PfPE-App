import { Stack, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { colors, radii, space, type } from '../../src/theme/colors';

export default function Intro3() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: space.lg, justifyContent: 'flex-end' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={[type.h1, { color: colors.text, marginBottom: space.sm }]}>
        Join a movement that matters.
      </Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.xl }}>
        Together, we can play for the planet.
      </Text>
      <Pressable
        onPress={() => router.push('/onboarding/get-started')}
        style={{ backgroundColor: colors.limeYellow, borderRadius: radii.pill, paddingVertical: 16 }}>
        <Text style={{ textAlign: 'center', color: '#0E160F', fontWeight: '800' }}>Continue</Text>
      </Pressable>
      <View style={{ height: space.md }} />
    </View>
  );
}
