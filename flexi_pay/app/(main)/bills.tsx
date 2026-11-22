// import { MaterialIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { type ComponentProps } from 'react';
// import { Pressable, Text, View } from 'react-native';

// import { colors } from '@/theme/colors';

// type IconName = ComponentProps<typeof MaterialIcons>['name'];

// const BILLS: { icon: IconName; label: string; href: string }[] = [
//   { icon: 'phone-android', label: 'Airtime', href: '/airtime' },
//   { icon: 'wifi', label: 'Data', href: '/data' },
//   { icon: 'bolt', label: 'Electricity', href: '/electricity' },
//   { icon: 'tv', label: 'Cable TV', href: '/tv' },
// ];

// export default function BillsScreen() {
//   return (
//     <View className="flex-1 bg-canvas p-4">
//       <Text className="mb-4 text-xl font-bold text-ink">Bills & Services</Text>
//       <View className="flex-row flex-wrap justify-between gap-y-3">
//         {BILLS.map((b) => (
//           <Pressable
//             key={b.label}
//             onPress={() => router.push(b.href as never)}
//             className="w-[48%] items-center rounded-2xl border border-line bg-card py-6 active:opacity-80"
//           >
//             <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
//               <MaterialIcons name={b.icon} size={28} color={colors.primary600} />
//             </View>
//             <Text className="mt-3 font-semibold text-ink">{b.label}</Text>
//           </Pressable>
//         ))}
//       </View>
//     </View>
//   );
// }



import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ComponentProps, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { dashboardStore } from '@/lib/dashboardStore';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface Service {
  label: string;
  subtitle: string;
  icon: IconName;
  href: string;
  color: string;
  /** Extra words the search box should match. */
  keywords?: string;
  isNew?: boolean;
}

const SECTIONS: { title: string; items: Service[] }[] = [
  {
    title: 'Airtime & data',
    items: [
      { label: 'Airtime', subtitle: 'Top up any Nigerian network', icon: 'phone-android', href: '/airtime', color: '#3B82F6', keywords: 'recharge mtn glo airtel 9mobile' },
      { label: 'Data', subtitle: 'Bundles for every network', icon: 'wifi', href: '/data', color: '#8B5CF6', keywords: 'internet bundle mtn glo airtel 9mobile' },
      { label: 'Airtime PIN', subtitle: 'Recharge cards to share', icon: 'confirmation-number', href: '/airtime-pin', color: '#0EA5E9', keywords: 'voucher card print', isNew: true },
      { label: 'Data PIN', subtitle: 'Data vouchers to share', icon: 'vpn-key', href: '/data-pin', color: '#6366F1', keywords: 'voucher card', isNew: true },
      { label: 'Intl. airtime', subtitle: 'Top up numbers abroad', icon: 'public', href: '/airtime-foreign', color: '#14B8A6', keywords: 'international foreign abroad ghana kenya', isNew: true },
      { label: 'Intl. data', subtitle: 'Data for numbers abroad', icon: 'language', href: '/data-foreign', color: '#06B6D4', keywords: 'international foreign abroad roaming', isNew: true },
    ],
  },
  {
    title: 'Utilities & TV',
    items: [
      { label: 'Electricity', subtitle: 'Prepaid & postpaid meters', icon: 'bolt', href: '/electricity', color: '#F59E0B', keywords: 'light nepa disco token' },
      { label: 'Cable TV', subtitle: 'DStv, GOtv, Startimes', icon: 'tv', href: '/tv', color: '#EC4899', keywords: 'dstv gotv startimes showmax subscription' },
    ],
  },
  {
    title: 'Betting',
    items: [
      { label: 'Betting', subtitle: 'Fund your betting wallet', icon: 'sports-soccer', href: '/betting', color: '#EF4444', keywords: 'bet9ja sportybet 1xbet topup gaming', isNew: true },
    ],
  },
  {
    title: 'Education',
    items: [
      { label: 'Result checker', subtitle: 'WAEC, NECO & NABTEB PINs', icon: 'school', href: '/result-checker', color: '#10B981', keywords: 'waec neco nabteb exam pin', isNew: true },
      { label: 'JAMB', subtitle: 'UTME & Direct Entry PINs', icon: 'menu-book', href: '/jamb', color: '#F97316', keywords: 'utme de exam registration pin', isNew: true },
    ],
  },
];

