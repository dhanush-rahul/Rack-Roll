import React, { useState, useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SigninScreen from './src/screens/SigninScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import TournamentScreen from './src/screens/TournamentScreen';
import CreateTournamentScreen from './src/screens/CreateTournamentScreen';
import Scoresheet from './src/screens/Scoresheet';
import AddPlayerScreen from './src/screens/AddPlayerScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import LoadingScreen from './src/screens/LodingScreen';

const Stack = createNativeStackNavigator();


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially null for loading state

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                setIsLoggedIn(!!token); // Set to true if token exists, otherwise false
                console.log('Auth token:', token);
            } catch (error) {
                console.error('Error checking auth token:', error);
            }
        };

        checkAuthToken();
    }, []);

    if (isLoggedIn === null) {
        // Show a loading screen while AsyncStorage is being checked
        return <LoadingScreen />;
    }
    const appTheme = {
        ...DefaultTheme,
        
        colors: {
            ...DefaultTheme.colors,
            background: '#e8f7fa', // Black background
            card: '#d5f0f6', // Dark color for the navigation bar
            text: '#000000', // White text
            border: '#ff8e8a', // Subtle border color
            notification: '#000000', // Notification highlight color (optional)
        },
    };

    return (
        <NavigationContainer theme={appTheme}>
            <Stack.Navigator initialRouteName={isLoggedIn ? 'Tournament' : 'HomeScreen'}>
                {/* Auth Screens */}
                <Stack.Screen name="Signin" options={{title: 'Sign In'}} component={SigninScreen} />
                <Stack.Screen name="CreateAccount" options={{title: 'Create Account'}} component={CreateAccountScreen} />

                {/* Main Screens */}
                <Stack.Screen name="HomeScreen" options={{title: 'Rack-N-Roll'}} component={HomeScreen} />
                <Stack.Screen name="Tournament" options={{title: 'Tournaments'}} component={TournamentScreen} />
                <Stack.Screen name="CreateTournament" options={{title: 'Create a Tournament'}} component={CreateTournamentScreen} />
                <Stack.Screen name="Player" options={{title: 'Manage Players'}} component={PlayerScreen} />
                <Stack.Screen name="AddPlayers" options={{title: 'Add Players'}} component={AddPlayerScreen} />
                <Stack.Screen name="Scoresheet" options={{title: 'Scoresheet'}} component={Scoresheet} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
