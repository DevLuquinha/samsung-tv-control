import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

import { RemoteButton } from '../components/RemoteButton';
import { DPad } from '../components/DPad';
import { sendKey } from '../services/tvApi';
import { TV_KEYS } from '../constants/keys';
import { colors, spacing, borderRadius } from '../constants/theme';

type FeedbackState = {
  message: string;
  type: 'idle' | 'loading' | 'success' | 'error';
};

export function RemoteScreen() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    message: 'Ready',
    type: 'idle',
  });

  const handlePress = useCallback(async (key: string) => {
    setFeedback({ message: `Sending...`, type: 'loading' });

    try {
      await sendKey(key);
      setFeedback({ message: `Sent!`, type: 'success' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Connection failed';
      setFeedback({ message: msg, type: 'error' });
    }
  }, []);

  const feedbackColor = {
    idle: colors.textSecondary,
    loading: colors.warning,
    success: colors.success,
    error: colors.danger,
  }[feedback.type];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Samsung Remote</Text>
          <View style={[styles.statusBadge, { borderColor: feedbackColor }]}>
            <View style={[styles.statusDot, { backgroundColor: feedbackColor }]} />
            <Text style={[styles.statusText, { color: feedbackColor }]}>
              {feedback.message}
            </Text>
          </View>
        </View>

        {/* Power & Source */}
        <View style={styles.section}>
          <View style={styles.rowSpread}>
            <RemoteButton
              label="Power"
              icon=""
              onPress={() => handlePress(TV_KEYS.POWER)}
              variant="danger"
              size="lg"
            />
            <RemoteButton
              label="Source"
              icon="📺"
              onPress={() => handlePress(TV_KEYS.SOURCE)}
              variant="muted"
              size="lg"
            />
          </View>
        </View>

        {/* Volume & Channel */}
        <View style={styles.section}>
          <View style={styles.rowSpread}>
            {/* Volume Column */}
            <View style={styles.column}>
              <Text style={styles.sectionLabel}>Volume</Text>
              <RemoteButton
                label="Vol +"
                icon="🔊"
                onPress={() => handlePress(TV_KEYS.VOLUME_UP)}
                size="lg"
              />
              <RemoteButton
                label="Vol -"
                icon="🔉"
                onPress={() => handlePress(TV_KEYS.VOLUME_DOWN)}
                size="lg"
              />
              <RemoteButton
                label="Mute"
                icon="🔇"
                onPress={() => handlePress(TV_KEYS.MUTE)}
                variant="muted"
                size="lg"
              />
            </View>

            {/* Channel Column */}
            <View style={styles.column}>
              <Text style={styles.sectionLabel}>Channel</Text>
              <RemoteButton
                label="CH +"
                icon="⬆"
                onPress={() => handlePress(TV_KEYS.CHANNEL_UP)}
                size="lg"
              />
              <RemoteButton
                label="CH -"
                icon="⬇"
                onPress={() => handlePress(TV_KEYS.CHANNEL_DOWN)}
                size="lg"
              />
            </View>
          </View>
        </View>

        {/* D-Pad Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Navigation</Text>
          <DPad
            onUp={() => handlePress(TV_KEYS.UP)}
            onDown={() => handlePress(TV_KEYS.DOWN)}
            onLeft={() => handlePress(TV_KEYS.LEFT)}
            onRight={() => handlePress(TV_KEYS.RIGHT)}
            onCenter={() => handlePress(TV_KEYS.ENTER)}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.rowCenter}>
            <RemoteButton
              label="Back"
              icon="↩"
              onPress={() => handlePress(TV_KEYS.BACK)}
              variant="muted"
            />
            <RemoteButton
              label="Home"
              icon="🏠"
              onPress={() => handlePress(TV_KEYS.HOME)}
              variant="primary"
            />
            <RemoteButton
              label="Config"
              icon="⚙"
              onPress={() => handlePress(TV_KEYS.MENU)}
              variant="muted"
            />
            <RemoteButton
              label="Info"
              icon="ℹ"
              onPress={() => handlePress(TV_KEYS.INFO)}
              variant="muted"
            />
          </View>
        </View>

        {/* Media Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Media</Text>
          <View style={styles.rowCenter}>
            <RemoteButton
              label="Rew"
              icon="⏪"
              onPress={() => handlePress(TV_KEYS.REWIND)}
              size="sm"
            />
            <RemoteButton
              label="Play"
              icon="▶"
              onPress={() => handlePress(TV_KEYS.PLAY)}
              variant="primary"
            />
            <RemoteButton
              label="Pause"
              icon="⏸"
              onPress={() => handlePress(TV_KEYS.PAUSE)}
            />
            <RemoteButton
              label="Stop"
              icon="⏹"
              onPress={() => handlePress(TV_KEYS.STOP)}
              variant="danger"
              size="sm"
            />
            <RemoteButton
              label="FF"
              icon="⏩"
              onPress={() => handlePress(TV_KEYS.FAST_FORWARD)}
              size="sm"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: borderRadius.round,
        marginRight: spacing.xs,
    },
    statusText: {
        fontSize: 12,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    rowSpread: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    column: {
        alignItems: 'center',
        gap: spacing.sm,
    },
});