function splitMoney(amount: number) {
  const [whole, decimals] = Math.abs(amount).toFixed(2).split('.');
  return { whole: whole.replace(/\B(?=(\d{3})+(?!\d))/g, ','), decimals };
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Pressable
      onPress={() => router.push(service.href as never)}
      className="w-[48.5%] rounded-3xl bg-white p-4 shadow-sm active:opacity-70"
    >
      <View className="flex-row items-start justify-between">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${service.color}1F` }}
        >
          <MaterialIcons name={service.icon} size={26} color={service.color} />
        </View>
        {service.isNew ? (
          <View className="rounded-full bg-primary-500 px-2 py-0.5">
            <Text className="text-[10px] font-bold tracking-wide text-white">NEW</Text>
          </View>
        ) : null}
      </View>
      <Text className="mt-3 text-[15px] font-bold text-ink" numberOfLines={1}>
        {service.label}
      </Text>
      <Text className="mt-0.5 text-xs leading-4 text-ink-secondary" numberOfLines={2}>
        {service.subtitle}
      </Text>
    </Pressable>
  );
}

export default function BillsScreen() {
  const { data } = dashboardStore.useDashboard();
  const [query, setQuery] = useState('');
  const balance = splitMoney(data?.walletBalance ?? 0);

  const q = query.trim().toLowerCase();
  const sections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (s) => !q || `${s.label} ${s.subtitle} ${s.keywords ?? ''}`.toLowerCase().includes(q),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Wallet hero */}
      <LinearGradient
        colors={['#064E3B', '#047857', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 20,
          overflow: 'hidden',
          shadowColor: '#047857',
          shadowOpacity: 0.3,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        <View
          pointerEvents="none"
          style={{ position: 'absolute', right: -40, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.08)' }}
        />
        <Text className="text-sm font-medium text-white/80">Available balance</Text>
        <View className="mt-1 flex-row items-end justify-between">
          <Text className="text-[32px] font-bold tracking-tight text-white">
            ₦{balance.whole}
            <Text className="text-base font-semibold text-white/70">.{balance.decimals}</Text>
          </Text>
          <Pressable
            onPress={() => router.push('/fund-wallet')}
            className="mb-1 flex-row items-center rounded-full bg-white px-4 py-2 active:opacity-80"
          >
            <MaterialIcons name="add" size={18} color={colors.primary700} />
            <Text className="ml-1 text-sm font-semibold text-primary-700">Add money</Text>
          </Pressable>
        </View>
        <Text className="mt-3 text-xs text-white/75">Pay bills and buy PINs instantly from your wallet.</Text>
      </LinearGradient>

      {/* Search */}
      <View className="mt-4 flex-row items-center rounded-2xl bg-white px-4 shadow-sm">
        <MaterialIcons name="search" size={22} color={colors.inkMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search services, e.g. airtime, JAMB, DStv"
          placeholderTextColor={colors.inkMuted}
          className="flex-1 px-3 py-[15px] text-[15px] text-ink"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10}>
            <MaterialIcons name="close" size={20} color={colors.inkMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Sections */}
      {sections.map((section) => (
        <View key={section.title} className="mt-6">
          <Text className="mb-3 ml-1 text-lg font-bold text-ink">{section.title}</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {section.items.map((s) => (
              <ServiceCard key={s.label} service={s} />
            ))}
          </View>
        </View>
      ))}

      {sections.length === 0 ? (
        <View className="mt-16 items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
            <MaterialIcons name="search-off" size={30} color={colors.inkMuted} />
          </View>
          <Text className="mt-4 text-base font-semibold text-ink">No services found</Text>
          <Text className="mt-1 text-sm text-ink-secondary">Try a different word.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}














