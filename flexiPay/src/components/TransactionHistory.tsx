import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView, LoadingView } from '@/components/ui/StateViews';
import { toast } from '@/components/ui/Toast';
import { dashboardStore } from '@/lib/dashboardStore';
import { formatDateTime, naira, relativeTime } from '@/lib/format';
import { historyTxIcon, historyTxTitle } from '@/lib/transactions';
import { isCredit, txCategory, type WalletTransaction } from '@/models/types';
import { colors } from '@/theme/colors';

const FILTERS = ['All', 'Sent', 'Received', 'Airtime', 'Data', 'Electricity', 'Cable TV'] as const;
type Filter = (typeof FILTERS)[number];

function applyFilter(list: WalletTransaction[], filter: Filter) {
  switch (filter) {
    case 'Sent':
      return list.filter((t) => !isCredit(t));
    case 'Received':
      return list.filter(isCredit);
    case 'Airtime':
      return list.filter((t) => txCategory(t) === 'airtime');
    case 'Data':
      return list.filter((t) => ['data', 'data_pin'].includes(txCategory(t)));
    case 'Electricity':
      return list.filter((t) => txCategory(t) === 'electricty-bill');
    case 'Cable TV':
      return list.filter((t) => txCategory(t) === 'tv_subscription');
    default:
      return list;
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2.5">
      <Text className="text-sm text-ink-secondary">{label}</Text>
      <Text className="ml-4 flex-1 text-right text-sm font-medium text-ink">{value}</Text>
    </View>
  );
}

/** Filterable transaction list with a details sheet. Used as a tab and as a standalone screen. */
export function TransactionHistory() {
  const insets = useSafeAreaInsets();
  const { data, loading, refreshing, error } = dashboardStore.useDashboard();
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState<WalletTransaction | null>(null);

  if (loading && !data) return <LoadingView />;
  if (error && !data) return <ErrorView message={error} onRetry={() => dashboardStore.load()} />;

  const items = applyFilter(data?.transactions ?? [], filter);

  return (
    <View className="flex-1 bg-canvas">
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 8 }}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 ${
                filter === f ? 'border-primary-500 bg-primary-500' : 'border-line bg-white'
              }`}
            >
              <Text className={`text-sm font-medium ${filter === f ? 'text-white' : 'text-ink-secondary'}`}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(t, i) => `${t.reference ?? 'tx'}-${i}`}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => dashboardStore.load('silent')} tintColor={colors.primary500} />
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="receipt-long" size={64} color={colors.neutral300} />
            <Text className="mt-3 text-base font-semibold text-ink-secondary">No transactions found</Text>
            <Text className="mt-1 text-sm text-ink-muted">Your transaction history will appear here</Text>
          </View>
        }
        renderItem={({ item: tx }) => {
          const credit = isCredit(tx);
          const tint = credit ? colors.success : colors.danger;
          return (
            <Pressable
              onPress={() => setSelected(tx)}
              className="flex-row items-center rounded-xl border border-line bg-card p-3 active:opacity-80"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${tint}1A` }}>
                <MaterialIcons name={historyTxIcon(tx)} size={22} color={tint} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-ink">{historyTxTitle(tx)}</Text>
                <Text className="mt-0.5 text-xs text-ink-secondary">{relativeTime(tx.timestamp)}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold" style={{ color: tint }}>
                  {credit ? '+' : '-'}
                  {naira(tx.amount)}
                </Text>
                {tx.status === 'pending' ? (
                  <Text className="mt-0.5 text-[10px] font-semibold text-warning">Pending</Text>
                ) : null}
              </View>
            </Pressable>
          );
        }}
      />

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setSelected(null)} />
        {selected ? (
          <View className="rounded-t-3xl bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
            <View className="items-center">
              <View className="h-1 w-10 rounded-full bg-neutral-300" />
            </View>
            <Text className="mt-4 text-center text-xl font-bold text-ink">{historyTxTitle(selected)}</Text>
            <Text
              className="my-3 text-center text-3xl font-bold"
              style={{ color: isCredit(selected) ? colors.success : colors.danger }}
            >
              {isCredit(selected) ? '+' : '-'}
              {naira(selected.amount)}
            </Text>
            {selected.reference ? <DetailRow label="Reference" value={selected.reference} /> : null}
            {selected.provider ? <DetailRow label="Provider" value={selected.provider} /> : null}
            <DetailRow label="Date" value={formatDateTime(selected.timestamp)} />
            <DetailRow label="Status" value={selected.status.toUpperCase()} />
            {selected.reference ? (
              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(selected.reference!);
                  toast.info('Reference copied');
                }}
                className="mt-4 h-12 flex-row items-center justify-center rounded-xl border border-primary-500"
              >
                <MaterialIcons name="content-copy" size={18} color={colors.primary500} />
                <Text className="ml-2 font-semibold text-primary-600">Copy Reference</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Modal>
    </View>
  );
}
