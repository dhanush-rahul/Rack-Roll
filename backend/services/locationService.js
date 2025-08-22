const Location = require('../models/Location').default;

async function createLocation(data) {
    const location = new Location(data);
    return await location.save();
}

async function getAllLocations() {
    return await Location.find().populate('tournaments');
}

async function getLocationByCredentials(locationName, passKey) {
    return await Location.findOne({ location: locationName, passKey }).populate('tournaments');
}

async function updateLocation(id, updateData) {
    return await Location.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteLocation(id) {
    return await Location.findByIdAndDelete(id);
}
async function getLocationByEmail(email) {
    return await Location.findOne({ email });
}


module.exports = {
    createLocation,
    getAllLocations,
    getLocationByCredentials,
    updateLocation,
    deleteLocation,
    getLocationByEmail
};
