import { Redirect } from 'expo-router';

export default function LoginRedirect() {
  return (
    <Redirect
      href={{
        pathname: '/auth-modal',
        params: {
          mode: 'login',
        },
      }}
    />
  );
}
