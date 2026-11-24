import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ReceiptSheet } from '@/components/ReceiptSheet';
import { PrimaryButton } from '@/components/ui/Buttons';
import { QuantityStepper } from '@/components/ui/PurchaseParts';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { EXAMS } from '@/lib/countries';
import { useBuy } from '@/lib/useBuy';
import { BillsService } from '@/services/billsService';

export default function ResultCheckerScreen() {
  const [exam, setExam] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>();
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const { loading, run } = useBuy();

  const submit = async () => {
    if (!exam) return setError('Select an exam body');
    setError(undefined);
    const result = await run(() => BillsService.buyResultChecker({ exam, quantity, idempotencyKey: Crypto.randomUUID() }));
    if (result) setReceipt(result);
  };

  return (
    <FormScreen title="Result Checker">
      <View className="gap-4">
        <SelectField label="Exam body" placeholder="Select WAEC, NECO or NABTEB" icon="school" value={exam}
          options={EXAMS} onChange={setExam} error={error} />
        <QuantityStepper label="How many PINs?" value={quantity} max={5} onChange={setQuantity} />
        <Text className="ml-1 text-xs leading-5 text-ink-secondary">
          The fee is taken from your wallet. Your PIN and serial number appear on the next screen, so save them.
        </Text>
      </View>
      <View className="mt-6">
        <PrimaryButton text="Buy result checker" onPress={submit} loading={loading} />
      </View>

      <ReceiptSheet visible={!!receipt} title="Your result checker" data={receipt}
        onClose={() => { setReceipt(null); router.back(); }} />
    </FormScreen>
  );
}
