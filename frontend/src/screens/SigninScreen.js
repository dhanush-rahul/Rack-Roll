import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { signIn } from '../services/api'; // Import sign-in API function
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store token locally
import { useNavigation, CommonActions } from '@react-navigation/native';

const SigninScreen = ({navigation}) => {
    // State for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const navigation = useNavigation();
    const handleSignin = async () => {
        try {
            const data = { email, passKey: password };
            const response = await signIn(data);

            if (response.status === 200) {
                const { token, locationId } = response.data;

                // Store token in AsyncStorage (or any other storage method)
                await AsyncStorage.setItem('authToken', token);
                await AsyncStorage.setItem('locationId', locationId);
                Alert.alert('Success', 'Signed in successfully');
                // Navigate to a protected screen or home screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Tournament' }], // Replace 'Home' with the name of your home screen
                    })
                );
                // navigation.replace('Tournament');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to sign in');
        }
    };

    return (
        <View style={styles.container}>
            {/* Illustration */}
            <Image
                source={require('../../assets/download.jpeg')} // Replace with the path to your image
                style={styles.image}
                resizeMode="contain"
            />

            {/* Title */}
            <Text style={styles.title}>Rack-N-Roll</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {/* Input Fields */}
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

            {/* Signin Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignin}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Link to Signup */}
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SigninScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
        backgroundColor: '#4CAF50',
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
    linkText: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});
