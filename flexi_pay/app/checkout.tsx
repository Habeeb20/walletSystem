import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { toast } from '@/components/ui/Toast';
import { events, WALLET_CHANGED } from '@/lib/events';
import { colors } from '@/theme/colors';

/** Paystack checkout. The backend redirects to a /dashboard URL once payment completes. */
export default function CheckoutScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const onSuccess = () => {
    toast.success('Payment complete — balance will update shortly');
    events.emit(WALLET_CHANGED);
    router.dismiss(2); // checkout + fund-wallet
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center border-b border-line px-2">
        <Pressable onPress={() => router.back()} hitSlop={8} className="h-10 w-10 items-center justify-center">
          <MaterialIcons name="close" size={24} color={colors.ink} />
        </Pressable>
        <Text className="ml-1 text-lg font-semibold text-ink">Complete Payment</Text>
      </View>

      <View className="flex-1">
        <WebView
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.includes('/dashboard')) {
              onSuccess();
              return false;
            }
            return true;
          }}
        />
        {loading ? (
          <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
            <ActivityIndicator size="large" color={colors.primary500} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
