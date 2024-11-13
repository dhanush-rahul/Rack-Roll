import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SigninScreen = ({ navigation }) => {
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
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />

            {/* Signin Button */}
            <TouchableOpacity style={styles.button} onPress={() => {/* Handle Signin Logic */}}>
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
