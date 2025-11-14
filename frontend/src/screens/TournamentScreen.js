import React, { useEffect, useState } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { withTiming, useSharedValue, interpolate, runOnJS, Easing } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAllTournaments } from '../services/api';
import CustomFloatingMenu from './CustomFloatingMenu';
import HeaderSection from '../components/HeaderSection';
import TournamentCard from '../components/TournamentCard';
import ExpandedOverlay from '../components/ExpandedOverlay';
import tournamentStyles from '../styles/tournamentStyles';

const TournamentsScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const openProgress = useSharedValue(0);
  const animationConfig = { duration: 360, easing: Easing.out(Easing.cubic) };
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const locationId = await AsyncStorage.getItem('locationId');
      const response = await getAllTournaments(locationId);
      setTournaments(response || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const closeOverlay = () => {
    openProgress.value = withTiming(0, { duration: 220 }, () => {
      runOnJS(setSelectedTournament)(null);
      runOnJS(setSelectedId)(null);
    });
  };

  const openFor = (item) => {

    if (selectedId && selectedId !== item._id) {
      openProgress.value = withTiming(0, { duration: 220 }, () => {
        runOnJS(setSelectedTournament)(item);
        runOnJS(setSelectedId)(item._id);
        openProgress.value = withTiming(1, animationConfig);
      });
    } else {
      console.log(item);
      setSelectedTournament(item);
      setSelectedId(item._id);
      openProgress.value = withTiming(1, animationConfig);
    }
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(openProgress.value, [0, 1], [0, 0.6]),
  }));

  const centeredCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(openProgress.value, [0, 1], [24, 0]) },
      { scale: interpolate(openProgress.value, [0, 1], [0.96, 1]) }
    ],
    opacity: interpolate(openProgress.value, [0, 1], [0, 1])
  }));

  return (
    <SafeAreaView edges={['top']} style={[tournamentStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#06100d" barStyle="light-content" />
      <View style={tournamentStyles.container}>
        <FlatList
          data={tournaments}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={tournamentStyles.cardWrapper}>
              <TournamentCard item={item} onPress={() => openFor(item)} />
            </View>
          )}
          contentContainerStyle={tournamentStyles.listContent}
          ListHeaderComponent={<HeaderSection />}
          showsVerticalScrollIndicator={false}
        />

        <ExpandedOverlay
          selectedTournament={selectedTournament}
          backdropStyle={backdropStyle}
          centeredCardStyle={centeredCardStyle}
          closeOverlay={closeOverlay}
        />

        <CustomFloatingMenu />
      </View>
    </SafeAreaView>
  );
};

export default TournamentsScreen;
