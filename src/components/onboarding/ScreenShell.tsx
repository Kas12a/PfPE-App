import React, { ReactNode } from 'react';
import { ImageBackground, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../../theme/colors';
import { OnboardingStatusBar } from './StatusBar';

export const ONBOARDING_FIELD_BG =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

type Props = {
  children: ReactNode;
  backgroundUri?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showQuarterAccent?: boolean;
  showHomeIndicator?: boolean;
  maxWidth?: number;
};

export function OnboardingScreenShell({
  children,
  backgroundUri = ONBOARDING_FIELD_BG,
  contentContainerStyle,
  showQuarterAccent = true,
  showHomeIndicator = true,
  maxWidth = 420,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const horizontalPadding = Math.max(space.lg, width * 0.05);
  const dynamicTop = Math.max(60, height * 0.12) + insets.top;
  const dynamicBottom = 64 + insets.bottom;

  return (
    <View style={styles.root}>
      <ImageBackground source={{ uri: backgroundUri }} resizeMode="cover" style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['rgba(5,26,35,0.95)', 'rgba(5,26,35,0.88)']} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <OnboardingStatusBar />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: dynamicTop,
            paddingBottom: dynamicBottom,
            paddingHorizontal: horizontalPadding,
          },
          contentContainerStyle,
        ]}
      >
        <View style={{ width: '100%', alignItems: 'center' }}>
          {showQuarterAccent && (
            <View style={styles.quarterWrap}>
              <View style={styles.quarterHorizontal} />
              <View style={styles.quarterVertical} />
            </View>
          )}
          <View style={[styles.inner, { maxWidth, alignSelf: 'center' }]}>{children}</View>
          {showHomeIndicator && <View style={styles.homeIndicator} />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  inner: {
    width: '100%',
  },
  quarterWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: space.xl,
  },
  quarterHorizontal: {
    position: 'absolute',
    width: 28,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  quarterVertical: {
    position: 'absolute',
    width: 2,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  homeIndicator: {
    marginTop: space.xl,
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
});
