import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getTournaments } from '../services/api';

const TournamentScreen = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const data = await getTournaments();
                setTournaments(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTournaments();
    }, []);

    return (
        <View>
            <Text>Tournament List</Text>
            <FlatList
                data={tournaments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </View>
    );
};

export default TournamentScreen;
