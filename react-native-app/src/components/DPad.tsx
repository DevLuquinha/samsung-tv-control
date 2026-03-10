import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

interface DPadProps {
    onUp: () => void;
    onDown: () => void;
    onLeft: () => void;
    onRight: () => void;
    onCenter: () => void;
}

export function DPad({ onUp, onDown, onLeft, onRight, onCenter }: DPadProps) {
    return (
        <View style={styles.container}>
            {/* Up */}
            <View style={styles.row}>
                <DPadButton icon="▲" onPress={onUp} />
            </View>

            {/* Left - Center - Right */}
            <View style={styles.row}>
                <DPadButton icon="◀" onPress={onLeft} />
                <Pressable
                    onPress={onCenter}
                    style={({ pressed }) => [
                        styles.centerButton,
                        { opacity: pressed ? 0.6 : 1, transform: [{ scale: pressed ? 0.92 : 1 }] },
                    ]}
                >
                    <Text style={styles.centerText}>OK</Text>
                </Pressable>
                <DPadButton icon="▶" onPress={onRight} />
            </View>

            {/* Down */}
            <View style={styles.row}>
                <DPadButton icon="▼" onPress={onDown} />
            </View>
        </View>
    );
}

function DPadButton({ icon, onPress }: { icon: string; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.dirButton,
                { opacity: pressed ? 0.6 : 1, transform: [{ scale: pressed ? 0.9 : 1 }] },
            ]}
        >
            <Text style={styles.dirIcon}>{icon}</Text>
        </Pressable>
    );
}

const DPAD_SIZE = 56;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    dirButton: {
        width: DPAD_SIZE,
        height: DPAD_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dirIcon: {
        fontSize: 18,
        color: colors.text,
    },
    centerButton: {
        width: 68,
        height: 68,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
        borderWidth: 2,
        borderColor: colors.border,
    },
    centerText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
});
