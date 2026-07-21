import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import type {
  PatientProfile,
  PatientProfileFormValues,
} from '../types/profile.types';

const getProfilesCollection = (uid: string) =>
  collection(db, 'users', uid, 'patientProfiles');

export async function getPatientProfiles(
  uid: string,
): Promise<PatientProfile[]> {
  const profilesQuery = query(
    getProfilesCollection(uid),
    orderBy('createdAt', 'asc'),
  );

  const snapshot = await getDocs(profilesQuery);

  return snapshot.docs.map(profileDoc => ({
    id: profileDoc.id,
    ...profileDoc.data(),
  })) as PatientProfile[];
}

export async function getPatientProfileById(
  uid: string,
  profileId: string,
): Promise<PatientProfile | null> {
  const profileRef = doc(
    db,
    'users',
    uid,
    'patientProfiles',
    profileId,
  );

  const snapshot = await getDoc(profileRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as PatientProfile;
}

export async function createPatientProfile(
  uid: string,
  values: PatientProfileFormValues,
): Promise<string> {
  const profileRef = await addDoc(getProfilesCollection(uid), {
    ownerUid: uid,
    fullName: values.fullName.trim(),
    relationship: values.relationship,
    gender: values.gender,
    dateOfBirth: Timestamp.fromDate(values.dateOfBirth),
    phoneNumber: values.phoneNumber.trim() || null,
    address: values.address.trim() || null,
    bloodType: values.bloodType.trim() || null,
    insuranceNumber: values.insuranceNumber.trim() || null,
    avatarUrl: null,
    isDefault: values.isDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profileRef.id;
}

export async function updatePatientProfile(
  uid: string,
  profileId: string,
  values: PatientProfileFormValues,
): Promise<void> {
  const profileRef = doc(
    db,
    'users',
    uid,
    'patientProfiles',
    profileId,
  );

  await updateDoc(profileRef, {
    fullName: values.fullName.trim(),
    relationship: values.relationship,
    gender: values.gender,
    dateOfBirth: Timestamp.fromDate(values.dateOfBirth),
    phoneNumber: values.phoneNumber.trim() || null,
    address: values.address.trim() || null,
    bloodType: values.bloodType.trim() || null,
    insuranceNumber: values.insuranceNumber.trim() || null,
    isDefault: values.isDefault,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePatientProfile(
  uid: string,
  profileId: string,
): Promise<void> {
  const profileRef = doc(
    db,
    'users',
    uid,
    'patientProfiles',
    profileId,
  );

  await deleteDoc(profileRef);
}