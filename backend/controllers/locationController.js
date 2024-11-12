const locationService = require('../services/locationService');

async function createLocation(req, res) {
    try {
        const location = await locationService.createLocation(req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllLocations(req, res) {
    try {
        const locations = await locationService.getAllLocations();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getLocationByCredentials(req, res) {
    try {
        const location = await locationService.getLocationByCredentials(req.body.location, req.body.passKey);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateLocation(req, res) {
    try {
        const location = await locationService.updateLocation(req.params.id, req.body);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteLocation(req, res) {
    try {
        const location = await locationService.deleteLocation(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.status(200).json({ message: "Location deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createLocation,
    getAllLocations,
    getLocationByCredentials,
    updateLocation,
    deleteLocation
};
