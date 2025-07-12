import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {JamSession} from '../definitions/types/Jam.types';

interface JamFormProps {
    onSubmit?: (jamData: Omit<JamSession, 'id'>) => void;
    initialData?: Partial<JamSession>;
    isLoading?: boolean;
}

type JamFormInputs = {
    name: string;
    date: Date;
    city: string;
    location: string;
    participants: number;
    description: string;
    style: string;
};

export default function JamForm({onSubmit: onSubmitProp, initialData, isLoading = false}: JamFormProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {control, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm<JamFormInputs>({
        defaultValues: {
            name: initialData?.name || '',
            date: initialData?.date || new Date(),
            city: initialData?.city || '',
            location: initialData?.location || '',
            participants: initialData?.participants || 1,
            description: initialData?.description || '',
            style: initialData?.style || '',
        }
    });

    const watchedValues = watch();

    const onSubmit: SubmitHandler<JamFormInputs> = (data: JamFormInputs) => {
        console.log('Form data:', data);
        if (onSubmitProp) {
            onSubmitProp(data);
        }
        // Reset form after submission
        reset({
            name: '',
            date: new Date(),
            city: '',
            location: '',
            participants: 1,
            description: '',
            style: '',
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setValue('date', selectedDate);
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const musicStyles = [
        'Jazz', 'Blues', 'Rock', 'Pop', 'Folk', 'Classical',
        'Electronic', 'Hip-Hop', 'R&B', 'Country', 'Reggae', 'Other'
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Jam Photo (Optional)</Text>
                    <UploadImg
                        onImageSelected={handleImageSelected}
                        maxWidth={350}
                        maxHeight={200}
                        style={styles.imageUpload}
                    />
                </View> */}

            {/* Jam Name */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Jam Name *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter jam session name"
                            placeholderTextColor="#999"
                        />
                    )}
                    name="name"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            {/* Date & Time */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date & Time *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {value}}) => (
                        <TouchableOpacity
                            style={[styles.dateButton, errors.date && styles.inputError]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#666" />
                            <Text style={styles.dateText}>{formatDate(value)}</Text>
                        </TouchableOpacity>
                    )}
                    name="date"
                />
                {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={watchedValues.date}
                    mode="datetime"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* City */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>City *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={[styles.input, errors.city && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter city"
                            placeholderTextColor="#999"
                        />
                    )}
                    name="city"
                />
                {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Location *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={[styles.input, errors.location && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Enter specific location/venue"
                            placeholderTextColor="#999"
                        />
                    )}
                    name="location"
                />
                {errors.location && <Text style={styles.errorText}>{errors.location.message}</Text>}
            </View>

            {/* Music Style */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Music Style *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.styleGrid}>
                            {musicStyles.map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    style={[
                                        styles.styleButton,
                                        value === style && styles.styleButtonActive,
                                    ]}
                                    onPress={() => onChange(style)}
                                >
                                    <Text
                                        style={[
                                            styles.styleButtonText,
                                            value === style && styles.styleButtonTextActive,
                                        ]}
                                    >
                                        {style}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    name="style"
                />
                {errors.style && <Text style={styles.errorText}>{errors.style.message}</Text>}
            </View>

            {/* Participants */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Expected Participants *</Text>
                <Controller
                    control={control}
                    rules={{required: true, min: 1}}
                    render={({field: {onChange, value}}) => (
                        <View style={styles.participantContainer}>
                            <TouchableOpacity
                                style={styles.participantButton}
                                onPress={() => onChange(Math.max(1, value - 1))}
                            >
                                <Ionicons name="remove" size={20} color="#666" />
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.participantInput, errors.participants && styles.inputError]}
                                value={value.toString()}
                                onChangeText={(text) => onChange(parseInt(text) || 1)}
                                keyboardType="numeric"
                                textAlign="center"
                            />
                            <TouchableOpacity
                                style={styles.participantButton}
                                onPress={() => onChange(value + 1)}
                            >
                                <Ionicons name="add" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    )}
                    name="participants"
                />
                {errors.participants && <Text style={styles.errorText}>{errors.participants.message}</Text>}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <Controller
                    control={control}
                    rules={{required: true}}
                    render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                            style={[styles.textArea, errors.description && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Describe the jam session, skill level, instruments needed, etc."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    )}
                    name="description"
                />
                {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>
                    {isLoading ? 'Creating Jam...' : 'Create Jam Session'}
                </Text>
            </TouchableOpacity>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
    },
    imageUpload: {
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    dateText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
    },
    styleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    styleButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    styleButtonActive: {
        backgroundColor: '#4A90E2',
        borderColor: '#4A90E2',
    },
    styleButtonText: {
        fontSize: 14,
        color: '#fff',
    },
    styleButtonTextActive: {
        color: '#fff',
    },
    participantContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    participantButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    participantInput: {
        width: 80,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        marginHorizontal: 15,
        textAlign: 'center',
    },
    textArea: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#666',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});       