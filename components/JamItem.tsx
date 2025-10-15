import {JamSession} from "@/definitions/types";
import {router} from "expo-router";
import React from "react";
import {View} from "react-native";
import {Card, Chip, IconButton, Text, useTheme} from "react-native-paper";

export default function JamItem({jam}: {jam: JamSession;}) {
    const theme = useTheme();

    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return {
            date: d.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: d.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const {date, time} = formatDate(jam.date);

    return (
        <Card
            style={{marginBottom: 12}}
            onPress={() => router.push(`/jam-detail/${jam.id}`)}
            mode="outlined"
        >
            <Card.Content>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12}}>
                    <Text variant="titleMedium" style={{flex: 1, fontWeight: '600'}}>
                        {jam.name}
                    </Text>
                    <View style={{alignItems: 'flex-end', marginLeft: 8}}>
                        <Text variant="bodySmall" style={{color: theme.colors.primary, fontWeight: '500'}}>
                            {date}
                        </Text>
                        <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                            {time}
                        </Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                    <IconButton
                        icon="map-marker"
                        size={16}
                        style={{margin: 0, padding: 0, marginRight: 4}}
                        iconColor={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, flex: 1}}>
                        {jam.city}
                    </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <IconButton
                        icon="map-marker-outline"
                        size={16}
                        style={{margin: 0, padding: 0, marginRight: 4}}
                        iconColor={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodyMedium" style={{color: theme.colors.onSurfaceVariant, flex: 1}} numberOfLines={2}>
                        {jam.location}
                    </Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Chip
                        mode="outlined"
                        compact
                        textStyle={{fontSize: 12}}
                        style={{backgroundColor: theme.colors.secondaryContainer}}
                    >
                        {jam.style}
                    </Chip>
                    <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                        Plus d&apos;infos ...
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
}