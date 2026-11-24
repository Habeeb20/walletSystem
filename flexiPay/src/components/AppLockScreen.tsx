import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppLock } from '@/core/security/appLock';
import { BiometricService } from '@/core/security/biometricService';
import { Nav } from '@/lib/navigation';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

/**
 * Overlay shown whenever the app returns from background while a session exists. Unlocks with
 * device biometrics/PIN; "Log out" is the escape hatch if the user can't authenticate.
 * Rendered above the whole navigator, so pushed screens (transfer, bills...) are covered too.
 */
export function AppLockScreen() {
  const [unlocking, setUnlocking] = useState(false);

  const unlock = useCallback(async () => {
    setUnlocking(true);
    try {
      if (await BiometricService.authenticateDeviceOwner('Unlock FlexiPay')) AppLock.unlock();
    } finally {
      setUnlocking(false);
    }
  }, []);

  useEffect(() => {
    unlock();
  }, [unlock]);

  const logout = async () => {
    await AuthService.logout();
    AppLock.unlock();
    Nav.toLogin();
  };

  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-canvas px-6">
      <MaterialIcons name="lock-outline" size={64} color={colors.primary500} />
      <Text className="mt-6 text-[22px] font-bold text-ink">FlexiPay is locked</Text>
      <Text className="mt-2 text-sm text-ink-secondary">Authenticate to continue</Text>

      <Pressable
        onPress={unlock}
        disabled={unlocking}
        className="mt-8 h-[52px] w-full flex-row items-center justify-center rounded-2xl bg-primary-500 active:opacity-90"
      >
        {unlocking ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="fingerprint" size={22} color="#fff" />}
        <Text className="ml-2 font-semibold text-white">{unlocking ? 'Verifying…' : 'Unlock'}</Text>
      </Pressable>
      <Pressable onPress={logout} className="mt-3 p-3">
        <Text className="text-ink-secondary">Log out</Text>
      </Pressable>
    </View>
  );
}
