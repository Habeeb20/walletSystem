import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <ActivityIndicator size="large" color={colors.primary500} />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center bg-canvas px-6">
      <MaterialIcons name="error-outline" size={48} color={colors.danger} />
      <Text className="mt-3 text-center text-ink-secondary">{message}</Text>
      <Pressable onPress={onRetry} className="mt-3 px-4 py-2" hitSlop={8}>
        <Text className="font-semibold text-primary-600">Retry</Text>
      </Pressable>
    </View>
  );
}
