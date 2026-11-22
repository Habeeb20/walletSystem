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
import { BETTING_PROVIDERS } from '@/lib/countries';
import { useBuy } from '@/lib/useBuy';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { BillsService } from '@/services/billsService';

const AMOUNTS = [500, 1000, 2000, 5000, 10000];
const MIN_AMOUNT = 100;

export default function BettingScreen() {
  const [provider, setProvider] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ provider?: string; customerId?: string; amount?: string }>({});
  const { loading, run } = useBuy();

  const value = Number(amount.trim());

  const submit = async () => {
    const found = validate({
      provider: provider ? null : 'Select a betting company',
      customerId: Validators.required('Enter your customer ID')(customerId),
      amount: !(value >= MIN_AMOUNT) ? `Minimum amount is ₦${MIN_AMOUNT}` : null,
    });
    setErrors(found);
    if (hasErrors(found) || !provider) return;

    const result = await run(() =>
      BillsService.bettingTopup({ provider, customerId: customerId.trim(), amount: value, idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) {
      toast.success('Betting account funded');
      router.back();
    }
  };

  return (
    <FormScreen title="Betting Top-up">
      <View className="gap-4">
        <SelectField label="Betting company" placeholder="Select a company" icon="sports-soccer" value={provider}
          options={BETTING_PROVIDERS} onChange={setProvider} error={errors.provider} />
        <AppInput label="Customer ID / User ID" icon="person-outline" placeholder="Your betting account ID"
          value={customerId} onChangeText={setCustomerId} error={errors.customerId} />
        <AppInput label="Amount (NGN)" icon="payments" placeholder="1000" value={amount}
          onChangeText={setAmount} keyboardType="decimal-pad" error={errors.amount} />
      </View>
      <View className="mb-6 mt-4">
        <AmountChips amounts={AMOUNTS} selected={AMOUNTS.includes(value) ? value : null} onSelected={(a) => setAmount(String(a))} />
      </View>
      <PrimaryButton text="Fund account" onPress={submit} loading={loading} />
    </FormScreen>
  );
}
