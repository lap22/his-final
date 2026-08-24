import {
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';
import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { auth } from '../config/firebase';
import { getUserById } from '../services/user.service';
import { AuthContext } from './auth-context';
import type { AppUser } from '../types/user';

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [firebaseUser, setFirebaseUser] =
    useState<User | null>(null);

  const [appUser, setAppUser] =
    useState<AppUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async currentUser => {
        setIsLoading(true);

        try {
          setFirebaseUser(currentUser);

          if (!currentUser) {
            setAppUser(null);
            return;
          }

          const userData = await getUserById(currentUser.uid);

          if (!userData || userData.role !== 'admin') {
            await signOut(auth);
            setAppUser(null);
            return;
          }

          setAppUser(userData);
        } finally {
          setIsLoading(false);
        }
      },
    );

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      appUser,
      isLoading,
      isAdmin: appUser?.role === 'admin',
    }),
    [firebaseUser, appUser, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

