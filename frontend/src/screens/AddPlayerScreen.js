import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Switch, FlatList, Alert, Keyboard } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { addPlayerToTournament, searchPlayers, createPlayer, addTournament } from '../services/api';
import { CommonActions } from '@react-navigation/native';

const AddPlayerScreen = ({ route, navigation }) => {
    const { numPlayers, numDivisions, numGames } = route.params;
    const [playerName, setPlayerName] = useState('');
    const [playerSuggestions, setPlayerSuggestions] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [shuffle, setShuffle] = useState(false);
    const [showAddPlayerPopup, setShowAddPlayerPopup] = useState(false);
    const [newPlayerHandicap, setNewPlayerHandicap] = useState(0.0);
    const [newPlayerName, setNewPlayerName] = useState('');
    const inputRef = useRef(null);

    const handlePlayerSearch = async (query) => {
        setPlayerName(query);

        if (query.length < 1) {
            setPlayerSuggestions([]);
            setShowAddPlayerPopup(false);
            return;
        }

        try {
            const suggestions = await searchPlayers(query);
            setPlayerSuggestions(suggestions);
        } catch (error) {
            console.error("Error fetching player suggestions:", error);
        }
    };

    const handleAddExistingPlayer = (player) => {
        if (selectedPlayers.length >= numPlayers) {
            Alert.alert("Player Limit Reached", `You can only add ${numPlayers} players.`);
            return;
        }

        if (selectedPlayers.find(p => p._id === player._id)) return;
        setSelectedPlayers([...selectedPlayers, player]);
        setPlayerName('');
        setPlayerSuggestions([]); // Clear suggestions without dismissing keyboard
    };

    const handleAddNewPlayer = async () => {
        if (selectedPlayers.length >= numPlayers) {
            Alert.alert("Player Limit Reached", `You can only add ${numPlayers} players.`);
            return;
        }

        try {
            console.log(newPlayerHandicap + " added");
            const newPlayer = await createPlayer({ name: newPlayerName, handicap: newPlayerHandicap != null || newPlayerHandicap != '' ? newPlayerHandicap : 0 });
            setSelectedPlayers([...selectedPlayers, newPlayer]);
            setPlayerName('');
            setNewPlayerHandicap('');
            setShowAddPlayerPopup(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create player";
            console.error("Error creating new player:", errorMessage);
            Alert.alert("Error", errorMessage);        }
    };

    const handleDeletePlayer = (playerId) => {
        setSelectedPlayers(selectedPlayers.filter(player => player._id !== playerId));
    };
    const shufflePlayers = (players, numDivisions) => {
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [players[i], players[j]] = [players[j], players[i]];
        }

        const divisions = Array.from({ length: numDivisions }, () => []);
        players.forEach((player, index) => {
            if (!player._id) {
                throw new Error(`Invalid player: ${JSON.stringify(player)}`);
            }
            const divisionIndex = index % numDivisions;
            divisions[divisionIndex].push(player);
        });

        return divisions;
    };
    const handleAddTournament = async () => {
        try {
            const players = shuffle ? shufflePlayers(selectedPlayers, numDivisions).flat() : selectedPlayers;
            const response = await addTournament(players, numDivisions, numGames); // Backend call to create tournament
            Alert.alert('Success', 'Tournament created successfully!');
            // Reset the navigation stack to TournamentScreen
            navigation.dispatch(
                CommonActions.reset({
                    index: 0, // Start at index 0
                    routes: [{ name: 'Tournament' }], // Only 'TournamentScreen' in the stack
                })
            );
        } catch (error) {
            console.error("Error creating tournament:", error);
            Alert.alert('Error', 'Failed to create the tournament.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Add Players Autocomplete */}
            <View style={styles.autocompleteSection}>
                <View style={styles.inputWrapper}>
                    <Autocomplete
                        data={playerSuggestions}
                        defaultValue={playerName}
                        onChangeText={handlePlayerSearch}
                        placeholder="Enter player name"
                        editable={selectedPlayers.length < numPlayers} // Disable input if limit reached
                        containerStyle={[styles.autocompleteContainer, { flex: 1 }]} // Allow input to take up available space
                        inputContainerStyle={styles.inputContainer}
                        listContainerStyle={styles.dropdownListContainer} // Add offset to dropdown
                        flatListProps={{
                            keyboardShouldPersistTaps: 'always',
                            keyExtractor: (item) => item._id,
                            renderItem: ({ item }) => (
                                <TouchableOpacity onPress={() => handleAddExistingPlayer(item)}>
                                    <Text style={styles.suggestion}>{`${item.name} (Handicap: ${item.handicap})`}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                        renderTextInput={(props) => (
                            <TextInput
                                {...props}
                                ref={inputRef}
                                autoFocus
                                onFocus={() => {
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                            />
                        )}
                    />

                    {/* + Icon for Adding New Player */}
                    {playerSuggestions.length === 0 && playerName.length >= 3 && (
                        <TouchableOpacity onPress={() => setShowAddPlayerPopup(true)} style={styles.addIcon}>
                            <Text style={styles.plusText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Players List with Player Count */}
            <View style={styles.playersListSection}>
                <Text style={styles.playerCount}>Players Added: {selectedPlayers.length} / {numPlayers}</Text>
                <FlatList
                    data={selectedPlayers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.playerContainer}>
                            <View>
                                <Text style={styles.playerName}>{item.name}</Text>
                                <Text style={styles.playerHandicap}>Handicap: {item.handicap}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeletePlayer(item._id)}>
                                <Text style={styles.deleteText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            {/* Shuffle Check & Proceed Button */}
            <View style={styles.footerSection}>
                <View style={styles.switchContainer}>
                    <Text>Shuffle Players into Divisions</Text>
                    <Switch value={shuffle} onValueChange={setShuffle} />
                </View>
                <Button
                    title="Add Tournament"
                    onPress={handleAddTournament}
                    color="#83c985"
                    disabled={selectedPlayers.length !== parseInt(numPlayers)} // Ensure all players are added
                />

            </View>

            {/* Popup for adding new player */}
            {showAddPlayerPopup && (
                <View style={styles.overlay}>
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupTitle}>Add New Player</Text>
                        <TextInput 
                            style={styles.input}
                            value={newPlayerName}
                            onChangeText={setNewPlayerName}
                            placeholder="Enter Player Name"
                        />
                        <TextInput
                            style={styles.input}
                            value={newPlayerHandicap}
                            onChangeText={setNewPlayerHandicap}
                            keyboardType="numeric"
                            placeholder="Enter handicap"
                        />
                        <View style={styles.popupButtons}>
                            <Button
                                style={styles.addnewPlayerButton}
                                title="Add Player"
                                onPress={handleAddNewPlayer}
                                color="#83c985"
                            />
                            <Button
                                style={styles.addnewPlayerCancelButton}
                                title="Cancel"
                                onPress={() => setShowAddPlayerPopup(false)}
                                color="#FF0000"
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default AddPlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    autocompleteSection: {
        flex: 0.15,
        justifyContent: 'center',
        zIndex: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playersListSection: {
        flex: 0.7,
        marginVertical: 10,
        padding: 10,
    },
    footerSection: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    autocompleteContainer: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
    inputContainer: {
        borderWidth: 0,
        padding: 5,
        flex: 1,
        position: 'relative',
        zIndex: 3,
    },
    dropdownListContainer: {
        position: 'absolute',
        width: '100%',
        marginTop: 40, // Adjust the dropdown position slightly below the input field
    },
    suggestion: {
        padding: 10,
        fontSize: 16,
        color: '#333',
        position: 'relative',
        zIndex: 1,
    },
    addIcon: {
        marginTop: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 18,
        backgroundColor: '#83c985',
    },
    plusText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    playerCount: {
        textAlign: 'right',
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 8,
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    playerHandicap: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    deleteText: {
        color: 'red',
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    addnewPlayerButton: {
        width: '25%',
    },
    addnewPlayerCancelButton: {
        width: '25%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // Ensure it overlays everything
    },
    popupContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    popupButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
});
