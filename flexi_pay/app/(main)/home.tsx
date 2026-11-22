// import { MaterialIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { router } from 'expo-router';
// import { type ComponentProps, useState } from 'react';
// import { Modal, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { ErrorView, LoadingView } from '@/components/ui/StateViews';
// import { TransactionRow } from '@/components/ui/TransactionRow';
// import { dashboardStore } from '@/lib/dashboardStore';
// import { naira } from '@/lib/format';
// import { colors } from '@/theme/colors';

// type IconName = ComponentProps<typeof MaterialIcons>['name'];

// const QUICK_ACTIONS: { label: string; icon: IconName; href: string }[] = [
//   { label: 'Fund Wallet', icon: 'add-circle-outline', href: '/fund-wallet' },
//   { label: 'Send Money', icon: 'send', href: '/transfer' },
//   { label: 'Buy Airtime', icon: 'phone-android', href: '/airtime' },
//   { label: 'Electricity', icon: 'lightbulb-outline', href: '/electricity' },
//   { label: 'Data Bundle', icon: 'wifi', href: '/data' },
//   { label: 'Cable TV', icon: 'tv', href: '/tv' },
// ];

// function greeting() {
//   const hour = new Date().getHours();
//   if (hour < 12) return 'Good morning';
//   if (hour < 17) return 'Good afternoon';
//   return 'Good evening';
// }

// function StatTile({ icon, label, amount, color }: { icon: IconName; label: string; amount: number; color: string }) {
//   return (
//     <View className="flex-1 flex-row items-center rounded-xl border border-line bg-card p-3">
//       <View className="rounded-lg p-2" style={{ backgroundColor: `${color}1A` }}>
//         <MaterialIcons name={icon} size={16} color={color} />
//       </View>
//       <View className="ml-3">
//         <Text className="text-[10px] text-ink-secondary">{label}</Text>
//         <Text className="text-sm font-bold text-ink">{naira(amount, 0)}</Text>
//       </View>
//     </View>
//   );
// }

// function ActionButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
//   return (
//     <Pressable onPress={onPress} className="flex-1 items-center rounded-xl border border-line bg-card py-3 active:opacity-80">
//       <View className="h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
//         <MaterialIcons name={icon} size={24} color="#fff" />
//       </View>
//       <Text className="mt-2 text-xs font-semibold text-ink">{label}</Text>
//     </Pressable>
//   );
// }

// function BillTile({ icon, label, href }: { icon: IconName; label: string; href: string }) {
//   return (
//     <Pressable
//       onPress={() => router.push(href as never)}
//       className="w-[23%] items-center rounded-xl border border-line bg-card py-3 active:opacity-80"
//     >
//       <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary-600/10">
//         <MaterialIcons name={icon} size={24} color={colors.primary600} />
//       </View>
//       <Text className="mt-2 text-[11px] font-medium text-ink" numberOfLines={1}>
//         {label}
//       </Text>
//     </Pressable>
//   );
// }

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();
//   const { data, paylonyAccount, loading, refreshing, error } = dashboardStore.useDashboard();
//   const [showBalance, setShowBalance] = useState(true);
//   const [sheetOpen, setSheetOpen] = useState(false);

//   if (loading && !data) return <LoadingView />;
//   if (error && !data) return <ErrorView message={error} onRetry={() => dashboardStore.load()} />;

//   const firstName = data?.fullName.trim().split(' ')[0] ?? '';
//   const recent = data?.transactions.slice(0, 4) ?? [];

//   return (
//     <View className="flex-1 bg-canvas">
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 96 }}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={() => dashboardStore.load('silent')} tintColor={colors.primary500} />
//         }
//       >
//         {/* Greeting */}
//         <View className="flex-row items-center px-4 pb-2 pt-3">
//           <View className="h-11 w-11 items-center justify-center rounded-full bg-primary-100">
//             <Text className="text-base font-bold text-primary-700">{firstName ? firstName[0].toUpperCase() : '👋'}</Text>
//           </View>
//           <View className="ml-3 flex-1">
//             <Text className="text-xs text-ink-secondary">{greeting()}</Text>
//             <Text className="text-xl font-bold text-ink">{firstName || 'Welcome back'}</Text>
//           </View>
//         </View>

