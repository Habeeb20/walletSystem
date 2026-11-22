import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';

const reference = (data: any): string => (data?.reference as string | undefined) ?? '';

export const BillsService = {
  async buyAirtime(args: { network: string; amount: number; phone: string }) {
    const data = await ApiClient.post(ApiEndpoints.buyAirtime, {
      network: args.network,
      amount: args.amount,
      phone: args.phone,
      country: 'NG',
    });
    return reference(data);
  },

  /** planCode and price come from the live plans catalog (/api/plans/:network). */
  async buyData(args: { planCode: string; phone: string; price: number }) {
    const data = await ApiClient.post(ApiEndpoints.buyData, {
      coded: args.planCode,
      number: args.phone,
      reseller_price: args.price,
    });
    return reference(data);
  },

  /** discoCode comes from the live `/api/plans/electricity` list (e.g. `ikeja-electric`). */
  async buyElectricity(args: { meterNumber: string; amount: number; discoCode: string }) {
    const data = await ApiClient.post(ApiEndpoints.buyElectricity, {
      number: args.meterNumber,
      amount: args.amount,
      disco: args.discoCode,
    });
    return reference(data);
  },

  async buyTvSubscription(args: { planCode: string; smartCardNumber: string; price: number }) {
    const data = await ApiClient.post(ApiEndpoints.buyTvSubscription, {
      coded: args.planCode,
      number: args.smartCardNumber,
      price: args.price,
    });
    return reference(data);
  },
};
