import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import PlayerModal from './PlayerModal';
import { fetchPlayers, addNewPlayer } from './playerUtils';
import { addTournament } from '../services/api';
import { CommonActions } from '@react-navigation/native';

const AddPlayerScreen = ({ route, navigation }) => {
    const { numPlayers: numPlayersParam, numDivisions: numDivisionsParam, numGames: numGamesParam } = route.params;    const numPlayers = Number(numPlayersParam) || 0;
    const numDivisions = Number(numDivisionsParam) || 0;
    const numGames = Number(numGamesParam) || 0;
    const [allPlayers, setAllPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [shuffle, setShuffle] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [newPlayerHandicap, setNewPlayerHandicap] = useState('');
    const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

    useEffect(() => {
        fetchPlayers(setAllPlayers, setFilteredPlayers);
    }, []);

    const handleSearch = (query) => {
        if (!query.trim()) {
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

    const handleAddNewPlayer = () =>
        addNewPlayer(
            newPlayerName,
            newPlayerHandicap,
            setAllPlayers,
            setFilteredPlayers,
            () => {
                setNewPlayerName('');
                setNewPlayerHandicap('');
            },
            () => setShowAddPlayerModal(false)
        );

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

    return (
        <View style={styles.container}>
            {/* Search Players */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        handleSearch(text);
                    }}
                    placeholder="Search players..."
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddPlayerModal(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Available Players List */}
            <FlatList
                data={filteredPlayers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.playerItem}
                        onPress={() => handleSelectPlayer(item)}
                    >
                        <Text>{item.name}</Text>
                        <Text>Handicap: {item.handicap}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No players found. Add a new player!</Text>
                }
            />

            {/* Selected Players */}
            <Text style={styles.selectedTitle}>Selected Players ({selectedPlayers.length}):</Text>
            <FlatList
                data={selectedPlayers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.selectedPlayerItem}>
                        <Text>{item.name}</Text>
                        <Text>Handicap: {item.handicap}</Text>
                        <TouchableOpacity onPress={() => handleRemovePlayer(item)}>
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Shuffle Toggle */}
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Shuffle Players</Text>
                <Switch value={shuffle} onValueChange={setShuffle} />
            </View>

            {/* Add Tournament Button */}
            <Button
                title="Add Tournament"
                onPress={handleAddTournament}
                disabled={selectedPlayers.length !== numPlayers}
            />

            {/* Add Player Modal */}
            <PlayerModal
                visible={showAddPlayerModal}
                onClose={() => setShowAddPlayerModal(false)}
                newPlayerName={newPlayerName}
                setNewPlayerName={setNewPlayerName}
                newPlayerHandicap={newPlayerHandicap}
                setNewPlayerHandicap={setNewPlayerHandicap}
                onSubmit={handleAddNewPlayer}
            />
        </View>
    );
};

export default AddPlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 30,
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
        backgroundColor: '#4CAF50',
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
});
