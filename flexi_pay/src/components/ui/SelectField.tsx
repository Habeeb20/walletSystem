import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface SelectOption {
  key: string;
  label: string;
}

interface Props {
  label: string;
  placeholder: string;
  /** Sheet heading; defaults to `label`. */
  title?: string;
  icon?: IconName;
  value?: string | null;
  options: SelectOption[];
  onChange: (key: string) => void;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
}

/** Dropdown replacement: a field that opens a bottom sheet list (optionally searchable). */
export function SelectField({
  label,
  placeholder,
  title,
  icon,
  value,
  options,
  onChange,
  loading = false,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search',
  emptyText = 'Nothing to select',
}: Props) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = options.find((o) => o.key === value);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View>
      <Text className="mb-1.5 ml-1 text-sm font-medium text-ink-secondary">{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled || loading}
        className={`flex-row items-center rounded-2xl border bg-white px-4 py-[17px] shadow-sm ${
          error ? 'border-danger' : 'border-transparent'
        } ${disabled ? 'opacity-60' : ''}`}
      >
        {icon ? <MaterialIcons name={icon} size={22} color={colors.primary500} style={{ marginRight: 12 }} /> : null}
        <Text
          className={`flex-1 text-base ${selected ? 'text-ink' : 'text-ink-muted'}`}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary500} />
        ) : (
          <MaterialIcons name="expand-more" size={24} color={colors.inkMuted} />
        )}
      </Pressable>
      {error ? <Text className="ml-1 mt-1 text-xs text-danger">{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable className="flex-1 bg-black/40" onPress={close} />
          <View
            className="max-h-[75%] rounded-t-3xl bg-white"
            style={{ paddingBottom: insets.bottom + 8, minHeight: 240 }}
          >
            <View className="items-center pt-3">
              <View className="h-1 w-10 rounded-full bg-neutral-300" />
            </View>
            <Text className="px-5 pb-2 pt-4 text-lg font-semibold text-ink">{title ?? label}</Text>

            {searchable ? (
              <View className="mx-5 mb-2 flex-row items-center rounded-xl bg-muted px-3">
                <MaterialIcons name="search" size={20} color={colors.inkMuted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={colors.inkMuted}
                  className="flex-1 px-2 py-3 text-base text-ink"
                  autoCorrect={false}
                />
              </View>
            ) : null}

            <FlatList
              data={visible}
              keyExtractor={(o) => o.key}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text className="px-5 py-8 text-center text-ink-secondary">
                  {query.trim() ? `No results match "${query.trim()}"` : emptyText}
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = item.key === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item.key);
                      close();
                    }}
                    className="flex-row items-center border-b border-line-light px-5 py-4 active:bg-primary-50"
                  >
                    <Text
                      className={`flex-1 text-base ${isSelected ? 'font-semibold text-primary-600' : 'text-ink'}`}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? <MaterialIcons name="check" size={20} color={colors.primary500} /> : null}
                  </Pressable>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
