import { jwtDecode } from 'jwt-decode';

import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';
import { BiometricService } from '@/core/security/biometricService';
import { SecureStorage } from '@/core/security/secureStorage';
import {
  ApiError,
  type ChangePasswordRequest,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type ResetPasswordRequest,
} from '@/models/types';
import { dashboardStore } from '@/lib/dashboardStore';

export const AuthService = {
  // ==================== TOKEN / SESSION ====================

  getToken: () => SecureStorage.getToken(),

  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStorage.getToken();
    if (!token) return false;
    try {
      const { exp } = jwtDecode<{ exp?: number }>(token);
      return exp != null && exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // ==================== REGISTRATION / EMAIL VERIFICATION ====================

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const data = await ApiClient.post(ApiEndpoints.register, { ...request }, false);
    const response: RegisterResponse = {
      token: data.token as string,
      usernameSuggestions: ((data.usernameSuggestions as unknown[]) ?? []).map(String),
    };
    await SecureStorage.saveToken(response.token);
    return response;
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    await ApiClient.post(ApiEndpoints.verifyEmail, { email, code }, false);
  },

  async resendVerification(email: string): Promise<void> {
    await ApiClient.post(ApiEndpoints.resendVerification, { email }, false);
  },

  async selectUsername(username: string): Promise<void> {
    await ApiClient.post(ApiEndpoints.selectUsername, { username });
  },

  // ==================== LOGIN ====================

  /** Standard email + password login. Passwordless options below are alternatives to it. */
  async loginWithEmailPassword(request: LoginRequest): Promise<LoginResponse> {
    const data = await ApiClient.post(ApiEndpoints.login, { ...request }, false);
    const response = data as LoginResponse;
    await SecureStorage.saveToken(response.token);
    return response;
  },

  /** Step 1 of passwordless login: the backend emails a one-time code. No token yet. */
  async requestLoginOtp(email: string): Promise<void> {
    await ApiClient.post(ApiEndpoints.loginEmailOtpRequest, { email }, false);
  },

  /** Step 2: exchanges the emailed code for the session token. */
  async verifyLoginOtp(email: string, code: string): Promise<LoginResponse> {
    const data = await ApiClient.post(ApiEndpoints.loginEmailOtpVerify, { email, code }, false);
    const response = data as LoginResponse;
    await SecureStorage.saveToken(response.token);
    return response;
  },

  // ==================== BIOMETRICS ====================

  isBiometricDeviceSupported: () => BiometricService.isDeviceSupported(),
  isBiometricEnrolled: () => BiometricService.isEnrolled(),

  /** Generates the on-device keypair (biometric-gated) and registers the public key. Must be authenticated. */
  async enrollBiometrics(): Promise<void> {
    const publicKeyJwk = await BiometricService.enroll();
    if (!publicKeyJwk) {
      throw new ApiError(BiometricService.lastErrorMessage ?? 'Biometric enrollment was cancelled');
    }
    await ApiClient.post(ApiEndpoints.biometricRegister, { publicKey: publicKeyJwk });
  },

  disableBiometrics: () => BiometricService.disable(),

  /** Fetch a one-time challenge, sign it on-device (biometric prompt), exchange it for a token. */
  async biometricLogin(email: string): Promise<LoginResponse> {
    const challengeData = await ApiClient.post(ApiEndpoints.biometricChallenge, { email }, false);
    const challenge = challengeData.challenge as string;

    const signature = await BiometricService.signChallenge(challenge);
    if (!signature) {
      throw new ApiError(
        BiometricService.lastErrorMessage ?? 'Biometric authentication was cancelled',
      );
    }

    const data = await ApiClient.post(
      ApiEndpoints.biometricLogin,
      { email, challenge, signature },
      false,
    );
    const response = data as LoginResponse;
    await SecureStorage.saveToken(response.token);
    return response;
  },

  // ==================== LOGOUT / PASSWORD ====================

  async logout(): Promise<void> {
    try {
      await ApiClient.post(ApiEndpoints.logout);
    } catch {
      // Best-effort server-side revocation; local session is cleared regardless.
    }
    await SecureStorage.clearAll();
    dashboardStore.reset();
  },

  /** Soft-deletes the account server-side and clears the local session. */
  async deleteAccount(): Promise<void> {
    await ApiClient.delete(ApiEndpoints.deleteAccount);
    await SecureStorage.clearAll();
    dashboardStore.reset();
  },

  async forgotPassword(email: string): Promise<void> {
    await ApiClient.post(ApiEndpoints.resetPasswordInitiate, { email }, false);
  },

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await ApiClient.post(ApiEndpoints.resetPassword, { ...request }, false);
  },

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await ApiClient.post(ApiEndpoints.changePassword, { ...request });
  },
};
