import React, { useState, useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SigninScreen from './src/screens/Auth/SigninScreen';
import CreateAccountScreen from './src/screens/Auth/CreateAccountScreen';
import CreateTournamentScreen from './src/screens/Tournament/CreateTournamentScreen';
import PlayerScreen from './src/screens/Tournament/PlayerScreen';
import AddPlayerScreen from './src/screens/Tournament/AddPlayerScreen';
import ScoresheetScreen from './src/screens/Tournament/Scoresheet';
import HomeScreen from './src/screens/Home/HomeScreen';
import BottomNavigation from './src/screens/Home/BottomNavigation';
import TournamentsScreen from './src/screens/Tournament/TournamentScreen';
import LoadingScreen from './src/screens/Shared/LoadingScreen';

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
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Signin'}>
                {/* Auth Screens */}
                <Stack.Screen name="Signin" options={{ title: 'Sign In' }} component={SigninScreen} />
                <Stack.Screen name="CreateAccount" options={{ title: 'Create Account' }} component={CreateAccountScreen} />

                {/* Main App with Bottom Navigation */}
                <Stack.Screen name="Main" options={{ headerShown: false }} component={BottomNavigation} />

                {/* Tournament Screens
                <Stack.Screen name="Tournaments" component={TournamentsScreen} options={{ title: 'Tournaments' }} />
                <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{ title: 'Create Tournament' }} />
                <Stack.Screen name="AddPlayer" component={AddPlayerScreen} options={{ title: 'Add Players1' }} />
                <Stack.Screen name="Player" component={PlayerScreen} options={{ title: 'Player Details' }} />
                <Stack.Screen name="Scoresheet" component={ScoresheetScreen} options={{ title: 'Scoresheet' }} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
