import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { NETWORK_BRANDS, NetworkSelector } from '@/components/ui/NetworkSelector';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { events, WALLET_CHANGED } from '@/lib/events';
import { usePlans } from '@/lib/usePlans';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { BillsService } from '@/services/billsService';

export default function DataScreen() {
  const [network, setNetwork] = useState(NETWORK_BRANDS[0].code);
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ phone?: string; plan?: string }>({});
  const [loading, setLoading] = useState(false);

  const { plans, loading: plansLoading, error: plansError, reload } = usePlans(
    network,
    'Could not load plans. Please try again.',
  );

  // A new network means a new catalog: clear the previous selection.
  useEffect(() => setPlanId(null), [network]);

  const submit = async () => {
    const plan = plans.find((p) => String(p.id) === planId);
    const found = validate({
      phone: Validators.minLength10('Enter a valid phone number')(phone),
      plan: plan ? null : 'Select a plan',
    });
    setErrors(found);
    if (hasErrors(found) || !plan || plan.price == null) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await BillsService.buyData({ planCode: plan.coded, phone: phone.trim(), price: plan.price });
      toast.success('Data purchase successful');
      events.emit(WALLET_CHANGED);
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Buy Data">
      <Text className="mb-3 text-base font-semibold text-ink">Network</Text>
      <NetworkSelector selected={network} onSelected={setNetwork} />

      <View className="mt-6 gap-4">
        <AppInput label="Phone number" icon="phone" placeholder="08012345678" value={phone}
          onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />

        <SelectField
          label="Plan"
          placeholder="Select a plan"
          value={planId}
          loading={plansLoading}
          options={plans.map((p) => ({ key: String(p.id), label: `${p.name} — ₦${p.price?.toFixed(0) ?? '-'}` }))}
          onChange={setPlanId}
          error={errors.plan}
          emptyText="No plans available"
        />
        {plansError ? (
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-danger">{plansError}</Text>
            <Pressable onPress={reload} hitSlop={8}>
              <Text className="font-semibold text-primary-600">Retry</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View className="mt-8">
        <PrimaryButton text="Buy Data" onPress={submit} loading={loading} />
      </View>
    </FormScreen>
  );
}
