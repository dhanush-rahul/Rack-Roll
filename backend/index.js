import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const { json } = bodyParser;
import connectDB from './database.js';
import dotenv from 'dotenv';
// Import route modules
import tournamentRoutes from './routes/tournamentRoutes.js';
import divisionRoutes from './routes/divisionRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import scoresheetRoutes from './routes/scoresheetRoutes.js';
const app = express();
app.use(cors());
app.use(json());

if (process.env.NODE_ENV !== 'production') {
    dotenv.config(); // Load environment variables from .env file in development
}

const PORT = process.env.PORT || 5000;

import os from 'os';

function listLocalIPs() {
    const nets = os.networkInterfaces();
    const results = [];
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                results.push(net.address);
            }
        }
    }
    return results;
}

connectDB();

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/scoresheets', scoresheetRoutes);


// Start server
// Healthcheck
app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));

// Start server and bind to all interfaces so LAN devices can reach it
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Accessible on these IPv4 addresses:');
    listLocalIPs().forEach(ip => console.log(`  http://${ip}:${PORT}`));
    console.log(`  http://localhost:${PORT}`);
});
