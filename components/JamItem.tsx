import {JamSession} from "@/definitions/types";
import {router} from "expo-router";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {ThemedText} from "./ThemedText";
import {ThemedView} from "./ThemedView";

export default function JamItem({jam}: {jam: JamSession;}) {
    return (
        <TouchableOpacity onPress={() => router.push(`/jam-detail/${jam.id}`)}>
            <ThemedView style={[styles.item]}>
                <View style={styles.header}>
                    <View>
                        <ThemedText type="defaultSemiBold">{jam.name}</ThemedText>
                    </View>
                    <View>
                        <ThemedText>{new Date(jam.date).toLocaleDateString()} à {new Date(jam.date).toLocaleTimeString()}</ThemedText>
                    </View>
                </View>
                <View style={styles.content}>
                    <ThemedText>{jam.city}</ThemedText>
                    <ThemedText>{jam.location}</ThemedText>
                    <ThemedText>{jam.style}</ThemedText>
                    <ThemedText>Inscrits : undefined</ThemedText>
                </View>
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        marginBottom: 16,
    },
    content: {
        flex: 1,
    },
});