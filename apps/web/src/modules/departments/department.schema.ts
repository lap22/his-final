import { z } from 'zod';

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên khoa phải có ít nhất 2 ký tự.')
    .max(100, 'Tên khoa quá dài.'),

  code: z
    .string()
    .trim()
    .min(2, 'Mã khoa không hợp lệ.')
    .max(30, 'Mã khoa quá dài.')
    .regex(
      /^[A-Z0-9_-]+$/,
      'Mã khoa chỉ gồm chữ in hoa, số, _ hoặc -.',
    ),

  description: z
    .string()
    .trim()
    .max(500, 'Mô tả tối đa 500 ký tự.'),
});

export type DepartmentSchema = z.infer<
  typeof departmentSchema
>;