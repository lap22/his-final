import type { Timestamp } from 'firebase/firestore';

export type ProfileRelationship =
  | 'self'
  | 'father'
  | 'mother'
  | 'husband'
  | 'wife'
  | 'child'
  | 'sibling'
  | 'other';

export type ProfileGender = 'male' | 'female' | 'other';

export interface PatientProfile {
  id: string;
  ownerUid: string;
  fullName: string;
  relationship: ProfileRelationship;
  gender: ProfileGender;
  dateOfBirth: Timestamp;
  phoneNumber: string | null;
  address: string | null;
  bloodType: string | null;
  insuranceNumber: string | null;
  avatarUrl: string | null;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PatientProfileFormValues {
  fullName: string;
  relationship: ProfileRelationship;
  gender: ProfileGender;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  bloodType: string;
  insuranceNumber: string;
  isDefault: boolean;
}