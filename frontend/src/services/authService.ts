import axios from 'axios';
import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions for local storage
const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

// Configure axios to use token for all requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // For FastAPI OAuth2 token request, we need to use form data
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<AuthResponse>(
      `/auth/login`, 
      formData
    );
    
    const { access_token, token_type } = response.data;
    setToken(access_token);
    
    return response.data;
  },
  
  register: async (data: RegisterData): Promise<UserProfile> => {
    const response = await api.post<UserProfile>(
      `/auth/register`,
      data
    );
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    try {
      await api.post(`/auth/logout`);
    } finally {
      removeToken();
    }
  },
  
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(`/users/profile`);
    return response.data;
  },
  
  isAuthenticated: (): boolean => {
    return !!getToken();
  },
  
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/auth/refresh`);
    const { access_token } = response.data;
    setToken(access_token);
    return response.data;
  }
};

export default authService;