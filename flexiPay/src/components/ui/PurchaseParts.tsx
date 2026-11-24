import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { naira } from '@/lib/format';
import { colors } from '@/theme/colors';

/** − 1 + control for "how many PINs". */
export function QuantityStepper({
  label = 'Quantity',
  value,
  min = 1,
  max = 10,
  onChange,
}: {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  const Button = ({ icon, disabled, onPress }: { icon: 'remove' | 'add'; disabled: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      className={`h-9 w-9 items-center justify-center rounded-full ${disabled ? 'bg-muted' : 'bg-primary-500/10'}`}
    >
      <MaterialIcons name={icon} size={20} color={disabled ? colors.neutral300 : colors.primary600} />
    </Pressable>
  );

  return (
    <View>
      <Text className="mb-1.5 ml-1 text-sm font-medium text-ink-secondary">{label}</Text>
      <View className="flex-row items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <Text className="text-lg font-bold text-ink">{value}</Text>
        <View className="flex-row items-center gap-3">
          <Button icon="remove" disabled={value <= min} onPress={() => onChange(value - 1)} />
          <Button icon="add" disabled={value >= max} onPress={() => onChange(value + 1)} />
        </View>
      </View>
    </View>
  );
}

/** "You will pay" line shown above the buy button. */
export function TotalCard({ label = 'You will pay', amount, note }: { label?: string; amount: number | null; note?: string }) {
  return (
    <View className="rounded-2xl border border-primary-500/20 bg-primary-50 px-4 py-3.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm text-ink-secondary">{label}</Text>
        <Text className="text-xl font-bold text-primary-700">{amount != null ? naira(amount) : '—'}</Text>
      </View>
      {note ? <Text className="mt-1 text-xs text-ink-secondary">{note}</Text> : null}
    </View>
  );
}
