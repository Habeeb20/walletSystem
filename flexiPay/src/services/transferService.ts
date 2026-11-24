import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';
import { parseBank, parseVerifiedAccount, type Bank, type VerifiedAccount } from '@/models/types';

export const TransferService = {
  async fetchBanks(): Promise<Bank[]> {
    const data = await ApiClient.get(ApiEndpoints.banks);
    let list: unknown[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.banks)) list = data.banks;
      else if (Array.isArray(data.data?.banks)) list = data.data.banks;
      else if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.result)) list = data.result;
    }
    return list
      .filter((e): e is Record<string, unknown> => !!e && typeof e === 'object')
      .map(parseBank);
  },

  async verifyAccount(args: { bankCode: string; accountNumber: string }): Promise<VerifiedAccount> {
    const data = await ApiClient.post(ApiEndpoints.verifyAccount, {
      bank_code: args.bankCode,
      account_number: args.accountNumber,
    });
    return parseVerifiedAccount(data as Record<string, unknown>);
  },

  async transferFunds(args: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    amount: number;
    narration?: string;
  }): Promise<void> {
    await ApiClient.post(ApiEndpoints.transferFunds, {
      account_number: args.accountNumber,
      account_name: args.accountName,
      bank_code: args.bankCode,
      bank_name: args.bankName,
      // Backend expects amount as a string, not a number.
      amount: String(args.amount),
      narration: args.narration || 'Wallet transfer',
    });
  },
};
