/**
 * OpenStreetMap Nominatim Geocoding Service
 * Free and open-source alternative to Mapbox geocoding
 * Documentation: https://nominatim.org/release-docs/develop/api/Search/
 */

export interface NominatimFeature {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
    address?: {
        house_number?: string;
        road?: string;
        suburb?: string;
        city?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
}

export interface LocationSuggestion {
    id: string;
    place_name: string;
    city: string;
    text: string;
    place_type?: string[];
    center: [number, number]; // [longitude, latitude]
    geometry: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
        address?: string;
    };
    context?: {
        id: string;
        text: string;
        short_code?: string;
    }[];
    latitude?: number;
    longitude?: number;
}

export class NominatimService {
    private static readonly BASE_URL = 'https://nominatim.openstreetmap.org';
    private static readonly USER_AGENT = 'MyJam/1.0.0'; // Required by Nominatim

    /**
     * Search for places using Nominatim geocoding API
     * @param query Search query string
     * @param limit Maximum number of results (default: 10)
     * @param countryCodes Optional array of country codes to limit results (e.g., ['fr', 'es'])
     * @returns Promise with location suggestions
     */
    static async searchPlaces(
        query: string,
        limit: number = 10,
        countryCodes?: string[]
    ): Promise<LocationSuggestion[]> {
        if (!query || query.length < 3) {
            return [];
        }

        try {
            const params = new URLSearchParams({
                q: query,
                format: 'json',
                addressdetails: '1',
                limit: limit.toString(),
                'accept-language': 'en',
                dedupe: '1', // Remove duplicate results
            });

            if (countryCodes && countryCodes.length > 0) {
                params.append('countrycodes', countryCodes.join(','));
            }

            const response = await fetch(
                `${this.BASE_URL}/search?${params.toString()}`,
                {
                    headers: {
                        'User-Agent': this.USER_AGENT,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: NominatimFeature[] = await response.json();
            
            return data.map(NominatimService.convertToLocationSuggestion);
        } catch (error) {
            console.error('Error fetching location suggestions from Nominatim:', error);
            return [];
        }
    }

    /**
     * Reverse geocoding - get address from coordinates
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @returns Promise with location information
     */
    static async reverseGeocode(
        latitude: number,
        longitude: number
    ): Promise<LocationSuggestion | null> {
        try {
            const params = new URLSearchParams({
                lat: latitude.toString(),
                lon: longitude.toString(),
                format: 'json',
                addressdetails: '1',
                'accept-language': 'en',
            });

            const response = await fetch(
                `${this.BASE_URL}/reverse?${params.toString()}`,
                {
                    headers: {
                        'User-Agent': this.USER_AGENT,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: NominatimFeature = await response.json();
            
            return NominatimService.convertToLocationSuggestion(data);
        } catch (error) {
            console.error('Error reverse geocoding with Nominatim:', error);
            return null;
        }
    }

    /**
     * Convert Nominatim feature to our LocationSuggestion format
     * This maintains compatibility with the existing Mapbox-based interface
     */
    private static convertToLocationSuggestion(feature: NominatimFeature): LocationSuggestion {
        const longitude = parseFloat(feature.lon);
        const latitude = parseFloat(feature.lat);
        
        // Extract meaningful name from display_name
        const displayParts = feature.display_name.split(',');
        const text = displayParts[0].trim();
        
        // Determine place type based on Nominatim class and type
        const placeType = NominatimService.getPlaceType(feature.class, feature.type);

        return {
            id: `nominatim-${feature.place_id}`,
            place_name: feature.display_name,
            city: feature.address?.city || '',
            text: text,
            place_type: [placeType],
            center: [longitude, latitude],
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
            properties: {
                address: feature.address ? NominatimService.formatAddress(feature.address) : undefined,
            },
            context: NominatimService.buildContext(feature),
            latitude,
            longitude,
        };
    }

    /**
     * Map Nominatim class/type to place types
     */
    private static getPlaceType(osmClass: string, osmType: string): string {
        const classTypeMap: Record<string, string> = {
            'amenity': 'poi',
            'shop': 'poi',
            'tourism': 'poi',
            'leisure': 'poi',
            'place': 'place',
            'boundary': 'region',
            'highway': 'address',
            'railway': 'poi',
            'aeroway': 'poi',
            'waterway': 'poi',
            'natural': 'poi',
            'landuse': 'poi',
        };

        return classTypeMap[osmClass] || 'poi';
    }

    /**
     * Format address components
     */
    private static formatAddress(address: NonNullable<NominatimFeature['address']>): string {
        const parts: string[] = [];
        
        if (address.house_number && address.road) {
            parts.push(`${address.house_number} ${address.road}`);
        } else if (address.road) {
            parts.push(address.road);
        }
        
        if (address.suburb) parts.push(address.suburb);
        if (address.city) parts.push(address.city);
        if (address.county) parts.push(address.county);
        if (address.state) parts.push(address.state);
        
        return parts.join(', ');
    }

    /**
     * Build context array similar to Mapbox format
     */
    private static buildContext(feature: NominatimFeature): LocationSuggestion['context'] {
        const context: NonNullable<LocationSuggestion['context']> = [];
        
        if (feature.address) {
            const { address } = feature;
            
            if (address.postcode) {
                context.push({
                    id: `postcode-${address.postcode}`,
                    text: address.postcode,
                });
            }
            
            if (address.city) {
                context.push({
                    id: `place-${address.city}`,
                    text: address.city,
                });
            }
            
            if (address.state) {
                context.push({
                    id: `region-${address.state}`,
                    text: address.state,
                });
            }
            
            if (address.country) {
                context.push({
                    id: `country-${address.country_code}`,
                    text: address.country,
                    short_code: address.country_code,
                });
            }
        }
        
        return context;
    }
}
