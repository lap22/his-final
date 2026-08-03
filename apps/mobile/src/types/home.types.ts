export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export type AppointmentSession = 'morning' | 'afternoon';

export type Appointment = {
  id: string;
  clinicName: string;
  department: string;
  bookedBy: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  reason: string;
  createdAt: string;
};

export type HealthReminder = {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
};

export type PatientProfile = {
  name: string;
  avatarUrl?: string;
  facilityName: string;
  pid: string;
  notificationCount: number;
};

export type NotificationContent = {
  title: string;
  message: string;
};

export type StatusConfig = {
  label: string;
  backgroundColor: string;
  color: string;
};
