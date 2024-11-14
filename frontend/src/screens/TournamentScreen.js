import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation } from '@react-navigation/native';
import { getTournaments } from '../services/api';

const TournamentsScreen = () => {
    const [tournaments, setTournaments] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await getTournaments();
            console.log("Fetched tournaments:", response); // Log data structure
            setTournaments(response); // Set directly to ensure no nested issues
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    };

    const renderTournamentCard = ({ item }) => (
        // <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        //     <Text>{item.name}</Text>
        //     <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
        //     <Text>Divisions: {item.divisionCount}</Text>
        //     <Text>Players: {item.playerCount}</Text>
        // </View>

<View style={styles.card}>
<Text style={styles.dateText}>{new Date(item.date).getDate()}</Text>
<View style={styles.cardContent}>
    <Text style={styles.title}>{item.name}</Text>
    <View style={styles.divisionTag}>
        <Text style={styles.divisionText}>Divisions: {item.divisionCount}</Text>
        <Text style={styles.playerText}>Players: {item.playerCount}</Text>
    </View>
    <Text style={styles.dateDetail}>{new Date(item.date).toLocaleDateString()}</Text>
</View>
</View>
    );

    console.log("Tournaments data for FlatList:", tournaments); // Confirm data before rendering

    return (
        <View style={styles.container}>
            <FlatList
                data={tournaments}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderTournamentCard}
                contentContainerStyle={styles.listContent}
            />
            <FloatingAction
                color="#4CAF50"
                position="right"
                onPressMain={() => navigation.navigate('CreateTournament')}
                showBackground={false}
            />
        </View>
    );
};

export default TournamentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 20,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 80, // Adjust to keep space for the floating button
    },
});
