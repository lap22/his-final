import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ProfileDetailScreen() {
  const { profileId } = useLocalSearchParams<{
    profileId: string;
  }>();

  return (
    <View>
      <Text>Profile ID: {profileId}</Text>
    </View>
  );
}