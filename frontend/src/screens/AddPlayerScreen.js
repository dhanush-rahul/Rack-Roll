import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, TouchableOpacity,  Switch, FlatList, Alert, Keyboard } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { addPlayerToTournament, searchPlayers, createPlayer } from '../services/api';

const AddPlayerScreen = ({ route, navigation }) => {
    const { numPlayers, numDivisions, numGames } = route.params;
    const [playerName, setPlayerName] = useState('');
    const [playerSuggestions, setPlayerSuggestions] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [shuffle, setShuffle] = useState(true);
    const [showAddPlayerPopup, setShowAddPlayerPopup] = useState(false);
    const [newPlayerHandicap, setNewPlayerHandicap] = useState('');
    const inputRef = useRef(null);

    const handlePlayerSearch = async (query) => {
        setPlayerName(query);

        if (query.length < 3) {
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
            const newPlayer = await createPlayer({ name: playerName, handicap: newPlayerHandicap });
            setSelectedPlayers([...selectedPlayers, newPlayer]);
            setPlayerName('');
            setNewPlayerHandicap('');
            setShowAddPlayerPopup(false);
        } catch (error) {
            console.error("Error creating new player:", error);
        }
    };

    const handleDeletePlayer = (playerId) => {
        setSelectedPlayers(selectedPlayers.filter(player => player._id !== playerId));
    };

    const handleProceedToScoresheet = () => {
        // if (selectedPlayers.length !== parseInt(numPlayers)) {
        //     Alert.alert("Error", "Please add the correct number of players");
        //     return;
        // }

        // if (shuffle) {
            // const shuffledPlayers = shufflePlayers(selectedPlayers, numDivisions);
            navigation.navigate('Scoresheet', { players: selectedPlayers, numDivisions: numDivisions});
        // } else {
        //     navigation.navigate('ManualDivisionSetup', { players: selectedPlayers, numDivisions });
        // }
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
                    title="Proceed to Scoresheet"
                    onPress={handleProceedToScoresheet}
                    color="#4CAF50"
                    // disabled={selectedPlayers.length !== parseInt(numPlayers)}
                />
            </View>

            {/* Popup for adding new player */}
            {showAddPlayerPopup && (
                <View style={styles.popupContainer}>
                    <TextInput
                        style={styles.input}
                        value={newPlayerHandicap}
                        onChangeText={setNewPlayerHandicap}
                        keyboardType="numeric"
                        placeholder="Enter handicap"
                    />
                    <View style={styles.popupButtons}>
                    <Button style={styles.addnewPlayerButton} title="Add Player" onPress={handleAddNewPlayer} color="#4CAF50" />
                    <Button style={styles.addnewPlayerCancelButton} title="Cancel" onPress={() => setShowAddPlayerPopup(false)} color="#FF0000" />
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
    elevation: 2,
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
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
    },
    addIcon: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
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
    popupContainer: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 5,
        zIndex: 2,
    },
    popupButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        width: '100%',
    },
    addnewPlayerButton: {
        width: '25%',
    },
    addnewPlayerCancelButton: {
        width: '25%',
    }
});
