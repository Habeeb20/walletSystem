import { MaterialIcons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Nav } from '@/lib/navigation';
import { colors } from '@/theme/colors';

/** Transparent app bar with back arrow, used by every pushed screen. */
export function ScreenHeader({
  title,
  onBack,
  right,
  showBack = true,
}: {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  showBack?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="bg-canvas">
      <View className="h-14 flex-row items-center px-2">
        {showBack ? (
          <Pressable onPress={onBack ?? Nav.back} hitSlop={8} className="h-10 w-10 items-center justify-center">
            <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.ink} />
          </Pressable>
        ) : (
          <View className="w-3" />
        )}
        <Text className="flex-1 text-lg font-semibold text-ink" numberOfLines={1}>
          {title}
        </Text>
        {right}
      </View>
    </View>
  );
}

/** Pushed screen: header + keyboard-aware scrolling body. */
export function FormScreen({
  title,
  children,
  onBack,
  showBack = true,
  padding = 24,
}: {
  title: string;
  children: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  padding?: number;
}) {
  return (
    <View className="flex-1 bg-canvas">
      <ScreenHeader title={title} onBack={onBack} showBack={showBack} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding, paddingBottom: padding + 24 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Full-bleed scrolling body that respects the status bar (login, register, forgot password...). */
export function AuthScreen({ children, header }: { children: ReactNode; header?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: header ? 0 : insets.top }}>
      {header}
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 40 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
