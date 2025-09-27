import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import authService from '../services/authService';
import { Alert } from '@mui/material';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleRegister = async (
    email: string, 
    username: string, 
    password: string, 
    fullName: string
  ) => {
    setLoading(true);
    setError(undefined);

    try {
      await authService.register({
        email,
        username,
        password,
        full_name: fullName
      });
      
      // Redirect to login after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.'
        }
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to register. Please check your information and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400, margin: '0 auto', mt: 2 }}>
          {error}
        </Alert>
      )}
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
};

export default RegisterPage;