import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";

type SetEntry = {
    id: string;
    weight: string;
    reps: string;
};

type Exercise = {
    id: string;
    name: string;
    sets: SetEntry[];
};

type WorkoutLog = {
    id: string;
    date: string;
    day?: string;
    exercises: Exercise[];
    notes: string;
};

export default function WorkoutLogs() {
    const { day } = useLocalSearchParams<{ day?: string }>();
    const [logs, setLogs] = useState<WorkoutLog[]>([]);

    // 🔹 Load logs from AsyncStorage
    const loadLogs = async () => {
        try {
            const stored = await AsyncStorage.getItem("workout_logs");
            const allLogs = stored ? JSON.parse(stored) : [];
            const filtered = allLogs
                .filter((l: WorkoutLog) => l.day === day)
                .sort((a: WorkoutLog, b: WorkoutLog) => b.id.localeCompare(a.id));
            setLogs(filtered);
        } catch (err) {
            console.error("Error reading logs:", err);
        }
    };

    useEffect(() => {
        loadLogs();
    }, [day]);

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // 🔹 Delete a specific log
    const deleteLog = async (logId: string) => {
        Alert.alert("Delete Log", "Are you sure you want to delete this entry?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const stored = await AsyncStorage.getItem("workout_logs");
                        const allLogs: WorkoutLog[] = stored ? JSON.parse(stored) : [];
                        const updated = allLogs.filter((l) => l.id !== logId);
                        await AsyncStorage.setItem("workout_logs", JSON.stringify(updated));
                        setLogs((prev) => prev.filter((l) => l.id !== logId));
                    } catch (err) {
                        console.error("Error deleting log:", err);
                    }
                },
            },
        ]);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${day} Logs`,
                    headerStyle: { backgroundColor: "#0f172a" },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "700" },
                }}
            />
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                    {logs.length === 0 ? (
                        <Text style={styles.noLogs}>No records yet.</Text>
                    ) : (
                        logs.map((log) => {
                            const logDate = new Date(log.date);
                            const isRecent = logDate >= oneWeekAgo;
                            return (
                                <View
                                    key={log.id}
                                    style={[
                                        styles.card,
                                        isRecent && styles.recentCard,
                                    ]}
                                >
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.date}>{log.date}</Text>
                                        <TouchableOpacity
                                            onPress={() => deleteLog(log.id)}
                                            style={styles.deleteBtn}
                                        >
                                            <Text style={styles.deleteText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {log.exercises.map((ex) => (
                                        <View key={ex.id} style={{ marginBottom: 8 }}>
                                            <Text style={styles.exerciseName}>{ex.name}</Text>
                                            {ex.sets.map((s, i) => (
                                                <Text key={s.id} style={styles.setText}>
                                                    Set {i + 1}: {s.weight || "—"} lbs × {s.reps || "—"} reps
                                                </Text>
                                            ))}
                                        </View>
                                    ))}

                                    {log.notes ? (
                                        <Text style={styles.notes}>📝 {log.notes}</Text>
                                    ) : null}
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
    noLogs: { color: "#94a3b8", textAlign: "center", marginTop: 50 },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    recentCard: {
        borderWidth: 1,
        borderColor: "#38bdf8",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    date: { color: "#f97316", fontWeight: "700" },
    deleteBtn: {
        backgroundColor: "#dc2626",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    deleteText: { color: "#fff", fontWeight: "600", fontSize: 13 },
    exerciseName: { color: "#fff", fontWeight: "600" },
    setText: { color: "#cbd5e1", marginLeft: 10 },
    notes: { color: "#94a3b8", marginTop: 8, fontStyle: "italic" },
});
