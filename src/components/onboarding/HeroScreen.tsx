import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, space, type } from '../../theme/colors';
import { OnboardingStatusBar } from './StatusBar';

export type OnboardingHeroProps = {
  image: { uri: string };
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onNext: () => void;
  footerLabel?: string;
  footerActionLabel?: string;
  onFooterPress?: () => void;
};

export function OnboardingHeroScreen({
  image,
  title,
  subtitle,
  buttonLabel = 'Next',
  onNext,
  footerLabel,
  footerActionLabel,
  onFooterPress,
}: OnboardingHeroProps) {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['rgba(5,26,35,0)', 'rgba(5,26,35,0.82)']} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <OnboardingStatusBar />
      <View style={styles.content}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>🌱</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.ctaTrack}>
          <Pressable style={styles.ctaMain} onPress={onNext}>
            <Text style={styles.ctaText}>{buttonLabel}</Text>
          </Pressable>
          <Pressable style={styles.ctaCircle} onPress={onNext}>
            <Text style={styles.arrow}>↗</Text>
          </Pressable>
        </View>
        {footerActionLabel && onFooterPress ? (
          <Pressable style={styles.footerLink} onPress={onFooterPress}>
            <Text style={styles.footerLabel}>
              {footerLabel}{' '}
              <Text style={styles.footerAction}>{footerActionLabel}</Text>
            </Text>
          </Pressable>
        ) : null}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: space.lg,
    paddingBottom: 48,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.lg,
    alignSelf: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  title: {
    ...type.h1,
    color: colors.text,
    marginBottom: space.sm,
  },
  subtitle: {
    color: '#D9D9D9',
    fontSize: 16,
    marginBottom: space.xl,
  },
  ctaTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    marginBottom: space.lg,
  },
  ctaMain: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  ctaText: {
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
    marginLeft: 8,
  },
  arrow: {
    fontSize: 20,
    color: '#051A23',
  },
  footerLink: {
    alignSelf: 'center',
    marginBottom: space.md,
  },
  footerLabel: {
    color: '#D9D9D9',
  },
  footerAction: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    marginTop: space.xl,
  },
});
