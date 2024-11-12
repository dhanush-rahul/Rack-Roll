const connectDB = require('./database');
const Tournament = require('./models/Tournament');
const Player = require('./models/Player');
const Division = require('./models/Division');
const Game = require('./models/Game');
const Scoresheet = require('./models/Scoresheet');
const Leaderboard = require('./models/Leaderboard');
const Location = require('./models/Location');

const initializeDatabase = async () => {
    try {
        await connectDB();

        // Example: Insert a placeholder tournament (this will also create the collection)
        const tournament = new Tournament({
            name: 'Sample Tournament',
            location: 'Sample Location',
            passKey: 'samplePassKey',
            date: new Date()
        });
        await tournament.save();

        // Add similar entries for other collections if desired

        console.log('Database initialized with sample data');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initializeDatabase();
