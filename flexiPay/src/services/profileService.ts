import { jwtDecode } from 'jwt-decode';

import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';
import { SecureStorage } from '@/core/security/secureStorage';
import { formatIsoDate } from '@/lib/format';
import { ApiError, type PaylonyAccount, type ProfileCompletionInput } from '@/models/types';

/**
 * Handles the mandatory post-registration profile step: collecting the KYC fields
 * (address/gender/dob) the backend's Paylony dedicated-account creation requires, and checking
 * whether a given user has already completed it.
 */
export const ProfileService = {
  /** Raw `/auth/customer` payload: first_name, last_name, email, phone, wallet, paylonyVirtualAccountDetails. */
  async fetchCustomerDetails(): Promise<Record<string, any>> {
    const data = await ApiClient.get(ApiEndpoints.customer);
    return (data?.data as Record<string, any> | undefined) ?? {};
  },

  /** True once the Paylony dedicated account exists: the only "profile complete" signal the API exposes. */
  async isProfileComplete(): Promise<boolean> {
    const customer = await ProfileService.fetchCustomerDetails();
    const accountNumber = (customer.paylonyVirtualAccountDetails as PaylonyAccount | undefined)
      ?.account_number;
    return typeof accountNumber === 'string' && accountNumber.length > 0;
  },

  async fetchPaylonyAccount(): Promise<PaylonyAccount | null> {
    const customer = await ProfileService.fetchCustomerDetails();
    const paylony = customer.paylonyVirtualAccountDetails as PaylonyAccount | undefined;
    if (!paylony || !paylony.account_number) return null;
    return paylony;
  },

  async completeProfile(input: ProfileCompletionInput): Promise<void> {
    const token = await SecureStorage.getToken();
    if (!token) throw new ApiError('Session expired. Please log in again.');
    const { id } = jwtDecode<{ id: string }>(token);

    await ApiClient.post(ApiEndpoints.createPaylonyVirtualAccount, {
      customerId: id,
      firstname: input.firstName,
      lastname: input.lastName,
      address: input.address,
      gender: input.gender,
      email: input.email,
      phone: input.phone,
      dob: formatIsoDate(input.dob),
    });
  },
};
