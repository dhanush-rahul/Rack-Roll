import { createLocation as _createLocation, getLocationByEmail, getAllLocations as _getAllLocations, getLocationByCredentials as _getLocationByCredentials, updateLocation as _updateLocation, deleteLocation as _deleteLocation } from '../services/locationService.js';
import Player from '../models/Player.js';

import jwtPkg from 'jsonwebtoken';
const { sign } = jwtPkg;

async function createLocation(req, res) {
    try {
        const location = await _createLocation(req.body);
        res.status(201).json(location);
    } catch (error) {
        if(error.code === 11000){
            res.status(400).json({ message: 'Location already exists. Please use a different location.' });  
        }
        else{
            res.status(400).json({ message: error.message });
        }
    }
}

async function signInLocation(req, res) {

    try {
        const { email, passKey } = req.body;
        const location = await getLocationByEmail(email);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        // Assuming passwords are hashed, use bcrypt to compare
        const isPasswordValid = passKey.toString() === location.passKey
        //  bcrypt.compare(password, location.passKey);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = sign({ id: location._id, email: location.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expiry (optional)
        });

        res.status(200).json({ message: "Sign-in successful", token, locationId: location._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllLocations(req, res) {
    try {
        const locations = await _getAllLocations();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getLocationByCredentials(req, res) {
    try {
        const location = await _getLocationByCredentials(req.body.location, req.body.passKey);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getPlayersByLocation(req, res) {
    try {
        const { locationId } = req.query;

        // Validate locationId
        if (!locationId) {
            return res.status(400).json({ error: 'locationId is required' });
        }

        // Fetch players based on location
    const players = await Player.find({ location: locationId })
            .select('name handicap') // Select only necessary fields
            .lean();

        if (!players.length) {
            return res.status(404).json({ error: 'No players found for this location' });
        }

        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players by location:', error);
        res.status(500).json({ error: 'Failed to fetch players by location' });
    }
}

async function updateLocation(req, res) {
    try {
        const location = await _updateLocation(req.params.id, req.body);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteLocation(req, res) {
    try {
        const location = await _deleteLocation(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default {
    createLocation,
    getAllLocations,
    getLocationByCredentials,
    updateLocation,
    deleteLocation,
    signInLocation,
    getPlayersByLocation
};
