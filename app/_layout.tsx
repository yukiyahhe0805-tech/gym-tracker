import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
                screenOptions={{
                    headerShown: false,                // ✅ hides the black "(tabs)/home" header
                    contentStyle: { backgroundColor: "#0f172a" }, // matches your theme
                }}
            >
                {/* Redirects to /home */}
                <Stack.Screen name="index" />

                {/* Main Home */}
                <Stack.Screen name="home" />

                {/* Workout Editor */}
                <Stack.Screen name="workout/[day]" />

                {/* Workout Logs */}
                <Stack.Screen name="workout/logs/[day]" />
            </Stack>

            {/* Status bar matches your dark theme */}
            <StatusBar style="light" backgroundColor="#0f172a" />
        </ThemeProvider>
    );
}
