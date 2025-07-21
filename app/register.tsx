import {ThemedText} from '@/components/ThemedText';
import {useAuth} from '@/contexts/AuthContext';
import {Instrument} from '@/definitions/types/user.types';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>Join My Jam</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>
                        Create your account to start jamming
                    </ThemedText>
                </View>

                <View style={styles.form}>
                    {/* Email Field */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>Email *</ThemedText>
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
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, errors.email && styles.inputError]}
                                        placeholder="your.email@example.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>
                            )}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>

                    {/* Password Field */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>Password *</ThemedText>
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: 'Password is required',
                                // validate: validatePassword
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                                        placeholder="Enter a strong password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>Confirm Password *</ThemedText>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: 'Please confirm your password',
                                validate: validateConfirmPassword
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                                        placeholder="Confirm your password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                    </View>

                    {/* Name Fields Row */}
                    <View style={styles.nameRow}>
                        <View style={[styles.fieldGroup, styles.halCol]}>
                            <ThemedText style={styles.label}>First Name *</ThemedText>
                            <Controller
                                control={control}
                                name="firstName"
                                rules={{
                                    required: 'First name is required',
                                    minLength: {value: 2, message: 'First name must be at least 2 characters'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, errors.firstName && styles.inputError]}
                                            placeholder="First name"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            autoComplete="given-name"
                                        />
                                    </View>
                                )}
                            />
                            {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}
                        </View>

                        <View style={[styles.fieldGroup, styles.halCol]}>
                            <ThemedText style={styles.label}>Last Name *</ThemedText>
                            <Controller
                                control={control}
                                name="lastName"
                                rules={{
                                    required: 'Last name is required',
                                    minLength: {value: 2, message: 'Last name must be at least 2 characters'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, errors.lastName && styles.inputError]}
                                            placeholder="Last name"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                            autoComplete="family-name"
                                        />
                                    </View>
                                )}
                            />
                            {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}
                        </View>
                    </View>

                    {/* Age and City Row */}
                    <View style={styles.nameRow}>
                        <View style={[styles.fieldGroup, styles.halCol]}>
                            <ThemedText style={styles.label}>Age *</ThemedText>
                            <Controller
                                control={control}
                                name="age"
                                rules={{
                                    required: 'Age is required',
                                    validate: validateAge
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, errors.age && styles.inputError]}
                                            placeholder="25"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                    </View>
                                )}
                            />
                            {errors.age && <Text style={styles.errorText}>{errors.age.message}</Text>}
                        </View>

                        <View style={[styles.fieldGroup, styles.halCol]}>
                            <ThemedText style={styles.label}>City *</ThemedText>
                            <Controller
                                control={control}
                                name="city"
                                rules={{
                                    required: 'City is required',
                                    minLength: {value: 2, message: 'City must be at least 2 characters'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <View style={styles.inputContainer}>
                                        <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, errors.city && styles.inputError]}
                                            placeholder="Your city"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                )}
                            />
                            {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
                        </View>
                    </View>

                    {/* Instruments Selection */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>Instruments (Optional)</ThemedText>
                        <ThemedText style={styles.helpText}>
                            Select the instruments you play to help others find you for jam sessions
                        </ThemedText>
                        <View style={styles.instrumentsContainer}>
                            {instrumentsArray.map((instrument) => (
                                <TouchableOpacity
                                    key={instrument}
                                    style={[
                                        styles.instrumentChip,
                                        selectedInstruments.includes(instrument) && styles.instrumentChipSelected
                                    ]}
                                    onPress={() => toggleInstrument(instrument)}
                                >
                                    <Text style={[
                                        styles.instrumentChipText,
                                        selectedInstruments.includes(instrument) && styles.instrumentChipTextSelected
                                    ]}>
                                        {instrument}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <ThemedText style={styles.registerButtonText}>Create Account</ThemedText>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
                        <TouchableOpacity onPress={handleGoToLogin}>
                            <ThemedText type="link" style={styles.loginLink}>Sign In</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ============================================================================
    // CONTAINER STYLES
    // ============================================================================
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        flex: 1,
    },

    // ============================================================================
    // HEADER STYLES
    // ============================================================================
    header: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        color: '#1a1a1a',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },

    // ============================================================================
    // ROW & LAYOUT STYLES
    // ============================================================================
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    halCol: {
        width: '45%'
    },

    // ============================================================================
    // INPUT STYLES
    // ============================================================================
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e5e9',
        width: '100%',
        paddingHorizontal: 15,
        gap: 5,
        paddingVertical: 10,
    },
    input: {
        fontSize: 16,
        color: '#333',
        width: '100%',
    },
    passwordInput: {
        paddingRight: 40,
    },
    inputIcon: {
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    inputError: {
        borderColor: '#e74c3c',
        borderWidth: 2,
    },

    // ============================================================================
    // TEXT STYLES
    // ============================================================================
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5,
    },
    loginText: {
        fontSize: 16,
        color: '#666',
    },
    loginLink: {
        fontSize: 16,
        fontWeight: '600',
    },

    // ============================================================================
    // BUTTON STYLES
    // ============================================================================
    registerButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#007AFF',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    registerButtonDisabled: {
        backgroundColor: '#9BB5FF',
        shadowOpacity: 0,
        elevation: 0,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingVertical: 15,
    },

    // ============================================================================
    // INSTRUMENTS STYLES
    // ============================================================================
    instrumentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    instrumentChip: {
        backgroundColor: '#f1f3f4',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    instrumentChipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    instrumentChipText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    instrumentChipTextSelected: {
        color: '#FFFFFF',
    },
});