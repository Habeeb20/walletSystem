import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Connectivity } from '@/core/network/connectivity';

export function ConnectionBanner() {
  const { quality } = Connectivity.useConnectivity();
  const insets = useSafeAreaInsets();
  if (quality === 'online') return null;

  const offline = quality === 'offline';
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top }}
      className={offline ? 'bg-neutral-800' : 'bg-warning'}
    >
      <Text className="py-1.5 text-center text-xs font-medium text-white">
        {offline ? "You're offline. Showing saved data." : 'Slow connection. Payments may take longer.'}
      </Text>
    </View>
  );
}