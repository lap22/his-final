import { z } from 'zod';

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export const appointmentSchema = z.object({
  patientProfileId: z.string().min(1, 'Vui lòng chọn hồ sơ bệnh nhân.'),
  departmentId: z.string().min(1, 'Vui lòng chọn chuyên khoa.'),
  doctorId: z.string().min(1, 'Vui lòng chọn bác sĩ.'),
  appointmentDate: z.date().refine(
    date => startOfDay(date) >= startOfDay(new Date()),
    'Ngày khám không được trước hôm nay.',
  ),
  timeSlot: z.string().min(1, 'Vui lòng chọn giờ khám.'),
  reason: z.string().trim().min(1, 'Vui lòng nhập lý do khám.'),
  symptoms: z.string().trim(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

