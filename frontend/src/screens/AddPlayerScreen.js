import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Switch,
} from 'react-native';
import { addTournament, createPlayer, getAllPlayersOfLocation } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const AddPlayerScreen = ({ route, navigation }) => {
    const { numPlayers, numDivisions, numGames } = route.params;
    const [playerName, setPlayerName] = useState('');
    const [allPlayers, setAllPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [shuffle, setShuffle] = useState(false);
    const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerHandicap, setNewPlayerHandicap] = useState('');

    const fetchPlayers = async () => {
        try {
            const locationId = await AsyncStorage.getItem('locationId');
            const players = await getAllPlayersOfLocation(locationId); // Assume response is an array of names
            setAllPlayers(players);
            setFilteredPlayers(players);
        } catch (error) {
            console.error('Error fetching players:', error);
            Alert.alert('Error', 'Failed to load players.');
        }
    };

    const handleSearch = (query) => {
        setPlayerName(query);
        if (query.length === 0) {
            setFilteredPlayers(allPlayers.filter((player) => !selectedPlayers.includes(player)));
        } else {
            const filtered = allPlayers.filter(
                (player) =>
                    player.name.toLowerCase().includes(query.toLowerCase()) &&
                    !selectedPlayers.find((selected) => selected._id === player._id)
            );
            setFilteredPlayers(filtered);
        }
    };

    const handleSelectPlayer = (player) => {
        if (selectedPlayers.length >= numPlayers) {
            Alert.alert('Player Limit Reached', `You can only add ${numPlayers} players.`);
            return;
        }

        setSelectedPlayers((prev) => [...prev, player]);
        setFilteredPlayers((prev) => prev.filter((p) => p._id !== player._id));
    };

    const handleRemovePlayer = (player) => {
        setSelectedPlayers((prev) => prev.filter((p) => p._id !== player._id));
        setFilteredPlayers((prev) => [...prev, player]);
    };
    const handleAddNewPlayer = async () => {
        if (!newPlayerName.trim()) {
            Alert.alert('Error', 'Player name is required.');
            return;
        }

        try {
            // Save the new player to the backend
            const newPlayer = await createPlayer({ name: newPlayerName, handicap: newPlayerHandicap || 0 });

            // Add the new player object to the lists
            setAllPlayers((prev) => [...prev, newPlayer]);
            setFilteredPlayers((prev) => [...prev, newPlayer]);

            // Reset modal inputs and close modal
            setNewPlayerName('');
            setNewPlayerHandicap('');
            setShowAddPlayerModal(false);
        } catch (error) {
            console.error('Error creating player:', error);
            Alert.alert('Error', 'Failed to add the player.');
        }
    };

    const handleAddTournament = async () => {
        try {
            const players = shuffle
                ? [...selectedPlayers].sort(() => Math.random() - 0.5)
                : selectedPlayers;

            await addTournament(players, numDivisions, numGames);
            Alert.alert('Success', 'Tournament created successfully!');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Tournament' }],
                })
            );
        } catch (error) {
            console.error('Error creating tournament:', error);
            Alert.alert('Error', 'Failed to create the tournament.');
        }
    };

    React.useEffect(() => {
        fetchPlayers();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={playerName}
                    onChangeText={handleSearch}
                    placeholder="Search players..."
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddPlayerModal(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredPlayers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.playerItem}
                        onPress={() => handleSelectPlayer(item)}
                    >
                        {/* Access the 'name' property explicitly */}
                        <Text style={styles.playerName}>{item.name}</Text>
                        <Text style={styles.playerHandicap}>Handicap: {item.handicap}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No players found. Add a new player!</Text>
                }
            />
            <Text style={styles.selectedTitle}>Selected Players ({selectedPlayers.length}):</Text>
            <FlatList
                data={selectedPlayers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.selectedPlayerItem}>
                        {/* Access player name instead of rendering the whole object */}
                        <Text>{item.name} </Text>
                        <Text style={styles.playerHandicap}>Handicap: {item.handicap}</Text>
                        <TouchableOpacity onPress={() => handleRemovePlayer(item)}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Shuffle Players</Text>
                <Switch value={shuffle} onValueChange={setShuffle} />
            </View>
            <Button
                title="Add Tournament"
                onPress={handleAddTournament}
                disabled={selectedPlayers.length != numPlayers}
            />

            {/* Add Player Modal */}
            <Modal
                visible={showAddPlayerModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAddPlayerModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Player</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newPlayerName}
                            onChangeText={setNewPlayerName}
                            placeholder="Enter Player Name"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={newPlayerHandicap}
                            onChangeText={setNewPlayerHandicap}
                            placeholder="Enter Player Handicap"
                            keyboardType="numeric"
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Add" onPress={handleAddNewPlayer} />
                            <Button
                                title="Cancel"
                                color="red"
                                onPress={() => setShowAddPlayerModal(false)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddPlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    searchInput: {
        flex: 3,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#83c985',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
    },
    playerItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 5,
        borderRadius: 5,
    },
    playerName: {
        fontSize: 16,
    },
    selectedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    selectedPlayerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e7f7e7',
        borderRadius: 5,
        marginBottom: 5,
    },
    removeText: {
        color: 'red',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
    },
    toggleText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
