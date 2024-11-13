import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CreateAccountScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Illustration */}
            <Image
                source={require('../../assets/download.jpeg')} // Replace with the path to your image
                style={styles.image}
                resizeMode="contain"
            />

            {/* Title */}
            <Text style={styles.title}>8BallTourney</Text>
            <Text style={styles.subtitle}>Join now for exciting pool tournaments!</Text>

            {/* Input Fields */}
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
            <TextInput style={styles.input} placeholder="Name" />
            <TextInput style={styles.input} placeholder="Player Name" />
            <TextInput style={styles.input} placeholder="Handicap Level" keyboardType="numeric" />

            {/* Signup Button */}
            <TouchableOpacity style={styles.button} onPress={() => {/* Handle Signup Logic */}}>
                <Text style={styles.buttonText}>Enter</Text>
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
});
