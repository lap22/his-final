import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createAppointment,
  formatDateKey,
  getAppointmentById,
  getAppointmentsByAccount,
  getAvailableTimeSlots,
  getDepartments,
  getDoctorsByDepartment,
  SLOT_ALREADY_BOOKED,
} from '../services/appointment.service';
import type {
  CreateAppointmentInput,
  Doctor,
} from '../types/appointment.types';

export const appointmentKeys = {
  all: ['appointments'] as const,
  reference: ['appointmentReference'] as const,

  list: (accountUid: string) =>
    [...appointmentKeys.all, 'list', accountUid] as const,

  detail: (accountUid: string, appointmentId: string) =>
    [...appointmentKeys.all, 'detail', accountUid, appointmentId] as const,

  departments: () =>
    [...appointmentKeys.reference, 'departments'] as const,

  doctors: (departmentId: string) =>
    [...appointmentKeys.reference, 'doctors', departmentId] as const,

  slots: (doctorId: string, dateKey: string) =>
    [...appointmentKeys.reference, 'slots', doctorId, dateKey] as const,
};

export function useDepartments() {
  return useQuery({
    queryKey: appointmentKeys.departments(),
    queryFn: getDepartments,
  });
}

export function useDoctors(departmentId?: string) {
  return useQuery({
    queryKey: appointmentKeys.doctors(departmentId ?? ''),
    queryFn: () => getDoctorsByDepartment(departmentId!),
    enabled: Boolean(departmentId),
  });
}

export function useTimeSlots(
  doctor?: Doctor,
  appointmentDate?: Date,
) {
  const dateKey = appointmentDate
    ? formatDateKey(appointmentDate)
    : '';

  return useQuery({
    queryKey: appointmentKeys.slots(doctor?.id ?? '', dateKey),
    queryFn: () => getAvailableTimeSlots(doctor!, appointmentDate!),
    enabled: Boolean(doctor && appointmentDate),
  });
}

export function useAppointments(accountUid?: string) {
  return useQuery({
    queryKey: appointmentKeys.list(accountUid ?? ''),
    queryFn: () => getAppointmentsByAccount(accountUid!),
    enabled: Boolean(accountUid),
  });
}

export function useAppointment(
  accountUid?: string,
  appointmentId?: string,
) {
  return useQuery({
    queryKey: appointmentKeys.detail(
      accountUid ?? '',
      appointmentId ?? '',
    ),
    queryFn: () => getAppointmentById(accountUid!, appointmentId!),
    enabled: Boolean(accountUid && appointmentId),
  });
}

export function useCreateAppointment(accountUid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => {
      if (!accountUid) {
        throw new Error('Bạn cần đăng nhập để đặt lịch khám.');
      }

      return createAppointment(input);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: appointmentKeys.list(accountUid ?? ''),
      });
      await queryClient.invalidateQueries({
        queryKey: appointmentKeys.reference,
      });
    },
  });
}

export function getAppointmentErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === SLOT_ALREADY_BOOKED) {
    return 'Khung giờ này vừa được đặt. Vui lòng chọn giờ khám khác.';
  }

  return error instanceof Error
    ? error.message
    : 'Đã xảy ra lỗi không xác định.';
}
