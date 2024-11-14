import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Autocomplete from 'react-native-autocomplete-input';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTournament, getLocationTournamentCount, searchLocations } from '../services/api';

const CreateTournamentScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchLocationTournamentCount();
    }, []);

    const fetchLocationTournamentCount = async () => {
        try {
            const locationId = await AsyncStorage.getItem('locationId');
            if (!locationId) throw new Error("Location ID not found");

            const tournamentCount = await getLocationTournamentCount(locationId);
            setName(`Tournament #${tournamentCount + 1}`);
        } catch (error) {
            console.error('Error fetching location-specific tournament count:', error);
        }
    };

    const handleCreateTournament = async () => {
        try {
            const locationId = await AsyncStorage.getItem('locationId');
            const data = { name, date, locationId };
            await createTournament(data);

            Alert.alert('Success', 'Tournament created successfully');
            navigation.goBack(); // Navigate back to TournamentsScreen
        } catch (error) {
            console.error('Error creating tournament:', error);
            Alert.alert('Error', 'Failed to create tournament');
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tournament Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{date ? date.toDateString() : 'Select Date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            

            <Button title="Create Tournament" onPress={handleCreateTournament} color="#4CAF50" />
        </View>
    );
};

export default CreateTournamentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    suggestion: {
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
    autocompleteContainer: {
        marginBottom: 15,
    },
    inputContainer: {
        borderWidth: 0,
    },
});

