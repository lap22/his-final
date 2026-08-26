import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DepartmentFormDialog from '../components/DepartmentFormDialog';
import { useDepartments } from '../hooks/useDepartments';
import type { Department } from '../types/department.types';
import { updateDepartmentStatus } from '../services/department.service';



export default function DepartmentsPage() {
  const {
    departments,
    isLoading,
    error,
  } = useDepartments();

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const handleCreate = () => {
    setSelectedDepartment(null);
    setDialogOpen(true);
  };

  const handleEdit = (
    department: Department,
  ) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleStatusChange = async (
    department: Department,
  ) => {
    const nextStatus =
      department.status === 'active'
        ? 'inactive'
        : 'active';

    await updateDepartmentStatus(
      department.id,
      nextStatus,
    );
  };

  if (isLoading) {
    return (
      <Box
       sx={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Không thể tải danh sách khoa.
      </Typography>
    );
  }

  return (
    <>
    <Stack
  direction="row"
  sx={{
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 3,
  }}
>
        <Box>
          <Typography 
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Quản lý khoa
          </Typography>

          <Typography 
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Quản lý các khoa đang hoạt động trong bệnh viện.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Thêm khoa
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã khoa</TableCell>
              <TableCell>Tên khoa</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">
                Hoạt động
              </TableCell>
              <TableCell align="right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {departments.map(department => (
              <TableRow
                key={department.id}
                hover
              >
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>
                    {department.code}
                  </Typography>
                </TableCell>

                <TableCell>
                  {department.name}
                </TableCell>

                <TableCell>
                  {department.description || '-'}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    color={
                      department.status === 'active'
                        ? 'success'
                        : 'default'
                    }
                    label={
                      department.status === 'active'
                        ? 'Đang hoạt động'
                        : 'Ngừng hoạt động'
                    }
                  />
                </TableCell>

                <TableCell align="center">
                  <Switch
                    checked={
                      department.status === 'active'
                    }
                    onChange={() =>
                      handleStatusChange(department)
                    }
                  />
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    onClick={() =>
                      handleEdit(department)
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {departments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                >
                  Chưa có khoa nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DepartmentFormDialog
        open={dialogOpen}
        department={selectedDepartment}
        onClose={handleClose}
      />
    </>
  );
}
