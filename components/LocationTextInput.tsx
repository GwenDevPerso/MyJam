import {LocationSuggestion, NominatimService} from '@/lib/services/nominatim.service';
import {Ionicons} from '@expo/vector-icons';
import {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type LocationTextInputProps = {
    placeholder?: string;
    value?: string;
    onLocationSelect?: (location: LocationSuggestion) => void;
    onChangeText?: (text: string) => void;
    style?: any;
    error?: boolean;
    countryCodes?: string[]; // Changed from countryCode to countryCodes array
};

export default function LocationTextInput({
    placeholder = "Enter location",
    value,
    onLocationSelect,
    onChangeText,
    style,
    error = false,
    countryCodes // Changed from countryCode to countryCodes
}: LocationTextInputProps) {
    const [inputText, setInputText] = useState(value || '');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Update local state when value prop changes
    useEffect(() => {
        if (value !== undefined) {
            setInputText(value);
        }
    }, [value]);

    // Debounce function to limit API calls
    const debounce = (func: Function, delay: number) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    // Function to search for locations using OpenStreetMap Nominatim API
    const searchLocations = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoading(true);
        try {
            const results = await NominatimService.searchPlaces(query, 10, countryCodes);

            if (results && results.length > 0) {
                setSuggestions(results);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Error fetching location suggestions from OpenStreetMap:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = debounce(searchLocations, 300);

    const handleTextChange = (text: string) => {
        setInputText(text);
        onChangeText?.(text);
        if (text.length >= 3) {
            debouncedSearch(text);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleLocationSelect = async (location: LocationSuggestion) => {
        // Update both local state and notify parent
        setInputText(location.place_name);
        onChangeText?.(location.place_name);
        setShowSuggestions(false);
        setSuggestions([]);

        // Location already has latitude and longitude from Nominatim service
        onLocationSelect?.(location);
    };

    const clearInput = () => {
        setInputText('');
        setSuggestions([]);
        setShowSuggestions(false);
        onChangeText?.('');
    };

    const handleBlur = () => {
        // Temporarily commented out to test touch events
        // setTimeout(() => {
        //     setShowSuggestions(false);
        // }, 500); // Increased delay to allow touch events
    };

    const getLocationDisplayText = (feature: LocationSuggestion) => {
        // Extract main text and secondary text from the place_name
        const parts = feature.place_name.split(',');
        const mainText = feature.text || parts[0];
        const secondaryText = parts.slice(1).join(',').trim();

        return {
            mainText,
            secondaryText
        };
    };

    const renderSuggestion = (item: LocationSuggestion) => {
        const displayText = getLocationDisplayText(item);

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => {
                    handleLocationSelect(item);
                }}
                activeOpacity={0.7}
            >
                <Ionicons name="location-outline" size={16} color="#666" style={styles.suggestionIcon} />
                <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionMainText} numberOfLines={1}>
                        {displayText.mainText}
                    </Text>
                    {displayText.secondaryText && (
                        <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
                            {displayText.secondaryText}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    // Use controlled value if provided, otherwise use local state
    const displayValue = value !== undefined ? value : inputText;

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={displayValue}
                    onChangeText={handleTextChange}
                    onFocus={() => {
                        if (suggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                    onBlur={handleBlur}
                />
                {displayValue.length > 0 && (
                    <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </TouchableOpacity>
                )}
                {isLoading && (
                    <ActivityIndicator size="small" color="#666" style={styles.loadingIndicator} />
                )}
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <ScrollView
                        style={styles.suggestionsScrollView}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {suggestions.map(renderSuggestion)}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1000,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        height: 48,
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 12,
    },
    clearButton: {
        marginLeft: 8,
    },
    loadingIndicator: {
        marginLeft: 8,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        maxHeight: 250,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1001,
    },
    suggestionsScrollView: {
        flex: 1,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    suggestionIcon: {
        marginRight: 12,
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionMainText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    suggestionSecondaryText: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 2,
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
    },
});   