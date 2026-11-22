import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput, VisibilityToggle } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FadeIn } from '@/components/ui/FadeIn';
import { AuthScreen, ScreenHeader } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { Nav } from '@/lib/navigation';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<0 | 1>(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    const problem = Validators.email(email.trim());
    setErrors({ email: problem ?? undefined });
    if (problem) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AuthService.forgotPassword(email.trim());
      toast.success('Reset code sent! Check your email');
      setStep(1);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    const found = validate({
      code: !code.trim() ? 'Verification code is required' : code.trim().length < 4 ? 'Enter a valid code' : null,
      password: Validators.password(password),
      confirm: Validators.confirmPassword(confirm, password),
    });
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AuthService.resetPassword({ email: email.trim(), code: code.trim(), newPassword: password });
      toast.success('Password reset successful!');
      setTimeout(Nav.toLogin, 1000);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen header={<ScreenHeader title="Reset Password" />}>
      <FadeIn>
        <View className="mt-6 items-center">
          <MaterialIcons name={step === 0 ? 'lock-reset' : 'lock-open'} size={72} color={colors.primary500} />
          <Text className="mt-5 text-[28px] font-bold tracking-tight text-ink">
            {step === 0 ? 'Forgot Password?' : 'Create New Password'}
          </Text>
          <Text className="mt-2 text-center text-[15px] text-ink-secondary">
            {step === 0 ? 'Enter your email to receive a reset code' : 'Enter the code and your new password'}
          </Text>
        </View>

        {step === 0 ? (
          <View className="mt-10 gap-4">
            <AppInput label="Email Address" icon="mail-outline" placeholder="your@email.com" value={email}
              onChangeText={setEmail} keyboardType="email-address" error={errors.email}
              returnKeyType="done" onSubmitEditing={sendCode} />
            <Text className="text-center text-[13px] text-ink-muted">
              We will send a verification code to this email address
            </Text>
            <PrimaryButton text="Send Reset Code" onPress={sendCode} loading={loading} />
            <View className="mt-2 flex-row items-center justify-center">
              <Text className="text-[15px] text-ink-secondary">Remember your password? </Text>
              <Text className="text-[15px] font-bold text-primary-500" onPress={Nav.toLogin}>
                Log In
              </Text>
            </View>
          </View>
        ) : (
          <View className="mt-10 gap-4">
            <AppInput label="Verification Code" icon="pin" placeholder="Enter 6-digit code" value={code}
              onChangeText={setCode} keyboardType="number-pad" error={errors.code} />
            <AppInput label="New Password" icon="lock-outline" placeholder="••••••••" value={password}
              onChangeText={setPassword} secureTextEntry={!showPassword} error={errors.password}
              suffix={<VisibilityToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />} />
            <Text className="-mt-2 ml-1 text-xs text-ink-muted">
              Password must be 8+ characters with uppercase, lowercase, number and special character
            </Text>
            <AppInput label="Confirm Password" icon="lock-outline" placeholder="••••••••" value={confirm}
              onChangeText={setConfirm} secureTextEntry={!showConfirm} error={errors.confirm}
              returnKeyType="done" onSubmitEditing={reset}
              suffix={<VisibilityToggle visible={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />} />
            <PrimaryButton text="Reset Password" onPress={reset} loading={loading} />
            <Pressable onPress={sendCode} disabled={loading} className="flex-row items-center justify-center py-2">
              <MaterialIcons name="refresh" size={18} color={colors.primary500} />
              <Text className="ml-1 font-medium text-primary-500">Resend Code</Text>
            </Pressable>
          </View>
        )}
      </FadeIn>
    </AuthScreen>
  );
}
