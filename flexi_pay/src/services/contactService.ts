import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiClient } from '@/core/network/apiClient';

export const ContactService = {
  async sendMessage(args: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await ApiClient.post(
      ApiEndpoints.contact,
      {
        name: args.name,
        email: args.email,
        ...(args.phone ? { phone: args.phone } : {}),
        subject: args.subject,
        message: args.message,
      },
      false,
    );
  },
};
