// components/TournamentCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDate } from '../utils/formatDate';
import tournamentStyles from '../styles/tournamentStyles';

const TournamentCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={tournamentStyles.cardWrapper}>
      <LinearGradient
        colors={['rgba(6,12,10,0.98)', 'rgba(12,22,18,0.9)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tournamentStyles.card}
      >
        <View style={tournamentStyles.cardContent}>
          <View style={tournamentStyles.cardText}>
            <Text numberOfLines={2} style={tournamentStyles.cardTitle}>
              {item.title || item.tournamentName}
            </Text>
            <Text style={tournamentStyles.cardDate}>{formatDate(item.date)}</Text>
            <View style={tournamentStyles.miniRow}>
              <Text style={tournamentStyles.miniStat}>
                {(item.playerCount ?? '—') + ' players'}
              </Text>
              <Text style={tournamentStyles.miniStat}>📍 {item.location || 'Location'}</Text>
            </View>
          </View>
          <Image
            source={item.heroImage ? { uri: item.heroImage } : require('../../assets/icon.png')}
            style={tournamentStyles.cardImage}
            resizeMode="cover"
          />
        </View>
        <View style={tournamentStyles.neonBorder} pointerEvents="none" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TournamentCard;
