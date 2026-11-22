import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

let showImpl: ((message: string, type: ToastType) => void) | null = null;

/** Imperative toast API (replaces ScaffoldMessenger.showSnackBar); usable outside React too. */
export const toast = {
  success: (message: string) => showImpl?.(message, 'success'),
  error: (message: string) => showImpl?.(message, 'error'),
  info: (message: string) => showImpl?.(message, 'info'),
};

const BG: Record<ToastType, string> = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#334155',
};
const ICON = { success: 'check-circle', error: 'error', info: 'info' } as const;

/** Mount once near the root. */
export function ToastHost() {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<{ id: number; message: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string, type: ToastType) => {
      if (timer.current) clearTimeout(timer.current);
      setCurrent({ id: Date.now(), message, type });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() =>
          setCurrent(null),
        );
      }, 3500);
    },
    [opacity],
  );

  useEffect(() => {
    showImpl = show;
    return () => {
      showImpl = null;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [show]);

  if (!current) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 16,
        opacity,
        transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
      }}
    >
      <View
        className="flex-row items-center rounded-xl px-4 py-3.5 shadow-lg"
        style={{ backgroundColor: BG[current.type] }}
      >
        <MaterialIcons name={ICON[current.type]} size={22} color="#fff" />
        <Text className="ml-3 flex-1 text-sm text-white">{current.message}</Text>
      </View>
    </Animated.View>
  );
}
