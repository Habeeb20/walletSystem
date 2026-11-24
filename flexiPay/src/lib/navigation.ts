import { router } from 'expo-router';
import { ApiError } from '@/models/types';
import { ProfileService } from '@/services/profileService';

export type MainTab = 'home' | 'bills' | 'wallet' | 'history' | 'settings';

/** Clears the stack, then lands on `href` (Flutter's pushNamedAndRemoveUntil(..., (_) => false)). */
function resetTo(href: Parameters<typeof router.replace>[0]) {
  if (router.canDismiss()) router.dismissAll();
  router.replace(href);
}

/** Navigation helpers (port of Flutter's AppRoutes.navigateTo* functions). */
export const Nav = {
  toLogin: () => resetTo('/login'),
  toRegister: () => resetTo('/register'),
  toHome: (tab: MainTab = 'home') => resetTo(`/${tab}`),
  toForgotPassword: () => router.push('/forgot-password'),
  toChangePassword: () => router.push('/change-password'),

  toCompleteProfile(params: { fullName?: string; email?: string; phone?: string } = {}) {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => typeof v === 'string' && v.length > 0),
    ) as Record<string, string>;
    resetTo({ pathname: '/complete-profile', params: clean });
  },

  back() {
    if (router.canGoBack()) router.back();
  },

  /**
   * Every login (password or biometric) must land on the profile-completion screen instead of
   * home until the backend's Paylony dedicated account exists, which is what makes wallet
   * funding work, so it can't be skipped.
   */


  async toHomeOrCompleteProfile() {
  let complete: boolean;
  try {
    complete = await ProfileService.isProfileComplete();
  } catch (e) {
    // A server reply (ApiError) means the profile really isn't complete. Anything else is
    // a network failure, so send the user home and show their saved data instead.
    complete = !(e instanceof ApiError) ? true : false;
  }
  if (complete) Nav.toHome();
  else Nav.toCompleteProfile();
},
};
