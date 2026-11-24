import { View } from 'react-native';

import { TransactionHistory } from '@/components/TransactionHistory';
import { ScreenHeader } from '@/components/ui/Screen';

/** Standalone (pushed) transaction history, opened from Home. */
export default function TransactionsScreen() {
  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader title="Transaction History" />
      <TransactionHistory />
    </View>
  );
}
