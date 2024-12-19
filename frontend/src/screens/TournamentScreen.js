import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deleteTournamentApi, getTournamentsByLocation } from '../services/api';
import CustomFloatingMenu from './CustomFloatingMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TournamentsScreen = () => {
    const [tournaments, setTournaments] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const locationId = await AsyncStorage.getItem('locationId');
            const response = await getTournamentsByLocation(locationId);
            // console.log('Fetched tournaments:', response);
            setTournaments(response);
        } catch (error) {
            // Alert.alert('Error', 'Error fetching tournaments.');
            console.error('Error fetching tournaments:', error);
        }
    };

    const deleteTournament = async (id) => {
        try {
            await deleteTournamentApi(id);
            Alert.alert('Success', 'Tournament deleted successfully!');
            fetchTournaments();
        } catch (error) {
            console.error("Error deleting tournament:", error);
            Alert.alert('Error', 'Failed to delete tournament.');
        }
    };

    const renderTournamentCard = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Scoresheet', { tournamentId: item._id })}
            style={styles.card}
            activeOpacity={0.8}
        >
            <Text style={styles.dateText}>{new Date(item.date).getDate()}</Text>
            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>{item.tournamentName}</Text>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteTournament(item._id)}
                        activeOpacity={0.7}
                    >
                        <Image source={require('./../../assets/delete_icon.png')} style={{ width: 26, height: 26 }} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.gamesText}>Total Games: {item.totalGames}</Text>
                <View style={styles.divisionTag}>
                    <Text style={styles.divisionText}>Divisions: {item.divisionCount}</Text>
                    <Text style={styles.playerText}>Players: {item.playerCount}</Text>
                </View>
                <Text style={styles.dateDetail}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={tournaments}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderTournamentCard}
                contentContainerStyle={styles.listContent}
            />
            <CustomFloatingMenu />
        </View>
    );
};

export default TournamentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#f5f5f5',
        paddingTop: 1,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 40,

    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eaf6fa', // Card background
        borderRadius: 12, // Rounded corners
        padding: 20, // Inner padding
        margin: 5, // Margin around the card
        shadowColor: '#000', // Shadow color (natural black for depth)
        shadowOffset: {
            width: 0, // No horizontal shadow
            height: 10, // Creates a bottom elevation effect
        },
        shadowOpacity: 0.2, // Lighter shadow for natural look
        shadowRadius: 15, // Softer shadow edges
        elevation: 8, // Higher elevation for Android
        // Remove the borderColor and borderWidth for a cleaner look
    },
    dateText: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 15,
        lineHeight: 50,
    },
    cardContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensures title on left and delete button on right
        marginBottom: 5,
        width: '97%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 0,
    },
    deleteButton: {
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        // marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    divisionTag: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    divisionText: {
        fontSize: 14,
        color: '#83c985',
        fontWeight: '500',
    },
    gamesText: {
        fontSize: 14,
        color: '#83c985',
        fontWeight: '500',
        marginBottom: 5,
    },
    playerText: {
        fontSize: 14,
        color: '#83c985',
        fontWeight: '500',
    },
    dateDetail: {
        fontSize: 12,
        color: '#999',
    },
});