//         {/* Balance card */}
//         <View className="px-4">
//           <LinearGradient
//             colors={[colors.primary600, colors.primary700]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={{
//               borderRadius: 16,
//               padding: 24,
//               shadowColor: colors.primary500,
//               shadowOpacity: 0.3,
//               shadowRadius: 20,
//               shadowOffset: { width: 0, height: 10 },
//               elevation: 8,
//             }}
//           >
//             <View className="flex-row items-center justify-between">
//               <Text className="text-sm text-white/90">Wallet Balance</Text>
//               <Pressable onPress={() => setShowBalance((v) => !v)} className="rounded-md bg-white/20 p-2">
//                 <MaterialIcons name={showBalance ? 'visibility' : 'visibility-off'} size={16} color="#fff" />
//               </Pressable>
//             </View>
//             <Text className="mt-3 text-4xl font-bold text-white">
//               {showBalance ? naira(data?.walletBalance ?? 0) : '₦****.**'}
//             </Text>
//             {paylonyAccount ? (
//               <>
//                 <View className="my-4 h-px bg-white/20" />
//                 <View className="flex-row items-center">
//                   <Text className="flex-1 text-xs text-white/85" numberOfLines={1}>
//                     Account · {paylonyAccount.account_number ?? ''} · {paylonyAccount.bank_name ?? ''}
//                   </Text>
//                   <View className="ml-2 rounded-2xl bg-white/20 px-3 py-1">
//                     <Text className="text-[10px] font-semibold text-white">Verified</Text>
//                   </View>
//                 </View>
//               </>
//             ) : null}
//           </LinearGradient>

//           <View className="mt-3 flex-row gap-3">
//             <StatTile icon="arrow-downward" label="Income" amount={data?.income ?? 0} color={colors.success} />
//             <StatTile icon="arrow-upward" label="Expenses" amount={data?.expenses ?? 0} color={colors.danger} />
//           </View>
//         </View>

//         {/* Quick actions */}
//         <View className="flex-row gap-3 p-4">
//           <ActionButton icon="add" label="Fund" onPress={() => router.push('/fund-wallet')} />
//           <ActionButton icon="send" label="Transfer" onPress={() => router.push('/transfer')} />
//           <ActionButton icon="history" label="History" onPress={() => router.push('/transactions')} />
//         </View>

//         {/* Bills */}
//         <Text className="px-4 text-xl font-bold text-ink">Bills & Services</Text>
//         <View className="mt-3 flex-row justify-between px-4">
//           <BillTile icon="phone-android" label="Airtime" href="/airtime" />
//           <BillTile icon="wifi" label="Data" href="/data" />
//           <BillTile icon="bolt" label="Electricity" href="/electricity" />
//           <BillTile icon="tv" label="Cable TV" href="/tv" />
//         </View>

//         {/* Recent transactions */}
//         <View className="flex-row items-center justify-between p-4">
//           <Text className="text-xl font-bold text-ink">Recent Transactions</Text>
//           <Pressable onPress={() => router.push('/transactions')} hitSlop={8}>
//             <Text className="text-sm text-primary-600">View all</Text>
//           </Pressable>
//         </View>
//         {recent.length === 0 ? (
//           <Text className="px-4 text-ink-secondary">No transactions yet</Text>
//         ) : (
//           recent.map((tx, i) => <TransactionRow key={`${tx.reference ?? 'tx'}-${i}`} transaction={tx} />)
//         )}
//       </ScrollView>

//       {/* Quick-actions FAB (home only) */}
//       <Pressable
//         onPress={() => setSheetOpen(true)}
//         className="absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 shadow-lg active:opacity-90"
//       >
//         <MaterialIcons name="add" size={28} color="#fff" />
//       </Pressable>

//       <Modal visible={sheetOpen} transparent animationType="slide" onRequestClose={() => setSheetOpen(false)}>
//         <Pressable className="flex-1 bg-black/40" onPress={() => setSheetOpen(false)} />
//         <View className="rounded-t-3xl bg-white px-4 pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
//           <View className="items-center">
//             <View className="h-1 w-10 rounded-full bg-neutral-300" />
//           </View>
//           <Text className="my-4 text-center text-xl font-semibold text-ink">Quick Actions</Text>
//           <View className="flex-row flex-wrap justify-between gap-y-3">
//             {QUICK_ACTIONS.map((a) => (
//               <Pressable
//                 key={a.label}
//                 onPress={() => {
//                   setSheetOpen(false);
//                   router.push(a.href as never);
//                 }}
//                 className="aspect-square w-[31%] items-center justify-center rounded-lg border border-line bg-card p-3 active:opacity-80"
//               >
//                 <MaterialIcons name={a.icon} size={24} color={colors.primary500} />
//                 <Text className="mt-1 text-center text-xs font-medium text-ink">{a.label}</Text>
//               </Pressable>
//             ))}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }




import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ComponentProps, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { LastUpdated } from '@/components/LastUpdated';
import { ErrorView, LoadingView } from '@/components/ui/StateViews';
import { toast } from '@/components/ui/Toast';
import { dashboardStore } from '@/lib/dashboardStore';
import { relativeTime } from '@/lib/format';
import { historyTxTitle, homeTxIcon } from '@/lib/transactions';
import { isCredit, type WalletTransaction } from '@/models/types';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

