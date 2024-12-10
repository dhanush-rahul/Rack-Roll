import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomFloatingMenu = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [animation] = useState(new Animated.Value(0)); // Animation value
    const navigation = useNavigation();

    const toggleMenu = () => {
        if (menuVisible) {
            // Close the menu
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start(() => setMenuVisible(false));
        } else {
            // Open the menu
            setMenuVisible(true);
            Animated.timing(animation, {
                toValue: 1,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        }
    };

    const menuStyle = {
        transform: [
            {
                scale: animation,
            },
        ],
        opacity: animation,
    };

    return (
        <View style={styles.container}>
            {/* Floating Menu Options */}
            {menuVisible && (
                <Animated.View style={[styles.menu, menuStyle]}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            navigation.navigate('Player'); // Navigate to Add/Edit Players
                        }}
                    >
                        <Text style={styles.menuText}>Edit Players</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            navigation.navigate('CreateTournament'); // Navigate to Create Tournament
                        }}
                    >
                        <Text style={styles.menuText}>Create Tournament</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            toggleMenu();
                            AsyncStorage.removeItem('authToken')
                            console.log('Logged out'); // Handle logout logic
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Signin' }], // Replace 'Home' with the name of your home screen
                                })
                            );                        }}
                    >
                        <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Floating Button */}
            <TouchableOpacity style={styles.floatingButton} onPress={toggleMenu}>
                <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomFloatingMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative', // Ensures correct positioning of children
    },
    floatingButton: {
        position: 'absolute',
        right: 20, // Keeps it aligned to the right
        width: 60,
        height: 60,
        backgroundColor: '#83c985',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        transform: [{ translateY: -45 }], // Moves the button up by 100 pixels
    },
    floatingButtonText: {
        fontSize: 30,
        color: '#FFF',
        fontWeight: 'bold',
    },
    menu: {
        position: 'absolute',
        right: 20, // Aligns with the button
        bottom: 110, // Places the menu above the button
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        zIndex: 10, // Ensures the menu appears above other elements
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});

