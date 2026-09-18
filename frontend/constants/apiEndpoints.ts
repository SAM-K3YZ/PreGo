export const ENDPOINTS = {
  AUTH: {
    SIGNUP: '/auth/signup',
    VERIFY_OTP: '/auth/verify-otp',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PATIENTS: {
    ME: '/patients/me',
  },
  LOGS: {
    SYMPTOMS: '/logs/symptoms',
    WEIGHT: '/logs/weight',
  },
  HOSPITALS: {
    LIST: '/hospitals',
    DOCTORS: (hospitalId: string) => `/hospitals/${hospitalId}/doctors`,
  },
  LINKS: '/links',
  APPOINTMENTS: '/appointments',
  CHAT: (linkId: string) => `/chat/${linkId}/messages`,
  MEDIA: {
    UPLOAD_URL: '/media/upload-url',
    DOWNLOAD_URL: (id: string) => `/media/${id}/download-url`,
  },
} as const;
