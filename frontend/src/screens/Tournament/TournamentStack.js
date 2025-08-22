import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Alert, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CreateTournamentScreen from './CreateTournamentScreen';
import AddPlayerScreen from './AddPlayerScreen';

const TournamentStack = createNativeStackNavigator();

// ✅ Ensure BackButton Renders Properly
const BackButton = () => {
    const navigation = useNavigation();
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        console.warn("BackButton Mounted ✅");
    }, []);

    const handleBackPress = () => {
        if (isPressed) return; // Prevent multiple presses
        setIsPressed(true);

        console.warn("Back button pressed! Navigating back... ✅");

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate("CreateTournament");
        }

        setTimeout(() => setIsPressed(false), 500); // Reset after 500ms
    };

    return (
        <TouchableOpacity onPress={handleBackPress} style={{ marginLeft: 0 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
    );
};



const TournamentStackScreen = () => {
    return (
        <TournamentStack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#83c985' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
            }}
        >
            {/* Create Tournament Screen */}
            <TournamentStack.Screen
                name="CreateTournament"
                component={CreateTournamentScreen}
                options={{ title: "Create Tournament" }}
            />

            {/* Add Player Screen with Back Button */}
            <TournamentStack.Screen
    name="AddPlayer"
    component={AddPlayerScreen}
    options={{
        title: "Add Players",
        headerLeft: () => <BackButton />, // ✅ Ensure BackButton is set correctly
    }}
/>

        </TournamentStack.Navigator>
    );
};

export default TournamentStackScreen;
