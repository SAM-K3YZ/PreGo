import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';

export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface SignUpPayload {
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  fullName: string;
  phone: string;
  // Doctor-only verification details.
  licenseNumber?: string;
  specialty?: string;
  hospitalName?: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

export const authService = {
  async signUp(payload: SignUpPayload) {
    const { data } = await apiClient.post('/auth/signup', payload);
    return data;
  },

  async verifyOtp(payload: { email: string; otp: string }) {
    const { data } = await apiClient.post('/auth/verify-otp', payload);
    return data;
  },

  async signIn({ email, password }: SignInPayload): Promise<AuthUser> {
    const { data } = await apiClient.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('accessToken', data.accessToken);
    await SecureStore.setItemAsync('refreshToken', data.refreshToken);
    return data.user;
  },

  async signOut(): Promise<void> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      await apiClient.post('/auth/logout', { refreshToken });
    } finally {
      // Always clear local tokens even if the server call fails —
      // the device should never be "stuck" logged in.
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },
};
