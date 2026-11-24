import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { ApiError } from '@/models/types';
import { WalletService } from '@/services/walletService';

export default function FundWalletScreen() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const start = async () => {
    const value = Number(amount.trim());
    if (!(value > 0)) {
      setError('Enter a valid amount');
      return;
    }
    setError(undefined);

    setLoading(true);
    try {
      const { url } = await WalletService.fundWallet(value);
      router.push({ pathname: '/checkout', params: { url } });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Fund Wallet">
      <Text className="mb-5 text-lg font-semibold text-ink">How much would you like to add?</Text>
      <AppInput label="Amount (NGN)" icon="payments" placeholder="5000" value={amount}
        onChangeText={setAmount} keyboardType="decimal-pad" error={error}
        returnKeyType="done" onSubmitEditing={start} />
      <View className="mt-6">
        <PrimaryButton text="Continue to Payment" icon="arrow-forward" onPress={start} loading={loading} />
      </View>
    </FormScreen>
  );
}
