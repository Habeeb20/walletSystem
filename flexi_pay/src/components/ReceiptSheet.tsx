import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { toast } from '@/components/ui/Toast';
import { colors } from '@/theme/colors';

const HIDDEN = /^(success|error|statuscode|code)$/i;
const COPYABLE = /pin|serial|token|code|reference|voucher|card/i;

function humanize(key: string) {
  const spaced = key.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Turns whatever the server returned into label/value rows (handles nested objects and arrays). */
function flatten(value: unknown, label: string, out: [string, string][] = [], depth = 0): [string, string][] {
  if (value == null || depth > 4) return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, value.length > 1 ? `${label} ${i + 1}` : label, out, depth + 1));
  } else if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (HIDDEN.test(k)) continue;
      flatten(v, label ? `${label} ${k}` : k, out, depth + 1);
    }
  } else if (String(value).length > 0) {
    out.push([humanize(label), String(value)]);
  }
  return out;
}

/** Success sheet that lists everything the server returned (PINs, tokens, references) with copy buttons. */
export function ReceiptSheet({
  visible,
  title,
  data,
  onClose,
}: {
  visible: boolean;
  title: string;
  data: Record<string, unknown> | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const rows = data ? flatten(data, '') : [];
  const message = typeof data?.message === 'string' ? data.message : undefined;
  const shown = rows.filter(([label]) => label.toLowerCase() !== 'message');

  const copy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    toast.info('Copied');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="items-center">
            <View className="h-1 w-10 rounded-full bg-neutral-300" />
          </View>

          <View className="items-center py-4">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <MaterialIcons name="check-circle" size={32} color={colors.success} />
            </View>
            <Text className="mt-3 text-xl font-bold text-ink">{title}</Text>
            {message ? <Text className="mt-1 text-center text-sm text-ink-secondary">{message}</Text> : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {shown.map(([label, value], i) => (
              <View key={`${label}-${i}`} className="flex-row items-center border-b border-line-light py-3">
                <View className="flex-1">
                  <Text className="text-xs text-ink-secondary">{label}</Text>
                  <Text className="mt-0.5 text-base font-semibold text-ink" selectable>
                    {value}
                  </Text>
                </View>
                {COPYABLE.test(label) ? (
                  <Pressable onPress={() => copy(value)} hitSlop={10} className="ml-3 p-1">
                    <MaterialIcons name="content-copy" size={18} color={colors.primary500} />
                  </Pressable>
                ) : null}
              </View>
            ))}
            {shown.length === 0 ? (
              <Text className="py-4 text-center text-ink-secondary">Your purchase was successful.</Text>
            ) : null}
          </ScrollView>

          <View className="mt-4 flex-row gap-3">
            {shown.length > 0 ? (
              <Pressable
                onPress={() => copy(shown.map(([l, v]) => `${l}: ${v}`).join('\n'))}
                className="h-12 flex-1 flex-row items-center justify-center rounded-xl border border-primary-500"
              >
                <MaterialIcons name="content-copy" size={18} color={colors.primary500} />
                <Text className="ml-2 font-semibold text-primary-600">Copy all</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={onClose} className="h-12 flex-1 items-center justify-center rounded-xl bg-primary-500">
              <Text className="font-semibold text-white">Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
