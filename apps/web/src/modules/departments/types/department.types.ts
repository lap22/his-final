import type { Timestamp } from 'firebase/firestore';

export type DepartmentStatus = 'active' | 'inactive';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  status: DepartmentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DepartmentFormValues {
  name: string;
  code: string;
  description: string;
}
