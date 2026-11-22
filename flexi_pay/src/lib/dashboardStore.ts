import { createStore } from '@/lib/store';
import { ApiError, type DashboardData, type PaylonyAccount } from '@/models/types';
import { ProfileService } from '@/services/profileService';
import { WalletService } from '@/services/walletService';

interface DashboardState {
  data: DashboardData | null;
  paylonyAccount: PaylonyAccount | null;
  /** Full-screen spinner (first load / retry). */
  loading: boolean;
  /** Pull-to-refresh or background refresh; keeps the current content on screen. */
  refreshing: boolean;
  error: string | null;
  loaded: boolean;
}

const initial: DashboardState = {
  data: null,
  paylonyAccount: null,
  loading: false,
  refreshing: false,
  error: null,
  loaded: false,
};

const store = createStore<DashboardState>(initial);

/**
 * Shared dashboard state. Home, Wallet, History and the drawer all read from one fetch
 * instead of each screen re-requesting `/auth/dashboard` (the Flutter app did the latter).
 */
export const dashboardStore = {
  useDashboard: store.useStore,
  get: store.get,

  async load(mode: 'initial' | 'silent' = 'initial') {
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
      store.set({ data, paylonyAccount, error: null, loaded: true });
    } catch (e) {
      // A failed silent refresh keeps whatever is already on screen.
      if (mode === 'initial' || !store.get().data) {
        store.set({
          error: e instanceof ApiError ? e.message : 'Could not load your dashboard',
        });
      }
    } finally {
      store.set({ loading: false, refreshing: false });
    }
  },

  reset() {
    store.set(initial);
  },
};
