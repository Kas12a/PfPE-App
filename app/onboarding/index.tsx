// app/onboarding/index.tsx
import { Stack, useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { colors, radii, space, type } from '../../src/theme/colors';

export default function Welcome() {
  const router = useRouter();

  const onPressContinue = () => {
    // sanity check
    console.log('Continue pressed');
    // Navigate to the next onboarding screen
    router.push('/onboarding/intro2');
  };

  const onPressTest = () => {
    Alert.alert('Touch OK', 'Your tap is reaching the screen.');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: space.lg,
        justifyContent: 'flex-end',
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={[type.h1, { color: colors.text, marginBottom: space.sm }]}>
        Welcome to Play for{'\n'}Planet Earth
      </Text>
      <Text style={{ color: colors.textMuted, marginBottom: space.xl }}>
        Turn your daily actions into real impact for the planet.
      </Text>

      {/* Primary CTA */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressContinue}
        accessibilityRole="button"
        style={{
          backgroundColor: colors.limeYellow,
          borderRadius: radii.pill,
          paddingVertical: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#0E160F', fontWeight: '800' }}>Get Started</Text>
      </TouchableOpacity>

      {/* tiny spacer */}
      <View style={{ height: space.md }} />

      {/* Secondary: touch test (shows alert) */}
      <TouchableOpacity onPress={onPressTest} style={{ paddingVertical: 8 }}>
        <Text style={{ color: colors.textMuted, textAlign: 'center' }}>
          Tap here to test touch →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
