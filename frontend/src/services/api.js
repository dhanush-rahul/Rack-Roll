import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your backend URL
});

export const getTournaments = async () => {
    const response = await api.get('/tournaments');
    return response.data;
};

export const getPlayers = async () => {
    const response = await api.get('/players');
    return response.data;
};

export default api;
