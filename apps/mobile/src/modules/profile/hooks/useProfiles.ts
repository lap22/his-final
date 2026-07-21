import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createPatientProfile,
  deletePatientProfile,
  getPatientProfileById,
  getPatientProfiles,
  updatePatientProfile,
} from '../services/profile.service';
import type { PatientProfileFormValues } from '../types/profile.types';

export const profileKeys = {
  all: ['patientProfiles'] as const,

  list: (uid: string) =>
    [...profileKeys.all, 'list', uid] as const,

  detail: (uid: string, profileId: string) =>
    [...profileKeys.all, 'detail', uid, profileId] as const,
};

export function usePatientProfiles(uid?: string) {
  return useQuery({
    queryKey: profileKeys.list(uid ?? ''),
    queryFn: () => getPatientProfiles(uid!),
    enabled: Boolean(uid),
    retry: false, // Disable automatic retries
  });
}

export function usePatientProfile(
  uid?: string,
  profileId?: string,
) {
  return useQuery({
    queryKey: profileKeys.detail(uid ?? '', profileId ?? ''),
    queryFn: () => getPatientProfileById(uid!, profileId!),
    enabled: Boolean(uid && profileId),
  });
}

export function useCreatePatientProfile(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: PatientProfileFormValues) => {
      if (!uid) {
        throw new Error('Người dùng chưa đăng nhập.');
      }

      return createPatientProfile(uid, values);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: profileKeys.list(uid ?? ''),
      });
    },
  });
}

interface UpdateProfilePayload {
  profileId: string;
  values: PatientProfileFormValues;
}

export function useUpdatePatientProfile(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      values,
    }: UpdateProfilePayload) => {
      if (!uid) {
        throw new Error('Người dùng chưa đăng nhập.');
      }

      return updatePatientProfile(uid, profileId, values);
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileKeys.list(uid ?? ''),
        }),

        queryClient.invalidateQueries({
          queryKey: profileKeys.detail(
            uid ?? '',
            variables.profileId,
          ),
        }),
      ]);
    },
  });
}

export function useDeletePatientProfile(uid?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) => {
      if (!uid) {
        throw new Error('Người dùng chưa đăng nhập.');
      }

      return deletePatientProfile(uid, profileId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: profileKeys.list(uid ?? ''),
      });
    },
  });
}