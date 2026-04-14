/** useAuth — JWT session management hook */
import { useAuthStore } from '../store/authStore';
import { apiPost } from '../lib/api';
import type { User, AuthTokens } from '../types';

export function useAuth() {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();

  const login = async (email: string, password: string, role: 'STUDENT' | 'OWNER') => {
    const data = await apiPost<{ user: User; tokens: AuthTokens }>('/auth/login', {
      email,
      password,
      role,
    });
    setAuth(data.user, data.tokens.accessToken);
    return data.user;
  };

  const registerUser = async (email: string, password: string, role: 'STUDENT' | 'OWNER', firstName?: string, lastName?: string) => {
    const data = await apiPost<{ user: User; tokens: AuthTokens }>('/auth/register', {
      email,
      password,
      role,
      firstName: firstName || 'New',
      lastName: lastName || 'User',
    });
    setAuth(data.user, data.tokens.accessToken);
    return data.user;
  };

  const logout = () => clearAuth();

  return { user, accessToken, isAuthenticated: !!accessToken, login, register: registerUser, logout };
}
