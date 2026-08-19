import { homeColors } from '@/constants/colors';
import type { AppointmentStatus } from '../types/appointment.types';

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đã check-in',
  in_progress: 'Đang khám',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const statusStyles: Record<
  AppointmentStatus,
  { backgroundColor: string; color: string }
> = {
  pending: {
    backgroundColor: homeColors.warningSoft,
    color: homeColors.warning,
  },
  confirmed: {
    backgroundColor: homeColors.primarySoft,
    color: homeColors.primaryDark,
  },
  checked_in: {
    backgroundColor: '#EDE9FE',
    color: '#6D28D9',
  },
  in_progress: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  completed: {
    backgroundColor: homeColors.successSoft,
    color: homeColors.success,
  },
  cancelled: {
    backgroundColor: homeColors.dangerSoft,
    color: homeColors.danger,
  },
};

