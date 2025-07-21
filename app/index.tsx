import {useAuth} from '@/contexts/AuthContext';
import {Redirect} from 'expo-router';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default function Index() {
    const {user, loading} = useAuth();

    // Show loading spinner while checking authentication state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Redirect based on authentication state
    if (user) {
        return <Redirect href="/(tabs)" />;
    } else {
        return <Redirect href="/login" />;
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
}); 