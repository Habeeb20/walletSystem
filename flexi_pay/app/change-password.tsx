import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AppInput, VisibilityToggle } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { AuthService } from '@/services/authService';

export default function ChangePasswordScreen() {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const toggle = (k: keyof typeof show) => () => setShow((s) => ({ ...s, [k]: !s[k] }));

  const submit = async () => {
    const found = validate({
      oldPassword: Validators.required('Current password is required')(oldPassword),
      newPassword: Validators.password(newPassword),
      confirm: Validators.confirmPassword(confirm, newPassword),
    });
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await AuthService.changePassword({ oldPassword, newPassword });
      toast.success('Password changed successfully');
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Change Password">
      <View className="gap-4">
        <AppInput label="Current password" icon="lock-outline" placeholder="••••••••" value={oldPassword}
          onChangeText={setOld} secureTextEntry={!show.old} error={errors.oldPassword}
          suffix={<VisibilityToggle visible={show.old} onToggle={toggle('old')} />} />
        <AppInput label="New password" icon="lock-reset" placeholder="••••••••" value={newPassword}
          onChangeText={setNew} secureTextEntry={!show.new} error={errors.newPassword}
          suffix={<VisibilityToggle visible={show.new} onToggle={toggle('new')} />} />
        <AppInput label="Confirm new password" icon="lock-reset" placeholder="••••••••" value={confirm}
          onChangeText={setConfirm} secureTextEntry={!show.confirm} error={errors.confirm}
          returnKeyType="done" onSubmitEditing={submit}
          suffix={<VisibilityToggle visible={show.confirm} onToggle={toggle('confirm')} />} />
        <View className="mt-3">
          <PrimaryButton text="Update Password" onPress={submit} loading={loading} />
        </View>
      </View>
    </FormScreen>
  );
}
