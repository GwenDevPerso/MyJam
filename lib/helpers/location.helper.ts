import * as Location from 'expo-location';

export type Coordinates = {
    latitude: number;
    longitude: number;
};

export class LocationHelper {
    /**
     * Get coordinates from city and location address
     */
    static async getCoordinatesFromAddress(city: string, location: string): Promise<Coordinates> {
        try {
            const fullAddress = `${location}, ${city}`;
            const geocoded = await Location.geocodeAsync(fullAddress);
            
            if (geocoded.length > 0) {
                return {
                    latitude: geocoded[0].latitude,
                    longitude: geocoded[0].longitude
                };
            } else {
                // Fallback: try with just the city
                const cityGeocode = await Location.geocodeAsync(city);
                if (cityGeocode.length > 0) {
                    return {
                        latitude: cityGeocode[0].latitude,
                        longitude: cityGeocode[0].longitude
                    };
                }
            }
            
            throw new Error('Unable to find coordinates for the provided address');
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    }

    /**
     * Get address from coordinates (reverse geocoding)
     */
    static async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
        try {
            const results = await Location.reverseGeocodeAsync({ latitude, longitude });
            
            if (results.length > 0) {
                const address = results[0];
                const parts = [
                    address.name,
                    address.street,
                    address.city,
                    address.region,
                    address.country
                ].filter(Boolean);
                
                return parts.join(', ');
            }
            
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        }
    }

    /**
     * Calculate distance between two coordinates in kilometers
     */
    static calculateDistance(
        coord1: Coordinates,
        coord2: Coordinates
    ): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2.latitude - coord1.latitude);
        const dLon = this.toRadians(coord2.longitude - coord1.longitude);
        
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(coord1.latitude)) * 
            Math.cos(this.toRadians(coord2.latitude)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    /**
     * Convert degrees to radians
     */
    private static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get current user location
     */
    static async getCurrentLocation(): Promise<Coordinates> {
        try {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.error('Error getting current location:', error);
            throw error;
        }
    }
}