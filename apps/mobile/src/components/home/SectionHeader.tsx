import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';

type SectionHeaderProps = {
  title: string;
  badgeText?: string;
};

function SectionHeaderComponent({ title, badgeText }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {badgeText ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      ) : null}
    </View>
  );
}

export const SectionHeader = memo(SectionHeaderComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: homeColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  badge: {
    minHeight: 28,
    borderRadius: 8,
    backgroundColor: homeColors.primarySoft,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeText: {
    color: homeColors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
});
