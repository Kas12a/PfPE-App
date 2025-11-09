import React, { PropsWithChildren } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Colors } from "../../src/theme/colors";
import { S } from "../../src/theme/spacing";

export default function Screen({ children }: PropsWithChildren) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
    padding: S.md,
  },
});
