import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { toast } from '@/components/ui/Toast';
import { Connectivity } from '@/core/network/connectivity';
import { events, WALLET_CHANGED } from '@/lib/events';
import { ApiError } from '@/models/types';

const UNCONFIRMED = 'We could not confirm this purchase. Check your transaction history before trying again.';

/**
 * Wrapper for purchases that need a live server answer (PINs, international top-ups, betting,
 * exam products). They can't be queued offline: the user needs the PIN or confirmation now.
 * Resolves the result, or null after showing the problem.
 */
export function useBuy() {
  const [loading, setLoading] = useState(false);

  async function run<T>(action: () => Promise<T>): Promise<T | null> {
    if (Connectivity.get() === 'offline') {
      toast.error("You're offline. This purchase needs an internet connection.");
      return null;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await action();
      events.emit(WALLET_CHANGED);
      return result;
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : UNCONFIRMED);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, run };
}
