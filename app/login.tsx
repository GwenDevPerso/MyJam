import {useAuth} from '@/contexts/AuthContext';
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
    HelperText,
    TextInput as PaperTextInput,
    Surface,
    Text,
    Title,
    useTheme
} from 'react-native-paper';

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const {signIn, loading} = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

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
                        justifyContent: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{alignItems: 'center', marginBottom: 40}}>
                        <Title style={{textAlign: 'center', marginBottom: 8}}>
                            Welcome Back
                        </Title>
                        <Text variant="bodyLarge" style={{textAlign: 'center', color: theme.colors.onSurfaceVariant}}>
                            Sign in to continue jamming
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
                                        label="Email"
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
                        <View style={{marginBottom: 24}}>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Password is required',
                                    minLength: {value: 6, message: 'Password must be at least 6 characters'}
                                }}
                                render={({field: {onChange, onBlur, value}}) => (
                                    <PaperTextInput
                                        mode="outlined"
                                        label="Password"
                                        placeholder="Enter your password"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="current-password"
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

                        {/* Submit Button */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            loading={loading}
                            disabled={loading}
                            style={{marginBottom: 16}}
                            contentStyle={{paddingVertical: 8}}
                        >
                            Sign In
                        </Button>

                        {/* Register Link */}
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text variant="bodyMedium">Don&apos;t have an account? </Text>
                            <Button
                                mode="text"
                                onPress={handleGoToRegister}
                                compact
                            >
                                Sign Up
                            </Button>
                        </View>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </Surface>
    );
}