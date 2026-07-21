import { Stack } from 'expo-router';

export default function ProfilesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Hồ sơ bệnh nhân',
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: 'Thêm hồ sơ',
        }}
      />

      <Stack.Screen
        name="[profileId]"
        options={{
          title: 'Chi tiết hồ sơ',
        }}
      />
    </Stack>
  );
}