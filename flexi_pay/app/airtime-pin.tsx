import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { ReceiptSheet } from '@/components/ReceiptSheet';
import { AmountChips } from '@/components/ui/AmountChips';
import { PrimaryButton } from '@/components/ui/Buttons';
import { NETWORK_BRANDS, NetworkSelector } from '@/components/ui/NetworkSelector';
import { QuantityStepper, TotalCard } from '@/components/ui/PurchaseParts';
import { FormScreen } from '@/components/ui/Screen';
import { useBuy } from '@/lib/useBuy';
import { BillsService } from '@/services/billsService';

const DENOMINATIONS = [100, 200, 500, 1000];

export default function AirtimePinScreen() {
  const [network, setNetwork] = useState(NETWORK_BRANDS[0].code);
  const [amount, setAmount] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const { loading, run } = useBuy();

  const submit = async () => {
    const result = await run(() =>
      BillsService.buyAirtimePin({ network, amount, quantity, idempotencyKey: Crypto.randomUUID() }),
    );
    if (result) setReceipt(result);
  };

  return (
    <FormScreen title="Airtime PIN">
      <Text className="mb-3 text-base font-semibold text-ink">Network</Text>
      <NetworkSelector selected={network} onSelected={setNetwork} />

      <Text className="mb-3 mt-6 text-base font-semibold text-ink">Card value</Text>
      <AmountChips amounts={DENOMINATIONS} selected={amount} onSelected={setAmount} />

      <View className="mt-6 gap-4">
        <QuantityStepper label="How many cards?" value={quantity} max={10} onChange={setQuantity} />
        <TotalCard amount={amount * quantity} note="Your PINs appear on the next screen. Keep them safe." />
      </View>

      <View className="mt-6">
        <PrimaryButton text="Buy PIN" onPress={submit} loading={loading} />
      </View>

      <ReceiptSheet visible={!!receipt} title="Your airtime PINs" data={receipt}
        onClose={() => { setReceipt(null); router.back(); }} />
    </FormScreen>
  );
}
