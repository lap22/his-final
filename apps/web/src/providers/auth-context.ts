import { createContext } from 'react';
import type { User } from 'firebase/auth';

import type { AppUser } from '../types/user';

export interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

