import NetInfo from '@react-native-community/netinfo';

import { createStore } from '@/lib/store';

export type NetworkQuality = 'online' | 'poor' | 'offline';

const SLOW_MS = 6000;

const store = createStore<{ quality: NetworkQuality }>({ quality: 'online' });

let deviceOffline = false;
let slowRequests = 0;

function update() {
  if (deviceOffline) store.set({ quality: 'offline' });
  else if (slowRequests >= 2) store.set({ quality: 'poor' });
  else store.set({ quality: 'online' });
}

export const Connectivity = {
  useConnectivity: store.useStore,
  get: () => store.get().quality,

  /** Call once at app start; returns an unsubscribe function. */
  start(): () => void {
    return NetInfo.addEventListener((state) => {
      deviceOffline = state.isConnected === false || state.isInternetReachable === false;
      if (state.type === 'cellular' && state.details?.cellularGeneration === '2g') {
        slowRequests = Math.max(slowRequests, 2);
      }
      if (!deviceOffline && state.type !== 'cellular') slowRequests = 0;
      update();
    });
  },

  /** Called by ApiClient after every request. */
  reportRequest(durationMs: number, ok: boolean) {
    if (!ok) {
      slowRequests += 1; // timeouts and network errors count as "bad"
    } else if (durationMs > SLOW_MS) {
      slowRequests += 1;
    } else {
      slowRequests = 0; // one fast success clears it
    }
    update();
  },

  /** Throw before money actions instead of letting them hang for 30 seconds. */
  assertOnline() {
    if (store.get().quality === 'offline') {
      throw new Error("You're offline. Connect to the internet to continue.");
    }
  },
};