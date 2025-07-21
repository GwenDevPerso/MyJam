import {ThemedText} from '@/components/ThemedText';
import {useAuth} from '@/contexts/AuthContext';
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

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const {signIn, loading} = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {control, handleSubmit, formState: {errors}, reset} = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            await signIn(data.email, data.password);

            Alert.alert(
                'Welcome Back!',
                'Successfully signed in to My Jam.',
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            reset();
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert(
                'Login Failed',
                error.message || 'Invalid email or password. Please try again.',
                [{text: 'OK'}]
            );
        }
    };

    const handleGoToRegister = () => {
        router.replace('/register');
    };

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
                    <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
                    <ThemedText type="subtitle" style={styles.subtitle}>
                        Sign in to continue jamming
                    </ThemedText>
                </View>

                <View style={styles.form}>
                    {/* Email Field */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>Email</ThemedText>
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
                        <ThemedText style={styles.label}>Password</ThemedText>
                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: 'Password is required',
                                minLength: {value: 6, message: 'Password must be at least 6 characters'}
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                                        placeholder="Enter your password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="current-password"
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

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <ThemedText style={styles.registerText}>Don&apos;t have an account? </ThemedText>
                        <TouchableOpacity onPress={handleGoToRegister}>
                            <ThemedText type="link" style={styles.registerLink}>Sign Up</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
    form: {
        flex: 1,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e5e9',
        paddingHorizontal: 15,
        minHeight: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 12,
    },
    passwordInput: {
        paddingRight: 40,
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
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5,
    },
    loginButton: {
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
    loginButtonDisabled: {
        backgroundColor: '#9BB5FF',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        paddingVertical: 15,
    },
    registerText: {
        fontSize: 16,
        color: '#666',
    },
    registerLink: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 