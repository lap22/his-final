import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'patient' | 'doctor' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface UserDocument {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string | null;
  photoURL: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}