import apiClient from '@/services/apiClient';
import { z } from 'zod';
import { tokenStore } from '@/services/tokenStore';
import { queryClient } from '@/services/queryClient';
import type { AuthUser, SignInPayload, SignUpPayload, VerifyOtpPayload } from '@/types';

const SignInResponse = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum(['patient', 'doctor', 'hospital_admin', 'platform_admin']),
  }),
});

export const authService = {
  async signUp(payload: SignUpPayload) {
    const { data } = await apiClient.post('/auth/signup', payload);
    return data;
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const { data } = await apiClient.post('/auth/verify-otp', payload);
    return data;
  },

  async signIn({ email, password }: SignInPayload): Promise<AuthUser> {
    const { data } = await apiClient.post('/auth/login', { email, password });
    const parsed = SignInResponse.parse(data);
    await tokenStore.setUser(parsed.user);
    await tokenStore.set(parsed.accessToken, parsed.refreshToken);
    return parsed.user;
  },

  async signOut(): Promise<void> {
    try {
      const refreshToken = await tokenStore.getRefresh();
      if (refreshToken) await apiClient.post('/auth/logout', { refreshToken }, { timeout: 5000 });
    } catch {
      // Offline, expired or already revoked: still sign out locally, so the
      // device is never "stuck" logged in.
    } finally {
      await tokenStore.clear();
      queryClient.clear(); // drop cached health data
    }
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  },
};
