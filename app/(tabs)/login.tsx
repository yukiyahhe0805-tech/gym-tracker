// app/login.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Workout Tracker</Text>

            <Text style={styles.title}>Welcome back! </Text>
            <Text style={styles.subtitle}>Log in to continue</Text>

            <TextInput placeholder="Email or username" placeholderTextColor="#94a3b8" style={styles.input} />
            <TextInput placeholder="Password" secureTextEntry placeholderTextColor="#94a3b8" style={styles.input} />

            <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
                <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>New here? Create an account</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", padding: 20, justifyContent: "center" },
    header: { fontSize: 40, fontWeight: "bold", color: "#fff", marginBottom: 40, textAlign: "center" },
    title: { fontSize: 20, fontWeight: "600", color: "#fff", textAlign: "center" },
    subtitle: { fontSize: 14, color: "#94a3b8", marginBottom: 20, textAlign: "center" },
    input: {
        backgroundColor: "#1e293b",
        color: "#fff",
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
    },
    button: {
        backgroundColor: "#f97316",
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    footer: { color: "#94a3b8", marginTop: 20, textAlign: "center" },
});