// ---------- helpers ----------

function splitMoney(amount: number) {
  const [whole, decimals] = Math.abs(amount).toFixed(2).split('.');
  return { whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, ','), decimals };
}
const money0 = (n: number) => `₦${splitMoney(n).whole}`;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const SERVICES: { label: string; icon: IconName; href: string; color: string }[] = [
  { label: 'Send', icon: 'send', href: '/transfer', color: '#10B981' },
  { label: 'Airtime', icon: 'phone-android', href: '/airtime', color: '#3B82F6' },
  { label: 'Data', icon: 'wifi', href: '/data', color: '#8B5CF6' },
  { label: 'Electricity', icon: 'bolt', href: '/electricity', color: '#F59E0B' },
  { label: 'Cable TV', icon: 'tv', href: '/tv', color: '#EC4899' },
  { label: 'Fund', icon: 'account-balance-wallet', href: '/fund-wallet', color: '#14B8A6' },
  { label: 'History', icon: 'history', href: '/transactions', color: '#6366F1' },
  { label: 'Support', icon: 'support-agent', href: '/support', color: '#64748B' },
];

// ---------- small components ----------

function HeroButton({ icon, label, onPress, solid }: { icon: IconName; label: string; onPress: () => void; solid?: boolean }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      className={`h-12 flex-1 flex-row items-center justify-center rounded-2xl active:opacity-80 ${
        solid ? 'bg-white' : 'bg-white/20'
      }`}
    >
      <MaterialIcons name={icon} size={20} color={solid ? colors.primary700 : '#fff'} />
      <Text className={`ml-2 text-[15px] font-semibold ${solid ? 'text-primary-700' : 'text-white'}`}>{label}</Text>
    </Pressable>
  );
}

function StatHalf({ icon, label, amount, tint }: { icon: IconName; label: string; amount: number; tint: string }) {
  return (
    <View className="flex-1 flex-row items-center">
      <View className="h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${tint}1A` }}>
        <MaterialIcons name={icon} size={20} color={tint} />
      </View>
      <View className="ml-3">
        <Text className="text-xs text-ink-secondary">{label}</Text>
        <Text className="mt-0.5 text-base font-bold text-ink">{money0(amount)}</Text>
      </View>
    </View>
  );
}

