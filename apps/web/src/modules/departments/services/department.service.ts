import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { Department, DepartmentFormValues, DepartmentStatus } from '../types/types';



const departmentsRef = collection(db, 'departments');

export function subscribeDepartments(
  callback: (departments: Department[]) => void,
) {
  const departmentsQuery = query(
    departmentsRef,
    orderBy('name', 'asc'),
  );

  return onSnapshot(departmentsQuery, snapshot => {
    const departments = snapshot.docs.map(departmentDoc => ({
      id: departmentDoc.id,
      ...departmentDoc.data(),
    })) as Department[];

    callback(departments);
  });
}

export async function createDepartment(
  values: DepartmentFormValues,
) {
  await addDoc(departmentsRef, {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    description: values.description.trim(),
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDepartment(
  id: string,
  values: DepartmentFormValues,
) {
  const departmentRef = doc(db, 'departments', id);

  await updateDoc(departmentRef, {
    name: values.name.trim(),
    code: values.code.trim().toUpperCase(),
    description: values.description.trim(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDepartmentStatus(
  id: string,
  status: DepartmentStatus,
) {
  const departmentRef = doc(db, 'departments', id);

  await updateDoc(departmentRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}