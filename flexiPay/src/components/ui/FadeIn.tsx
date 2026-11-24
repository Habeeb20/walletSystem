import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** One-shot fade + slide-up entrance (used for the auth screens). */
export function FadeIn({ children, delay = 0, duration = 700 }: { children: ReactNode; delay?: number; duration?: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay, duration]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
      }}
    >
      {children}
    </Animated.View>
  );
}
