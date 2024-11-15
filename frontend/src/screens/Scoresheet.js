import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Scoresheet = ({ players = [], numDivisions = 2 }) => {
  players = players.length
    ? players
    : [
        { "name": "Alex", "handicap": 1, "_id": "6736c34a3c6ba7642cf65622" },
        { "_id": "67360ecff989bab14f212cb5", "name": "Dhanush", "handicap": 2.5 },
        { "_id": "67360ee1f989bab14f212cb7", "name": "Claude", "handicap": 2.5 },
        { "_id": "67361aff3c6ba7642cf65538", "name": "Ryo", "handicap": null },
        { "name": "Joseph", "handicap": 2.5, "_id": "6736c3623c6ba7642cf65630" },
        { "name": "Elijeen", "handicap": 5, "_id": "6736c3763c6ba7642cf65647" },
        { "_id": "67361aee3c6ba7642cf6552f", "name": "Colleen", "handicap": 3 },
        { "name": "Colleen C", "handicap": 3, "_id": "6736c38a3c6ba7642cf65657" },
        { "name": "Willheim", "handicap": 2, "_id": "6736c3953c6ba7642cf6565f" },
        { "name": "Bill", "handicap": 4, "_id": "6736c39c3c6ba7642cf65663" },
        { "_id": "67361ad83c6ba7642cf65523", "name": "Johnny butts", "handicap": 3 },
        { "_id": "67361af83c6ba7642cf65535", "name": "Monica", "handicap": null },
      ];

  const [selectedRound, setSelectedRound] = useState(null);

  const handleRoundClick = (round) => {
    setSelectedRound(round);
  };

  const splitIntoDivisions = (players, numDivisions) => {
    const divisions = [];
    const divisionSize = Math.ceil(players.length / numDivisions);

    for (let i = 0; i < numDivisions; i++) {
      divisions.push(players.slice(i * divisionSize, (i + 1) * divisionSize));
    }

    return divisions;
  };

  // Generate round-robin matchups for each division
  const generateRoundRobinMatchups = (divisionPlayers) => {
    const rounds = [];
    const numPlayers = divisionPlayers.length;

    if (numPlayers % 2 !== 0) {
      divisionPlayers.push({ name: "Bye", _id: "bye" }); // Add a bye if odd number of players
    }

    for (let round = 0; round < numPlayers - 1; round++) {
      const roundMatchups = [];
      for (let i = 0; i < numPlayers / 2; i++) {
        const player1 = divisionPlayers[i];
        const player2 = divisionPlayers[numPlayers - 1 - i];
        if (player1._id !== "bye" && player2._id !== "bye") {
          roundMatchups.push([player1, player2]);
        }
      }
      rounds.push(roundMatchups);

      // Rotate players to get new matchups for the next round
      divisionPlayers.splice(1, 0, divisionPlayers.pop());
    }

    return rounds;
  };

  const divisions = splitIntoDivisions(players, numDivisions);
  const divisionRounds = divisions.map(generateRoundRobinMatchups);

  return (
    <ScrollView contentContainerStyle={styles.scoresheetContainer}>
      {/* Players Section */}
      <View style={styles.playersColumn}>
        {divisions.map((division, index) => (
          <View key={index} style={styles.divisionContainer}>
            <Text style={styles.divisionHeader}>Division {index + 1}</Text>
            {division.map((player, playerIndex) => (
              <View key={playerIndex} style={styles.playerInfo}>
                <Text>{playerIndex+1}.{player.name} ({player.handicap})</Text>
              </View>
            ))}
            {index < divisions.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Rounds Section */}
      <View style={styles.roundsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roundButtons}>
          {[1, 2, 3, 4, 5].map((round) => (
            <TouchableOpacity key={round} onPress={() => handleRoundClick(round)} style={styles.roundButton}>
              <Text style={styles.buttonText}>Round {round}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Matchups Section */}
        <View style={styles.matchupsSection}>
          {selectedRound && (
            <View style={styles.roundMatchups}>
              <Text style={styles.matchupHeaderText}>Round {selectedRound} Matchups</Text>
              {divisions.map((division, divisionIndex) => (
                <View key={divisionIndex} style={styles.divisionMatchupContainer}>
                  <Text style={styles.divisionHeader}>Division {divisionIndex + 1}</Text>
                  {divisionRounds[divisionIndex][selectedRound - 1].map(([player1, player2], index) => (
                    <View key={index} style={styles.matchup}>
                      <Text style={styles.matchupText}>
                        {player1.name} vs {player2.name}
                      </Text>
                      <View style={styles.scoreInputs}>
                        <TextInput style={styles.scoreInput} placeholder="Score" keyboardType="numeric" />
                        <TextInput style={styles.scoreInput} placeholder="Score" keyboardType="numeric" />
                      </View>
                    </View>
                  ))}
                  {divisionIndex < divisions.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Scoresheet;

const styles = StyleSheet.create({
  scoresheetContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 20,
  },
  playersColumn: {
    flex: 1,
    paddingRight: 20,
    borderRightWidth: 2,
    borderRightColor: '#ccc',
  },
  divisionContainer: {
    height: "auto",
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  divisionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerInfo: {
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roundsSection: {
    flex: 2,
    paddingLeft: 20,
  },
  roundButtons: {
    marginBottom: 20,
    flexDirection: 'row',
    maxHeight: "7%",
  },
  roundButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    maxHeight: "100%",
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  matchupsSection: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  roundMatchups: {
    marginTop: 10,
  },
  divisionMatchupContainer: {
    marginBottom: 15,
  },
  matchupHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchup: {
    marginBottom: 15,
  },
  matchupText: {
    fontSize: 16,
  },
  scoreInputs: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  scoreInput: {
    width: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
