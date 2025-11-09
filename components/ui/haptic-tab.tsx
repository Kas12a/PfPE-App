import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: "light" | "medium" | "heavy";
  onPress?: () => void;
};

export default function HapticTab({
  children,
  style,
  intensity = "light",
  onPress,
}: Props) {
  const handlePress = async () => {
    const styleMap = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    } as const;

    try {
      await Haptics.impactAsync(styleMap[intensity]);
    } catch {
      // ignore haptics failure (e.g., simulator)
    }
    onPress?.();
  };

  return (
    <Pressable style={style} onPress={handlePress}>
      {children}
    </Pressable>
  );
}
