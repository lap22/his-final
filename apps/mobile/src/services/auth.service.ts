import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '@/config/firebase';

export interface RegisterInput {
  displayName: string;
  phoneNumber?: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function registerPatient({
  displayName,
  phoneNumber,
  email,
  password,
}: RegisterInput) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = displayName.trim();

  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password,
  );

  await updateProfile(credential.user, {
    displayName: normalizedName,
  });

  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email: normalizedEmail,
    displayName: normalizedName,
    phoneNumber: phoneNumber?.trim() || null,
    photoURL: null,
    role: 'patient',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
}

export async function loginWithEmail({
  email,
  password,
}: LoginInput) {
  const normalizedEmail = email.trim().toLowerCase();

  const credential = await signInWithEmailAndPassword(
    auth,
    normalizedEmail,
    password,
  );

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}