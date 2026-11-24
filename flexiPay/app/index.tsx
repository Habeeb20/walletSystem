import { MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Text, View } from 'react-native';

import { IntegrityService } from '@/core/security/integrityService';
import { Nav } from '@/lib/navigation';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

/** Splash: animation, device integrity check, then route to login or home. */
export default function SplashScreen() {
  const intro = useRef(new Animated.Value(0)).current;
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(checkAuthStatus, 3000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkAuthStatus() {
    const integrity = await IntegrityService.check();
    if (integrity === 'compromisedBlocked') {
      setBlocked(true);
      return;
    }
    if (integrity === 'compromisedWarn') {
      await new Promise<void>((resolve) =>
        Alert.alert(
          'Security warning',
          'This device appears to be jailbroken, which can expose your financial data. Continue at your own risk.',
          [{ text: 'Continue anyway', onPress: () => resolve() }],
          { cancelable: false },
        ),
      );
    }

    if (!(await AuthService.isAuthenticated())) {
      Nav.toLogin();
      return;
    }
    await Nav.toHomeOrCompleteProfile();
  }

  if (blocked) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-8">
        <MaterialIcons name="gpp-bad" size={64} color={colors.danger} />
        <Text className="mt-4 text-xl font-bold text-ink">Device not supported</Text>
        <Text className="mt-2 text-center text-ink-secondary">
          FlexiPay cannot run on a rooted device for your security. Please use an unmodified device.
        </Text>
      </View>
    );
  }

  const scale = intro.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });

  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <Animated.View style={{ opacity: intro, transform: [{ scale }], alignItems: 'center' }}>
        <LottieView
          source={require('../assets/animations/smartphone.json')}
          autoPlay
          loop
          style={{ width: 320, height: 320 }}
        />
        <Text className="mt-6 text-[32px] font-bold tracking-tight text-ink">Flexi Pay</Text>
        <Text className="mt-2 text-base text-ink-secondary">Manage your finances and bills with ease</Text>
      </Animated.View>
      <Animated.View style={{ opacity: intro, marginTop: 56 }}>
        <ActivityIndicator size="large" color={colors.primary500} />
      </Animated.View>
    </View>
  );
}
