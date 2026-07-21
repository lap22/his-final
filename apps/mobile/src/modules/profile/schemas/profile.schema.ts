import { z } from 'zod';

export const patientProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự.')
    .max(100, 'Họ tên quá dài.'),

  relationship: z.enum([
    'self',
    'father',
    'mother',
    'husband',
    'wife',
    'child',
    'sibling',
    'other',
  ]),

  gender: z.enum(['male', 'female', 'other']),

  dateOfBirth: z
    .date()
    .refine(date => date <= new Date(), {
      message: 'Ngày sinh không được lớn hơn ngày hiện tại.',
    }),

  phoneNumber: z
    .string()
    .trim()
    .refine(
      value => value === '' || /^[0-9]{9,11}$/.test(value),
      'Số điện thoại phải có từ 9 đến 11 chữ số.',
    ),

  address: z.string().trim().max(255, 'Địa chỉ quá dài.'),

  bloodType: z.string().trim(),

  insuranceNumber: z.string().trim().max(30, 'Mã BHYT quá dài.'),

  isDefault: z.boolean(),
});

export type PatientProfileSchema = z.infer<
  typeof patientProfileSchema
>;