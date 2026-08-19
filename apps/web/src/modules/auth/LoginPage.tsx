import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../config/firebase';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      window.alert('Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",        
      justifyContent:"center",
      bgcolor:"#f5f7fa"
    }}>
      <Paper sx={{ width: 400, p: 4 }}>
        <Typography sx={{ variant: "h5", mb: 3 }}>
          HIS Admin
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
      </Paper>
    </Box>
  );
}