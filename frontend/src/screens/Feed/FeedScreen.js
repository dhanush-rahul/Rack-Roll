import React, { useState, useEffect } from "react";
import { 
    View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllLocations, getTournamentsByLocation, getCurrentUser } from "../../services/api";

const FeedScreen = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserAndLocations = async () => {
            try {
                // Fetch current user
                const user = await getCurrentUser();
                if (!user) throw new Error("User not found");

                setCurrentUser(user);
                const userLocation = user.locationId; // Fetch location from user object

                // Fetch all locations
                const locationData = await getAllLocations();
                setLocations(locationData);

                // Set default location as user's location
                setSelectedLocation(userLocation || locationData[0]?._id);

                // Fetch tournaments for the user's default location
                fetchTournaments(userLocation || locationData[0]?._id);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserAndLocations();
    }, []);

    const fetchTournaments = async (locationId) => {
        setLoading(true);
        try {
            const tournamentsData = await getTournamentsByLocation(locationId);
            setTournaments(tournamentsData);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
        setLoading(false);
    };

    const categorizeTournaments = () => {
        const today = new Date().toISOString().split("T")[0];

        const todayEvents = tournaments.filter(event => event.date.split("T")[0] === today);
        const upcomingEvents = tournaments.filter(event => new Date(event.date) > new Date(today));
        const previousEvents = tournaments.filter(event => new Date(event.date) < new Date(today));

        return { todayEvents, upcomingEvents, previousEvents };
    };

    const { todayEvents, upcomingEvents, previousEvents } = categorizeTournaments();

    return (
        <View style={styles.container}>
            {/* Location Picker */}
            <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => {
                    setSelectedLocation(itemValue);
                    fetchTournaments(itemValue);
                }}
                style={styles.picker}
            >
                {locations.map((loc) => (
                    <Picker.Item key={loc._id} label={loc.name} value={loc._id} />
                ))}
            </Picker>

            {loading ? (
                <ActivityIndicator size="large" color="#83c985" style={styles.loader} />
            ) : (
                <View style={styles.scrollContainer}>
                    {/* Today's Events */}
                    <Text style={styles.sectionTitle}>Today's Events</Text>
                    <View style={styles.divider} />
                    <FlatList
                        data={todayEvents}
                        horizontal
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <EventCard event={item} />}
                        contentContainerStyle={styles.flatList}
                    />

                    {/* Upcoming Events */}
                    <Text style={styles.sectionTitle}>Upcoming Events</Text>
                    <View style={styles.divider} />
                    <FlatList
                        data={upcomingEvents}
                        horizontal
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <EventCard event={item} />}
                        contentContainerStyle={styles.flatList}
                    />

                    {/* Previous Events */}
                    <Text style={styles.sectionTitle}>Previous Events</Text>
                    <View style={styles.divider} />
                    <FlatList
                        data={previousEvents}
                        horizontal
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <EventCard event={item} />}
                        contentContainerStyle={styles.flatList}
                    />
                </View>
            )}
        </View>
    );
};

// Event Card Component
const EventCard = ({ event }) => (
    <TouchableOpacity style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.tournamentName}</Text>
        <Text style={styles.eventDate}>{new Date(event.date).toDateString()}</Text>
    </TouchableOpacity>
);

export default FeedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8f7fa",
        padding: 10,
    },
    picker: {
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#333",
    },
    divider: {
        height: 2,
        backgroundColor: "#83c985",
        marginBottom: 10,
    },
    flatList: {
        paddingLeft: 10,
    },
    eventCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        width: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    eventDate: {
        fontSize: 14,
        color: "#555",
        marginTop: 5,
    },
    loader: {
        marginTop: 20,
    },
});
