import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.2.20:5000/api', // Replace with your backend URL
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
export default api;
