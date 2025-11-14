import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPlayer, getAllPlayersOfLocation, getPlayers } from '../services/api';

export const fetchPlayers = async (setAllPlayers, setFilteredPlayers) => {
    try {
        const locationId = await AsyncStorage.getItem('locationId');
        // const players = await getAllPlayersOfLocation(locationId);
        const players = await getPlayers();
        setAllPlayers(players);
        setFilteredPlayers(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        Alert.alert('Error', 'Failed to load players.');
    }
};

export const addNewPlayer = async (
    newPlayerName,
    newPlayerHandicap,
    setAllPlayers,
    setFilteredPlayers,
    resetInputs,
    closeModal
) => {
    if (!newPlayerName.trim()) {
        Alert.alert('Error', 'Player name is required.');
        return;
    }

    try {
        const newPlayer = await createPlayer({
            name: newPlayerName,
            handicap: newPlayerHandicap || 0,
        });

        setAllPlayers((prev) => [...prev, newPlayer]);
        setFilteredPlayers((prev) => [...prev, newPlayer]);
        resetInputs();
        closeModal();
    } catch (error) {
        console.error('Error creating player:', error);
        Alert.alert('Error', 'Failed to add the player.');
    }
};
