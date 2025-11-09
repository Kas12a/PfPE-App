// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { ProfileProvider } from "../src/context/ProfileProvider";
import { ToastProvider } from "../src/context/ToastProvider";
import { QuestProvider } from "../src/context/QuestProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ProfileProvider>
          <QuestProvider>
            <Stack screenOptions={{ headerShown: false }}>
          {/* (tabs) layout remains as-is */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Ranking stack lives under /ranking; child routes are handled there */}
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
          </QuestProvider>
        </ProfileProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
