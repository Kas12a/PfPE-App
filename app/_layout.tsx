// app/_layout.tsx
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { ProfileProvider } from "../src/context/ProfileProvider";
import { ToastProvider } from "../src/context/ToastProvider";
import { QuestProvider } from "../src/context/QuestProvider";
import { StoreProvider } from "../src/hooks/useStore";
import { OfflineBanner } from "../src/components/system/OfflineBanner";
import { useActionSync } from "../src/hooks/useActionSync";

function AppNavigator() {
  useActionSync();
  return (
    <>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="share-rank" options={{ headerShown: false, presentation: "transparentModal" }} />
        <Stack.Screen name="redeem" options={{ headerShown: false, presentation: "transparentModal" }} />
        <Stack.Screen name="credits/index" options={{ headerShown: false }} />
        <Stack.Screen name="credits/redeem" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <StoreProvider>
          <ProfileProvider>
            <QuestProvider>
              <AppNavigator />
            </QuestProvider>
          </ProfileProvider>
        </StoreProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
