import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode, useState } from 'react';
import { Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  icon: IconName;
  error?: string;
  suffix?: ReactNode;
}

/** Labelled input with leading icon, optional trailing widget and inline validation error. */
export function AppInput({ label, icon, error, suffix, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const border = error ? 'border-danger' : focused ? 'border-primary-500' : 'border-transparent';

  return (
    <View>
      <Text className="mb-1.5 ml-1 text-sm font-medium text-ink-secondary">{label}</Text>
      <View className={`flex-row items-center rounded-2xl border bg-white px-4 shadow-sm ${border}`}>
        <MaterialIcons name={icon} size={22} color={colors.primary500} />
        <TextInput
          className="flex-1 px-3 py-[17px] text-base text-ink"
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {suffix}
      </View>
      {error ? <Text className="ml-1 mt-1 text-xs text-danger">{error}</Text> : null}
    </View>
  );
}

/** Eye toggle used as the `suffix` of password fields. */
export function VisibilityToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <MaterialIcons
      name={visible ? 'visibility' : 'visibility-off'}
      size={22}
      color={colors.inkMuted}
      onPress={onToggle}
      suppressHighlighting
    />
  );
}
