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

// Connect to MongoDB
// mongoose.connect("mongodb://dhanushrahul555:ITDOOj8wzjRRYsif@rack-roll-cluster.l2t7k.mongodb.net/?retryWrites=true&w=majority&appName=Rack-Roll-Cluster", 
//     { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 500000 })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log("MongoDB connection error:", err));

connectDB();

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/divisions', divisionRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/players', (req, res, next) => {
    console.log("Request received at /api/players route"); // This should log whenever /api/players route is hit
    next();
}, playerRoutes);
app.use('/api/scoresheets', scoresheetRoutes);

// Basic route

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
