import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';

const PlayerModal = ({
    visible,
    onClose,
    newPlayerName,
    setNewPlayerName,
    newPlayerHandicap,
    setNewPlayerHandicap,
    onSubmit,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Player</Text>
                    <TextInput
                        style={styles.modalInput}
                        value={newPlayerName}
                        onChangeText={setNewPlayerName}
                        placeholder="Enter Player Name"
                    />
                    <TextInput
                        style={styles.modalInput}
                        value={newPlayerHandicap}
                        onChangeText={setNewPlayerHandicap}
                        placeholder="Enter Player Handicap"
                        keyboardType="numeric"
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Add" onPress={onSubmit} />
                        <Button title="Cancel" color="red" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default PlayerModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
