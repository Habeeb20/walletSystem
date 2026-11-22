import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { AmountChips } from '@/components/ui/AmountChips';
import { PrimaryButton } from '@/components/ui/Buttons';
import { NETWORK_BRANDS, NetworkSelector } from '@/components/ui/NetworkSelector';
import { FormScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { events, WALLET_CHANGED } from '@/lib/events';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { BillsService } from '@/services/billsService';

const POPULAR_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen() {
  const [network, setNetwork] = useState(NETWORK_BRANDS[0].code);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; amount?: string }>({});
  const [loading, setLoading] = useState(false);

  const parsed = Number(amount.trim());
  const selectedAmount = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const submit = async () => {
    const found = validate({
      phone: Validators.minLength10('Enter a valid phone number')(phone),
      amount: !(parsed > 0) ? 'Enter a valid amount' : null,
    });
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await BillsService.buyAirtime({ network, amount: parsed, phone: phone.trim() });
      toast.success('Airtime purchase successful');
      events.emit(WALLET_CHANGED);
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Buy Airtime">
      <Text className="mb-3 text-base font-semibold text-ink">Network</Text>
      <NetworkSelector selected={network} onSelected={setNetwork} />

      <View className="mt-6 gap-4">
        <AppInput label="Phone number" icon="phone" placeholder="08012345678" value={phone}
          onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <AppInput label="Amount (NGN)" icon="payments" placeholder="500" value={amount}
          onChangeText={setAmount} keyboardType="decimal-pad" error={errors.amount} />
      </View>

      <Text className="mb-3 mt-5 text-sm font-semibold text-ink-secondary">Popular amounts</Text>
      <AmountChips
        amounts={POPULAR_AMOUNTS}
        selected={selectedAmount}
        onSelected={(a) => {
          Haptics.selectionAsync();
          setAmount(String(a));
        }}
      />

      <View className="mt-8">
        <PrimaryButton text="Buy Airtime" onPress={submit} loading={loading} />
      </View>
    </FormScreen>
  );
}
