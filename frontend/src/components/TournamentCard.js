// components/TournamentCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatDate } from '../utils/formatDate';
import tournamentStyles from '../styles/tournamentStyles';
import Colors from '../constants/Colors';

// Helper to determine tournament status
const getTournamentStatus = (item) => {
  const now = new Date();
  const tournamentDate = new Date(item.date);
  
  // If tournament is within 24 hours, it's LIVE
  const hoursDiff = (now - tournamentDate) / (1000 * 60 * 60);
  if (Math.abs(hoursDiff) < 24 && hoursDiff > -2) {
    return { label: 'LIVE', color: Colors.statusLive, icon: '●' };
  }
  
  // If tournament is in the future
  if (tournamentDate > now) {
    return { label: 'UPCOMING', color: Colors.statusUpcoming, icon: '◐' };
  }
  
  // Tournament is completed
  return { label: 'COMPLETED', color: Colors.statusCompleted, icon: '○' };
};

const TournamentCard = ({ item, onPress, index }) => {
  const status = getTournamentStatus(item);
  const isCompact = index % 2 === 1; // Every second card is more compact
  
  return (
    <TouchableOpacity 
      activeOpacity={0.85} 
      onPress={onPress} 
      style={isCompact ? tournamentStyles.cardWrapperCompact : tournamentStyles.cardWrapper}
    >
      <LinearGradient
        colors={['rgba(26,40,34,0.95)', 'rgba(26,40,34,0.98)', 'rgba(20,32,28,0.98)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={tournamentStyles.card}
      >
        {/* Left accent stripe */}
        <View style={[tournamentStyles.accentStripe, { backgroundColor: status.color }]} />
        
        <View style={[
          tournamentStyles.cardContent,
          isCompact && tournamentStyles.cardContentCompact
        ]}>
          <View style={tournamentStyles.cardText}>
            {/* Status indicator */}
            <View style={tournamentStyles.statusRow}>
              <Text style={[tournamentStyles.statusIcon, { color: status.color }]}>
                {status.icon}
              </Text>
              <Text style={[tournamentStyles.statusLabel, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
            
            {/* Location name - prominent */}
            <Text numberOfLines={1} style={tournamentStyles.locationName}>
              {item.location || 'Unknown Location'}
            </Text>
            
            {/* Tournament name */}
            <Text numberOfLines={1} style={tournamentStyles.cardTitle}>
              {item.title || item.tournamentName}
            </Text>
            
            {/* Stats */}
            <View style={tournamentStyles.statsRow}>
              <Text style={tournamentStyles.miniStat}>
                {(item.playerCount ?? 0) + ' players'}
              </Text>
              {item.divisionCount && (
                <>
                  <Text style={tournamentStyles.statDivider}>·</Text>
                  <Text style={tournamentStyles.miniStat}>
                    {item.divisionCount} divisions
                  </Text>
                </>
              )}
            </View>
            
            {/* Date */}
            <Text style={tournamentStyles.cardDate}>{formatDate(item.date)}</Text>
          </View>
          
          {/* Image - smaller, top-right corner */}
          <Image
            source={item.heroImage ? { uri: item.heroImage } : require('../../assets/icon.png')}
            style={tournamentStyles.cardImage}
            resizeMode="cover"
          />
        </View>
        
        {/* Subtle glow for active tournaments */}
        {status.label === 'LIVE' && (
          <View style={[tournamentStyles.neonGlow, { borderColor: status.color }]} pointerEvents="none" />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default TournamentCard;
