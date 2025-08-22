import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createAccount, getAllLocations } from '../../services/api'; // Import the API function
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown

const CreateAccountScreen = ({ navigation }) => {
    // Local state to manage form fields
    const [playerName, setPlayerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]);

    // Fetch locations from API when the component mounts
    useEffect(() => {
        console.log("Hello")
        const fetchLocations = async () => {
            try {
                const data = await getAllLocations();
                // console.log(data);
                setLocations(data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
    }, []);

    // Handle form submission
    const handleSignup = async () => {
        if (!location) {
            Alert.alert("Error", "Please select a location.");
            return;
        }

        try {
            // Form data to send to the backend
            const data = {
                name: playerName,
                email: email.toLowerCase(),
                password,
                locationId: location,
                role: 'user'
            };
            console.log(location)
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

            {/* Location Picker Dropdown */}
            <Text style={styles.label}>Select Your Home Location</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={location}
                    onValueChange={(itemValue) => setLocation(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Select a Dooly's Location" value="" />
                    {locations.map((loc) => (
                        <Picker.Item 
                            key={loc._id} 
                            label={`${loc.name} - ${loc.address}`} 
                            value={loc._id} 
                        />
                    ))}
                </Picker>
            </View>

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#333',
    },
    pickerContainer: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    picker: {
        width: '100%',
        height: 50,
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
