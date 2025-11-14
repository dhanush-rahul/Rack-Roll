// components/ExpandedOverlay.js
import React from 'react';
import { Modal, View, Pressable, Image, Text, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import tournamentStyles from '../styles/tournamentStyles';
import { formatDate } from '../utils/formatDate';

const ExpandedOverlay = ({ selectedTournament, backdropStyle, centeredCardStyle, closeOverlay }) => {
  if (!selectedTournament) return null;

  return (
    <Modal visible={!!selectedTournament} animationType="none" transparent statusBarTranslucent>
      <Pressable style={tournamentStyles.modalContainer} onPress={closeOverlay} />
      <Animated.View style={[tournamentStyles.backdrop, backdropStyle]} pointerEvents="none" />
      <View style={tournamentStyles.overlayCenter}>
        <Animated.View style={[tournamentStyles.expandedCard, centeredCardStyle]}>
          <Image
            source={selectedTournament.heroImage ? { uri: selectedTournament.heroImage } : require('../../assets/icon.png')}
            style={tournamentStyles.expandedImage}
            resizeMode="cover"
          />
          <View style={tournamentStyles.expandedContent}>
            <Text style={tournamentStyles.expandedTitle}>{selectedTournament.tournamentName}</Text>
            <Text style={tournamentStyles.expandedDate}>{formatDate(selectedTournament.date)}</Text>
            <View style={tournamentStyles.statsBlock}>
              <Text style={tournamentStyles.statText}>👥 {selectedTournament.playerCount || '—'} Players</Text>
              <Text style={tournamentStyles.statText}>💲 {selectedTournament.entryFee ?? 'Free'}</Text>
              <Text style={tournamentStyles.statText}>📍 {selectedTournament.location || 'Location'}</Text>
            </View>
            <TouchableOpacity style={tournamentStyles.registerButton}>
              <Text style={tournamentStyles.registerText}>REGISTER</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ExpandedOverlay;
