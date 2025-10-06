import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

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

export default function WorkoutEditor() {
    const { day } = useLocalSearchParams<{ day?: string }>();
    const router = useRouter();

    const [date, setDate] = useState<string>(
        new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    );
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [notes, setNotes] = useState("");

    const addExercise = () => {
        setExercises((prev) => [
            ...prev,
            { id: Date.now().toString(), name: "", sets: [] },
        ]);
    };

    const updateExerciseName = (id: string, name: string) =>
        setExercises((prev) =>
            prev.map((e) => {
                if (e.id === id) {
                    if (name.trim() !== "" && e.sets.length === 0) {
                        return {
                            ...e,
                            name,
                            sets: [{ id: Date.now().toString(), weight: "", reps: "" }],
                        };
                    }
                    return { ...e, name };
                }
                return e;
            })
        );

    const addSet = (exerciseId: string) =>
        setExercises((prev) =>
            prev.map((e) =>
                e.id === exerciseId
                    ? {
                        ...e,
                        sets: [
                            ...e.sets,
                            { id: Date.now().toString(), weight: "", reps: "" },
                        ],
                    }
                    : e
            )
        );

    const clearSets = (exerciseId: string) =>
        setExercises((prev) =>
            prev.map((e) =>
                e.id === exerciseId
                    ? { ...e, sets: e.sets.slice(0, -1) } // delete last set only
                    : e
            )
        );

    const updateSet = (
        exerciseId: string,
        setId: string,
        field: "weight" | "reps",
        value: string
    ) =>
        setExercises((prev) =>
            prev.map((e) =>
                e.id === exerciseId
                    ? {
                        ...e,
                        sets: e.sets.map((s) =>
                            s.id === setId ? { ...s, [field]: value } : s
                        ),
                    }
                    : e
            )
        );

    const removeExercise = (id: string) =>
        setExercises((prev) => prev.filter((e) => e.id !== id));

    const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0);

    // ✅ Save workout to local storage
    const saveEntry = async () => {
        if (exercises.length === 0) {
            Alert.alert("Add at least one exercise first!");
            return;
        }

        const newEntry = {
            id: Date.now().toString(),
            date,
            day,
            exercises,
            notes,
        };

        try {
            const existing = await AsyncStorage.getItem("workout_logs");
            const logs = existing ? JSON.parse(existing) : [];
            logs.push(newEntry);
            await AsyncStorage.setItem("workout_logs", JSON.stringify(logs));
            Alert.alert("Saved!", `Workout saved for ${day} on ${date}`);
            router.back();
        } catch (error) {
            console.error("Error saving workout:", error);
            Alert.alert("Error", "Could not save workout data.");
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: `${day} Day`,
                    headerStyle: { backgroundColor: "#0f172a" },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "700" },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                }}
            />

            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Date */}
                    <View style={styles.card}>
                        <Text style={styles.label}>Date</Text>
                        <TextInput
                            value={date}
                            onChangeText={setDate}
                            style={styles.input}
                            placeholder="Enter date"
                            placeholderTextColor="#64748b"
                        />
                    </View>

                    {/* Exercises */}
                    {exercises.map((ex) => (
                        <View key={ex.id} style={styles.card}>
                            <TextInput
                                placeholder="Exercise name"
                                placeholderTextColor="#64748b"
                                value={ex.name}
                                onChangeText={(t) => updateExerciseName(ex.id, t)}
                                style={styles.input}
                            />

                            {ex.sets.map((s, i) => (
                                <View key={s.id} style={styles.setRow}>
                                    <View style={styles.setTag}>
                                        <Text style={styles.setTagText}>Set {i + 1}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.smallLabel}>Pounds</Text>
                                        <TextInput
                                            value={s.weight}
                                            onChangeText={(v) =>
                                                updateSet(ex.id, s.id, "weight", v)
                                            }
                                            keyboardType="decimal-pad"
                                            style={styles.smallInput}
                                            placeholder="Weight"
                                            placeholderTextColor="#64748b"
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.smallLabel}>Reps</Text>
                                        <TextInput
                                            value={s.reps}
                                            onChangeText={(v) =>
                                                updateSet(ex.id, s.id, "reps", v)
                                            }
                                            keyboardType="number-pad"
                                            style={styles.smallInput}
                                            placeholder="Reps"
                                            placeholderTextColor="#64748b"
                                        />
                                    </View>
                                </View>
                            ))}

                            {/* Add/Delete buttons */}
                            <View style={styles.setButtons}>
                                <TouchableOpacity onPress={() => addSet(ex.id)}>
                                    <Text style={styles.addBtn}>Add set</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => clearSets(ex.id)}>
                                    <Text style={styles.clearBtn}>Delete set</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Delete Exercise */}
                            <TouchableOpacity
                                style={styles.deleteExercise}
                                onPress={() => removeExercise(ex.id)}
                            >
                                <Text style={styles.deleteText}>Delete Exercise</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add Exercise */}
                    <TouchableOpacity onPress={addExercise} style={styles.addExercise}>
                        <Text style={styles.addExerciseText}>+ Add exercise</Text>
                    </TouchableOpacity>

                    {/* Notes */}
                    <View style={styles.card}>
                        <Text style={styles.label}>Notes</Text>
                        <TextInput
                            placeholder="Felt strong on last set..."
                            placeholderTextColor="#64748b"
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            style={[styles.input, { minHeight: 60 }]}
                        />
                    </View>

                    <Text style={styles.total}>Auto-total: {totalSets} sets</Text>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#475569" }]}
                        onPress={() => {
                            setExercises([]);
                            setNotes("");
                        }}
                    >
                        <Text style={styles.btnText}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#38bdf8" }]}
                        onPress={() => router.push(`/workout/logs/${day}`)}
                    >
                        <Text style={styles.btnText}>View Logs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#f97316" }]}
                        onPress={saveEntry}
                    >
                        <Text style={styles.btnText}>Save entry</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },
    label: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 6 },
    input: {
        backgroundColor: "#0f172a",
        borderRadius: 10,
        padding: 10,
        color: "#fff",
        fontSize: 15,
    },
    subLabel: {
        color: "#94a3b8",
        marginTop: 8,
        marginBottom: 6,
        fontSize: 14,
    },
    setRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    setTag: {
        backgroundColor: "#0f172a",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    setTagText: { color: "#fff", fontWeight: "600" },
    smallLabel: { color: "#94a3b8", fontSize: 13, marginBottom: 4 },
    smallInput: {
        backgroundColor: "#0f172a",
        borderRadius: 8,
        padding: 8,
        color: "#fff",
    },
    setButtons: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        gap: 20,
    },
    addBtn: { color: "#38bdf8", fontWeight: "600", fontSize: 15 },
    clearBtn: { color: "#94a3b8", fontWeight: "600", fontSize: 15 },
    deleteExercise: {
        alignItems: "center",
        marginTop: 12,
        borderTopWidth: 1,
        borderColor: "#334155",
        paddingTop: 10,
    },
    deleteText: { color: "#f87171", fontWeight: "600" },
    addExercise: {
        backgroundColor: "#1e293b",
        borderRadius: 12,
        padding: 14,
        alignItems: "center",
        marginBottom: 14,
    },
    addExerciseText: { color: "#38bdf8", fontWeight: "700", fontSize: 16 },
    sectionTitle: { color: "#fff", fontSize: 18, marginBottom: 8 },
    total: { color: "#94a3b8", textAlign: "center", marginBottom: 24 },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#334155",
        backgroundColor: "#0f172a",
    },
    btn: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 6,
    },
    btnText: { color: "#fff", fontWeight: "700" },
});
