import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { events, WALLET_CHANGED } from '@/lib/events';
import { usePlans } from '@/lib/usePlans';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { BillsService } from '@/services/billsService';

/** Display name -> plan catalog key on the backend. */
const PROVIDERS: Record<string, string> = {
  DStv: 'dstv',
  GOtv: 'gotv',
  Startimes: 'startimes',
  Showmax: 'showmax',
};

export default function TvScreen() {
  const [provider, setProvider] = useState('DStv');
  const [smartCard, setSmartCard] = useState('');
  const [planId, setPlanId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ smartCard?: string; plan?: string }>({});
  const [loading, setLoading] = useState(false);

  const { plans, loading: plansLoading, error: plansError, reload } = usePlans(
    PROVIDERS[provider],
    'Could not load plans. Please try again.',
  );

  useEffect(() => setPlanId(null), [provider]);

  const submit = async () => {
    const plan = plans.find((p) => String(p.id) === planId);
    const found = validate({
      smartCard: Validators.minLength10('Enter a valid smart card number')(smartCard),
      plan: plan ? null : 'Select a package',
    });
    setErrors(found);
    if (hasErrors(found) || !plan || plan.price == null) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await BillsService.buyTvSubscription({
        planCode: plan.coded,
        smartCardNumber: smartCard.trim(),
        price: plan.price,
      });
      toast.success('TV subscription successful');
      events.emit(WALLET_CHANGED);
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Cable TV">
      <View className="gap-4">
        <SelectField
          label="Provider"
          placeholder="Select a provider"
          value={provider}
          options={Object.keys(PROVIDERS).map((name) => ({ key: name, label: name }))}
          onChange={setProvider}
        />

        <AppInput label="Smart card / IUC number" icon="tv" placeholder="1234567890" value={smartCard}
          onChangeText={setSmartCard} keyboardType="number-pad" error={errors.smartCard} />

        <SelectField
          label="Package"
          placeholder="Select a package"
          value={planId}
          loading={plansLoading}
          options={plans.map((p) => ({ key: String(p.id), label: `${p.name} — ₦${p.price?.toFixed(0) ?? '-'}` }))}
          onChange={setPlanId}
          error={errors.plan}
          emptyText="No packages available"
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
        <PrimaryButton text="Subscribe" onPress={submit} loading={loading} />
      </View>
    </FormScreen>
  );
}
