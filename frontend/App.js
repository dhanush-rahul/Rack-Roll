import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SigninScreen from './src/screens/SigninScreen';
import HomePage from './src/screens/HomeScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';
import TournamentScreen from './src/screens/TournamentScreen';
import LoadingScreen from './src/screens/LodingScreen';
import CreateTournamentScreen from './src/screens/CreateTournamentScreen';


const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initially null for loading state

    useEffect(() => {
        const checkAuthToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setIsLoggedIn(!!token); // Set to true if token exists, otherwise false
            console.log('Auth token: ' + token);
        };

        checkAuthToken();
    }, []);

    if (isLoggedIn === null) {
        // Show a loading screen while we check AsyncStorage
        // return <LoadingScreen />;-
    }
  return (
  <NavigationContainer>
  <Stack.Navigator initialRouteName={isLoggedIn ? "Tournament" : "Signin"}>
      
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Tournament" component={TournamentScreen} />
      <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
      
  </Stack.Navigator>
</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
