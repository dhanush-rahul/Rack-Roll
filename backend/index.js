import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import connectDB from './database';
// Import route modules
import tournamentRoutes from './routes/tournamentRoutes';
import divisionRoutes from './routes/divisionRoutes';
import gameRoutes from './routes/gameRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import locationRoutes from './routes/locationRoutes';
import playerRoutes from './routes/playerRoutes';
import scoresheetRoutes from './routes/scoresheetRoutes';
const app = express();
app.use(cors());
app.use(json());

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config(); // Load environment variables from .env file in development
}

const PORT = process.env.PORT || 5000;


connectDB();

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/scoresheets', scoresheetRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
