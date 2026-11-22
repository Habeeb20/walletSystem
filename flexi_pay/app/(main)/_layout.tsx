import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { type ColorValue, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppDrawer } from '@/components/AppDrawer';
import { dashboardStore } from '@/lib/dashboardStore';
import { useEvent, WALLET_CHANGED } from '@/lib/events';
import { colors } from '@/theme/colors';

type TabIcon = { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap };

function icon({ on, off }: TabIcon) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? on : off} size={24} color={color as string} />
  );
}

function MainHeader({ title, onMenu }: { title: string; onMenu: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="bg-card shadow-sm">
      <View className="h-14 flex-row items-center px-2">
        <Pressable onPress={onMenu} hitSlop={8} className="h-10 w-10 items-center justify-center">
          <MaterialIcons name="menu" size={24} color={colors.ink} />
        </Pressable>
        <Text className="ml-1 text-lg font-semibold text-ink">{title}</Text>
      </View>
    </View>
  );
}

/** Authenticated shell: header + drawer + 5 bottom tabs. */
export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data } = dashboardStore.useDashboard();

  useEffect(() => {
    dashboardStore.load();
  }, []);

  // Any purchase, transfer or funding flow emits this so balances and history stay fresh.
  useEvent(WALLET_CHANGED, () => dashboardStore.load('silent'));

  return (
    <>
      <Tabs
        screenOptions={{
          header: ({ options }) => <MainHeader title={options.title ?? ''} onMenu={() => setDrawerOpen(true)} />,
          tabBarActiveTintColor: colors.primary500,
          tabBarInactiveTintColor: colors.inkSecondary,
          tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 0, elevation: 12 },
          tabBarLabelStyle: { fontSize: 11 },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home', tabBarLabel: 'Home', tabBarIcon: icon({ on: 'home', off: 'home-outline' }) }} />
        <Tabs.Screen name="bills" options={{ title: 'Pay Bills', tabBarLabel: 'Bills', tabBarIcon: icon({ on: 'receipt', off: 'receipt-outline' }) }} />
        <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarLabel: 'Wallet', tabBarIcon: icon({ on: 'wallet', off: 'wallet-outline' }) }} />
        <Tabs.Screen name="history" options={{ title: 'Transaction History', tabBarLabel: 'History', tabBarIcon: icon({ on: 'time', off: 'time-outline' }) }} />
        <Tabs.Screen name="settings" options={{ title: 'Profile', tabBarLabel: 'Profile', tabBarIcon: icon({ on: 'person', off: 'person-outline' }) }} />
      </Tabs>

      <AppDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={data?.fullName || 'FlexiPay User'}
        walletBalance={data?.walletBalance ?? 0}
      />
    </>
  );
}
