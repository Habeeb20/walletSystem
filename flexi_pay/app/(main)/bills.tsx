import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const BILLS: { icon: IconName; label: string; href: string }[] = [
  { icon: 'phone-android', label: 'Airtime', href: '/airtime' },
  { icon: 'wifi', label: 'Data', href: '/data' },
  { icon: 'bolt', label: 'Electricity', href: '/electricity' },
  { icon: 'tv', label: 'Cable TV', href: '/tv' },
];

export default function BillsScreen() {
  return (
    <View className="flex-1 bg-canvas p-4">
      <Text className="mb-4 text-xl font-bold text-ink">Bills & Services</Text>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {BILLS.map((b) => (
          <Pressable
            key={b.label}
            onPress={() => router.push(b.href as never)}
            className="w-[48%] items-center rounded-2xl border border-line bg-card py-6 active:opacity-80"
          >
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
              <MaterialIcons name={b.icon} size={28} color={colors.primary600} />
            </View>
            <Text className="mt-3 font-semibold text-ink">{b.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
