import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { AmountChips } from '@/components/ui/AmountChips';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { COUNTRIES } from '@/lib/countries';
import { useBuy } from '@/lib/useBuy';
import { hasErrors, validate } from '@/lib/validators';
import { BillsService } from '@/services/billsService';

const AMOUNTS = [500, 1000, 2000, 5000];

export default function AirtimeForeignScreen() {
  const [country, setCountry] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ country?: string; phone?: string; amount?: string }>({});
  const { loading, run } = useBuy();

  const dial = COUNTRIES.find((c) => c.code === country)?.dial;
  const value = Number(amount.trim());

  const submit = async () => {
    const digits = phone.replace(/\D/g, '');
    const found = validate({
      country: country ? null : 'Select a country',
      phone: digits.length < 7 ? 'Enter a valid phone number' : null,
      amount: !(value > 0) ? 'Enter a valid amount' : null,
    });
    setErrors(found);
    if (hasErrors(found) || !country) return;

    const result = await run(() =>
      BillsService.buyAirtimeForeign({ country, phone: phone.trim(), amount: value, idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) {
      toast.success('International airtime sent');
      router.back();
    }
  };

  return (
    <FormScreen title="International Airtime">
      <View className="gap-4">
        <SelectField label="Country" placeholder="Select a country" icon="public" value={country}
          options={COUNTRIES.map((c) => ({ key: c.code, label: `${c.name} (${c.dial})` }))}
          onChange={setCountry} error={errors.country} searchable searchPlaceholder="Search country" />
        <AppInput label="Phone number" icon="phone" placeholder={dial ? `${dial} 700 000 0000` : 'Include the country code'}
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <AppInput label="Amount (NGN)" icon="payments" placeholder="1000" value={amount}
          onChangeText={setAmount} keyboardType="decimal-pad" error={errors.amount} />
      </View>
      <View className="mb-6 mt-4">
        <AmountChips amounts={AMOUNTS} selected={AMOUNTS.includes(value) ? value : null} onSelected={(a) => setAmount(String(a))} />
      </View>
      <PrimaryButton text="Send airtime" onPress={submit} loading={loading} />
    </FormScreen>
  );
}
