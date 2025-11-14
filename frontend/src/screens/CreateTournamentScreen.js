import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddTournamentScreen = ({ navigation }) => {
    const [numPlayers, setNumPlayers] = useState('');
    const [numDivisions, setNumDivisions] = useState(2);
    const [numGames, setNumGames] = useState('');

    const handleProceed = () => {
        if (!numPlayers || !numDivisions || !numGames) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        navigation.navigate('AddPlayers', { numPlayers, numDivisions, numGames });
    };

    return (
        <View style={styles.container}>
            {/* Number of Players */}
            <View style={styles.row}>
                <Text style={styles.label}>Number of Players</Text>
                <TextInput
                    style={styles.input}
                    value={numPlayers}
                    onChangeText={setNumPlayers}
                    keyboardType="numeric"
                    placeholder="0"
                />
            </View>

            {/* Number of Divisions */}
            <View style={styles.row}>
                <Text style={styles.label}>Number of Divisions</Text>
                <Picker
                    selectedValue={numDivisions}
                    style={styles.picker}
                    onValueChange={(itemValue) => setNumDivisions(itemValue)}
                >
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                </Picker>
            </View>

            {/* Number of Games */}
            <View style={styles.column}>
                <Text style={styles.label}>Number of Games Played Between 2 Players</Text>
                <TextInput
                    style={styles.inputFullWidth}
                    value={numGames}
                    onChangeText={setNumGames}
                    keyboardType="numeric"
                    placeholder="Enter number of games"
                />
            </View>

            {/* Proceed Button */}
            <View style={styles.footer}>
                <Button title="Proceed to Add Players" onPress={handleProceed} color="#83c985" />
            </View>
        </View>
    );
};

export default AddTournamentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#eafaf5',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom:30,
    },
    column: {
        marginBottom: 15, // Space between this section and the next
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        height: 40,
    },
    inputFullWidth: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        height: 40,
    },
    picker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginLeft: 10,
        height: 60,
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
    },
});
