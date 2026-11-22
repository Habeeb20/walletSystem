import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ReceiptSheet } from '@/components/ReceiptSheet';
import { PrimaryButton } from '@/components/ui/Buttons';
import { NETWORK_BRANDS, NetworkSelector } from '@/components/ui/NetworkSelector';
import { QuantityStepper, TotalCard } from '@/components/ui/PurchaseParts';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { usePlans } from '@/lib/usePlans';
import { useBuy } from '@/lib/useBuy';
import { BillsService } from '@/services/billsService';

export default function DataPinScreen() {
  const [network, setNetwork] = useState(NETWORK_BRANDS[0].code);
  const [planId, setPlanId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>();
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const { loading, run } = useBuy();

  const { plans, loading: plansLoading, error: plansError, reload } = usePlans(
    network,
    'Could not load plans. Please try again.',
  );
  useEffect(() => setPlanId(null), [network]);

  const plan = plans.find((p) => String(p.id) === planId);

  const submit = async () => {
    if (!plan) return setError('Select a plan');
    setError(undefined);
    const result = await run(() =>
      BillsService.buyDataPin({ network, planCode: plan.coded, quantity, idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) setReceipt(result);
  };

  return (
    <FormScreen title="Data PIN">
      <Text className="mb-3 text-base font-semibold text-ink">Network</Text>
      <NetworkSelector selected={network} onSelected={setNetwork} />

      <View className="mt-6 gap-4">
        <SelectField label="Plan" placeholder="Select a plan" value={planId} loading={plansLoading}
          options={plans.map((p) => ({ key: String(p.id), label: `${p.name} — ₦${p.price?.toFixed(0) ?? '-'}` }))}
          onChange={setPlanId} error={error} emptyText="No plans available" />
        {plansError ? (
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-danger">{plansError}</Text>
            <Pressable onPress={reload} hitSlop={8}><Text className="font-semibold text-primary-600">Retry</Text></Pressable>
          </View>
        ) : null}
        <QuantityStepper label="How many vouchers?" value={quantity} max={10} onChange={setQuantity} />
        <TotalCard amount={plan?.price != null ? plan.price * quantity : null} note="Your PINs appear on the next screen." />
      </View>

      <View className="mt-6">
        <PrimaryButton text="Buy PIN" onPress={submit} loading={loading} />
      </View>

      <ReceiptSheet visible={!!receipt} title="Your data PINs" data={receipt}
        onClose={() => { setReceipt(null); router.back(); }} />
    </FormScreen>
  );
}
