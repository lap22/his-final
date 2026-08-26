import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Department } from '../types/department.types';
import { departmentSchema, type DepartmentSchema } from '../department.schema';
import { createDepartment, updateDepartment } from '../services/department.service';



interface DepartmentFormDialogProps {
  open: boolean;
  department?: Department | null;
  onClose: () => void;
}

export default function DepartmentFormDialog({
  open,
  department,
  onClose,
}: DepartmentFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        code: department.code,
        description: department.description,
      });
    } else {
      reset({
        name: '',
        code: '',
        description: '',
      });
    }
  }, [department, reset]);

  const onSubmit = async (
    values: DepartmentSchema,
  ) => {
    if (department) {
      await updateDepartment(
        department.id,
        values,
      );
    } else {
      await createDepartment(values);
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {department ? 'Cập nhật khoa' : 'Thêm khoa'}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên khoa"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <TextField
                {...field}
                label="Mã khoa"
                onChange={event =>
                  field.onChange(
                    event.target.value.toUpperCase(),
                  )
                }
                error={Boolean(errors.code)}
                helperText={errors.code?.message}
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextField
                {...field}
                label="Mô tả"
                multiline
                minRows={3}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
        >
          Hủy
        </Button>

        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {department ? 'Cập nhật' : 'Thêm khoa'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
