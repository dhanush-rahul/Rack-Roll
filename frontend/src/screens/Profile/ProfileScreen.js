import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await AsyncStorage.clear(); // Delete everything in AsyncStorage
            Alert.alert("Logged Out", "You have been successfully logged out.");
            navigation.replace("Signin"); // Redirect to Signin screen
        } catch (error) {
            console.error("Error clearing AsyncStorage:", error);
            Alert.alert("Error", "Failed to log out. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Screen</Text>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8f7fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
