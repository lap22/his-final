import type { Timestamp } from 'firebase/firestore';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export interface Doctor {
  id: string;
  departmentId: string;
  name: string;
  title?: string | null;
  specialty?: string | null;
  isActive?: boolean;
  schedule?: DoctorSchedule;
}

export interface DoctorSchedule {
  defaultSlots: string[];
  unavailableDates?: string[];
  dateOverrides?: Record<string, string[]>;
}

export interface TimeSlot {
  value: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  accountUid: string;
  patientProfileId: string;
  patientName: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: Timestamp;
  timeSlot: string;
  reason: string;
  symptoms: string | null;
  status: AppointmentStatus;
  queueNumber: number | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateAppointmentInput {
  accountUid: string;
  patientProfileId: string;
  patientName: string;
  department: Department;
  doctor: Doctor;
  appointmentDate: Date;
  timeSlot: string;
  reason: string;
  symptoms: string;
}

