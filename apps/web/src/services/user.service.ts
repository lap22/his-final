import { doc, getDoc } from 'firebase/firestore';

import { db } from '../config/firebase';
import type { AppUser } from '../types/user';

export async function getUserById(
  uid: string,
): Promise<AppUser | null> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as AppUser;
}