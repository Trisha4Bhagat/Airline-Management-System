import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import authService from '../services/authService';
import { Alert } from '@mui/material';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(undefined);

    try {
      await authService.login({ username, password });
      
      // Redirect to dashboard after successful login
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to login. Please check your credentials and try again.');
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
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </div>
  );
};

export default LoginPage;