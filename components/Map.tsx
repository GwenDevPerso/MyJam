import {Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Only import MapView on native platforms
let MapView: any, Marker: any;
if (Platform.OS !== 'web') {
    const MapKit = require('react-native-maps');
    MapView = MapKit.default;
    Marker = MapKit.Marker;
}

interface MapProps {
    markers?: {
        id: number;
        latitude: number;
        longitude: number;
        title: string;
        description: string;
    }[];
    showUserLocation?: boolean;
    onLocationChange?: (location: Location.LocationObject) => void;
}

export default function Map({
    markers = [],
    showUserLocation = true,
    onLocationChange
}: MapProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [region, setRegion] = useState({
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            // Request location permissions
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                Alert.alert(
                    'Location Permission',
                    'Please enable location permissions to use this feature.',
                    [{text: 'OK'}]
                );
                return;
            }

            // Get current location
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setLocation(currentLocation);

            // Update map region to current location
            setRegion({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            // Call callback if provided
            if (onLocationChange) {
                onLocationChange(currentLocation);
            }

        } catch (error) {
            setErrorMsg('Error getting location');
            console.error('Error getting location:', error);
            Alert.alert(
                'Location Error',
                'Could not retrieve your location. Please try again.',
                [{text: 'OK'}]
            );
        }
    };

    // Web fallback component
    const WebMapFallback = () => (
        <View style={styles.webContainer}>
            <Ionicons name="location-outline" size={48} color="#666" />
            <Text style={styles.webTitle}>Map View</Text>
            <Text style={styles.webSubtitle}>
                Interactive map is available on mobile devices
            </Text>
            {location && (
                <View style={styles.webLocationInfo}>
                    <Text style={styles.webLocationText}>
                        Current Location:
                    </Text>
                    <Text style={styles.webLocationCoords}>
                        Lat: {location.coords.latitude.toFixed(6)}
                    </Text>
                    <Text style={styles.webLocationCoords}>
                        Lng: {location.coords.longitude.toFixed(6)}
                    </Text>
                </View>
            )}
            {markers.length > 0 && (
                <View style={styles.webMarkersInfo}>
                    <Text style={styles.webMarkersTitle}>
                        Jam Locations ({markers.length}):
                    </Text>
                    {markers.map((marker) => (
                        <Text key={marker.id} style={styles.webMarkerItem}>
                            • {marker.title}
                        </Text>
                    ))}
                </View>
            )}
            <TouchableOpacity
                style={styles.webRefreshButton}
                onPress={getCurrentLocation}
            >
                <Ionicons name="refresh" size={20} color="#007AFF" />
                <Text style={styles.webRefreshText}>Update Location</Text>
            </TouchableOpacity>
        </View>
    );

    if (errorMsg) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <Text style={styles.errorSubtext}>
                    Please enable location permissions to view the map.
                </Text>
            </View>
        );
    }

    // Return web fallback for web platform
    if (Platform.OS === 'web') {
        return <WebMapFallback />;
    }

    // Return native map for mobile platforms
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                showsUserLocation={showUserLocation}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                mapType="standard"
            >
                {/* Custom markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.title}
                        description={marker.description}
                    />
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
});       