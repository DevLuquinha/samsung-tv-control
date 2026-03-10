import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { API_BASE_URL } from '@env';

// Type definition for the Python API response
interface ApiResponse {
    status: string;
    key?: string;
    message?: string;
}

const App = () => {
    const [status, setStatus] = useState<string>('Ready to send commands');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const pressKey = async (key: string): Promise<void> => {
        setIsLoading(true);
        setStatus(`Sending ${key}...`);

        try {
            const response = await fetch(`${API_BASE_URL}/send/${key}`);
            const data: ApiResponse = await response.json();

            if (response.ok && data.status === 'success') {
                setStatus(`Success: ${key} sent!`);
            } else {
                setStatus(`API Error: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            setStatus('Network Error. Is the Python API running?');
            console.error("Error details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>API URL: {API_BASE_URL}</Text>
            <Text style={styles.statusText}>Status: {status}</Text>

            {/* Visual feedback during the HTTP request */}
            <View style={styles.loaderContainer}>
                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : <View style={{ height: 36 }} />}
            </View>

            <View style={styles.buttonGrid}>
                <Button title="Volume +" onPress={() => pressKey('KEY_VOLUP')} color="#2196F3" />
                <Button title="Volume -" onPress={() => pressKey('KEY_VOLDOWN')} color="#F44336" />
                <Button title="Mute" onPress={() => pressKey('KEY_MUTE')} color="#9E9E9E" />
                <Button title="Home" onPress={() => pressKey('KEY_HOME')} color="#4CAF50" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    statusText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    loaderContainer: {
        height: 50,
        justifyContent: 'center',
    },
    buttonGrid: {
        width: '100%',
        gap: 15,
        marginTop: 20,
    }
});

export default App;