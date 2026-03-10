import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

interface RemoteButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const variantColors = {
  default: colors.surfaceLight,
  primary: colors.primary,
  danger: colors.danger,
  muted: colors.muted,
} as const;

const sizeConfig = {
  sm: { width: 56, height: 44, fontSize: 12, iconSize: 16 },
  md: { width: 72, height: 56, fontSize: 14, iconSize: 20 },
  lg: { width: 88, height: 64, fontSize: 16, iconSize: 24 },
} as const;

export function RemoteButton({
  label,
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  style,
}: RemoteButtonProps) {
  const config = sizeConfig[size];
  const bgColor = variantColors[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: config.width,
          height: config.height,
          backgroundColor: bgColor,
          opacity: pressed ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      {icon && (
        <Text style={[styles.icon, { fontSize: config.iconSize }]}>{icon}</Text>
      )}
      {!icon && (
        <Text style={[styles.label, { fontSize: config.fontSize }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  icon: {
    color: colors.text,
  } as TextStyle,
  label: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  } as TextStyle,
});