function ServiceTile({ label, icon, href, color }: (typeof SERVICES)[number]) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        router.push(href as never);
      }}
      className="w-1/4 items-center py-2 active:opacity-60"
    >
      <View className="h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}1F` }}>
        <MaterialIcons name={icon} size={26} color={color} />
      </View>
      <Text className="mt-2 text-xs font-medium text-ink" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function ActivityRow({ tx, last }: { tx: WalletTransaction; last: boolean }) {
  const credit = isCredit(tx);
  const pending = tx.status === 'pending';
  const failed = tx.status === 'failed';
  const { whole, decimals } = splitMoney(tx.amount);

  return (
    <View className={`flex-row items-center px-4 py-3.5 ${last ? '' : 'border-b border-line-light'}`}>
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: credit ? `${colors.success}1A` : colors.canvas }}
      >
        <MaterialIcons name={homeTxIcon(tx)} size={20} color={credit ? colors.success : colors.inkSecondary} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-[15px] font-semibold text-ink" numberOfLines={1}>
          {historyTxTitle(tx)}
        </Text>
        <Text className="mt-0.5 text-xs text-ink-secondary">{relativeTime(tx.timestamp)}</Text>
      </View>

      <View className="items-end">
        <Text className={`text-[15px] font-bold ${credit ? 'text-success' : 'text-ink'}`}>
          {credit ? '+' : '-'}₦{whole}.{decimals}
        </Text>
        {pending || failed ? (
          <View
            className="mt-1 rounded-full px-2 py-0.5"
            style={{ backgroundColor: `${pending ? colors.warning : colors.danger}1A` }}
          >
            <Text className="text-[10px] font-semibold" style={{ color: pending ? colors.warning : colors.danger }}>
              {pending ? 'Pending' : 'Failed'}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// ---------- screen ----------

export default function HomeScreen() {
  const { data, paylonyAccount, loading, refreshing, error } = dashboardStore.useDashboard();
  const [showBalance, setShowBalance] = useState(true);

  if (loading && !data) return <LoadingView />;
  if (error && !data) return <ErrorView message={error} onRetry={() => dashboardStore.load()} />;

  const firstName = data?.fullName.trim().split(' ')[0] ?? '';
  const recent = data?.transactions.slice(0, 5) ?? [];
  const balance = splitMoney(data?.walletBalance ?? 0);
  const accountNumber = paylonyAccount?.account_number ?? '';

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => dashboardStore.load('silent')} tintColor={colors.primary500} />
      }
    >
      {/* Greeting */}
      <View className="flex-row items-center px-5 pb-3 pt-4">
        <LinearGradient
          colors={['#34D399', colors.primary600]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text className="text-lg font-bold text-white">{firstName ? firstName[0].toUpperCase() : 'F'}</Text>
        </LinearGradient>
        <View className="ml-3 flex-1">
          <Text className="text-[13px] text-ink-secondary">{greeting()} 👋</Text>
          <Text className="text-xl font-bold text-ink" numberOfLines={1}>
            {firstName || 'Welcome back'}
          </Text>
        </View>
      </View>

      <LastUpdated />

      {/* Balance hero */}
      <View className="px-4">
        <LinearGradient
          colors={['#064E3B', '#047857', '#10B981']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 28,
            padding: 22,
            overflow: 'hidden',
            shadowColor: '#047857',
            shadowOpacity: 0.35,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 10,
          }}
        >
          {/* decorative circles */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', right: -50, top: -50, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)' }}
          />
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: -40, bottom: -60, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.06)' }}
          />

          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-white/80">Total balance</Text>
            <Pressable
              onPress={() => setShowBalance((v) => !v)}
              hitSlop={10}
              className="h-8 w-8 items-center justify-center rounded-full bg-white/15"
            >
              <MaterialIcons name={showBalance ? 'visibility' : 'visibility-off'} size={16} color="#fff" />
            </Pressable>
          </View>

          <Text className="mt-5 text-[33px] font-bold tracking-tight text-white">
            {showBalance ? (
              <>
                ₦{balance.whole}
                <Text className="text-xl font-semibold text-white/70">.{balance.decimals}</Text>
              </>
            ) : (
              '₦ ••••••'
            )}
          </Text>

          {paylonyAccount ? (
            <Pressable
              onPress={async () => {
                await Clipboard.setStringAsync(accountNumber);
                toast.info('Account number copied');
              }}
              className="mt-4 flex-row items-center self-start rounded-full bg-white/15 px-3 py-1.5 active:opacity-80"
            >
              <MaterialIcons name="verified" size={14} color="#A7F3D0" />
              <Text className="ml-1.5 text-xs font-medium text-white" numberOfLines={1}>
                {paylonyAccount.bank_name ?? 'Account'} · {accountNumber}
              </Text>
              <MaterialIcons name="content-copy" size={12} color="rgba(255,255,255,0.8)" style={{ marginLeft: 8 }} />
            </Pressable>
          ) : null}

          <View className="mt-5 flex-row gap-3">
            <HeroButton solid icon="add" label="Add money" onPress={() => router.push('/fund-wallet')} />
            <HeroButton icon="send" label="Send" onPress={() => router.push('/transfer')} />
          </View>
        </LinearGradient>

        {/* Income / expenses */}
        <View className="mt-4 flex-row items-center rounded-3xl bg-white p-4 shadow-sm">
          <StatHalf icon="south-west" label="Income" amount={data?.income ?? 0} tint={colors.success} />
          <View className="mx-3 h-10 w-px bg-line" />
          <StatHalf icon="north-east" label="Expenses" amount={data?.expenses ?? 0} tint={colors.danger} />
        </View>
      </View>

      {/* Services */}
      <Text className="mb-1 mt-7 px-5 text-lg font-bold text-ink">Quick services</Text>
      <View className="mx-4 mt-2 flex-row flex-wrap rounded-3xl bg-white px-1 py-2 shadow-sm">
        {SERVICES.map((s) => (
          <ServiceTile key={s.label} {...s} />
        ))}
      </View>

      {/* Recent activity */}
      <View className="mb-3 mt-7 flex-row items-center justify-between px-5">
        <Text className="text-lg font-bold text-ink">Recent activity</Text>
        <Pressable onPress={() => router.push('/transactions')} hitSlop={8}>
          <Text className="text-sm font-semibold text-primary-600">See all</Text>
        </Pressable>
      </View>

      <View className="mx-4 overflow-hidden rounded-3xl bg-white shadow-sm">
        {recent.length === 0 ? (
          <View className="items-center px-6 py-10">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-50">
              <MaterialIcons name="receipt-long" size={26} color={colors.primary500} />
            </View>
            <Text className="mt-3 text-base font-semibold text-ink">No transactions yet</Text>
            <Text className="mt-1 text-center text-sm text-ink-secondary">
              Add money to your wallet to get started.
            </Text>
          </View>
        ) : (
          recent.map((tx, i) => (
            <ActivityRow key={`${tx.reference ?? 'tx'}-${i}`} tx={tx} last={i === recent.length - 1} />
          ))
        )}
      </View>
    </ScrollView>
  );
}