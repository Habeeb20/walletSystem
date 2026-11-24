import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { ErrorView, LoadingView } from '@/components/ui/StateViews';
import { toast } from '@/components/ui/Toast';
import { dashboardStore } from '@/lib/dashboardStore';
import { naira } from '@/lib/format';
import { colors } from '@/theme/colors';

export default function WalletScreen() {
  const { data, paylonyAccount, loading, refreshing, error } = dashboardStore.useDashboard();

  if (loading && !data) return <LoadingView />;
  if (error && !data) return <ErrorView message={error} onRetry={() => dashboardStore.load()} />;

  const accountNumber = paylonyAccount?.account_number ?? '';

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => dashboardStore.load('silent')} tintColor={colors.primary500} />
      }
    >
      <LinearGradient
        colors={[colors.primary600, colors.primary700]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, padding: 24 }}
      >
        <Text className="text-sm text-white/70">Wallet Balance</Text>
        <Text className="mt-2 text-4xl font-bold text-white">{naira(data?.walletBalance ?? 0)}</Text>
        <Pressable
          onPress={() => router.push('/fund-wallet')}
          className="mt-5 h-12 flex-row items-center justify-center rounded-xl bg-white active:opacity-90"
        >
          <MaterialIcons name="add" size={20} color={colors.primary600} />
          <Text className="ml-1 font-semibold text-primary-600">Fund Wallet</Text>
        </Pressable>
      </LinearGradient>

      {paylonyAccount ? (
        <View className="mt-4 rounded-2xl border border-line bg-card p-4">
          <Text className="text-base font-semibold text-ink">Bank Transfer Account</Text>
          <View className="mt-3 flex-row items-center">
            <Text className="flex-1 text-2xl font-bold tracking-widest text-ink">{accountNumber}</Text>
            <Pressable
              hitSlop={10}
              onPress={async () => {
                await Clipboard.setStringAsync(accountNumber);
                toast.info('Account number copied');
              }}
            >
              <MaterialIcons name="content-copy" size={20} color={colors.primary500} />
            </Pressable>
          </View>
          <Text className="mt-2 text-ink-secondary">{paylonyAccount.bank_name ?? ''}</Text>
          <Text className="text-ink-secondary">{paylonyAccount.account_name ?? ''}</Text>
          <Text className="mt-3 text-xs text-ink-muted">Transfer to this account to fund your wallet directly.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
