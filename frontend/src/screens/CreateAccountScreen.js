import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { createAccount } from '../services/api'; // Import the API function

const CreateAccountScreen = ({ navigation }) => {
    // Local state to manage form fields
    const [playerName, setPlayerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');

    // Handle form submission
    const handleSignup = async () => {
        try {
            // Form data to send to the backend
            const data = {
                name: playerName,
                email: email.toLowerCase(),
                passKey: password,
                location,
            };

            // Call the API to create an account
            const response = await createAccount(data);

            if (response.status === 201) {
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Signin'); // Navigate to signin screen after successful signup
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to create account');
        }
    };

    return (
        <View style={styles.container}>
           

            {/* Title */}
            <Text style={styles.title}>Rack-N-Roll</Text>

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Player Name"
                value={playerName}
                onChangeText={setPlayerName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
            />

            {/* Signup Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8f7fa',
        padding: 20,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        top: -20,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#83c985',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
