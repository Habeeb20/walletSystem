import { MaterialIcons } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { toast } from '@/components/ui/Toast';
import { AppLock } from '@/core/security/appLock';
import { dashboardStore } from '@/lib/dashboardStore';
import { Nav } from '@/lib/navigation';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';
import { router } from 'expo-router';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

function Card({ children }: { children: ReactNode }) {
  return <View className="overflow-hidden rounded-2xl bg-white">{children}</View>;
}

function SectionTitle({ title }: { title: string }) {
  return <Text className="mb-2 ml-1 mt-6 text-[13px] font-semibold text-ink-secondary">{title}</Text>;
}

function Row({ icon, title, onPress, danger }: { icon: IconName; title: string; onPress: () => void; danger?: boolean }) {
  const tint = danger ? colors.danger : colors.ink;
  return (
    <Pressable onPress={onPress} className="flex-row items-center px-4 py-3.5 active:bg-muted">
      <MaterialIcons name={icon} size={22} color={tint} />
      <Text className={`ml-4 flex-1 font-medium ${danger ? 'text-danger' : 'text-ink'}`}>{title}</Text>
      <MaterialIcons name="chevron-right" size={22} color={colors.inkMuted} />
    </Pressable>
  );
}

function SwitchRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
  disabled,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View className="flex-row items-center px-4 py-3">
      <MaterialIcons name={icon} size={22} color={colors.ink} />
      <View className="ml-4 flex-1">
        <Text className="font-medium text-ink">{title}</Text>
        {subtitle ? <Text className="text-xs text-ink-secondary">{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: colors.primary500, false: colors.neutral300 }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { data } = dashboardStore.useDashboard();
  const { isEnabled: appLockEnabled } = AppLock.useLock();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      setBiometricSupported(await AuthService.isBiometricDeviceSupported());
      setBiometricEnrolled(await AuthService.isBiometricEnrolled());
      await AppLock.initialize();
    })();
  }, []);

  const toggleBiometric = async (enable: boolean) => {
    setBusy(true);
    try {
      if (enable) {
        await AuthService.enrollBiometrics();
        toast.success('Biometric login enabled');
      } else {
        await AuthService.disableBiometrics();
        toast.success('Biometric login disabled');
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not update biometric settings');
    } finally {
      setBiometricEnrolled(await AuthService.isBiometricEnrolled());
      setBusy(false);
    }
  };

  const logout = () =>
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AuthService.logout();
          Nav.toLogin();
        },
      },
    ]);

  const deleteAccount = () =>
    Alert.alert(
      'Delete Account',
      'This permanently deactivates your account and signs you out. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              await AuthService.deleteAccount();
              Nav.toLogin();
            } catch (e) {
              toast.error(e instanceof ApiError ? e.message : 'Could not delete account. Please try again.');
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );

  const name = data?.fullName || 'FlexiPay User';

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View className="flex-row items-center">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Text className="text-2xl font-bold text-primary-700">{name[0].toUpperCase()}</Text>
        </View>
        <Text className="ml-4 flex-1 text-xl font-bold text-ink">{name}</Text>
      </View>

      <SectionTitle title="Security" />
      <Card>
        <Row icon="lock-outline" title="Change Password" onPress={Nav.toChangePassword} />
        {biometricSupported ? (
          <SwitchRow icon="fingerprint" title="Biometric Login" value={biometricEnrolled} onChange={toggleBiometric} disabled={busy} />
        ) : null}
        <SwitchRow
          icon="lock-clock"
          title="App Lock"
          subtitle="Require authentication when reopening the app"
          value={appLockEnabled}
          onChange={(v) => AppLock.setEnabled(v)}
        />
      </Card>

      <SectionTitle title="Support" />
      <Card>
        <Row icon="help-outline" title="Help & Support" onPress={() => router.push('/support')} />
        <Row icon="logout" title="Logout" onPress={logout} />
        <Row icon="delete-outline" title="Delete Account" onPress={deleteAccount} danger />
      </Card>

      <Text className="mt-8 text-center text-xs text-ink-muted">FlexiPay v1.0.0</Text>
    </ScrollView>
  );
}
