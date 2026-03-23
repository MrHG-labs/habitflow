import { apiClient } from './client';
import { User, UserCreate, UserLogin, Token } from '@/types/user';

export const authApi = {
  register: async (data: UserCreate): Promise<User> => {
    const response = await apiClient.post<User>('/auth/register', data);
    return response.data;
  },

  login: async (data: UserLogin): Promise<Token> => {
    const response = await apiClient.post<Token>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  refreshToken: async (refreshToken: string): Promise<Token> => {
    const response = await apiClient.post<Token>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};