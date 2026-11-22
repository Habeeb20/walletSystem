import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { type ComponentProps, useEffect, useRef } from 'react';
import { Alert, Animated, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Nav } from '@/lib/navigation';
import { naira } from '@/lib/format';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

const WIDTH = 304;

interface Props {
  visible: boolean;
  onClose: () => void;
  userName: string;
  walletBalance: number;
}

export function AppDrawer({ visible, onClose, userName, walletBalance }: Props) {
  const insets = useSafeAreaInsets();
  const x = useRef(new Animated.Value(-WIDTH)).current;

  useEffect(() => {
    if (visible) {
      x.setValue(-WIDTH);
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  }, [visible, x]);

  const go = (href: Parameters<typeof router.push>[0]) => {
    onClose();
    router.push(href);
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          onClose();
          await AuthService.logout();
          Nav.toLogin();
        },
      },
    ]);
  };

  const Section = ({ title }: { title: string }) => (
    <Text className="px-4 pb-1 pt-3 text-xs font-semibold tracking-wide text-ink-secondary">{title}</Text>
  );

  const Item = ({ icon, title, onPress, danger }: { icon: IconName; title: string; onPress: () => void; danger?: boolean }) => (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3 active:bg-primary-50">
      <MaterialIcons name={icon} size={20} color={danger ? colors.danger : colors.ink} />
      <Text className={`ml-4 text-sm font-medium ${danger ? 'text-danger' : 'text-ink'}`}>{title}</Text>
    </Pressable>
  );

  const initial = (userName.trim()[0] ?? 'F').toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 flex-row">
        <Animated.View style={{ width: WIDTH, transform: [{ translateX: x }] }} className="bg-card">
          <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
            <LinearGradient
              colors={[colors.primary500, colors.primary700]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingTop: insets.top + 24, paddingHorizontal: 16, paddingBottom: 20 }}
            >
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                <Text className="text-2xl font-semibold text-primary-500">{initial}</Text>
              </View>
              <Text className="mt-3 text-lg font-semibold text-white">{userName}</Text>
            </LinearGradient>

            <View className="m-4 rounded-xl border border-primary-500/30 bg-primary-500/10 p-4">
              <Text className="text-xs font-medium text-ink-secondary">Wallet Balance</Text>
              <Text className="mt-1 text-2xl font-bold text-primary-600">{naira(walletBalance)}</Text>
            </View>

            <View className="mx-4 h-px bg-line" />
            <Section title="Wallet Services" />
            <Item icon="send" title="Send Money" onPress={() => go('/transfer')} />

            <View className="mx-4 mt-2 h-px bg-line" />
            <Section title="Bills & Payments" />
            <Item icon="phone-android" title="Buy Airtime" onPress={() => go('/airtime')} />
            <Item icon="wifi" title="Buy Data" onPress={() => go('/data')} />
            <Item icon="lightbulb-outline" title="Electricity Bill" onPress={() => go('/electricity')} />
            <Item icon="tv" title="Cable TV" onPress={() => go('/tv')} />

            <View className="mx-4 mt-2 h-px bg-line" />
            <Section title="More" />
            <Item
              icon="settings"
              title="Settings"
              onPress={() => {
                onClose();
                router.navigate('/settings');
              }}
            />
            <Item icon="help-outline" title="Help & Support" onPress={() => go('/support')} />
            <Item icon="logout" title="Logout" danger onPress={confirmLogout} />
          </ScrollView>
        </Animated.View>
        <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      </View>
    </Modal>
  );
}
