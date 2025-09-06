import { Stack } from "expo-router";
import "./globals.css"
import { SettingsProvider } from "@/context/storageContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="about"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="game"
          options={{ headerShown: false }}
        />
      </Stack>
    </SettingsProvider>
  );
}
