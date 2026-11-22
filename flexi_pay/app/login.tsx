import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppInput, VisibilityToggle } from '@/components/ui/AppInput';
import { LinkText, PrimaryButton, SecondaryButton } from '@/components/ui/Buttons';
import { FadeIn } from '@/components/ui/FadeIn';
import { AuthScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { AppLock } from '@/core/security/appLock';
import { Nav } from '@/lib/navigation';
import { onLoginVerified } from '@/lib/postLogin';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  /** false = email + password (primary), true = passwordless email code. */
  const [otpMode, setOtpMode] = useState(false);

  const toggleMode = () => {
    setOtpMode((v) => !v);
    setErrors({});
    Haptics.selectionAsync();
  };

  const check = () => {
    const found = validate({
      email: Validators.email(email.trim()),
      password: otpMode ? null : Validators.required('Password is required')(password),
    });
    setErrors(found);
    return !hasErrors(found);
  };

  const loginWithPassword = async () => {
    if (!check()) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AuthService.loginWithEmailPassword({ email: email.trim(), password });
      await onLoginVerified();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    if (!check()) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      // The backend emails a one-time code; the token only comes back once it's confirmed.
      await AuthService.requestLoginOtp(email.trim());
      router.push({ pathname: '/login-otp', params: { email: email.trim() } });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithBiometric = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email first');
      return;
    }
    setBiometricLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AuthService.biometricLogin(email.trim());
      AppLock.unlock();
      toast.success('Biometric login successful!');
      await Nav.toHomeOrCompleteProfile();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Biometric authentication failed');
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <AuthScreen>
      <FadeIn>
        <View className="mt-10 h-[200px] w-full overflow-hidden rounded-3xl bg-primary-50">
          <LottieView source={require('../assets/animations/login.json')} autoPlay loop style={{ flex: 1 }} />
        </View>

        <View className="mt-8 items-center">
          <Text className="text-[32px] font-bold tracking-tight text-ink">Welcome Back</Text>
          <Text className="mt-2 text-center text-base text-ink-secondary">
            {otpMode ? "Enter your email and we'll send you a code" : 'Sign in with your email and password'}
          </Text>
        </View>

        <View className="mt-12 gap-4">
          <AppInput
            label="Email"
            icon="mail-outline"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            returnKeyType={otpMode ? 'done' : 'next'}
            onSubmitEditing={otpMode ? requestOtp : undefined}
          />

          {!otpMode ? (
            <>
              <AppInput
                label="Password"
                icon="lock-outline"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                returnKeyType="done"
                onSubmitEditing={loginWithPassword}
                suffix={<VisibilityToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />}
              />
              <View className="items-end">
                <LinkText text="Forgot Password?" onPress={Nav.toForgotPassword} />
              </View>
            </>
          ) : null}

          <View className="mt-2">
            <PrimaryButton
              text={otpMode ? 'Send Code' : 'Log In'}
              onPress={otpMode ? requestOtp : loginWithPassword}
              loading={loading}
            />
          </View>

          <View className="items-center">
            <LinkText
              text={otpMode ? 'Sign in with password instead' : 'Sign in with a login code instead'}
              onPress={toggleMode}
            />
          </View>

          <View className="flex-row items-center">
            <View className="h-px flex-1 bg-neutral-200" />
            <Text className="mx-4 text-[13px] font-medium text-ink-muted">OR</Text>
            <View className="h-px flex-1 bg-neutral-200" />
          </View>

          <SecondaryButton text="Use Biometric" icon="fingerprint" onPress={loginWithBiometric} loading={biometricLoading} />
        </View>

        <View className="mt-8 flex-row items-center justify-center">
          <Text className="text-[15px] text-ink-secondary">Don't have an account? </Text>
          <Text className="text-[15px] font-bold text-primary-500" onPress={Nav.toRegister}>
            Sign Up
          </Text>
        </View>
      </FadeIn>
    </AuthScreen>
  );
}
