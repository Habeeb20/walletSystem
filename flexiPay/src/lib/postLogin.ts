import { Alert } from 'react-native';

import { toast } from '@/components/ui/Toast';
import { AppLock } from '@/core/security/appLock';
import { dashboardStore } from '@/lib/dashboardStore';
import { Nav } from '@/lib/navigation';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';

/**
 * Offered once after a successful registration or password login. Skipped silently if the
 * device has no biometric/PIN hardware or the user already enrolled. Never blocks navigation.
 */
export async function maybePromptBiometricEnrollment(): Promise<void> {
  if (await AuthService.isBiometricEnrolled()) return;
  if (!(await AuthService.isBiometricDeviceSupported())) return;

  const shouldEnroll = await new Promise<boolean>((resolve) => {
    Alert.alert(
      'Enable biometric login?',
      'Use your fingerprint or face to log in faster next time, instead of typing your password.',
      [
        { text: 'Not now', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Enable', onPress: () => resolve(true) },
      ],
      { onDismiss: () => resolve(false) },
    );
  });
  if (!shouldEnroll) return;

  try {
    await AuthService.enrollBiometrics();
    toast.success('Biometric login enabled');
  } catch (e) {
    if (e instanceof ApiError) toast.error(e.message);
    // Anything else is non-critical: the user can enable it later from Settings.
  }
}

/** Shared tail of password and email-code login. */
export async function onLoginVerified(): Promise<void> {
  dashboardStore.reset();
  AppLock.unlock();
  toast.success('Welcome back!');
  await maybePromptBiometricEnrollment();
  await Nav.toHomeOrCompleteProfile();
}
