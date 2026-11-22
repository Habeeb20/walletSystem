import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { AuthScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { colors } from '@/theme/colors';

interface Props {
  title: string;
  subtitle: string;
  /** Exchanges the code for whatever the flow needs; throw on failure. */
  onSubmit: (code: string) => Promise<void>;
  /** Asks the backend for a fresh code. */
  onResend: () => Promise<void>;
  resendMessage: string;
}

/** Shared 4-digit code screen: used by email verification and passwordless login. */
export function CodeVerification({ title, subtitle, onSubmit, onResend, resendMessage }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const startCooldown = () => {
    setCooldown(60);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timer.current) clearInterval(timer.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const verify = async () => {
    const problem = Validators.verificationCode(code.trim());
    setError(problem ?? undefined);
    if (problem) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onSubmit(code.trim());
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await onResend();
      toast.success(resendMessage);
      startCooldown();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const resendDisabled = cooldown > 0 || resending;

  return (
    <AuthScreen>
      <View className="mt-10 items-center">
        <MaterialIcons name="mark-email-read" size={72} color={colors.primary500} />
        <Text className="mt-6 text-center text-[26px] font-bold text-ink">{title}</Text>
        <Text className="mt-2 text-center text-[15px] text-ink-secondary">{subtitle}</Text>
      </View>

      <View className="mt-8">
        <AppInput
          label="Verification code"
          icon="pin"
          placeholder="1234"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={4}
          error={error}
          returnKeyType="done"
          onSubmitEditing={verify}
        />
      </View>

      <View className="mt-6">
        <PrimaryButton text="Verify" onPress={verify} loading={loading} />
      </View>

      <Pressable onPress={resend} disabled={resendDisabled} className="mt-4 items-center py-3">
        <Text className={`font-semibold ${resendDisabled ? 'text-ink-muted' : 'text-primary-500'}`}>
          {cooldown > 0
            ? `Resend code in ${cooldown}s`
            : resending
              ? 'Sending…'
              : "Didn't get a code? Resend"}
        </Text>
      </Pressable>
    </AuthScreen>
  );
}
