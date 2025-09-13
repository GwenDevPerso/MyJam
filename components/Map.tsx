import {useLocation} from '@/contexts/LocationContext';
import * as Location from 'expo-location';
import {router} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';

export type MarkerType = {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image?: string; // URL de l'image ou require() pour une image locale
};

interface MapProps {
    markers?: MarkerType[];
    showUserLocation?: boolean;
    onLocationChange?: (location: Location.LocationObject) => void;
}

export default function Map({
    markers = [],
    showUserLocation = true,
    onLocationChange
}: MapProps) {
    const {location, error, } = useLocation();
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        if (location) {
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    }, [location, onLocationChange]);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorSubtext}>
                    Please enable location permissions to view the map.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={showUserLocation}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                mapType="terrain"
            >
                {/* Custom markers with custom callouts */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                    >
                        {/* Custom marker view with pin */}
                        <View style={styles.markerContainer}>
                            <View style={styles.customMarker}>
                                {marker.image ? (
                                    <Image
                                        source={typeof marker.image === 'string' ? {uri: marker.image} : marker.image}
                                        style={styles.markerImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.markerPlaceholder}>
                                        <Text style={styles.markerText}>🎵</Text>
                                    </View>
                                )}
                            </View>
                            {/* Pin pointer */}
                            <View style={styles.markerPin} />
                        </View>
                        <Callout
                            style={styles.callout}
                            onPress={() => {
                                console.log('callout pressed', marker);
                                router.push(`/jam-detail/${marker.id}`);
                            }}
                        >
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{marker.title}</Text>
                                <Text style={styles.calloutDate}>{new Date(marker.date).toLocaleDateString()} à {new Date(marker.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</Text>
                                <Text style={styles.calloutLocation}>{marker.location}</Text>
                                <Text style={styles.calloutDescription}>
                                    {marker.description}
                                </Text>
                                <View style={styles.calloutButton}>
                                    <Text style={styles.calloutButtonText}>Tap to view details</Text>
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {location && (
                <View style={styles.locationInfo}>
                    <Text style={styles.locationText}>
                        Lat: {location.coords.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.locationText}>
                        Lng: {location.coords.longitude.toFixed(6)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: 300,
    },
    map: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    locationInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    locationText: {
        fontSize: 12,
        color: '#333',
        fontFamily: 'monospace',
    },
    // Web-specific styles
    webContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        height: 300,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    webTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    webSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    webLocationInfo: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    webLocationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    webLocationCoords: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
    },
    webMarkersInfo: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    webMarkersTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    webMarkerItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    webRefreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    webRefreshText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    // Custom marker styles
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    customMarker: {
        width: 32,
        height: 32,
        backgroundColor: '#fff',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#007AFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        overflow: 'hidden',
    },
    markerPin: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 0,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#007AFF',
        marginTop: -1,
    },
    markerImage: {
        width: '100%',
        height: '100%',
    },
    markerPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerText: {
        fontSize: 14,
        color: '#fff',
    },
    // Custom callout styles
    callout: {
        width: 250,
        minHeight: 80,
    },
    calloutContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    calloutDate: {
        fontSize: 13,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 4,
    },
    calloutLocation: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    calloutDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
        marginBottom: 12,
    },
    calloutButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    calloutButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});       