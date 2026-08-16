import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';

import { db } from '@/config/firebase';
import type {
  Appointment,
  CreateAppointmentInput,
  Department,
  Doctor,
  TimeSlot,
} from '../types/appointment.types';

export const SLOT_ALREADY_BOOKED = 'SLOT_ALREADY_BOOKED';

const fallbackDepartments: Department[] = [
  {
    id: 'general',
    name: 'Khoa Khám bệnh',
    description: 'Tư vấn ban đầu và khám tổng quát.',
    isActive: true,
  },
  {
    id: 'cardiology',
    name: 'Tim mạch',
    description: 'Khám và theo dõi bệnh lý tim mạch.',
    isActive: true,
  },
  {
    id: 'pediatrics',
    name: 'Nhi khoa',
    description: 'Chăm sóc sức khỏe trẻ em.',
    isActive: true,
  },
];

const fallbackDoctors: Doctor[] = [
  {
    id: 'general-dr-lan',
    departmentId: 'general',
    name: 'BS. Nguyễn Mai Lan',
    title: 'Bác sĩ khám tổng quát',
    specialty: 'Nội tổng quát',
    isActive: true,
  },
  {
    id: 'cardiology-dr-minh',
    departmentId: 'cardiology',
    name: 'ThS.BS. Trần Quang Minh',
    title: 'Bác sĩ chuyên khoa Tim mạch',
    specialty: 'Tim mạch',
    isActive: true,
  },
  {
    id: 'pediatrics-dr-huong',
    departmentId: 'pediatrics',
    name: 'BS.CKII. Lê Thu Hương',
    title: 'Bác sĩ Nhi khoa',
    specialty: 'Nhi tổng quát',
    isActive: true,
  },
];

const defaultSlots = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
];

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function toSlotDocumentId(doctorId: string, dateKey: string, timeSlot: string) {
  return `${doctorId}_${dateKey}_${timeSlot.replace(':', '-')}`;
}

function normalizeAppointment(
  appointmentId: string,
  data: Record<string, unknown>,
): Appointment {
  return {
    id: appointmentId,
    accountUid: String(data.accountUid),
    patientProfileId: String(data.patientProfileId),
    patientName: String(data.patientName),
    departmentId: String(data.departmentId),
    departmentName: String(data.departmentName),
    doctorId: String(data.doctorId),
    doctorName: String(data.doctorName),
    appointmentDate: data.appointmentDate as Timestamp,
    timeSlot: String(data.timeSlot),
    reason: String(data.reason),
    symptoms:
      typeof data.symptoms === 'string' ? data.symptoms : null,
    status: data.status as Appointment['status'],
    queueNumber:
      typeof data.queueNumber === 'number'
        ? data.queueNumber
        : null,
    createdAt: data.createdAt as Timestamp,
    updatedAt: data.updatedAt as Timestamp,
  };
}

export async function getDepartments(): Promise<Department[]> {
  const departmentsQuery = query(
    collection(db, 'departments'),
    orderBy('name', 'asc'),
  );

  const snapshot = await getDocs(departmentsQuery);
  const departments = snapshot.docs
    .map(departmentDoc => ({
      id: departmentDoc.id,
      ...departmentDoc.data(),
    })) as Department[];

  return departments.length > 0 ? departments : fallbackDepartments;
}

export async function getDoctorsByDepartment(
  departmentId: string,
): Promise<Doctor[]> {
  const doctorsQuery = query(
    collection(db, 'doctors'),
    where('departmentId', '==', departmentId),
  );

  const snapshot = await getDocs(doctorsQuery);
  const doctors = snapshot.docs
    .map(doctorDoc => ({
      id: doctorDoc.id,
      ...doctorDoc.data(),
    })) as Doctor[];

  return doctors.length > 0
    ? doctors.sort((first, second) =>
        first.name.localeCompare(second.name, 'vi'),
      )
    : fallbackDoctors.filter(doctor => doctor.departmentId === departmentId);
}

export async function getAvailableTimeSlots(
  doctor: Doctor,
  appointmentDate: Date,
): Promise<TimeSlot[]> {
  const dateKey = formatDateKey(appointmentDate);
  const schedule = doctor.schedule;

  if (schedule?.unavailableDates?.includes(dateKey)) {
    return [];
  }

  const scheduleSlots =
    schedule?.dateOverrides?.[dateKey] ??
    schedule?.defaultSlots ??
    defaultSlots;

  const bookedSnapshots = await Promise.all(
    scheduleSlots.map(slot =>
      getDoc(
        doc(
          db,
          'appointmentSlots',
          toSlotDocumentId(doctor.id, dateKey, slot),
        ),
      ),
    ),
  );

  const bookedSlots = new Set(
    bookedSnapshots
      .filter(slotSnapshot => slotSnapshot.exists())
      .map(slotSnapshot => String(slotSnapshot.data().timeSlot)),
  );

  return scheduleSlots.map(slot => ({
    value: slot,
    isAvailable: !bookedSlots.has(slot),
    isBooked: bookedSlots.has(slot),
  }));
}

export async function getAppointmentsByAccount(
  accountUid: string,
): Promise<Appointment[]> {
  const appointmentsQuery = query(
    collection(db, 'appointments'),
    where('accountUid', '==', accountUid),
  );

  const snapshot = await getDocs(appointmentsQuery);

  return snapshot.docs
    .map(appointmentDoc =>
      normalizeAppointment(appointmentDoc.id, appointmentDoc.data()),
    )
    .sort(
      (first, second) =>
        second.appointmentDate.toMillis() -
        first.appointmentDate.toMillis(),
    );
}

export async function getAppointmentById(
  accountUid: string,
  appointmentId: string,
): Promise<Appointment | null> {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  const snapshot = await getDoc(appointmentRef);

  if (!snapshot.exists()) {
    return null;
  }

  const appointment = normalizeAppointment(
    snapshot.id,
    snapshot.data(),
  );

  return appointment.accountUid === accountUid ? appointment : null;
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<string> {
  const dateKey = formatDateKey(input.appointmentDate);
  const slotId = toSlotDocumentId(
    input.doctor.id,
    dateKey,
    input.timeSlot,
  );
  const slotRef = doc(db, 'appointmentSlots', slotId);
  const appointmentRef = doc(collection(db, 'appointments'));

  await runTransaction(db, async transaction => {
    const slotSnapshot = await transaction.get(slotRef);

    if (slotSnapshot.exists()) {
      throw new Error(SLOT_ALREADY_BOOKED);
    }

    transaction.set(slotRef, {
      appointmentId: appointmentRef.id,
      doctorId: input.doctor.id,
      dateKey,
      timeSlot: input.timeSlot,
      status: 'booked',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.set(appointmentRef, {
      accountUid: input.accountUid,
      patientProfileId: input.patientProfileId,
      patientName: input.patientName,
      departmentId: input.department.id,
      departmentName: input.department.name,
      doctorId: input.doctor.id,
      doctorName: input.doctor.name,
      appointmentDate: Timestamp.fromDate(input.appointmentDate),
      timeSlot: input.timeSlot,
      reason: input.reason.trim(),
      symptoms: input.symptoms.trim() || null,
      status: 'pending',
      queueNumber: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  return appointmentRef.id;
}

export async function ensureFallbackReferenceData() {
  await Promise.all([
    ...fallbackDepartments.map(department =>
      setDoc(doc(db, 'departments', department.id), department, {
        merge: true,
      }),
    ),
    ...fallbackDoctors.map(doctor =>
      setDoc(doc(db, 'doctors', doctor.id), doctor, {
        merge: true,
      }),
    ),
  ]);
}
