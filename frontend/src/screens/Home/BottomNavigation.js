import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import ProfileScreen from '../Profile/ProfileScreen';
import LocationScreen from '../Location/LocationScreen';
import BookATableScreen from '../TableBooking/BookATableScreen';
import FeedScreen from '../Feed/FeedScreen';
import TournamentStackScreen from '../Tournament/TournamentStack';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
    const navState = useNavigationState(state => {
        if (!state) return 'Start';
        const route = state.routes.find(route => route.name === 'Start');
        const nestedScreen = route?.state?.routes?.[route.state.index]?.name;
        return nestedScreen === 'AddPlayer' ? 'Add Players' : 'Start';
    });

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Feed') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Start') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Book') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'Locations') {
                        iconName = focused ? 'location' : 'location-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#83c985',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 14 },
                tabBarStyle: { backgroundColor: '#f8f9fa', paddingBottom: 5, height: 60 },
                keyboardHidesTabBar: false
            })}
        >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen
                name="Start"
                component={TournamentStackScreen}
                options={{ title: navState, headerShown: false }} // Dynamic Tab Label
            />
            <Tab.Screen name="Book" component={BookATableScreen} />
            <Tab.Screen name="Locations" component={LocationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomNavigation;
