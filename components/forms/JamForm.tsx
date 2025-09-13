import {Profile} from '@/definitions/types/user.types';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {
    Platform,
    ScrollView,
    View
} from 'react-native';
import {
    Button,
    Card,
    Chip,
    HelperText,
    TextInput as PaperTextInput,
    Surface,
    Text
} from 'react-native-paper';
import {osmConfig} from '../../constants/config';
import {JamSession} from '../../definitions/types/Jam.types';
import LocationTextInput from '../LocationTextInput';

interface JamFormProps {
    onSubmit?: (jamData: Omit<JamSession, 'id' | 'created_by' | 'created_at' | 'updated_at' | 'latitude' | 'longitude'>) => void;
    initialData?: Partial<JamSession>;
    isLoading?: boolean;
}

export type JamFormInputs = {
    name: string;
    date: Date;
    city: string;
    location: string;
    description: string;
    style: string;
    participants: Profile[];
    createdBy: string;
    latitude?: number;
    longitude?: number;
};

export default function JamForm({onSubmit: onSubmitProp, initialData, isLoading = false}: JamFormProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {control, handleSubmit, formState: {errors}, setValue, watch, reset} = useForm<JamFormInputs>({
        defaultValues: {
            name: '',
            date: new Date(),
            city: '',
            location: '',
            description: '',
            style: '',
        }
    });

    // Load initial data when component mounts or initialData changes
    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name || '');
            setValue('date', initialData.date ? new Date(initialData.date) : new Date());
            setValue('city', initialData.city || '');
            setValue('location', initialData.location || '');
            setValue('description', initialData.description || '');
            setValue('style', initialData.style || '');
            if (initialData.latitude) setValue('latitude', initialData.latitude);
            if (initialData.longitude) setValue('longitude', initialData.longitude);
        }
    }, [initialData, setValue]);

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
            description: '',
            style: '',
            participants: [],
            createdBy: '',
        });
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setValue('date', selectedDate);
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
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
        <Surface style={{flex: 1, marginBottom: 50}}>
            <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{padding: 20}}
                showsVerticalScrollIndicator={false}
            >
                <Card style={{padding: 20}}>
                    {/* Jam Name */}
                    <View style={{marginBottom: 16}}>
                        <Controller
                            control={control}
                            rules={{required: 'Jam name is required'}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <PaperTextInput
                                    mode="outlined"
                                    label="Jam Name *"
                                    placeholder="Enter jam session name"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={!!errors.name}
                                    left={<PaperTextInput.Icon icon="music-note" />}
                                />
                            )}
                            name="name"
                        />
                        <HelperText type="error" visible={!!errors.name}>
                            {errors.name?.message}
                        </HelperText>
                    </View>

                    {/* Date & Time */}
                    <View style={{marginBottom: 16}}>
                        <Controller
                            control={control}
                            rules={{required: 'Date and time are required'}}
                            render={({field: {value}}) => (
                                <PaperTextInput
                                    mode="outlined"
                                    label="Date & Time *"
                                    value={formatDate(value)}
                                    editable={false}
                                    right={
                                        <PaperTextInput.Icon
                                            icon="calendar"
                                            onPress={() => setShowDatePicker(true)}
                                        />
                                    }
                                    left={<PaperTextInput.Icon icon="clock-outline" />}
                                    error={!!errors.date}
                                />
                            )}
                            name="date"
                        />
                        <HelperText type="error" visible={!!errors.date}>
                            {errors.date?.message}
                        </HelperText>
                    </View>

                    {showDatePicker && (
                        <View style={{marginBottom: 16}}>
                            <DateTimePicker
                                value={watchedValues.date}
                                mode="datetime"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                            <Button mode="contained"
                                style={{marginLeft: 'auto'}} onPress={() => setShowDatePicker(false)}>Valider</Button>
                        </View>
                    )}

                    {/* Location */}
                    <View style={{marginBottom: 16}}>
                        <Text variant="bodyMedium" style={{marginBottom: 8, fontWeight: '600'}}>
                            Location *
                        </Text>
                        <Controller
                            control={control}
                            rules={{required: 'Location is required'}}
                            render={({field: {onChange, value}}) => (
                                <LocationTextInput
                                    placeholder="Enter specific location/venue"
                                    value={value}
                                    onChangeText={onChange}
                                    onLocationSelect={(location) => {
                                        onChange(location.place_name);
                                        if (location.latitude && location.longitude) {
                                            setValue('latitude', location.latitude);
                                            setValue('longitude', location.longitude);
                                        }
                                    }}
                                    error={!!errors.location}
                                    countryCode={osmConfig.defaultCountryCode}
                                />
                            )}
                            name="location"
                        />
                        <HelperText type="error" visible={!!errors.location}>
                            {errors.location?.message}
                        </HelperText>
                    </View>

                    {/* Music Style */}
                    <View style={{marginBottom: 16}}>
                        <Text variant="bodyMedium" style={{marginBottom: 8, fontWeight: '600'}}>
                            Music Style *
                        </Text>
                        <Controller
                            control={control}
                            rules={{required: 'Music style is required'}}
                            render={({field: {onChange, value}}) => (
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                                    {musicStyles.map((style) => (
                                        <Chip
                                            key={style}
                                            selected={value === style}
                                            onPress={() => onChange(style)}
                                            mode={value === style ? 'flat' : 'outlined'}
                                        >
                                            {style}
                                        </Chip>
                                    ))}
                                </View>
                            )}
                            name="style"
                        />
                        <HelperText type="error" visible={!!errors.style}>
                            {errors.style?.message}
                        </HelperText>
                    </View>

                    {/* Description */}
                    <View style={{marginBottom: 24}}>
                        <Controller
                            control={control}
                            rules={{required: 'Description is required'}}
                            render={({field: {onChange, onBlur, value}}) => (
                                <PaperTextInput
                                    mode="outlined"
                                    label="Description *"
                                    placeholder="Describe the jam session, skill level, instruments needed, etc."
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={4}
                                    error={!!errors.description}
                                    left={<PaperTextInput.Icon icon="text" />}
                                />
                            )}
                            name="description"
                        />
                        <HelperText type="error" visible={!!errors.description}>
                            {errors.description?.message}
                        </HelperText>
                    </View>

                    {/* Submit Button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        loading={isLoading}
                        disabled={isLoading}
                        contentStyle={{paddingVertical: 8}}
                    >
                        {initialData ?
                            (isLoading ? 'Updating Jam...' : 'Update Jam Session') :
                            (isLoading ? 'Creating Jam...' : 'Create Jam Session')
                        }
                    </Button>
                </Card>
            </ScrollView>
        </Surface>
    );
}