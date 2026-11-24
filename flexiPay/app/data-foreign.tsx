import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { TotalCard } from '@/components/ui/PurchaseParts';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { COUNTRIES } from '@/lib/countries';
import { usePlans } from '@/lib/usePlans';
import { useBuy } from '@/lib/useBuy';
import { hasErrors, validate } from '@/lib/validators';
import { BillsService } from '@/services/billsService';

export default function DataForeignScreen() {
  const [country, setCountry] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ country?: string; phone?: string; plan?: string }>({});
  const { loading, run } = useBuy();

  // Plan catalog key for international data. Change if your backend names it differently.
  const { plans, loading: plansLoading, error: plansError, reload } = usePlans(
    'data-foreign',
    'Could not load plans. Please try again.',
  );

  // Show only the chosen country's plans when the catalog says which country each plan is for.
  const countryPlans = useMemo(() => {
    const selected = COUNTRIES.find((c) => c.code === country);
    if (!selected) return plans;
    const matches = plans.filter((p) => {
      const tag = (p.network ?? p.category ?? '').toLowerCase();
      return tag === selected.code.toLowerCase() || tag === selected.name.toLowerCase();
    });
    return matches.length > 0 ? matches : plans;
  }, [plans, country]);

  useEffect(() => setPlanId(null), [country]);
  const plan = countryPlans.find((p) => String(p.id) === planId);
  const dial = COUNTRIES.find((c) => c.code === country)?.dial;

  const submit = async () => {
    const found = validate({
      country: country ? null : 'Select a country',
      phone: phone.replace(/\D/g, '').length < 7 ? 'Enter a valid phone number' : null,
      plan: plan ? null : 'Select a plan',
    });
    setErrors(found);
    if (hasErrors(found) || !country || !plan) return;

    const result = await run(() =>
      BillsService.buyDataForeign({ country, phone: phone.trim(), planCode: plan.coded, idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) {
      toast.success('International data sent');
      router.back();
    }
  };

  return (
    <FormScreen title="International Data">
      <View className="gap-4">
        <SelectField label="Country" placeholder="Select a country" icon="public" value={country}
          options={COUNTRIES.map((c) => ({ key: c.code, label: `${c.name} (${c.dial})` }))}
          onChange={setCountry} error={errors.country} searchable searchPlaceholder="Search country" />
        <AppInput label="Phone number" icon="phone" placeholder={dial ? `${dial} 700 000 0000` : 'Include the country code'}
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
        <SelectField label="Plan" placeholder="Select a plan" value={planId} loading={plansLoading}
          options={countryPlans.map((p) => ({ key: String(p.id), label: `${p.name} — ₦${p.price?.toFixed(0) ?? '-'}` }))}
          onChange={setPlanId} error={errors.plan} emptyText="No plans available" />
        {plansError ? (
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-danger">{plansError}</Text>
            <Pressable onPress={reload} hitSlop={8}><Text className="font-semibold text-primary-600">Retry</Text></Pressable>
          </View>
        ) : null}
        <TotalCard amount={plan?.price ?? null} />
      </View>
      <View className="mt-6">
        <PrimaryButton text="Buy data" onPress={submit} loading={loading} />
      </View>
    </FormScreen>
  );
}
