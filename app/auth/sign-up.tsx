import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useProfile } from "../../src/hooks/useProfile"; // ✅ your context hook
import { Colors } from "../../src/theme/colors"; // ✅ correct path
import { S } from "../../src/theme/spacing"; // ✅ spacing tokens

export default function SignUp() {
  const [name, setName] = useState("");
  const { setProfile } = useProfile();

  const onContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setProfile?.({
      name: trimmed,
      avatar: null,
      level: 1,
      points: 0,
    });

    router.replace("/(tabs)"); // navigate to main tabs after signup
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your profile</Text>
      <Text style={styles.subtitle}>Enter your name to begin your journey</Text>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        placeholderTextColor={Colors.textMuted}
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onContinue}
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.9 : 1 },
        ]}
        onPress={onContinue}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    paddingHorizontal: S.lg,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: S.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 16,
    marginBottom: S.xl * 2,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    borderRadius: 14,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    fontSize: 16,
    marginBottom: S.xl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: S.md,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
