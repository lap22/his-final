import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { homeColors } from '@/constants/colors';

type PrimaryButtonProps = {
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'filled' | 'outline';
};

function PrimaryButtonComponent({
  label,
  iconName,
  onPress,
  variant = 'filled',
}: PrimaryButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isOutline ? styles.outlineButton : styles.filledButton,
        pressed && styles.pressed,
      ]}
    >
      {iconName ? (
        <Ionicons
          name={iconName}
          size={18}
          color={isOutline ? homeColors.primary : homeColors.surface}
        />
      ) : null}
      <Text style={[styles.label, isOutline ? styles.outlineLabel : styles.filledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

export const PrimaryButton = memo(PrimaryButtonComponent);

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  filledButton: {
    backgroundColor: homeColors.primary,
  },
  outlineButton: {
    backgroundColor: homeColors.surface,
    borderWidth: 1,
    borderColor: homeColors.primary,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  filledLabel: {
    color: homeColors.surface,
  },
  outlineLabel: {
    color: homeColors.primary,
  },
  pressed: {
    opacity: 0.82,
  },
});
