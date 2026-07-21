import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PatientProfile } from '../types/profile.types';

interface ProfileCardProps {
  profile: PatientProfile;
  onPress: () => void;
  onDelete: () => void;
}

const relationshipLabels: Record<string, string> = {
  self: 'Bản thân',
  father: 'Bố',
  mother: 'Mẹ',
  husband: 'Chồng',
  wife: 'Vợ',
  child: 'Con',
  sibling: 'Anh/Chị/Em',
  other: 'Khác',
};

export function ProfileCard({
  profile,
  onPress,
  onDelete,
}: ProfileCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {profile.fullName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{profile.fullName}</Text>

        <Text style={styles.relationship}>
          {relationshipLabels[profile.relationship]}
        </Text>

        {profile.isDefault && (
          <Text style={styles.defaultLabel}>Hồ sơ mặc định</Text>
        )}
      </View>

      <Pressable
        onPress={event => {
          event.stopPropagation();
          onDelete();
        }}
        hitSlop={10}
      >
        <Text style={styles.deleteText}>Xóa</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3e8ef',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
  },
  avatarText: {
    color: '#1565c0',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  relationship: {
    color: '#607d8b',
  },
  defaultLabel: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
});