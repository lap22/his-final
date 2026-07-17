import { Redirect } from 'expo-router';

export default function RegisterRedirect() {
  return (
    <Redirect
      href={{
        pathname: '/auth-modal',
        params: {
          mode: 'register',
        },
      }}
    />
  );
}
