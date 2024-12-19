import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { fetchMaxRoundsAPI, getLeaderboardData, getTournamentDetails, updateGameWithId, updateTournamentGames } from '../services/api';

const ScoresheetScreen = ({ route }) => {
  const { tournamentId } = route.params;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState(1);
  const [leaderboards, setLeaderboards] = useState({});
  const [maxRounds, setMaxRounds] = useState(0);
  const [scores, setScores] = useState({});
  const [tickDisabled, setTickDisabled] = useState({});
  const [hasCrossover, setHasCrossover] = useState(false);

  useEffect(() => {
    fetchTournamentDetails();
    fetchMaxRounds();
  }, []);

  const fetchMaxRounds = async () => {
    try {
      const response = await fetchMaxRoundsAPI(tournamentId);
      if (response && response.maxRound !== undefined) {
        setMaxRounds(response.maxRound);
      } else {
        setMaxRounds(0);
      }
    } catch (error) {
      setMaxRounds(0);
    }
  };

  useEffect(() => {
    if (selectedRound === 'Final') {
      fetchLeaderboards();
    }
  }, [selectedRound]);

  const fetchTournamentDetails = async () => {
    try {
      const data = await getTournamentDetails(tournamentId);
      setTournament(data);
      setLoading(false);
      console.log(data?.games);
      const initialScores = {};
      const initialTickDisabled = {};
      data.games.forEach((game) => {
        for (let gameIndex = 1; gameIndex <= data.numGamesPerMatchup; gameIndex++) {
          const key = `${game._id}_${gameIndex}`;
          const scoreEntry = game.scores
            ? game.scores.find((se) => se.gameIndex === gameIndex)
            : null;
          if (scoreEntry) {
            initialScores[key] = {
              player1: scoreEntry.player1 != null ? String(scoreEntry.player1) : '',
              player2: scoreEntry.player2 != null ? String(scoreEntry.player2) : '',
            };
            initialTickDisabled[key] = true;
          } else {
            initialScores[key] = {
              player1: '',
              player2: '',
            };
            initialTickDisabled[key] = false;
          }
        }
      });
      setScores(initialScores);
      setTickDisabled(initialTickDisabled);
      setHasCrossover(data.games.some(g => g.division === null));
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchLeaderboards = async () => {
    try {
      const divisionLeaderboards = {};
      for (const division of tournament.divisions) {
        const data = await getLeaderboardData(tournamentId, division._id);
        divisionLeaderboards[division._id] = data;
      }
      setLeaderboards(divisionLeaderboards);
    } catch (error) {
    }
  };

  const handleScoreSubmit = async (gameId, gameIndex, player1Score, player2Score) => {
    await updateGameWithId(gameId, gameIndex, player1Score, player2Score);
    Keyboard.dismiss();
  };

  const getPlayerById = (playerEntry) => {
    const playerId = playerEntry._id || playerEntry;
    return tournament.players.find((player) => player._id === playerId);
  };

  const getPlayerByIdFromString = (playerId) => {
    return tournament.players.find((player) => player._id === playerId);
  };

  const getGroupedGamesByRound = (divisionId, round) => {
    const gamesForRound = tournament.games.filter(
      (game) => game.division === divisionId && game.round === round && !game.isCrossover
    );
    const groupedGames = gamesForRound.reduce((acc, game) => {
      const pairKey = [game.player1, game.player2].sort().join('-');
      if (!acc[pairKey]) {
        acc[pairKey] = [];
      }
      acc[pairKey].push(game);
      return acc;
    }, {});
    return Object.values(groupedGames);
  };

  const getCrossoverGamesByRound = (round) => {
    const gamesForRound = tournament.games.filter(
      (game) => game.division === null && game.round === round
    );
    const groupedGames = gamesForRound.reduce((acc, game) => {
      const pairKey = [game.player1, game.player2].sort().join('-');
      if (!acc[pairKey]) {
        acc[pairKey] = [];
      }
      acc[pairKey].push(game);
      return acc;
    }, {});
    return Object.values(groupedGames);
  };

  const handleAddRound = async (divisionId = null) => {
    const isCrossover = divisionId === null;

    const confirmationMessage = isCrossover
      ? 'Are you sure you want to add one more round for the tournament?'
      : 'Are you sure you want to add one more round for this division?';

    Alert.alert('Confirmation', confirmationMessage, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await updateTournamentGames({
              tournamentId,
              divisionId,
              isCrossover,
            });
            fetchTournamentDetails(); // Refresh tournament details
            Alert.alert('Success', 'An extra round has been added!');
          } catch (error) {
            console.error('Error adding round:', error);
            Alert.alert('Error', 'Failed to add an extra round.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text>No tournament data found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{tournament.tournamentName}</Text>
          <Text style={styles.subHeader}>
            Date: {new Date(tournament.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.scoresheetContainer}>
          <View style={styles.divisionsContainer}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              {tournament.divisions.map((division, index) => (
                <View key={division._id} style={styles.divisionItem}>
                  <Text style={styles.divisionHeader}>Division {index + 1}</Text>
                  {division.players.map((playerEntry, playerIndex) => {
                    const player = getPlayerById(playerEntry);
                    return (
                      <Text
                        key={`player-${player?._id || playerEntry}`}
                        style={styles.playerText}
                      >
                        {playerIndex + 1}. {player?.name || 'Unknown'} ({player?.handicap || '-'})
                      </Text>
                    );
                  })}
                  {!hasCrossover && (
                    <TouchableOpacity
                      onPress={() => handleAddRound(division._id)}
                    >
                      <Text style={styles.addRoundText}>
                        Add an extra round for this division?
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.roundsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.roundSelector}
              keyboardShouldPersistTaps="always"
            >
              {[...Array(maxRounds).keys()].map((i) => i + 1).concat('Final').map((round) => (
                <TouchableOpacity
                  key={`round-${round}`}
                  style={[
                    styles.roundButton,
                    selectedRound === round && styles.roundButtonSelected,
                  ]}
                  onPress={() => setSelectedRound(round)}
                >
                  <Text style={[styles.roundButtonText, selectedRound === round && styles.roundButtonSelectedText]}>
                    {round === 'Final' ? 'Final' : `Round ${round}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {selectedRound !== 'Final' ? (
              <ScrollView
                style={styles.matchupsContainer}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {tournament.divisions.map((division, divisionIndex) => (
                  <View key={`division-${division._id}`} style={styles.divisionMatchup}>
                    <Text style={styles.divisionMatchupHeader}>Division {divisionIndex + 1}</Text>
                    {getGroupedGamesByRound(division._id, selectedRound).map((group) => {
                      const firstGame = group[0];
                      const player1 = getPlayerById(firstGame?.player1);
                      const player2 = getPlayerById(firstGame?.player2);
                      return (
                        <View key={`group-${firstGame._id}`} style={styles.matchup}>
                          <Text style={styles.matchupText}>
                            {player1?.name || 'Unknown'} vs {player2?.name || 'Unknown'}
                          </Text>
                          {group.map((game, index) => {
                            const gameIndex = index + 1;
                            const key = `${game._id}_${gameIndex}`;
                            return (
                              <View key={key} style={styles.scoreRow}>
                                <TextInput
                                  style={styles.scoreInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={scores?.[key]?.player1 || ''}
                                  onChangeText={(value) => {
                                    setScores((prevScores) => ({
                                      ...prevScores,
                                      [key]: {
                                        ...prevScores[key],
                                        player1: value,
                                      },
                                    }));
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: false,
                                    }));
                                  }}
                                />
                                <TextInput
                                  style={styles.scoreInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={scores?.[key]?.player2 || ''}
                                  onChangeText={(value) => {
                                    setScores((prevScores) => ({
                                      ...prevScores,
                                      [key]: {
                                        ...prevScores[key],
                                        player2: value,
                                      },
                                    }));
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: false,
                                    }));
                                  }}
                                />
                                <TouchableOpacity
                                  style={[
                                    styles.tickButton,
                                    tickDisabled[key] && styles.tickButtonDisabled,
                                  ]}
                                  onPress={() => {
                                    handleScoreSubmit(
                                      game._id,
                                      gameIndex,
                                      scores[key]?.player1 || '',
                                      scores[key]?.player2 || ''
                                    );
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: true,
                                    }));
                                  }}
                                  disabled={tickDisabled[key]}
                                >
                                  <Text style={styles.tickText}>✔</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                ))}
                {hasCrossover && (
                  <View style={styles.divisionMatchup}>
                    <Text style={styles.divisionMatchupHeader}>Crossover</Text>
                    {getCrossoverGamesByRound(selectedRound).map((group) => {
                      const firstGame = group[0];
                      const player1 = getPlayerById(firstGame?.player1);
                      const player2 = getPlayerById(firstGame?.player2);
                      return (
                        <View key={`cgroup-${firstGame._id}`} style={styles.matchup}>
                          <Text style={styles.matchupText}>
                            {player1?.name || 'Unknown'} vs {player2?.name || 'Unknown'}
                          </Text>
                          {group.map((game, index) => {
                            const gameIndex = index + 1;
                            const key = `${game._id}_${gameIndex}`;
                            return (
                              <View key={key} style={styles.scoreRow}>
                                <TextInput
                                  style={styles.scoreInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={scores?.[key]?.player1 || ''}
                                  onChangeText={(value) => {
                                    setScores((prevScores) => ({
                                      ...prevScores,
                                      [key]: {
                                        ...prevScores[key],
                                        player1: value,
                                      },
                                    }));
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: false,
                                    }));
                                  }}
                                />
                                <TextInput
                                  style={styles.scoreInput}
                                  placeholder="0"
                                  keyboardType="numeric"
                                  value={scores?.[key]?.player2 || ''}
                                  onChangeText={(value) => {
                                    setScores((prevScores) => ({
                                      ...prevScores,
                                      [key]: {
                                        ...prevScores[key],
                                        player2: value,
                                      },
                                    }));
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: false,
                                    }));
                                  }}
                                />
                                <TouchableOpacity
                                  style={[
                                    styles.tickButton,
                                    tickDisabled[key] && styles.tickButtonDisabled,
                                  ]}
                                  onPress={() => {
                                    handleScoreSubmit(
                                      game._id,
                                      gameIndex,
                                      scores[key]?.player1 || '',
                                      scores[key]?.player2 || ''
                                    );
                                    setTickDisabled((prevState) => ({
                                      ...prevState,
                                      [key]: true,
                                    }));
                                  }}
                                  disabled={tickDisabled[key]}
                                >
                                  <Text style={styles.tickText}>✔</Text>
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>
                      );
                    })}
                  </View>
                )}
              </ScrollView>
            ) : (
              <ScrollView
                style={styles.matchupsContainer}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {tournament.divisions.map((division, divisionIndex) => {
                  const leaderboard = leaderboards[division._id];
                  if (!leaderboard) {
                    return (
                      <Text key={`division-${division._id}`}>Loading leaderboard...</Text>
                    );
                  }
                  const rankingsArray = Object.entries(leaderboard.rankings || {})
                    .map(([playerId, score]) => ({ playerId, score }))
                    .sort((a, b) => b.score - a.score);
                  if (rankingsArray.length === 0) {
                    return (
                      <View key={`division-${division._id}`} style={styles.divisionLeaderboard}>
                        <Text style={styles.divisionLeaderboardHeader}>
                          Division {divisionIndex + 1}
                        </Text>
                        <Text>No scores submitted yet.</Text>
                      </View>
                    );
                  }
                  return (
                    <View key={`division-${division._id}`} style={styles.divisionLeaderboard}>
                      <Text style={styles.divisionLeaderboardHeader}>
                        Division {divisionIndex + 1}
                      </Text>
                      {rankingsArray.map(({ playerId, score }, index) => {
                        const player = getPlayerByIdFromString(playerId);
                        return (
                          <View key={`leaderboard-${playerId}`} style={styles.leaderboardRow}>
                            <Text style={styles.leaderboardPosition}>{index + 1}</Text>
                            <Text style={styles.leaderboardPlayer}>
                              {player?.name || 'Unknown'}
                            </Text>
                            <Text style={styles.leaderboardScore}>{score}</Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ScoresheetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f7fa',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 2
  },
  scoresheetContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  divisionsContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingRight: 10,
  },
  divisionItem: {
    marginBottom: 20,
  },
  divisionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 5,
  },
  addRoundText: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  roundsContainer: {
    flex: 2,
    paddingLeft: 10,
  },
  roundSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    maxHeight: 40,
  },
  roundButton: {
    padding: 10,
    backgroundColor: '#abe2ed',
    color: '#000',
    borderRadius: 5,
    marginRight: 10,
  },
  roundButtonSelected: {
    backgroundColor: '#1c6d7d',
  },
  roundButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  roundButtonSelectedText: {
    color: '#fff',
  },
  matchupsContainer: {
    flex: 1,
  },
  divisionMatchup: {
    marginBottom: 20,
  },
  divisionMatchupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchup: {
    marginBottom: 15,
  },
  matchupText: {
    fontSize: 16,
    marginBottom: 5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  scoreInput: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  tickButton: {
    marginLeft: 10,
    backgroundColor: '#83c985',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickButtonDisabled: {
    backgroundColor: 'grey',
  },
  tickText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divisionLeaderboard: {
    marginBottom: 20,
  },
  divisionLeaderboardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  leaderboardPosition: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboardPlayer: {
    flex: 1,
    fontSize: 16,
  },
  leaderboardScore: {
    width: 50,
    fontSize: 16,
    textAlign: 'right',
  },
});
