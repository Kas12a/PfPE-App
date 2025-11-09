import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useProfile } from "../../src/hooks/useProfile"; // keep your existing hook path
import { Colors } from "../../src/theme/colors"; // ✅ correct path & name
import { S } from "../../src/theme/spacing"; // ✅ spacing tokens

export default function SignIn() {
  const [name, setName] = useState("");
  const { save } = useProfile();

  const onSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // mock sign-in: set minimal profile and go to tabs
    save({
      name: trimmed,
      avatar: null,
      level: 1,
      points: 0,
      rank: 0,
      streak: 0,
    });
    router.replace("/(tabs)"); // go to your main app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Enter your name to continue</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <Pressable
        onPress={onSubmit}
        disabled={!name.trim()}
        style={({ pressed }) => [
          styles.button,
          { opacity: !name.trim() ? 0.5 : pressed ? 0.9 : 1 },
        ]}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: S.lg,
    paddingTop: S.xl * 2,
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
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    backgroundColor: Colors.surface,
    color: Colors.text,
    borderRadius: 14,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    fontSize: 16,
    marginBottom: S.lg,
  },
  button: {
    backgroundColor: Colors.accent, // your neon accent
    borderRadius: 14,
    paddingVertical: S.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
