import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Animated,
    TextInput,
} from 'react-native';
import { fetchPlayersByLocation, updatePlayerHandicap } from '../services/api'; // Ensure you have your API service set up

const calculateNewHandicap = (scores, currentHandicap) => {
    if (scores.length === 0) {
        return currentHandicap.toFixed(1); // No scores to adjust
    }

    const totalScore = scores.reduce((sum, score) => sum + (score || 0), 0);
    const averageScore = totalScore / scores.length;
    const targetAverage = 10; // Adjust based on your game's scoring system

    const difference = averageScore - targetAverage;
    const adjustmentFactor = 0.1; // Tweak as necessary

    let newHandicap = currentHandicap - (difference * adjustmentFactor);
    newHandicap = Math.max(1, Math.min(newHandicap, 7)); // Ensure handicap is between 1 and 7
    newHandicap = Math.round(newHandicap * 2) / 2;

    return newHandicap.toFixed(1);
};

const PlayerRow = ({
    item,
    index,
    highlightedRow,
    setHighlightedRow,
    changeHandicap,
}) => {
    if (!item) {
        console.warn(`Skipping undefined player at index ${index}`);
        return null;
    }

    const displayedScores = item.scores.slice(-10); // Get last 10 scores
    const [newHandicap, setNewHandicap] = useState(calculateNewHandicap(displayedScores, item.handicap || 0));

    // Compare currentHandicap and newHandicap
    const currentHandicap = parseFloat(item.handicap) || 0;
    const calculatedHandicap = parseFloat(newHandicap);

    // Determine if the handicap has been updated
    const isHandicapUpdated = currentHandicap !== calculatedHandicap;

    // Animated value for row highlight
    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animationValue, {
            toValue: highlightedRow === index ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [highlightedRow]);

    const rowBackgroundColor = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#ffe680'], // From white to light yellow
    });

    return (
        <Animated.View
            style={[
                styles.tableRow,
                { backgroundColor: rowBackgroundColor },
            ]}
        >
            <TouchableOpacity
                onPress={() => setHighlightedRow(index)}
                style={styles.rowTouchable}
            >
                <Text
                    style={[
                        styles.tableCell,
                        styles.nameColumn
                    ]}
                >
                    {item.name || 'Unknown'}
                </Text>
                <View style={styles.verticalDivider} />
                <Text
                    style={[
                        styles.tableCell,
                        styles.handicapColumn
                    ]}
                >
                    {item.handicap || '-'}
                </Text>
                <View style={styles.verticalDivider} />
                {Array.from({ length: 10 }).map((_, colIndex) => (
                    <React.Fragment key={colIndex}>
                        <Text
                            style={[
                                styles.tableCell,
                                styles.scoreColumn,
                            ]}
                        >
                            {displayedScores[colIndex] !== undefined ? displayedScores[colIndex] : '-'}
                        </Text>
                        <View style={styles.verticalDivider} />
                    </React.Fragment>
                ))}
                <TextInput
                style={[styles.tableCell, styles.newHandicapInput]}
                value={newHandicap}
                onChangeText={(value) => setNewHandicap(value)}
                keyboardType="numeric"
            />
                <View style={styles.verticalDivider} />
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.actionColumn,
                        !isHandicapUpdated && styles.buttonDisabled,
                    ]}
                    onPress={() => changeHandicap(item._id, newHandicap)}
                    disabled={!isHandicapUpdated}
                >
                    <Text style={styles.buttonText}>
                        {isHandicapUpdated ? 'Update' : 'Updated'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const PlayerScreen = () => {
    const [players, setPlayers] = useState([]);
    const [highlightedRow, setHighlightedRow] = useState(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await fetchPlayersByLocation();
            setPlayers(response);
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    const changeHandicap = async (playerId, newHandicap) => {
        try {
            await updatePlayerHandicap(playerId, newHandicap);
            fetchPlayers(); // Refresh players after updating
        } catch (error) {
            console.error("Error updating player handicap:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Scrollable Table */}
            <ScrollView horizontal>
                <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeaderRow]}>
                        <Text style={[styles.tableHeader, styles.nameColumn]}>Name</Text>
                        <View style={styles.verticalDivider} />
                        <Text style={[styles.tableHeader, styles.handicapColumn]}>
                            Handicap
                        </Text>
                        <View style={styles.verticalDivider} />
                        {Array.from({ length: 10 }).map((_, index) => (
                            <React.Fragment key={index}>
                                <Text style={[styles.tableHeader, styles.scoreColumn]}>
                                    {index + 1}
                                </Text>
                                <View style={styles.verticalDivider} />
                            </React.Fragment>
                        ))}
                        <Text style={[styles.tableHeader, styles.newHandicapColumn]}>
                            New Handicap
                        </Text>
                        <View style={styles.verticalDivider} />
                        <Text style={[styles.tableHeader, styles.actionColumn]}>
                            Action
                        </Text>
                    </View>

                    {/* Player Rows */}
                    <FlatList
                        data={players}
                        keyExtractor={(item) =>
                            item?._id ? item._id.toString() : Math.random().toString()
                        }
                        renderItem={({ item, index }) => (
                            <PlayerRow
                                item={item}
                                index={index}
                                highlightedRow={highlightedRow}
                                setHighlightedRow={setHighlightedRow}
                                changeHandicap={changeHandicap}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <Text style={{ textAlign: 'center', marginTop: 20 }}>
                                No players available
                            </Text>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default PlayerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
      
    tableContainer: {
        flex: 1,
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    rowTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    tableHeaderRow: {
        backgroundColor: '#f0f0f0',
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    tableCell: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        color: '#333',
    },
    nameColumn: {
        width: 120,
        textAlign: 'left',
        left:0,
    },
    handicapColumn: {
        width: 90,
    },
    scoreColumn: {
        width: 50,
    },
    newHandicapColumn: {
        width: 100,
    },
    actionColumn: {
        width: 100,
    },
    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        alignSelf: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc', // Gray color to indicate disabled state
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#ddd',
        height: '100%',
    },
    newHandicapInput: {
        width: 90,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        textAlign: 'center',
        paddingVertical: 4,
        paddingHorizontal: 5,
    },
});