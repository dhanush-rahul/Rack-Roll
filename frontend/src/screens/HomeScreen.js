import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Illustration */}
            <Image
                source={require('../../assets/download.jpeg')} // Replace with your local image path
                style={styles.image}
                resizeMode="contain"
            />
            
            {/* Welcome Message */}
            <Text style={styles.title}>Welcome to Rack-n-Roll</Text>
            <Text style={styles.subtitle}>
                Manage players, divisions, and scores effortlessly. Never miss a detail.
            </Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Signin')}>
                    <Text style={styles.buttonText}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={styles.createAccountText}>Register</Text>
                </TouchableOpacity>
            </View> 

            {/* Explore as Visitor */}
            {/* <TouchableOpacity onPress={() => navigation.navigate('ExploreVisitor')}>
                <Text style={styles.exploreText}>Explore features as a visitor</Text>
            </TouchableOpacity> */}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8f7fa',
        padding: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginVertical: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        position: 'relative',
    },
    signInButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        marginRight: 10,
        flex: 1,
        alignItems: 'center',
        verticalAlign: 'middle', 
    },
    createAccountButton: {
        backgroundColor: '#83c985',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createAccountText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exploreText: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});
