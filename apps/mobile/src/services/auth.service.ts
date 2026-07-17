import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

type AuthPayload = {email: string; password: string; confirmPassword: string; displayName: string; phoneNumber?: string};
type ResetPasswordPayload = {email: string};
export interface RegisterInput {
  displayName: string;
  phoneNumber?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}


export async function registerWithEmail({
  displayName,
  phoneNumber,
  email,
  password,
  confirmPassword,
}: AuthPayload) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = displayName.trim();
  const normalizedPhoneNumber = phoneNumber?.trim() || null;
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

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
    phoneNumber: normalizedPhoneNumber,
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
export async function resetPassword({
  email,
}: ResetPasswordPayload): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Email không được để trống.');
  }

  await sendPasswordResetEmail(auth, normalizedEmail);
}