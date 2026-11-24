import AsyncStorage from '@react-native-async-storage/async-storage';

import { Connectivity } from '@/core/network/connectivity';
import { createStore } from '@/lib/store';
import { ApiError, type DashboardData, type PaylonyAccount } from '@/models/types';
import { ProfileService } from '@/services/profileService';
import { WalletService } from '@/services/walletService';

const CACHE_KEY = 'dashboard_cache_v1';

interface DashboardState {
  data: DashboardData | null;
  paylonyAccount: PaylonyAccount | null;
  /** Full-screen spinner (first load / retry). */
  loading: boolean;
  /** Pull-to-refresh or background refresh; keeps the current content on screen. */
  refreshing: boolean;
  error: string | null;
  loaded: boolean;
  /** When `data` was last fetched from the server (ms since epoch). */
  savedAt: number | null;
  /** True while showing saved data that couldn't be refreshed. */
  fromCache: boolean;
}

const initial: DashboardState = {
  data: null,
  paylonyAccount: null,
  loading: false,
  refreshing: false,
  error: null,
  loaded: false,
  savedAt: null,
  fromCache: false,
};

const store = createStore<DashboardState>(initial);

/** JSON turns Dates into strings, so rebuild them after reading the cache. */
function revive(data: DashboardData): DashboardData {
  return {
    ...data,
    transactions: data.transactions.map((t) => ({ ...t, timestamp: new Date(t.timestamp) })),
  };
}

/**
 * Shared dashboard state. Home, Wallet, History and the drawer all read from one fetch.
 * The last successful result is saved on the device so the app still shows a balance and
 * history while offline.
 */
export const dashboardStore = {
  useDashboard: store.useStore,
  get: store.get,

  /** Show the saved dashboard immediately (call before `load`). */
  async restore() {
    if (store.get().data) return;
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw) as {
        data: DashboardData;
        paylonyAccount: PaylonyAccount | null;
        savedAt: number;
      };
      store.set({
        data: revive(cached.data),
        paylonyAccount: cached.paylonyAccount,
        savedAt: cached.savedAt,
        fromCache: true,
      });
    } catch {
      // Corrupt or missing cache: just load from the network.
    }
  },

  async load(mode: 'initial' | 'silent' = 'initial') {
    // Offline: don't wait for a request that can't succeed. Keep whatever is on screen.
    if (Connectivity.get() === 'offline') {
      store.set({ loading: false, refreshing: false });
      if (!store.get().data) {
        store.set({ error: "You're offline and there's no saved data yet." });
      }
      return;
    }

    if (mode === 'initial') store.set({ loading: true, error: null });
    else store.set({ refreshing: true });

    try {
      const data = await WalletService.fetchDashboard();
      let paylonyAccount: PaylonyAccount | null = null;
      try {
        paylonyAccount = await ProfileService.fetchPaylonyAccount();
      } catch {
        // Non-critical: the balance card just omits the account line.
      }

      const savedAt = Date.now();
      store.set({ data, paylonyAccount, error: null, loaded: true, savedAt, fromCache: false });
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, paylonyAccount, savedAt })).catch(() => {});
    } catch (e) {
      if (store.get().data) {
        // Keep showing the last known data, but mark it as not fresh.
        store.set({ fromCache: true });
      } else {
        store.set({ error: e instanceof ApiError ? e.message : 'Could not load your dashboard' });
      }
    } finally {
      store.set({ loading: false, refreshing: false });
    }
  },

  /** Clears state and the saved copy (logout, account deletion, new login). */
  reset() {
    store.set(initial);
    AsyncStorage.removeItem(CACHE_KEY).catch(() => {});
  },
};