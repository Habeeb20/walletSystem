import { type MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';

import { isCredit, txCategory, type WalletTransaction } from '@/models/types';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

/** Icon for the compact recent-transactions list on Home. */
export function homeTxIcon(tx: WalletTransaction): IconName {
  switch (txCategory(tx)) {
    case 'airtime':
      return 'phone-android';
    case 'data':
    case 'data_pin':
      return 'wifi';
    case 'electricty-bill':
      return 'bolt';
    case 'tv_subscription':
      return 'tv';
    case 'transfer':
      return 'send';
    default:
      return isCredit(tx) ? 'arrow-downward' : 'arrow-upward';
  }
}

/** Icon for the History list (transfers show direction instead of a generic send icon). */
export function historyTxIcon(tx: WalletTransaction): IconName {
  switch (txCategory(tx)) {
    case 'airtime':
      return 'phone-android';
    case 'data':
    case 'data_pin':
      return 'wifi';
    case 'electricty-bill':
      return 'bolt';
    case 'tv_subscription':
      return 'tv';
    default:
      return isCredit(tx) ? 'arrow-downward' : 'arrow-upward';
  }
}

export function historyTxTitle(tx: WalletTransaction): string {
  switch (txCategory(tx)) {
    case 'airtime':
      return 'Airtime Purchase';
    case 'data':
    case 'data_pin':
      return 'Data Purchase';
    case 'electricty-bill':
      return 'Electricity Bill';
    case 'tv_subscription':
      return 'Cable TV Subscription';
    case 'transfer':
      return 'Bank Transfer';
    default:
      return isCredit(tx) ? 'Wallet Funding' : 'Payment';
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'success':
      return 'Successful';
    case 'failed':
      return 'Failed';
    default:
      return 'Pending';
  }
}
