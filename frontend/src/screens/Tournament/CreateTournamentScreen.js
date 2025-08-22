import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    Alert, 
    StyleSheet, 
    Switch, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    ScrollView, 
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createTournament, getCurrentUser } from '../../services/api';

const CreateTournamentScreen = () => {
    const [tournamentName, setTournamentName] = useState('');
    const [numPlayers, setNumPlayers] = useState('');
    const [createInstantly, setCreateInstantly] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [recurring, setRecurring] = useState(false);
    const [loading, setLoading] = useState(false); // Track loading state

    const handleSubmit = async () => {
        const currentUser = await getCurrentUser();
        if
         (!tournamentName || !numPlayers) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            // Get `createdBy` and `locationId` from AsyncStorage (adjust if needed)
            const createdBy = currentUser._id;
            const locationId = currentUser.locationId;
            console.log(createdBy, locationId);

            if (!createdBy || !locationId) {
                Alert.alert("Error", "User or location information is missing.");
                return;
            }

            // Prepare tournament data
            const tournamentData = {
                tournamentName,
                date: createInstantly ? new Date() : selectedDate,
                locationId,
                createdBy,
                maxPlayers: parseInt(numPlayers),
                isPublic: true, // Assuming default as public, change if needed
                allowShuffle: false, // Default shuffle disabled
                numDivisions: 1, // Default divisions, update if necessary
                numGamesPerMatchup: 1, // Default games per matchup
            };

            // Call API function to create tournament
            const response = await createTournament(tournamentData);

            if (response?.data) {
                Alert.alert("Success", `Tournament "${tournamentName}" created successfully!`);
            } else {
                Alert.alert("Error", "Tournament creation failed.");
            }
        } catch (error) {
            console.error("Error creating tournament:", error);
            Alert.alert("Error", "Something went wrong while creating the tournament.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.innerContainer}>
                        {/* Tournament Name */}
                        <TextInput
                            style={styles.input}
                            value={tournamentName}
                            onChangeText={setTournamentName}
                            placeholder="Enter tournament name"
                        />

                        {/* Number of Players */}
                        <TextInput
                            style={styles.input}
                            value={numPlayers}
                            onChangeText={setNumPlayers}
                            keyboardType="numeric"
                            placeholder="Enter Max Number of Players"
                        />

                        {/* Create Tournament Instantly Switch */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Create Tournament Instantly?</Text>
                            <Switch
                                value={createInstantly}
                                onValueChange={setCreateInstantly}
                            />
                        </View>

                        {/* Date Picker (Disabled if "Create Instantly" is Yes) */}
                        <TouchableOpacity 
                            style={[styles.datePickerContainer, createInstantly && styles.disabled]}
                            onPress={() => !createInstantly && setShowDatePicker(true)}
                            disabled={createInstantly}
                        >
                            <Text style={styles.label}>
                                {createInstantly ? "Date: Today (Auto)" : `Date: ${selectedDate.toDateString()}`}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    if (date) setSelectedDate(date);
                                }}
                            />
                        )}

                        {/* Recurring Tournament Checkbox */}
                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Recurring Tournament?</Text>
                            <Switch
                                value={recurring}
                                onValueChange={setRecurring}
                            />
                        </View>

                        {/* Submit Button */}
                        <View style={styles.footer}>
                            <Button 
                                title={loading ? "Creating..." : "Create Tournament"} 
                                onPress={handleSubmit} 
                                color="#83c985" 
                                disabled={loading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CreateTournamentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eafaf5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        height: 40,
        backgroundColor: '#fff',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
    },
    datePickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    disabled: {
        backgroundColor: '#ddd',
    },
    footer: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%',
    },
});
