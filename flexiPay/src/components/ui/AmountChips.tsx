import { Pressable, Text, View } from 'react-native';

/** Wrap of tappable "popular amount" chips; `selected` keeps the active chip highlighted. */
export function AmountChips({
  amounts,
  selected,
  onSelected,
  prefix = '₦',
}: {
  amounts: number[];
  selected: number | null;
  onSelected: (amount: number) => void;
  prefix?: string;
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {amounts.map((amount) => {
        const isSelected = amount === selected;
        return (
          <Pressable
            key={amount}
            onPress={() => onSelected(amount)}
            className={`rounded-xl border px-4 py-2.5 ${
              isSelected ? 'border-primary-500 bg-primary-500' : 'border-line bg-white'
            }`}
          >
            <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-ink-secondary'}`}>
              {prefix}
              {amount}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
