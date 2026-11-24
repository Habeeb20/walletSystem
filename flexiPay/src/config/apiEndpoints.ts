import { AppConfig } from './appConfig';

/** Mirrors the real routes exposed by flexipay-backend. */
export const ApiEndpoints = {
  baseUrl: AppConfig.apiBaseUrl,

  // ---- Auth (/api/auth) ----
  register: '/auth/register',
  selectUsername: '/auth/select-username',
  verifyEmail: '/auth/verifyemail',
  resendVerification: '/auth/resend-verification',
  login: '/auth/login',
  loginEmailOtpRequest: '/auth/login-email/request',
  loginEmailOtpVerify: '/auth/login-email/verify',
  logout: '/auth/logout',
  deleteAccount: '/auth/delete-account',
  changePassword: '/auth/change-password',
  dashboard: '/auth/dashboard',
  biometricChallenge: '/auth/biometric-challenge',
  biometricLogin: '/auth/biometric-login',
  biometricRegister: '/auth/biometric-register',
  resetPasswordInitiate: '/auth/reset-password/initiate',
  resetPassword: '/auth/reset-password',
  customer: '/auth/customer',
  createVirtualAccount: '/auth/create-virtual-account',
  checkVirtualAccount: '/auth/check-virtual-account',
  createPaylonyVirtualAccount: '/auth/create-paylony-virtual-account',

  // ---- Wallet (/api/wallet) ----
  fundWallet: '/wallet/fund-wallet',
  walletBalance: '/wallet/wallet-balance',
  checkBalance: '/wallet/check-balance',

  // ---- Transfer (/api/transfer) ----
  banks: '/transfer/banks',
  verifyAccount: '/transfer/verify-account',
  transferFunds: '/transfer/transferfunds',

  // ---- Airtime / Data (/api/airtime) ----
  buyAirtime: '/airtime/buy-airtime',
  buyDataPin: '/airtime/buy-data-pin',
  // TODO: confirm the next six paths against your API docs (not in the original app).
  buyAirtimeForeign: '/airtime/buy-airtime-foreign',
  buyAirtimePin: '/airtime/buy-airtime-pin',
  buyDataForeign: '/airtime/buy-data-foreign',
  bettingTopup: '/betting/topup',
  resultChecker: '/education/result-checker',
  buyJamb: '/education/buy-jamb',
  buyData: '/airtime/buy-data',

  // ---- Electricity (/api/electricty: matches the backend's spelling) ----
  buyElectricity: '/electricty/buy-electricity',

  // ---- TV (/api/tv) ----
  buyTvSubscription: '/tv/buy-tv-subscription',

  // ---- Contact (/api/contact) ----
  contact: '/contact',

  // ---- Plans (/api/plans): live catalog ----
  plans: '/plans',
  plansForService: (service: string) => `/plans/${service}`,
  plansForType: (type: string) => `/plans/type/${type}`,

  full: (path: string) => `${AppConfig.apiBaseUrl}${path}`,
} as const;
