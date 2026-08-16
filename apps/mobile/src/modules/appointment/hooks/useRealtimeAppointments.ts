import { useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/config/firebase';
import { appointmentKeys } from './useAppointments';
import type { Appointment } from '../types/appointment.types';

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
    appointmentDate: data.appointmentDate as Appointment['appointmentDate'],
    timeSlot: String(data.timeSlot),
    reason: String(data.reason),
    symptoms:
      typeof data.symptoms === 'string' ? data.symptoms : null,
    status: data.status as Appointment['status'],
    queueNumber:
      typeof data.queueNumber === 'number'
        ? data.queueNumber
        : null,
    createdAt: data.createdAt as Appointment['createdAt'],
    updatedAt: data.updatedAt as Appointment['updatedAt'],
  };
}

export function useRealtimeAppointments(accountUid?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accountUid) {
      return undefined;
    }

    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('accountUid', '==', accountUid),
    );

    const unsubscribe = onSnapshot(appointmentsQuery, snapshot => {
      const appointments = snapshot.docs
        .map(appointmentDoc =>
          normalizeAppointment(
            appointmentDoc.id,
            appointmentDoc.data(),
          ),
        )
        .sort(
          (first, second) =>
            second.appointmentDate.toMillis() -
            first.appointmentDate.toMillis(),
        );

      queryClient.setQueryData(
        appointmentKeys.list(accountUid),
        appointments,
      );

      appointments.forEach(appointment => {
        queryClient.setQueryData(
          appointmentKeys.detail(accountUid, appointment.id),
          appointment,
        );
      });
    });

    return unsubscribe;
  }, [accountUid, queryClient]);
}

export function useRealtimeAppointment(
  accountUid?: string,
  appointmentId?: string,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!accountUid || !appointmentId) {
      return undefined;
    }

    const appointmentRef = doc(db, 'appointments', appointmentId);

    const unsubscribe = onSnapshot(appointmentRef, snapshot => {
      if (!snapshot.exists()) {
        queryClient.setQueryData(
          appointmentKeys.detail(accountUid, appointmentId),
          null,
        );
        return;
      }

      const appointment = normalizeAppointment(
        snapshot.id,
        snapshot.data(),
      );

      if (appointment.accountUid !== accountUid) {
        return;
      }

      queryClient.setQueryData(
        appointmentKeys.detail(accountUid, appointmentId),
        appointment,
      );
    });

    return unsubscribe;
  }, [accountUid, appointmentId, queryClient]);
}
