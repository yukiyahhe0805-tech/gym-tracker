import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";

const initialDays = [
    { id: "1", name: "Chest", entries: 0 },
    { id: "2", name: "Back", entries: 0 },
    { id: "3", name: "Arms", entries: 0 },
    { id: "4", name: "Shoulders", entries: 0 },
    { id: "5", name: "Legs", entries: 0 },
];

export default function HomeScreen() {
    const [workoutDays, setWorkoutDays] = useState(initialDays);
    const router = useRouter();

    // Add a new day
    const addCustomDay = () => {
        Alert.prompt?.(
            "New Workout Day",
            "Enter a name for your custom day:",
            (text) => {
                if (text && text.trim() !== "") {
                    setWorkoutDays((prev) => [
                        ...prev,
                        { id: Date.now().toString(), name: text.trim(), entries: 0 },
                    ]);
                }
            }
        );
    };

    // Delete a day
    const deleteDay = (id: string, name: string) => {
        Alert.alert("Delete Day", `Delete "${name}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () =>
                    setWorkoutDays((prev) => prev.filter((day) => day.id !== id)),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Select Your Day</Text>

            <View style={styles.contentWrapper}>
                <Text style={styles.sectionTitle}>Workout Days</Text>

                <FlatList
                    contentContainerStyle={{ paddingBottom: 80 }}
                    data={workoutDays}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/workout/${item.name}`)} // 👈 navigate to /workout/[day]
                            onLongPress={() => deleteDay(item.id, item.name)} // delete on long press
                        >
                            <Text style={styles.dayName}>{item.name}</Text>
                            <View style={styles.entryBadge}>
                                <Text style={styles.entryText}>{item.entries} entries</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {/* Add Day Button */}
                <TouchableOpacity style={styles.addButton} onPress={addCustomDay}>
                    <Text style={styles.addButtonText}>+ Add Day</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginTop: 60,
        marginBottom: 50,
    },
    contentWrapper: {
        flex: 1,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#cbd5e1",
        marginBottom: 20,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e293b",
        padding: 18,
        borderRadius: 14,
        marginBottom: 14,
    },
    dayName: { fontSize: 18, fontWeight: "600", color: "#f8fafc" },
    entryBadge: {
        backgroundColor: "#334155",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    entryText: { color: "#cbd5e1", fontSize: 13, fontWeight: "500" },
    addButton: {
        backgroundColor: "#f97316",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
