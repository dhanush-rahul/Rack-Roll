import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const api = axios.create({
    baseURL: 'https://api.dhanushcharipally.com/api', // Replace with your backend URL
    // baseURL:'http://localhost:5000/api', 
    headers:{
        'Content-Type': 'application/json',
    }
});

// Account-related API calls
export const createAccount = async (data) => {
    return await api.post('/locations/', data);
};

export const signIn = async (data) => {
    return await api.post('/locations/signin', data); // Endpoint for sign-in
};

// Tournament-related API calls
export const getTournaments = async () => {
    const response = await api.get('/tournaments');
    return response.data;
};
export const getTournamentsByLocation = async (locationId) => {
    const response = await api.get(`/tournaments/location/${locationId}`);
    return response.data;
}
export const createTournament = async (data) => {
    return await api.post('/tournaments', data);
};

export const getLocationTournamentCount = async (locationId) => {
    const response = await api.get(`/tournaments/count/location/${locationId}`);
    return response.data.count;
};

// Location-related API calls
export const getPlayers = async () => {
    const response = await api.get('/players');
    return response.data;
};

export const searchLocations = async (query) => {
    const response = await api.get(`/locations/search?query=${query}`);
    return response.data;
};

// Add a player to a specific tournament
export const addPlayerToTournament = async (tournamentId, playerId) => {
    return await api.post(`/tournaments/${tournamentId}/players`, { playerId });
};

// Search players by name
export const searchPlayers = async (query) => {
    const response = await api.get(`/players/search?query=${query}`);
    return response.data;
};

// Create a new player
export const createPlayer = async (playerData) => {
    const response = await api.post('/players', playerData);
    return response.data;
};

export const createGame = async (gameData) => {
    try {
        const response = await api.post('/games', gameData);
        return response.data;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
};

export const addTournament = async (players, numDivisions, numGames) => {
    const data = {
        players,
        numDivisions,
        numGames,
        tournamentName: `Tournament #`,
        locationId: await AsyncStorage.getItem('locationId'), // Retrieve location ID
    };
    return await api.post('/tournaments/create-with-games', data); // Update endpoint accordingly
};

export const deleteTournamentApi = async(tournamentId) => {
    const response = await api.delete(`/tournaments/${tournamentId}`);
    return response.data;
}

export const getScoresheet = async (tournamentId) => {
    return await api.get(`/tournaments/${tournamentId}/scoresheet`);
};
export const getTournamentDetails = async (tournamentId) => {
    const response = await api.get(`/tournaments/${tournamentId}/details`);
    return response.data;
};  
export const updateGameWithId = async (gameId, gameIndex, player1Score, player2Score) => {
    try {
        const response = await api.patch(`/games/${gameId}/scores`, {
            gameIndex,
            player1Score,
            player2Score,
        });
        console.log('Scores:', response.data.game.scores);
        return response.data;
    } catch (error) {
        console.error(`Error updating game ${gameId}:`, error.response?.data || error.message);
        throw error;
    }
};

// services/api.js

export const getLeaderboardData = async (tournamentId, divisionId) => {
    try {
      const response = await api.get(`/leaderboards/tournament/${tournamentId}/division/${divisionId}`);
      console.log('Leaderboard Data:', response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Leaderboard not found; return an empty leaderboard
        console.warn(`Leaderboard not found for division ${divisionId}, returning empty leaderboard.`);
        return { rankings: {} };
      } else {
        console.error('Error fetching leaderboard data:', error);
        throw error; // Rethrow other errors
      }
    }
};

export const getPlayersWithScores = async () => {
    const response = await api.get('/players/with-scores'); // Replace with your API endpoint
    return await response.json();
};

// export const updatePlayerHandicap = async (playerId, newHandicap) => {
//     const response = await api.post(`/players/${playerId}/update-handicap`, {
//         body: JSON.stringify({ handicap: newHandicap }),
//     });
//     return await response.json();
// };
export const fetchPlayersByLocation = async () => {
    try {
        // Retrieve locationId from AsyncStorage
        const locationId = await AsyncStorage.getItem('locationId');
        if (!locationId) {
            console.error('locationId is not set');
            return;
        }

        // Call the backend API
        const response = await api.get('/players/location', {
            params: { locationId },
        });

        console.log('Players:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching players by location:', error);
    }
};
export const updatePlayerHandicap = async (playerId, newHandicap) => {
    try {
        await api.put(`/players/${playerId}`, { handicap: newHandicap });
        Alert.alert("Success", "Player handicap updated successfully.");
    } catch (error) {
        console.error('Error updating player handicap:', error);
        Alert.alert("Error", "Failed to update player handicap.");
    }
};
export const fetchTournamentScores = async (tournamentId) => {
    try{
        const response = await api.get(`/tournaments/${tournamentId}/scores`);
        return response.data;
    } catch(error){
        console.error('Error fetching tournament scores:', error);
        throw error;
    }
}

export const fetchMaxRoundsAPI = async (tournamentId)  => {

    try {
        const response = await api.get('/games/max-rounds',{
            params: { tournamentId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching max rounds:', error);
    }
}

export const updateTournamentGames = async ({ tournamentId, divisionId, isCrossover }) => {
    try{
    const response = await api.post(`/tournaments/${tournamentId}/add-rounds`,{divisionId, isCrossover})
    if(response.ok){
        Alert.alert("Success", "Tournament games updated successfully.");
    }
    }
    catch(error){
        console.error('Error updating tournament games:', error);
    }
}

export default api;
