import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface UploadImgProps {
    onImageSelected?: (uri: string) => void;
    onImageUploaded?: (uploadedUrl: string) => void;
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    style?: any;
}

export default function UploadImg({
    onImageSelected,
    onImageUploaded,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.8,
    style
}: UploadImgProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const requestPermissions = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Sorry, we need camera roll permissions to upload images.',
                [{text: 'OK'}]
            );
            return false;
        }
        return true;
    };

    const handleImageSelection = () => {
        Alert.alert(
            'Select Image',
            'Choose how you want to select an image',
            [
                {text: 'Camera', onPress: handleOpenCamera},
                {text: 'Photo Library', onPress: handleOpenGallery},
                {text: 'Cancel', style: 'cancel'}
            ]
        );
    };

    const handleOpenCamera = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera permission is required to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: quality,
            base64: false,
        });

        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setSelectedImage(imageUri);
            onImageSelected?.(imageUri);
        }
    };

    const handleOpenGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: quality,
            base64: false,
        });

        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setSelectedImage(imageUri);
            onImageSelected?.(imageUri);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setIsUploading(true);
        try {
            // This is a placeholder for actual upload logic
            // You'll need to implement your actual upload endpoint here
            const formData = new FormData();
            formData.append('image', {
                uri: selectedImage,
                type: 'image/jpeg',
                name: 'image.jpg',
            } as any);

            // Replace with your actual upload URL
            const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                onImageUploaded?.(result.url);
                Alert.alert('Success', 'Image uploaded successfully!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload image. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    return (
        <View style={[styles.container, style]}>
            {!selectedImage ? (
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleImageSelection}
                    activeOpacity={0.7}
                >
                    <Ionicons name="cloud-upload-outline" size={48} color="#666" />
                    <Text style={styles.uploadText}>Tap to select image</Text>
                    <Text style={styles.uploadSubtext}>Camera or Photo Library</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: selectedImage}}
                        style={[styles.selectedImage, {maxWidth, maxHeight}]}
                        resizeMode="cover"
                    />
                    <View style={styles.imageActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleRemoveImage}
                        >
                            <Ionicons name="trash-outline" size={20} color="#ff4444" />
                            <Text style={styles.actionText}>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleImageSelection}
                        >
                            <Ionicons name="refresh-outline" size={20} color="#007AFF" />
                            <Text style={styles.actionText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.uploadActionButton]}
                            onPress={handleUpload}
                            disabled={isUploading}
                        >
                            <Ionicons
                                name={isUploading ? "cloud-upload" : "cloud-upload-outline"}
                                size={20}
                                color="#007AFF"
                            />
                            <Text style={styles.actionText}>
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        minHeight: 200,
        width: '100%',
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 12,
    },
    uploadSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    imageContainer: {
        alignItems: 'center',
        width: '100%',
    },
    selectedImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
    },
    imageActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    actionButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
    },
    uploadActionButton: {
        backgroundColor: '#e6f3ff',
    },
    actionText: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
        fontWeight: '500',
    },
});       