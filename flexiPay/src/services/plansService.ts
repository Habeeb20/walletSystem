import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';
import { parsePlan, parsePlanService, type Plan, type PlanService } from '@/models/types';

/**
 * Live plan catalog (`/api/plans`). Fetched on demand (when a user picks a network/provider),
 * never bundled or cached to disk, since prices can change on the backend without an app release.
 */
export const PlansService = {
  async getServices(): Promise<PlanService[]> {
    const data = await ApiClient.get(ApiEndpoints.plans);
    return ((data?.services as unknown[]) ?? []).map((e) => parsePlanService(e as Record<string, unknown>));
  },

  /** Plans for one service, e.g. `mtn`, `dstv`, or `electricity` (case-insensitive on the backend). */
  async getPlans(service: string): Promise<Plan[]> {
    const data = await ApiClient.get(ApiEndpoints.plansForService(service));
    return ((data?.plans as unknown[]) ?? []).map((e) => parsePlan(e as Record<string, unknown>));
  },
};
