// components/HeaderSection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tournamentStyles from '../styles/tournamentStyles';

const HeaderSection = () => (
  <View style={tournamentStyles.headerContainer}>
    <View style={tournamentStyles.headerTopRow}>
      <Text style={tournamentStyles.mainTitle}>Tournaments</Text>
      <TouchableOpacity style={tournamentStyles.menuIcon}>
        <View style={tournamentStyles.menuLine} />
        <View style={tournamentStyles.menuLine} />
        <View style={tournamentStyles.menuLine} />
      </TouchableOpacity>
    </View>
    <View style={tournamentStyles.headerBottomRow}>
      <Text style={tournamentStyles.subTitle}>Tournaments Near You</Text>
    </View>
  </View>
);

export default HeaderSection;
