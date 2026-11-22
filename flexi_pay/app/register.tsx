import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput, VisibilityToggle } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FadeIn } from '@/components/ui/FadeIn';
import { AuthScreen, ScreenHeader } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { EMAIL_VERIFIED, useEvent } from '@/lib/events';
import { Nav } from '@/lib/navigation';
import { maybePromptBiometricEnrollment } from '@/lib/postLogin';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';
import { colors } from '@/theme/colors';

type Form = { fullName: string; email: string; phone: string; password: string; confirmPassword: string };

export default function RegisterScreen() {
  const [form, setForm] = useState<Form>({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | 'username', string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 2: username
  const [usernameStep, setUsernameStep] = useState(false);
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const set = (key: keyof Form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  // The verify-email screen pops itself and signals us when the code was accepted.
  useEvent(EMAIL_VERIFIED, () => setUsernameStep(true));

  const register = async () => {
    const found = validate({
      fullName: Validators.fullName(form.fullName),
      email: Validators.email(form.email),
      phone: Validators.phone(form.phone),
      password: Validators.password(form.password),
      confirmPassword: Validators.confirmPassword(form.confirmPassword, form.password),
    });
    setErrors(found);
    if (hasErrors(found)) return;
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const response = await AuthService.register({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      setSuggestions(response.usernameSuggestions);
      router.push({ pathname: '/verify-email', params: { email: form.email.trim() } });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectUsername = async () => {
    const problem = Validators.username(username.trim());
    setErrors({ username: problem ?? undefined });
    if (problem) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AuthService.selectUsername(username.trim());
      toast.success('Registration completed successfully!');
      await maybePromptBiometricEnrollment();
      Nav.toCompleteProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
    } catch (e) {
      if (e instanceof ApiError && e.error?.toLowerCase().includes('verification')) {
        toast.error('Email verification required. Please check your email.');
      } else {
        toast.error(e instanceof ApiError ? e.message : 'Username selection failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (usernameStep) setUsernameStep(false);
    else if (router.canGoBack()) router.back();
    else Nav.toLogin();
  };

  return (
    <AuthScreen header={<ScreenHeader title={usernameStep ? 'Choose Username' : 'Create Account'} onBack={goBack} />}>
      <FadeIn>
        {!usernameStep ? (
          <View className="mt-5 h-40 w-full overflow-hidden rounded-3xl bg-primary-50">
            <LottieView source={require('../assets/animations/login.json')} autoPlay loop style={{ flex: 1 }} />
          </View>
        ) : null}

        <View className="mt-6 items-center">
          <Text className="text-[28px] font-bold tracking-tight text-ink">
            {usernameStep ? 'Almost There!' : 'Join Us Today'}
          </Text>
          <Text className="mt-2 text-center text-[15px] text-ink-secondary">
            {usernameStep ? 'Pick a unique username to complete signup' : 'Create your account and start managing'}
          </Text>
        </View>

        {/* Two-step progress bar */}
        <View className="mt-8 flex-row gap-2">
          <View className="h-1 flex-1 rounded-full bg-primary-500" />
          <View className={`h-1 flex-1 rounded-full ${usernameStep ? 'bg-secondary-500' : 'bg-neutral-200'}`} />
        </View>

        {!usernameStep ? (
          <View className="mt-8 gap-4">
            <AppInput label="Full Name" icon="person-outline" placeholder="John Doe" value={form.fullName}
              onChangeText={set('fullName')} autoCapitalize="words" error={errors.fullName} />
            <AppInput label="Email" icon="mail-outline" placeholder="your@email.com" value={form.email}
              onChangeText={set('email')} keyboardType="email-address" error={errors.email} />
            <AppInput label="Phone Number" icon="phone" placeholder="+1234567890" value={form.phone}
              onChangeText={set('phone')} keyboardType="phone-pad" error={errors.phone} />
            <AppInput label="Password" icon="lock-outline" placeholder="••••••••" value={form.password}
              onChangeText={set('password')} secureTextEntry={!showPassword} error={errors.password}
              suffix={<VisibilityToggle visible={showPassword} onToggle={() => setShowPassword((v) => !v)} />} />
            <AppInput label="Confirm Password" icon="lock-outline" placeholder="••••••••" value={form.confirmPassword}
              onChangeText={set('confirmPassword')} secureTextEntry={!showConfirm} error={errors.confirmPassword}
              returnKeyType="done" onSubmitEditing={register}
              suffix={<VisibilityToggle visible={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />} />

            <Pressable onPress={() => setAcceptTerms((v) => !v)} className="mt-1 flex-row items-center">
              <View
                className={`h-6 w-6 items-center justify-center rounded-md border ${
                  acceptTerms ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white'
                }`}
              >
                {acceptTerms ? <MaterialIcons name="check" size={16} color="#fff" /> : null}
              </View>
              <Text className="ml-3 flex-1 text-sm text-ink-secondary">
                I agree to the <Text className="font-semibold text-primary-500">Terms & Conditions</Text>
              </Text>
            </Pressable>

            <View className="mt-2">
              <PrimaryButton text="Create Account" onPress={register} loading={loading} />
            </View>

            <View className="mt-4 flex-row items-center justify-center">
              <Text className="text-[15px] text-ink-secondary">Already have an account? </Text>
              <Text className="text-[15px] font-bold text-primary-500" onPress={Nav.toLogin}>
                Sign In
              </Text>
            </View>
          </View>
        ) : (
          <View className="mt-8 gap-3">
            <AppInput label="Username" icon="alternate-email" placeholder="johndoe123" value={username}
              onChangeText={setUsername} error={errors.username} returnKeyType="done" onSubmitEditing={selectUsername} />

            {suggestions.length > 0 ? (
              <View className="rounded-xl border border-primary-500/20 bg-primary-50/60 p-3">
                <View className="flex-row items-center">
                  <MaterialIcons name="lightbulb-outline" size={18} color={colors.primary500} />
                  <Text className="ml-2 text-[13px] font-semibold text-primary-500">Suggestions:</Text>
                </View>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setUsername(s)}
                      className="rounded-lg border border-primary-500/30 bg-white px-3 py-1.5"
                    >
                      <Text className="text-[13px] font-medium text-primary-500">{s}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <View className="flex-row items-center rounded-xl border border-info/30 bg-info/10 p-3">
              <MaterialIcons name="info-outline" size={20} color={colors.info} />
              <Text className="ml-3 flex-1 text-[13px] text-info">Choose a unique username for your profile</Text>
            </View>

            <View className="mt-4">
              <PrimaryButton
                text="Complete Registration"
                icon="check-circle-outline"
                gradient={[colors.secondary500, colors.secondary600]}
                onPress={selectUsername}
                loading={loading}
              />
            </View>
          </View>
        )}
      </FadeIn>
    </AuthScreen>
  );
}
