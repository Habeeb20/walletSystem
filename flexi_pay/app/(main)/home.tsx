import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ComponentProps, useState } from 'react';
import { Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorView, LoadingView } from '@/components/ui/StateViews';
import { TransactionRow } from '@/components/ui/TransactionRow';
import { dashboardStore } from '@/lib/dashboardStore';
import { naira } from '@/lib/format';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const QUICK_ACTIONS: { label: string; icon: IconName; href: string }[] = [
  { label: 'Fund Wallet', icon: 'add-circle-outline', href: '/fund-wallet' },
  { label: 'Send Money', icon: 'send', href: '/transfer' },
  { label: 'Buy Airtime', icon: 'phone-android', href: '/airtime' },
  { label: 'Electricity', icon: 'lightbulb-outline', href: '/electricity' },
  { label: 'Data Bundle', icon: 'wifi', href: '/data' },
  { label: 'Cable TV', icon: 'tv', href: '/tv' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatTile({ icon, label, amount, color }: { icon: IconName; label: string; amount: number; color: string }) {
  return (
    <View className="flex-1 flex-row items-center rounded-xl border border-line bg-card p-3">
      <View className="rounded-lg p-2" style={{ backgroundColor: `${color}1A` }}>
        <MaterialIcons name={icon} size={16} color={color} />
      </View>
      <View className="ml-3">
        <Text className="text-[10px] text-ink-secondary">{label}</Text>
        <Text className="text-sm font-bold text-ink">{naira(amount, 0)}</Text>
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-1 items-center rounded-xl border border-line bg-card py-3 active:opacity-80">
      <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
        <MaterialIcons name={icon} size={24} color="#fff" />
      </View>
      <Text className="mt-2 text-xs font-semibold text-ink">{label}</Text>
    </Pressable>
  );
}

function BillTile({ icon, label, href }: { icon: IconName; label: string; href: string }) {
  return (
    <Pressable
      onPress={() => router.push(href as never)}
      className="w-[23%] items-center rounded-xl border border-line bg-card py-3 active:opacity-80"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-600/10">
        <MaterialIcons name={icon} size={24} color={colors.primary600} />
      </View>
      <Text className="mt-2 text-[11px] font-medium text-ink" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, paylonyAccount, loading, refreshing, error } = dashboardStore.useDashboard();
  const [showBalance, setShowBalance] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (loading && !data) return <LoadingView />;
  if (error && !data) return <ErrorView message={error} onRetry={() => dashboardStore.load()} />;

  const firstName = data?.fullName.trim().split(' ')[0] ?? '';
  const recent = data?.transactions.slice(0, 4) ?? [];

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => dashboardStore.load('silent')} tintColor={colors.primary500} />
        }
      >
        {/* Greeting */}
        <View className="flex-row items-center px-4 pb-2 pt-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-100">
            <Text className="text-base font-bold text-primary-700">{firstName ? firstName[0].toUpperCase() : '👋'}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-xs text-ink-secondary">{greeting()}</Text>
            <Text className="text-xl font-bold text-ink">{firstName || 'Welcome back'}</Text>
          </View>
        </View>

        {/* Balance card */}
        <View className="px-4">
          <LinearGradient
            colors={[colors.primary600, colors.primary700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 24,
              shadowColor: colors.primary500,
              shadowOpacity: 0.3,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-white/90">Wallet Balance</Text>
              <Pressable onPress={() => setShowBalance((v) => !v)} className="rounded-md bg-white/20 p-2">
                <MaterialIcons name={showBalance ? 'visibility' : 'visibility-off'} size={16} color="#fff" />
              </Pressable>
            </View>
            <Text className="mt-3 text-4xl font-bold text-white">
              {showBalance ? naira(data?.walletBalance ?? 0) : '₦****.**'}
            </Text>
            {paylonyAccount ? (
              <>
                <View className="my-4 h-px bg-white/20" />
                <View className="flex-row items-center">
                  <Text className="flex-1 text-xs text-white/85" numberOfLines={1}>
                    Account · {paylonyAccount.account_number ?? ''} · {paylonyAccount.bank_name ?? ''}
                  </Text>
                  <View className="ml-2 rounded-2xl bg-white/20 px-3 py-1">
                    <Text className="text-[10px] font-semibold text-white">Verified</Text>
                  </View>
                </View>
              </>
            ) : null}
          </LinearGradient>

          <View className="mt-3 flex-row gap-3">
            <StatTile icon="arrow-downward" label="Income" amount={data?.income ?? 0} color={colors.success} />
            <StatTile icon="arrow-upward" label="Expenses" amount={data?.expenses ?? 0} color={colors.danger} />
          </View>
        </View>

        {/* Quick actions */}
        <View className="flex-row gap-3 p-4">
          <ActionButton icon="add" label="Fund" onPress={() => router.push('/fund-wallet')} />
          <ActionButton icon="send" label="Transfer" onPress={() => router.push('/transfer')} />
          <ActionButton icon="history" label="History" onPress={() => router.push('/transactions')} />
        </View>

        {/* Bills */}
        <Text className="px-4 text-xl font-bold text-ink">Bills & Services</Text>
        <View className="mt-3 flex-row justify-between px-4">
          <BillTile icon="phone-android" label="Airtime" href="/airtime" />
          <BillTile icon="wifi" label="Data" href="/data" />
          <BillTile icon="bolt" label="Electricity" href="/electricity" />
          <BillTile icon="tv" label="Cable TV" href="/tv" />
        </View>

        {/* Recent transactions */}
        <View className="flex-row items-center justify-between p-4">
          <Text className="text-xl font-bold text-ink">Recent Transactions</Text>
          <Pressable onPress={() => router.push('/transactions')} hitSlop={8}>
            <Text className="text-sm text-primary-600">View all</Text>
          </Pressable>
        </View>
        {recent.length === 0 ? (
          <Text className="px-4 text-ink-secondary">No transactions yet</Text>
        ) : (
          recent.map((tx, i) => <TransactionRow key={`${tx.reference ?? 'tx'}-${i}`} transaction={tx} />)
        )}
      </ScrollView>

      {/* Quick-actions FAB (home only) */}
      <Pressable
        onPress={() => setSheetOpen(true)}
        className="absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-lg active:opacity-90"
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </Pressable>

      <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
        <Pressable className="flex-1 bg-black/40" onPress={() => setSheetOpen(false)} />
        <View className="rounded-t-3xl bg-white px-4 pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="items-center">
            <View className="h-1 w-10 rounded-full bg-neutral-300" />
          </View>
          <Text className="my-4 text-center text-xl font-semibold text-ink">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {QUICK_ACTIONS.map((a) => (
              <Pressable
                key={a.label}
                onPress={() => {
                  setSheetOpen(false);
                  router.push(a.href as never);
                }}
                className="aspect-square w-[31%] items-center justify-center rounded-lg border border-line bg-card p-3 active:opacity-80"
              >
                <MaterialIcons name={a.icon} size={24} color={colors.primary500} />
                <Text className="mt-1 text-center text-xs font-medium text-ink">{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}
