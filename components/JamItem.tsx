import {JamSession} from "@/definitions/types";
import {StyleSheet, View} from "react-native";
import {ThemedText} from "./ThemedText";
import {ThemedView} from "./ThemedView";

export default function JamItem({jam}: {jam: JamSession;}) {
    return (
        <ThemedView key={jam.id} style={styles.item}>
            <View style={styles.header}>
                <View>
                    <ThemedText type="defaultSemiBold">{jam.name}</ThemedText>
                </View>
                <View>
                    <ThemedText>{jam.date.toLocaleDateString()}</ThemedText>
                </View>
            </View>
            <View style={styles.content}>
                <ThemedText>{jam.city}, {jam.location}</ThemedText>
                <ThemedText>{jam.style}</ThemedText>
                <ThemedText>Inscrits : {jam.participants}</ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
});