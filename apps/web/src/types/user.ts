export type UserRole = 'patient' | 'doctor' | 'admin';

export type UserStatus = 'active' | 'blocked';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string | null;
  photoURL: string | null;
  role: UserRole;
  status: UserStatus;
}