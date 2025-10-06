import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#0f172a" },
                }}
            >
                {/* Main Home Screen */}
                <Stack.Screen name="home" />

                {/* Workout Editor */}
                <Stack.Screen name="workout/[day]" />

                {/* Workout Logs */}
                <Stack.Screen name="workout/logs/[day]" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}
