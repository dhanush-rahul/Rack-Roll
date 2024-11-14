import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const AddTournamentScreen = ({ navigation }) => {
    const [numPlayers, setNumPlayers] = useState('');
    const [numDivisions, setNumDivisions] = useState(2);
    const [numGames, setNumGames] = useState(1);

    const handleProceed = () => {
        if (!numPlayers || !numDivisions || !numGames) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        // Navigate to the Add Players screen with tournament settings as params
        navigation.navigate('AddPlayers', { numPlayers, numDivisions, numGames });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Number of Players</Text>
            <TextInput
                style={styles.input}
                value={numPlayers}
                onChangeText={setNumPlayers}
                keyboardType="numeric"
                placeholder="Enter number of players"
            />

            <Text style={styles.label}>Number of Divisions</Text>
            <Picker
                selectedValue={numDivisions}
                style={styles.input}
                onValueChange={(itemValue) => setNumDivisions(itemValue)}
            >
                <Picker.Item label="2" value={2} />
                <Picker.Item label="3" value={3} />
                <Picker.Item label="4" value={4} />
            </Picker>

            <Text style={styles.label}>Number of Games Played Between 2 Players</Text>
            <TextInput
                style={styles.input}
                value={numGames}
                onChangeText={setNumGames}
                keyboardType="numeric"
                placeholder="Enter number of games"
            />

            <Button title="Proceed to Add Players" onPress={handleProceed} color="#4CAF50" />
        </View>
    );
};

export default AddTournamentScreen;

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
});
