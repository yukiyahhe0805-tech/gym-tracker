// app/index.tsx
import React from "react";
import 'react-native-gesture-handler';

import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";

const workoutDays = [
    { id: "1", name: "Chest", entries: 12 },
    { id: "2", name: "Back", entries: 9 },
    { id: "3", name: "Arms", entries: 14 },
    { id: "4", name: "Shoulders", entries: 8 },
    { id: "5", name: "Legs", entries: 10 },
];

const historyData = [
    { id: "h1", date: "Sep 30, 2025", details: "Bench 5x5 @185lb, Incline DB 3x10, Flyes 3x12" },
    { id: "h2", date: "Sep 23, 2025", details: "Bench 5x5 @180lb, Dips 3x8, Pushups 3x20" },
    { id: "h3", date: "Sep 16, 2025", details: "Pause Bench 4x4, Cable Fly 3x15, Triceps 3x12" },
];

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Workout Tracker</Text>

            <Text style={styles.sectionTitle}>Workout Days</Text>
            <View style={styles.daysContainer}>
                {workoutDays.map((day) => (
                    <TouchableOpacity key={day.id} style={styles.dayCard}>
                        <Text style={styles.dayName}>{day.name}</Text>
                        <Text style={styles.dayEntries}>{day.entries} entries</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Chest Day</Text>
            <FlatList
                data={historyData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.historyCard}>
                        <Text style={styles.historyDate}>{item.date}</Text>
                        <Text style={styles.historyDetails}>{item.details}</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add entry</Text>
            </TouchableOpacity>

            <View style={styles.navBar}>
                <Text style={styles.navItem}>Home</Text>
                <Text style={styles.navItem}>Schedule</Text>
                <Text style={styles.navItem}>Profile</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
    header: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: "600", color: "#cbd5e1", marginTop: 10 },
    daysContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
    dayCard: {
        backgroundColor: "#1e293b",
        borderRadius: 10,
        padding: 15,
        margin: 5,
        minWidth: "45%",
    },
    dayName: { fontSize: 16, fontWeight: "600", color: "#f8fafc" },
    dayEntries: { fontSize: 12, color: "#94a3b8" },
    historyCard: {
        backgroundColor: "#1e293b",
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
    },
    historyDate: { color: "#f1f5f9", fontWeight: "600" },
    historyDetails: { color: "#94a3b8", fontSize: 13 },
    addButton: {
        backgroundColor: "#f97316",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginVertical: 15,
    },
    addButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#334155",
    },
    navItem: { color: "#cbd5e1", fontWeight: "600" },
});
