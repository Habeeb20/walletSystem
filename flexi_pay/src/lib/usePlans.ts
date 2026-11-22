import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError, type Plan } from '@/models/types';
import { PlansService } from '@/services/plansService';

/** Loads the live plan catalog for one service (network, TV provider or `electricity`). */
export function usePlans(service: string, errorMessage: string) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const id = ++latest.current; // ignore responses from a previously selected service
    setLoading(true);
    setError(null);
    setPlans([]);
    try {
      const result = await PlansService.getPlans(service);
      if (id === latest.current) setPlans(result);
    } catch (e) {
      if (id === latest.current) setError(e instanceof ApiError ? e.message : errorMessage);
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [service, errorMessage]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { plans, loading, error, reload };
}
