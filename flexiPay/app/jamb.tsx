import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ReceiptSheet } from '@/components/ReceiptSheet';
import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { JAMB_TYPES } from '@/lib/countries';
import { useBuy } from '@/lib/useBuy';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { BillsService } from '@/services/billsService';

export default function JambScreen() {
  const [type, setType] = useState<string | null>(null);
  const [profileCode, setProfileCode] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ type?: string; profileCode?: string; phone?: string }>({});
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const { loading, run } = useBuy();

  const submit = async () => {
    const found = validate({
      type: type ? null : 'Select UTME or Direct Entry',
      profileCode: /^\d{10}$/.test(profileCode.trim()) ? null : 'Profile code must be 10 digits',
      phone: Validators.minLength10('Enter a valid phone number')(phone),
    });
    setErrors(found);
    if (hasErrors(found) || !type) return;

    const result = await run(() =>
      BillsService.buyJamb({ type, profileCode: profileCode.trim(), phone: phone.trim(), idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) setReceipt(result);
  };

  return (
    <FormScreen title="JAMB PIN">
      <View className="gap-4">
        <SelectField label="Exam type" placeholder="Select UTME or Direct Entry" icon="menu-book" value={type}
          options={JAMB_TYPES} onChange={setType} error={errors.type} />
        <AppInput label="Profile code" icon="pin" placeholder="10-digit profile code" value={profileCode}
          onChangeText={setProfileCode} keyboardType="number-pad" maxLength={10} error={errors.profileCode} />
        <AppInput label="Phone number" icon="phone" placeholder="08012345678" value={phone}
          onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <Text className="ml-1 text-xs leading-5 text-ink-secondary">
          Enter the candidate's 10-digit JAMB profile code. The fee is taken from your wallet and your PIN appears on the next screen.
        </Text>
      </View>
      <View className="mt-6">
        <PrimaryButton text="Buy JAMB PIN" onPress={submit} loading={loading} />
      </View>

      <ReceiptSheet visible={!!receipt} title="Your JAMB PIN" data={receipt}
        onClose={() => { setReceipt(null); router.back(); }} />
    </FormScreen>
  );
}
