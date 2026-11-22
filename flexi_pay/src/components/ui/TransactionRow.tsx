import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { formatSql, naira } from '@/lib/format';
import { homeTxIcon, statusLabel } from '@/lib/transactions';
import { isCredit, txCategory, type WalletTransaction } from '@/models/types';
import { colors } from '@/theme/colors';

/** Compact recent-transaction row for the Home screen. */
export function TransactionRow({ transaction: tx }: { transaction: WalletTransaction }) {
  const credit = isCredit(tx);
  const tint = credit ? colors.success : colors.danger;

  return (
    <View className="mx-4 mb-2 flex-row items-center rounded-xl border border-line bg-card p-3">
      <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${tint}1A` }}>
        <MaterialIcons name={homeTxIcon(tx)} size={20} color={tint} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-sm font-semibold capitalize text-ink" numberOfLines={1}>
          {txCategory(tx).replace(/_/g, ' ').replace(/-/g, ' ')}
        </Text>
        <Text className="mt-0.5 text-xs text-ink-secondary">{formatSql(tx.timestamp)}</Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-bold" style={{ color: tint }}>
          {credit ? '+' : '-'}
          {naira(tx.amount)}
        </Text>
        <Text className="mt-0.5 text-[10px] text-ink-secondary">{statusLabel(tx.status)}</Text>
      </View>
    </View>
  );
}
