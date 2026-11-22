import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { ErrorView, LoadingView } from '@/components/ui/StateViews';
import { toast } from '@/components/ui/Toast';
import { formatDmy } from '@/lib/format';
import { Nav } from '@/lib/navigation';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { ProfileService } from '@/services/profileService';
import { colors } from '@/theme/colors';

const GENDERS = [
  { key: 'Male', label: 'Male' },
  { key: 'Female', label: 'Female' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Simple day / month / year picker (no native date-picker dependency). */
function DobPicker({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const now = new Date();
  const maxYear = now.getFullYear() - 18;
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(value?.getFullYear() ?? maxYear);
  const [month, setMonth] = useState(value?.getMonth() ?? now.getMonth());
  const [day, setDay] = useState(value?.getDate() ?? now.getDate());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const stepper = (label: string, text: string, onMinus: () => void, onPlus: () => void) => (
    <View className="mx-2 items-center">
      <Text className="mb-2 text-xs text-ink-secondary">{label}</Text>
      <Pressable onPress={onPlus} hitSlop={8}><MaterialIcons name="keyboard-arrow-up" size={32} color={colors.primary500} /></Pressable>
      <Text className="my-1 text-xl font-semibold text-ink">{text}</Text>
      <Pressable onPress={onMinus} hitSlop={8}><MaterialIcons name="keyboard-arrow-down" size={32} color={colors.primary500} /></Pressable>
    </View>
  );

  const confirm = () => {
    // Clamp to the 18+ rule: never later than today minus 18 years.
    const picked = new Date(year, month, Math.min(day, daysInMonth));
    const latest = new Date(maxYear, now.getMonth(), now.getDate());
    onChange(picked > latest ? latest : picked);
    setOpen(false);
  };

  return (
    <View>
      <Text className="mb-1.5 ml-1 text-sm font-medium text-ink-secondary">Date of birth</Text>
      <Pressable onPress={() => setOpen(true)} className="flex-row items-center rounded-2xl bg-white px-4 py-[17px] shadow-sm">
        <MaterialIcons name="calendar-today" size={22} color={colors.primary500} style={{ marginRight: 12 }} />
        <Text className={`text-base ${value ? 'text-ink' : 'text-ink-muted'}`}>
          {value ? formatDmy(value) : 'Date of birth'}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-3xl bg-white p-6">
            <Text className="mb-4 text-center text-lg font-semibold text-ink">Date of birth</Text>
            <View className="flex-row justify-center">
              {stepper('Day', String(Math.min(day, daysInMonth)).padStart(2, '0'),
                () => setDay((d) => (d <= 1 ? daysInMonth : d - 1)),
                () => setDay((d) => (d >= daysInMonth ? 1 : d + 1)))}
              {stepper('Month', MONTHS[month],
                () => setMonth((m) => (m + 11) % 12),
                () => setMonth((m) => (m + 1) % 12))}
              {stepper('Year', String(year),
                () => setYear((y) => Math.max(now.getFullYear() - 100, y - 1)),
                () => setYear((y) => Math.min(maxYear, y + 1)))}
            </View>
            <View className="mt-6 flex-row gap-3">
              <Pressable onPress={() => setOpen(false)} className="h-12 flex-1 items-center justify-center rounded-xl border border-line">
                <Text className="font-semibold text-ink-secondary">Cancel</Text>
              </Pressable>
              <Pressable onPress={confirm} className="h-12 flex-1 items-center justify-center rounded-xl bg-primary-500">
                <Text className="font-semibold text-white">Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** Mandatory post-signup step: collects the KYC fields the backend needs to create the Paylony account. */
export default function CompleteProfileScreen() {
  const params = useLocalSearchParams<{ fullName?: string; email?: string; phone?: string }>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [dob, setDob] = useState<Date | null>(null);
  const [email, setEmail] = useState<string | undefined>(params.email);
  const [phone, setPhone] = useState<string | undefined>(params.phone);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const prefill = async () => {
    setLoading(true);
    setLoadError(null);

    const parts = (params.fullName ?? '').trim().split(' ').filter(Boolean);
    let first = parts[0] ?? '';
    let last = parts.slice(1).join(' ');
    let mail = params.email;
    let tel = params.phone;

    if (!(mail && tel && first)) {
      try {
        const customer = await ProfileService.fetchCustomerDetails();
        mail ??= customer.email;
        tel ??= customer.phone;
        first ||= customer.first_name ?? '';
        last ||= customer.last_name ?? '';
      } catch {
        setLoadError('Could not load your account details. Please try again.');
        setLoading(false);
        return;
      }
    }
    setFirstName(first);
    setLastName(last);
    setEmail(mail);
    setPhone(tel);
    setLoading(false);
  };

  useEffect(() => {
    prefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    const found = validate({
      firstName: Validators.required('First name is required')(firstName),
      lastName: Validators.required('Last name is required')(lastName),
      address: Validators.required('Address is required')(address),
    });
    setErrors(found);
    if (hasErrors(found)) return;
    if (!gender) return void toast.error('Please select your gender');
    if (!dob) return void toast.error('Please select your date of birth');
    if (!email || !phone) {
      return void toast.error('Missing account details. Please restart the app and try again.');
    }

    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await ProfileService.completeProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
        gender,
        email,
        phone,
        dob,
      });
      Nav.toHome();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not save your profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingView />;
  if (loadError) return <ErrorView message={loadError} onRetry={prefill} />;

  return (
    <FormScreen title="Complete your profile" showBack={false}>
      <Text className="mb-6 text-[15px] text-ink-secondary">
        We need a few more details before you can fund your wallet or use the app. This only takes a minute.
      </Text>
      <View className="gap-4">
        <AppInput label="First name" icon="person-outline" placeholder="e.g. Ada" value={firstName}
          onChangeText={setFirstName} autoCapitalize="words" error={errors.firstName} />
        <AppInput label="Last name" icon="person-outline" placeholder="e.g. Lovelace" value={lastName}
          onChangeText={setLastName} autoCapitalize="words" error={errors.lastName} />
        <AppInput label="Address" icon="home" placeholder="Street, city, state" value={address}
          onChangeText={setAddress} autoCapitalize="sentences" error={errors.address} />
        <SelectField label="Gender" placeholder="Select gender" icon="wc" value={gender} options={GENDERS} onChange={setGender} />
        <DobPicker value={dob} onChange={setDob} />
        <View className="mt-3">
          <PrimaryButton text="Continue" onPress={submit} loading={submitting} />
        </View>
      </View>
    </FormScreen>
  );
}
