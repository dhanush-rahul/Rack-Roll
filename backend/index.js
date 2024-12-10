require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
// Import route modules
const tournamentRoutes = require('./routes/tournamentRoutes');
const divisionRoutes = require('./routes/divisionRoutes');
const gameRoutes = require('./routes/gameRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const locationRoutes = require('./routes/locationRoutes');
const playerRoutes = require('./routes/playerRoutes');
const scoresheetRoutes = require('./routes/scoresheetRoutes');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;


connectDB();

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/scoresheets', scoresheetRoutes);

// Basic route

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
