import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { AmountChips } from '@/components/ui/AmountChips';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { events, WALLET_CHANGED } from '@/lib/events';
import { usePlans } from '@/lib/usePlans';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { BillsService } from '@/services/billsService';

const POPULAR_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function ElectricityScreen() {
  const [meter, setMeter] = useState('');
  const [amount, setAmount] = useState('');
  const [discoId, setDiscoId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ meter?: string; amount?: string; disco?: string }>({});
  const [loading, setLoading] = useState(false);

  const { plans: discos, loading: discosLoading, error: discosError, reload } = usePlans(
    'electricity',
    'Could not load providers. Please try again.',
  );

  // Default to the first distribution company once the list arrives.
  useEffect(() => {
    if (discos.length > 0) setDiscoId(String(discos[0].id));
  }, [discos]);

  const parsed = Number(amount.trim());
  const selectedAmount = Number.isInteger(parsed) && parsed > 0 ? parsed : null;

  const submit = async () => {
    const disco = discos.find((d) => String(d.id) === discoId);
    const found = validate({
      meter: Validators.minLength10('Enter a valid meter number')(meter),
      amount: !(parsed >= 500) ? 'Minimum amount is ₦500' : null,
      disco: disco ? null : 'Select your distribution company',
    });
    setErrors(found);
    if (hasErrors(found) || !disco) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await BillsService.buyElectricity({ meterNumber: meter.trim(), amount: parsed, discoCode: disco.coded });
      toast.success('Electricity payment successful');
      events.emit(WALLET_CHANGED);
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Pay Electricity">
      <View className="gap-4">
        <SelectField
          label="Distribution company"
          placeholder="Select your distribution company"
          value={discoId}
          loading={discosLoading}
          options={discos.map((d) => ({ key: String(d.id), label: d.name }))}
          onChange={setDiscoId}
          error={errors.disco}
          emptyText="No providers available"
        />
        {discosError ? (
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-danger">{discosError}</Text>
            <Pressable onPress={reload} hitSlop={8}>
              <Text className="font-semibold text-primary-600">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        <AppInput label="Meter number" icon="bolt" placeholder="01234567890" value={meter}
          onChangeText={setMeter} keyboardType="number-pad" error={errors.meter} />
        <AppInput label="Amount (NGN)" icon="payments" placeholder="1000" value={amount}
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
        <PrimaryButton text="Pay Now" onPress={submit} loading={loading} />
      </View>
    </FormScreen>
  );
}
