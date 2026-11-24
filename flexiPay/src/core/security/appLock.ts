import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

import { createStore } from '@/lib/store';
import { SecureStorage } from './secureStorage';

const ENABLED_KEY = 'app_lock_enabled';

const store = createStore({ isLocked: false, isEnabled: true });

/**
 * Tracks whether the app should currently show a lock screen. Backgrounding the app while
 * authenticated arms the lock; only an explicit unlock() (after a successful biometric /
 * device-credential prompt) clears it. The enabled flag isn't security-sensitive, so it
 * lives in AsyncStorage rather than secure storage.
 */
export const AppLock = {
  useLock: store.useStore,
  get: store.get,

  async initialize() {
    const saved = await AsyncStorage.getItem(ENABLED_KEY);
    store.set({ isEnabled: saved === null ? true : saved === 'true' });
  },

  async setEnabled(enabled: boolean) {
    store.set({ isEnabled: enabled });
    await AsyncStorage.setItem(ENABLED_KEY, String(enabled));
  },

  unlock() {
    store.set({ isLocked: false });
  },

  lockNow() {
    if (store.get().isEnabled) store.set({ isLocked: true });
  },

  /**
   * Starts listening for app lifecycle changes; returns an unsubscribe function.
   * Only 'background' arms the lock: 'inactive' also fires on iOS while the Face ID
   * prompt itself is showing, which would re-lock the app mid-unlock.
   */
  attach(): () => void {
    const sub = AppState.addEventListener('change', async (state) => {
      if (!store.get().isEnabled || state !== 'background') return;
      const hasSession = (await SecureStorage.getToken()) != null;
      if (hasSession) store.set({ isLocked: true });
    });
    return () => sub.remove();
  },
};
