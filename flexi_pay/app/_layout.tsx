import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLockScreen } from '@/components/AppLockScreen';
import { ToastHost } from '@/components/ui/Toast';
import { ApiClient } from '@/core/network/apiClient';
import { AppLock } from '@/core/security/appLock';
import { Nav } from '@/lib/navigation';
import { AuthService } from '@/services/authService';

export default function RootLayout() {
  const { isLocked } = AppLock.useLock();

  useEffect(() => {
    AppLock.initialize();
    const detach = AppLock.attach();

    // A 401/403 anywhere (expired token, revoked session) drops the user back to login and
    // clears the stale local session. Guarded against re-entrancy: logout() itself makes an
    // authenticated call with the token that's already known bad, which could 401 again.
    let handling = false;
    ApiClient.onUnauthorized = async () => {
      if (handling) return;
      handling = true;
      try {
        await AuthService.logout();
        Nav.toLogin();
      } finally {
        handling = false;
      }
    };

    return () => {
      detach();
      ApiClient.onUnauthorized = undefined;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F7FAFC' } }} />
      {isLocked ? <AppLockScreen /> : null}
      <ToastHost />
    </SafeAreaProvider>
  );
}
