import type { Appointment, HealthReminder, PatientProfile } from '@/types/home.types';

export const patientProfile: PatientProfile = {
  name: 'Nguyen Minh Anh',
  facilityName: 'Bệnh viện Đa khoa HIS',
  pid: 'PID-240812',
  notificationCount: 3,
};

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-240812-01',
    clinicName: 'Phòng khám Nội tổng quát',
    department: 'Khoa Nội',
    bookedBy: 'Nguyen Minh Anh',
    time: '08:30',
    date: '2026-08-05',
    status: 'confirmed',
    reason: 'Tái khám sau điều trị',
    createdAt: '2026-08-01T08:00:00.000Z',
  },
  {
    id: 'apt-240812-02',
    clinicName: 'Phòng khám Tim mạch',
    department: 'Khoa Tim mạch',
    bookedBy: 'Nguyen Minh Anh',
    time: '14:00',
    date: '2026-08-09',
    status: 'pending',
    reason: 'Kiểm tra huyết áp định kỳ',
    createdAt: '2026-08-02T09:30:00.000Z',
  },
  {
    id: 'apt-240812-03',
    clinicName: 'Phòng khám Da liễu',
    department: 'Khoa Da liễu',
    bookedBy: 'Nguyen Minh Anh',
    time: '09:30',
    date: '2026-07-27',
    status: 'cancelled',
    reason: 'Dị ứng da',
    createdAt: '2026-07-20T02:30:00.000Z',
  },
];

export const initialHealthReminders: HealthReminder[] = [
  {
    id: 'reminder-medicine-01',
    title: 'Uống thuốc huyết áp',
    description: 'Amlodipine 5mg sau bữa sáng',
    time: '07:30',
    completed: false,
  },
  {
    id: 'reminder-activity-01',
    title: 'Đi bộ nhẹ',
    description: '20 phút quanh nhà hoặc công viên',
    time: '17:30',
    completed: false,
  },
  {
    id: 'reminder-water-01',
    title: 'Uống đủ nước',
    description: 'Hoàn thành mục tiêu 1.5 lít hôm nay',
    time: '20:00',
    completed: true,
  },
];
