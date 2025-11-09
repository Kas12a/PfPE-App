// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* (tabs) layout remains as-is */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Ranking detail lives outside tabs */}
        <Stack.Screen name="ranking/[id]" options={{ headerShown: false }} />
        {/* Share + Redeem as true modals – NO bottom tabs */}
        <Stack.Screen
          name="share-rank"
          options={{ headerShown: false, presentation: "transparentModal" }}
        />
        <Stack.Screen
          name="redeem"
          options={{ headerShown: false, presentation: "transparentModal" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
