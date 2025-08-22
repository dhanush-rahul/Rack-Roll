import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { searchPlayers } from '../../services/api';

const AutocompleteInput = ({ onSelectPlayer, maxPlayers, selectedPlayers }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);

    const handleSearch = async (text) => {
        setQuery(text);

        if (text.length < 1) {
            setSuggestions([]);
            return;
        }

        try {
            const results = await searchPlayers(text); // Call to API
            setSuggestions(results);
        } catch (error) {
            console.error('Error fetching player suggestions:', error);
        }
    };

    return (
        <View style={styles.autocompleteContainer}>
            <Autocomplete
                data={suggestions}
                value={query}
                onChangeText={handleSearch}
                placeholder="Enter player name"
                inputContainerStyle={styles.inputContainer}
                flatListProps={{
                    keyboardShouldPersistTaps: 'handled',
                    keyExtractor: (item) => item._id,
                    renderItem: ({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                onSelectPlayer(item);
                                setQuery('');
                                setSuggestions([]);
                            }}
                        >
                            <Text style={styles.suggestion}>{item.name}</Text>
                        </TouchableOpacity>
                    ),
                }}
                renderTextInput={(props) => (
                    <TextInput
                        {...props}
                        ref={inputRef}
                        editable={selectedPlayers.length < maxPlayers}
                        style={styles.textInput}
                    />
                )}
            />
        </View>
    );
};

export default AutocompleteInput;

const styles = StyleSheet.create({
    autocompleteContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        borderWidth: 0,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    suggestion: {
        padding: 10,
        fontSize: 16,
    },
});
