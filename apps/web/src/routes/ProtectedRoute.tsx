import { CircularProgress, Box } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/useAuth';



export default function ProtectedRoute() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",        
        justifyContent:"center"
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}