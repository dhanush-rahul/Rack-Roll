// components/HeaderSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tournamentStyles from '../styles/tournamentStyles';

const HeaderSection = ({ onMenuPress, menuAnimation }) => {
  const hamburgerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: menuAnimation?.value || 0 }],
    opacity: 1 - ((menuAnimation?.value || 0) / 300),
  }));

  return (
    <View style={tournamentStyles.headerContainer}>
      <View style={tournamentStyles.headerTopRow}>
        <Text style={tournamentStyles.mainTitle}>Tournaments</Text>
        <Animated.View style={hamburgerStyle}>
          <TouchableOpacity 
            style={tournamentStyles.menuIcon} 
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <View style={tournamentStyles.menuLine} />
            <View style={tournamentStyles.menuLine} />
            <View style={tournamentStyles.menuLine} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={tournamentStyles.headerBottomRow}>
        <Text style={tournamentStyles.subTitle}>Tournaments Near You</Text>
      </View>
    </View>
  );
};

export default HeaderSection;
