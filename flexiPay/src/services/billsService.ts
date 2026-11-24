// import { ApiEndpoints } from '@/config/apiEndpoints';
// import { ApiClient } from '@/core/network/apiClient';

// const reference = (data: any): string => (data?.reference as string | undefined) ?? '';

// export const BillsService = {
//   async buyAirtime(args: { network: string; amount: number; phone: string }) {
//     const data = await ApiClient.post(ApiEndpoints.buyAirtime, {
//       network: args.network,
//       amount: args.amount,
//       phone: args.phone,
//       country: 'NG',
//     });
//     return reference(data);
//   },

//   /** planCode and price come from the live plans catalog (/api/plans/:network). */
//   async buyData(args: { planCode: string; phone: string; price: number }) {
//     const data = await ApiClient.post(ApiEndpoints.buyData, {
//       coded: args.planCode,
//       number: args.phone,
//       reseller_price: args.price,
//     });
//     return reference(data);
//   },

//   /** discoCode comes from the live `/api/plans/electricity` list (e.g. `ikeja-electric`). */
//   async buyElectricity(args: { meterNumber: string; amount: number; discoCode: string }) {
//     const data = await ApiClient.post(ApiEndpoints.buyElectricity, {
//       number: args.meterNumber,
//       amount: args.amount,
//       disco: args.discoCode,
//     });
//     return reference(data);
//   },

//   async buyTvSubscription(args: { planCode: string; smartCardNumber: string; price: number }) {
//     const data = await ApiClient.post(ApiEndpoints.buyTvSubscription, {
//       coded: args.planCode,
//       number: args.smartCardNumber,
//       price: args.price,
//     });
//     return reference(data);
//   },
// };



import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';

const reference = (data: any): string => (data?.reference as string | undefined) ?? '';
const keyHeader = (key?: string) => (key ? { 'Idempotency-Key': key } : undefined);

/**
 * Original services (airtime, data, electricity, TV) are confirmed against the backend and
 * return the transaction reference.
 *
 * The services under "NEW" are NOT confirmed: their paths live in apiEndpoints.ts and their
 * request fields are my best guess. If your API expects different field names, change them
 * HERE only: the screens just collect the user's input. They return the raw response so the
 * receipt screen can show whatever the server sends back (PINs, tokens, references).
 */
export const BillsService = {
  async buyAirtime(args: { network: string; amount: number; phone: string; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyAirtime,
      { network: args.network, amount: args.amount, phone: args.phone, country: 'NG' },
      true,
      keyHeader(args.idempotencyKey),
    );
    return reference(data);
  },

  /** planCode and price come from the live plans catalog (/api/plans/:network). */
  async buyData(args: { planCode: string; phone: string; price: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyData,
      { coded: args.planCode, number: args.phone, reseller_price: args.price },
      true,
      keyHeader(args.idempotencyKey),
    );
    return reference(data);
  },

  /** discoCode comes from the live `/api/plans/electricity` list (e.g. `ikeja-electric`). */
  async buyElectricity(args: { meterNumber: string; amount: number; discoCode: string; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyElectricity,
      { number: args.meterNumber, amount: args.amount, disco: args.discoCode },
      true,
      keyHeader(args.idempotencyKey),
    );
    return reference(data);
  },

  async buyTvSubscription(args: { planCode: string; smartCardNumber: string; price: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyTvSubscription,
      { coded: args.planCode, number: args.smartCardNumber, price: args.price },
      true,
      keyHeader(args.idempotencyKey),
    );
    return reference(data);
  },

  // ======================= NEW (unconfirmed contracts) =======================

  /** Airtime for a number outside Nigeria. `country` is an ISO code such as "GH". */
  async buyAirtimeForeign(args: { country: string; phone: string; amount: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyAirtimeForeign,
      { country: args.country, phone: args.phone, amount: args.amount },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** Recharge-card PINs (returned in the response). */
  async buyAirtimePin(args: { network: string; amount: number; quantity: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyAirtimePin,
      { network: args.network, amount: args.amount, quantity: args.quantity },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** Data for a number outside Nigeria; planCode from the plans catalog. */
  async buyDataForeign(args: { country: string; phone: string; planCode: string; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyDataForeign,
      { country: args.country, number: args.phone, coded: args.planCode },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** Data vouchers (PINs returned in the response); path already existed in the app config. */
  async buyDataPin(args: { network: string; planCode: string; quantity: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyDataPin,
      { network: args.network, coded: args.planCode, quantity: args.quantity },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** Fund a betting account; `provider` is a slug such as "bet9ja". */
  async bettingTopup(args: { provider: string; customerId: string; amount: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.bettingTopup,
      { provider: args.provider, customer_id: args.customerId, amount: args.amount },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** Exam result-checker PINs; `exam` is "waec" | "neco" | "nabteb". */
  async buyResultChecker(args: { exam: string; quantity: number; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.resultChecker,
      { exam: args.exam, quantity: args.quantity },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },

  /** JAMB PIN; `type` is "utme" | "de", profileCode is the candidate's 10-digit profile code. */
  async buyJamb(args: { type: string; profileCode: string; phone: string; idempotencyKey?: string }) {
    const data = await ApiClient.post(
      ApiEndpoints.buyJamb,
      { type: args.type, profile_code: args.profileCode, phone: args.phone },
      true,
      keyHeader(args.idempotencyKey),
    );
    return (data ?? {}) as Record<string, unknown>;
  },
};