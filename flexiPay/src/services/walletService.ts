import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';
import {
  parseDashboard,
  parseVirtualAccount,
  type DashboardData,
  type VirtualAccountDetails,
} from '@/models/types';

export const WalletService = {
  async fetchDashboard(): Promise<DashboardData> {
    const data = await ApiClient.get(ApiEndpoints.dashboard);
    return parseDashboard(data);
  },

  /** Returns the Paystack checkout URL and reference; the UI opens it in a webview. */
  async fundWallet(amount: number): Promise<{ url: string; reference: string }> {
    const data = await ApiClient.post(ApiEndpoints.fundWallet, { amount });
    return { url: data.url as string, reference: data.reference as string };
  },

  async fetchWalletBalance(): Promise<number> {
    const data = await ApiClient.get(ApiEndpoints.walletBalance);
    return Number(data.balance);
  },

  async checkVirtualAccount(): Promise<VirtualAccountDetails | null> {
    const data = await ApiClient.get(ApiEndpoints.checkVirtualAccount);
    if (data?.exists !== true || !data.virtualAccountDetails) return null;
    return parseVirtualAccount(data.virtualAccountDetails);
  },

  async createVirtualAccount(): Promise<VirtualAccountDetails> {
    const data = await ApiClient.post(ApiEndpoints.createVirtualAccount);
    return parseVirtualAccount(data.details);
  },
};
