// ==================== ERROR ====================

export class ApiError extends Error {
  readonly error?: string;

  constructor(message: string, error?: string) {
    super(message);
    this.name = 'ApiError';
    this.error = error;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromJson(json: Record<string, unknown>): ApiError {
    const message =
      typeof json.message === 'string'
        ? json.message
        : typeof json.error === 'string'
          ? json.error
          : 'Unknown error';
    return new ApiError(message, typeof json.error === 'string' ? json.error : undefined);
  }
}

// ==================== AUTH ====================

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface RegisterResponse {
  token: string;
  usernameSuggestions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: Record<string, unknown>;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileCompletionInput {
  firstName: string;
  lastName: string;
  address: string;
  gender: string;
  email: string;
  phone: string;
  dob: Date;
}

// ==================== TRANSFER ====================

export interface Bank {
  name: string;
  code: string;
}

export interface VerifiedAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

export const parseBank = (json: Record<string, unknown>): Bank => ({
  name: String(json.name ?? ''),
  code: String(json.code ?? ''),
});

export const parseVerifiedAccount = (json: Record<string, unknown>): VerifiedAccount => ({
  accountName: String(json.account_name ?? ''),
  accountNumber: String(json.account_number ?? ''),
  bankName: String(json.bank_name ?? ''),
  bankCode: String(json.bank_code ?? ''),
});

// ==================== PLANS ====================

/** One entry from `GET /api/plans`. */
export interface PlanService {
  key: string;
  label: string;
  type: string;
  count: number;
}

/** A single plan from `GET /api/plans/:service` (data/TV) or the electricity disco list. */
export interface Plan {
  id: number;
  coded: string;
  name: string;
  price?: number;
  network?: string;
  category?: string;
  server?: string;
  status: number;
}

export const parsePlanService = (json: Record<string, unknown>): PlanService => ({
  key: String(json.key),
  label: String(json.label),
  type: String(json.type),
  count: typeof json.count === 'number' ? json.count : 0,
});

export const parsePlan = (json: Record<string, unknown>): Plan => ({
  id: Number(json.id),
  // Electricity entries use `code` instead of `coded` and have no price.
  coded: String(json.coded ?? json.code),
  name: String(json.name),
  price: typeof json.price === 'number' ? json.price : undefined,
  network: typeof json.network === 'string' ? json.network : undefined,
  category: typeof json.category === 'string' ? json.category : undefined,
  server: typeof json.server === 'string' ? json.server : undefined,
  status: typeof json.status === 'number' ? json.status : 1,
});

// ==================== WALLET ====================

/** A single wallet.transactions entry (dashboard, customer and wallet-balance share this shape). */
export interface WalletTransaction {
  type: string; // 'credit' | 'debit' | 'balance_check'
  amount: number;
  provider?: string;
  reference?: string;
  status: string; // 'pending' | 'success' | 'failed'
  details?: Record<string, unknown>;
  timestamp: Date;
}

export const isCredit = (t: WalletTransaction) => t.type === 'credit';

/** Best-effort "what was this" key from `details.type` (transfer, airtime, data, tv_subscription...). */
export const txCategory = (t: WalletTransaction): string =>
  (typeof t.details?.type === 'string' ? t.details.type : undefined) ?? t.provider ?? t.type;

export const parseTransaction = (json: Record<string, unknown>): WalletTransaction => {
  const ts = new Date(String(json.timestamp ?? ''));
  return {
    type: typeof json.type === 'string' ? json.type : 'debit',
    amount: typeof json.amount === 'number' ? json.amount : 0,
    provider: typeof json.provider === 'string' ? json.provider : undefined,
    reference: typeof json.reference === 'string' ? json.reference : undefined,
    status: typeof json.status === 'string' ? json.status : 'pending',
    details:
      json.details && typeof json.details === 'object'
        ? (json.details as Record<string, unknown>)
        : undefined,
    timestamp: Number.isNaN(ts.getTime()) ? new Date() : ts,
  };
};

export interface VirtualAccountDetails {
  accountNumber: string;
  accountName: string;
  bank: string;
}

export const parseVirtualAccount = (json: Record<string, unknown>): VirtualAccountDetails => ({
  accountNumber: String(json.account_number ?? ''),
  accountName: String(json.account_name ?? ''),
  bank: String(json.bank ?? json.bank_name ?? ''),
});

/** Raw `/auth/customer` -> paylonyVirtualAccountDetails payload. */
export interface PaylonyAccount {
  account_number?: string;
  account_name?: string;
  bank_name?: string;
  [key: string]: unknown;
}

export interface DashboardData {
  fullName: string;
  walletBalance: number;
  totalBalance: number;
  income: number;
  expenses: number;
  virtualAccount?: VirtualAccountDetails;
  transactions: WalletTransaction[];
}

const num = (v: unknown) => (typeof v === 'number' ? v : 0);

export const parseDashboard = (json: Record<string, any>): DashboardData => {
  const data = json.data as Record<string, any>;
  const user = data.user as Record<string, any>;
  const wallet = user.wallet as Record<string, any> | undefined;
  const vad = user.virtualAccountDetails as Record<string, unknown> | undefined;

  const transactions = ((wallet?.transactions as unknown[] | undefined) ?? [])
    .map((e) => parseTransaction(e as Record<string, unknown>))
    // ₦0 entries are balance checks / failed-before-charge placeholders the backend
    // logs internally, not real transactions, so hide them from the user.
    .filter((t) => t.amount > 0)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return {
    fullName: typeof user.fullName === 'string' ? user.fullName : '',
    walletBalance: num(wallet?.balance),
    totalBalance: num(data.totalBalance),
    income: num(data.income),
    expenses: num(data.expenses),
    virtualAccount: vad ? parseVirtualAccount(vad) : undefined,
    transactions,
  };
};
