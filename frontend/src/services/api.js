import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.2.20:5000/api', // Replace with your backend URL
});

export const createAccount = async (data) => {
    return await api.post('/locations/', data);
};
export const signIn = async (data) => {
    return await api.post('/locations/signin', data); // Endpoint for sign-in
};


export const getTournaments = async () => {
    const response = await api.get('/tournaments');
    return response.data;
};

export const getPlayers = async () => {
    const response = await api.get('/players');
    return response.data;
};

export default api;
