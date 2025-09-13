import {useAuth} from '@/contexts/AuthContext';
import {Instrument} from '@/definitions/types/user.types';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
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
    Text,
    Title,
    useTheme
} from 'react-native-paper';

type RegisterFormInputs = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    age: string;
    city: string;
    instruments: string[];
};

export default function RegisterScreen() {
    const {signUp, loading} = useAuth();
    const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const theme = useTheme();

    const {control, handleSubmit, formState: {errors}, watch, reset} = useForm<RegisterFormInputs>({
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            age: '',
            city: '',
            instruments: [],
        }
    });

    const password = watch('password');

    const validateAge = (value: string) => {
        const age = parseInt(value);
        if (isNaN(age)) return 'Age must be a number';
        if (age < 13) return 'You must be at least 13 years old';
        if (age > 120) return 'Please enter a valid age';
        return true;
    };

    const validatePassword = (value: string) => {
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
        return true;
    };

    const validateConfirmPassword = (value: string) => {
        if (value !== password) return 'Passwords do not match';
        return true;
    };

    const toggleInstrument = (instrument: string) => {
        setSelectedInstruments(prev => {
            if (prev.includes(instrument)) {
                return prev.filter(i => i !== instrument);
            } else {
                return [...prev, instrument];
            }
        });
    };

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await signUp(data.email, data.password, {
                firstName: data.firstName,
                lastName: data.lastName,
                age: parseInt(data.age),
                city: data.city,
                instruments: selectedInstruments,
            });

            Alert.alert(
                'Registration Successful!',
                'Welcome to My Jam! You can now start creating and joining jam sessions.',
                [
                    {
                        text: 'Get Started',
                        onPress: () => {
                            reset();
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error.message || 'Something went wrong. Please try again.',
                [{text: 'OK'}]
            );
        }
    };

    const handleGoToLogin = () => {
        router.replace('/login');
    };

    const instrumentsArray = Object.values(Instrument);

    return (
        <Surface style={{flex: 1}}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={{flex: 1}}
                    contentContainerStyle={{
                        flexGrow: 1,
                        padding: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{alignItems: 'center', marginBottom: 30, paddingTop: 20}}>
                        <Title style={{textAlign: 'center', marginBottom: 8}}>
                            Join My Jam
                        </Title>
                        <Text variant="bodyLarge" style={{textAlign: 'center', color: theme.colors.onSurfaceVariant}}>
                            Create your account to start jamming
                        </Text>
                    </View>

                    <Card style={{padding: 20}}>
                        {/* Email Field */}
                        <View style={{marginBottom: 16}}>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Please enter a valid email address'
                                    }
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Email *"
                                        placeholder="your.email@example.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        error={!!errors.email}
                                        left={<PaperTextInput.Icon icon="email-outline" />}
                                    />
                                )}
                            />
                            <HelperText type="error" visible={!!errors.email}>
                                {errors.email?.message}
                            </HelperText>
                        </View>

                        {/* Password Field */}
                        <View style={{marginBottom: 16}}>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Password is required',
                                    validate: validatePassword
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Password *"
                                        placeholder="Enter a strong password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        left={<PaperTextInput.Icon icon="lock-outline" />}
                                        right={
                                            <PaperTextInput.Icon
                                                icon={showPassword ? "eye-off" : "eye"}
                                                onPress={() => setShowPassword(!showPassword)}
                                            />
                                        }
                                    />
                                )}
                            />
                            <HelperText type="error" visible={!!errors.password}>
                                {errors.password?.message}
                            </HelperText>
                        </View>

                        {/* Confirm Password Field */}
                        <View style={{marginBottom: 16}}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{
                                    required: 'Please confirm your password',
                                    validate: validateConfirmPassword
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Confirm Password *"
                                        placeholder="Confirm your password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        error={!!errors.confirmPassword}
                                        left={<PaperTextInput.Icon icon="lock-outline" />}
                                        right={
                                            <PaperTextInput.Icon
                                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                            />
                                        }
                                    />
                                )}
                            />
                            <HelperText type="error" visible={!!errors.confirmPassword}>
                                {errors.confirmPassword?.message}
                            </HelperText>
                        </View>

                        {/* Name Fields Row */}
                        <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    name="firstName"
                                    rules={{
                                        required: 'First name is required',
                                        minLength: {value: 2, message: 'First name must be at least 2 characters'}
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="First Name *"
                                            placeholder="First name"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            autoComplete="given-name"
                                            error={!!errors.firstName}
                                            left={<PaperTextInput.Icon icon="account-outline" />}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!errors.firstName}>
                                    {errors.firstName?.message}
                                </HelperText>
                            </View>

                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    name="lastName"
                                    rules={{
                                        required: 'Last name is required',
                                        minLength: {value: 2, message: 'Last name must be at least 2 characters'}
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="Last Name *"
                                            placeholder="Last name"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            autoComplete="family-name"
                                            error={!!errors.lastName}
                                            left={<PaperTextInput.Icon icon="account-outline" />}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!errors.lastName}>
                                    {errors.lastName?.message}
                                </HelperText>
                            </View>
                        </View>

                        {/* Age and City Row */}
                        <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    name="age"
                                    rules={{
                                        required: 'Age is required',
                                        validate: validateAge
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="Age *"
                                            placeholder="25"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="numeric"
                                            maxLength={3}
                                            error={!!errors.age}
                                            left={<PaperTextInput.Icon icon="calendar-outline" />}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!errors.age}>
                                    {errors.age?.message}
                                </HelperText>
                            </View>

                            <View style={{flex: 1}}>
                                <Controller
                                    control={control}
                                    name="city"
                                    rules={{
                                        required: 'City is required',
                                        minLength: {value: 2, message: 'City must be at least 2 characters'}
                                    }}
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <PaperTextInput
                                            mode="outlined"
                                            label="City *"
                                            placeholder="Your city"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            error={!!errors.city}
                                            left={<PaperTextInput.Icon icon="map-marker-outline" />}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!errors.city}>
                                    {errors.city?.message}
                                </HelperText>
                            </View>
                        </View>

                        {/* Instruments Selection */}
                        <View style={{marginBottom: 24}}>
                            <Text variant="bodyMedium" style={{marginBottom: 8, fontWeight: '600'}}>
                                Instruments (Optional)
                            </Text>
                            <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant, marginBottom: 12}}>
                                Select the instruments you play to help others find you for jam sessions
                            </Text>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
                                {instrumentsArray.map((instrument) => (
                                    <Chip
                                        key={instrument}
                                        selected={selectedInstruments.includes(instrument)}
                                        onPress={() => toggleInstrument(instrument)}
                                        mode={selectedInstruments.includes(instrument) ? 'flat' : 'outlined'}
                                    >
                                        {instrument}
                                    </Chip>
                                ))}
                            </View>
                        </View>

                        {/* Submit Button */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            disabled={loading}
                            style={{marginBottom: 16}}
                            contentStyle={{paddingVertical: 8}}
                        >
                            Create Account
                        </Button>

                        {/* Login Link */}
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text variant="bodyMedium">Already have an account? </Text>
                            <Button
                                mode="text"
                                onPress={handleGoToLogin}
                                compact
                            >
                                Sign In
                            </Button>
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </Surface>
    );
}