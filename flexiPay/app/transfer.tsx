import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { LinkText, PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { SelectField } from '@/components/ui/SelectField';
import { toast } from '@/components/ui/Toast';
import { BiometricService } from '@/core/security/biometricService';
import { events, WALLET_CHANGED } from '@/lib/events';
import { naira } from '@/lib/format';
import { ApiError, type Bank, type VerifiedAccount } from '@/models/types';
import { TransferService } from '@/services/transferService';
import { colors } from '@/theme/colors';

export default function TransferScreen() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [bankCode, setBankCode] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [verified, setVerified] = useState<VerifiedAccount | null>(null);
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [errors, setErrors] = useState<{ bank?: string; account?: string }>({});
  const [verifying, setVerifying] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const loadBanks = useCallback(async () => {
    setBanksLoading(true);
    try {
      setBanks(await TransferService.fetchBanks());
    } catch {
      toast.error('Could not load banks. Please try again.');
    } finally {
      setBanksLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  const selectedBank = banks.find((b) => b.code === bankCode);

  // Changing the recipient invalidates any earlier verification.
  const changeBank = (code: string) => {
    setBankCode(code);
    setVerified(null);
    setErrors((e) => ({ ...e, bank: undefined }));
  };
  const changeAccount = (value: string) => {
    setAccountNumber(value);
    setVerified(null);
  };

  const verifyAccount = async () => {
    const found = {
      bank: selectedBank ? undefined : 'Select a bank',
      account: accountNumber.trim().length < 10 ? 'Enter a valid account number' : undefined,
    };
    setErrors(found);
    if (found.bank || found.account || !selectedBank) return;

    setVerifying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      setVerified(
        await TransferService.verifyAccount({ bankCode: selectedBank.code, accountNumber: accountNumber.trim() }),
      );
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Account verification failed');
    } finally {
      setVerifying(false);
    }
  };

  /** Biometric/device prompt when enrolled, otherwise a plain confirmation dialog. */
  const confirm = async (value: number, account: VerifiedAccount): Promise<boolean> => {
    if (await BiometricService.isEnrolled()) {
      const ok = await BiometricService.authenticateDeviceOwner(`Confirm transfer of ${naira(value)}`);
      if (!ok) toast.error('Authentication required to send money');
      return ok;
    }
    return new Promise<boolean>((resolve) =>
      Alert.alert(
        'Confirm transfer',
        `Send ${naira(value)} to ${account.accountName} (${account.bankName})?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Confirm', onPress: () => resolve(true) },
        ],
        { onDismiss: () => resolve(false) },
      ),
    );
  };

  const send = async () => {
    const value = Number(amount.trim());
    if (!verified) return;
    if (!(value > 0)) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!(await confirm(value, verified))) return;

    setTransferring(true);
    try {
      await TransferService.transferFunds({
        accountNumber: verified.accountNumber,
        accountName: verified.accountName,
        bankCode: verified.bankCode,
        bankName: verified.bankName,
        amount: value,
        narration: narration.trim(),
      });
      toast.success('Transfer successful');
      events.emit(WALLET_CHANGED);
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Transfer failed. Please try again.');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <FormScreen title="Send Money">
      <View className="gap-4">
        <SelectField
          label="Bank"
          placeholder="Search or select a bank"
          title="Select Bank"
          icon="account-balance"
          value={bankCode}
          loading={banksLoading}
          options={banks.map((b) => ({ key: b.code, label: b.name }))}
          onChange={changeBank}
          error={errors.bank}
          searchable
          searchPlaceholder="Search bank name"
          emptyText="No banks available. Check your connection."
        />
        {!banksLoading && banks.length === 0 ? (
          <View className="items-start">
            <LinkText text="Retry loading banks" onPress={loadBanks} />
          </View>
        ) : null}

        <AppInput label="Account number" icon="numbers" placeholder="0123456789" value={accountNumber}
          onChangeText={changeAccount} keyboardType="number-pad" maxLength={10} error={errors.account} />

        {!verified ? (
          <PrimaryButton text="Verify Account" onPress={verifyAccount} loading={verifying} />
        ) : (
          <>
            <View className="flex-row items-center rounded-2xl border border-primary-500/30 bg-primary-500/10 p-4">
              <MaterialIcons name="verified" size={24} color={colors.primary600} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-ink">{verified.accountName}</Text>
                <Text className="text-xs text-ink-secondary">
                  {verified.bankName} · {verified.accountNumber}
                </Text>
              </View>
            </View>

            <AppInput label="Amount (NGN)" icon="payments" placeholder="1000" value={amount}
              onChangeText={setAmount} keyboardType="decimal-pad" />
            <AppInput label="Narration (optional)" icon="subject" placeholder="What is this for?" value={narration}
              onChangeText={setNarration} autoCapitalize="sentences" />

            <View className="mt-2">
              <PrimaryButton text="Send Money" icon="send" onPress={send} loading={transferring} />
            </View>
          </>
        )}
      </View>
    </FormScreen>
  );
}
