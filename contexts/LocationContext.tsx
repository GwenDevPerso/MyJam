import * as Location from 'expo-location';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';

interface LocationContextType {
    location: Location.LocationObject | null;
    loading: boolean;
    error: string | null;
    hasPermission: boolean;
    getCurrentLocation: () => Promise<void>;
    requestPermission: () => Promise<boolean>;
    watchLocation: boolean;
    setWatchLocation: (watch: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

interface LocationProviderProps {
    children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({children}) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [watchLocation, setWatchLocation] = useState(false);
    const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

    useEffect(() => {
        // Check permission status on mount
        checkPermissionStatus();
    }, []);

    useEffect(() => {
        // Start/stop location watching based on watchLocation state
        if (watchLocation && hasPermission) {
            startWatchingLocation();
        } else {
            stopWatchingLocation();
        }

        return () => stopWatchingLocation();
    }, [watchLocation, hasPermission]);

    const checkPermissionStatus = async () => {
        try {
            const {status} = await Location.getForegroundPermissionsAsync();
            setHasPermission(status === 'granted');

            // Get initial location if permission already granted
            if (status === 'granted') {
                getCurrentLocation();
            }
        } catch (err) {
            console.error('Error checking permission status:', err);
        }
    };

    const requestPermission = async (): Promise<boolean> => {
        try {
            const {status} = await Location.requestForegroundPermissionsAsync();
            const granted = status === 'granted';
            setHasPermission(granted);

            if (!granted) {
                setError('Location permission denied');
                Alert.alert(
                    'Location Permission',
                    'Please enable location permissions to use location features.',
                    [{text: 'OK'}]
                );
            } else {
                setError(null);
            }

            return granted;
        } catch (err) {
            setError('Error requesting location permission');
            console.error('Error requesting permission:', err);
            return false;
        }
    };

    const getCurrentLocation = async () => {
        if (Platform.OS === 'web') {
            setError('Location not available on web');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!hasPermission) {
                const granted = await requestPermission();
                if (!granted) {
                    setLoading(false);
                    return;
                }
            }

            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                // timeout: 10000,
            });

            setLocation(currentLocation);
        } catch (err) {
            setError('Failed to get current location');
            console.error('Error getting location:', err);

            Alert.alert(
                'Location Error',
                'Could not retrieve your location. Please try again.',
                [{text: 'OK'}]
            );
        } finally {
            setLoading(false);
        }
    };

    const startWatchingLocation = async () => {
        if (Platform.OS === 'web' || !hasPermission) return;

        try {
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 30000, // Update every 30 seconds
                    distanceInterval: 100, // Update every 100 meters
                },
                (newLocation) => {
                    setLocation(newLocation);
                }
            );

            setLocationSubscription(subscription);
        } catch (err) {
            console.error('Error watching location:', err);
        }
    };

    const stopWatchingLocation = () => {
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }
    };

    const value: LocationContextType = {
        location,
        loading,
        error,
        hasPermission,
        getCurrentLocation,
        requestPermission,
        watchLocation,
        setWatchLocation,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}; 