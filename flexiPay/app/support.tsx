import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { PrimaryButton } from '@/components/ui/Buttons';
import { FormScreen } from '@/components/ui/Screen';
import { toast } from '@/components/ui/Toast';
import { hasErrors, validate, Validators } from '@/lib/validators';
import { ApiError } from '@/models/types';
import { ContactService } from '@/services/contactService';
import { colors } from '@/theme/colors';

export default function SupportScreen() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    const found = validate({
      name: Validators.required('Name is required')(form.name),
      email: Validators.email(form.email.trim()),
      subject: Validators.required('Subject is required')(form.subject),
      message: Validators.required('Message is required')(form.message),
    });
    setErrors(found);
    if (hasErrors(found)) return;

    setLoading(true);
    try {
      await ContactService.sendMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success("Message sent — we'll get back to you soon");
      router.back();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormScreen title="Help & Support">
      <Text className="mb-5 text-[15px] text-ink-secondary">
        Send us a message and our support team will get back to you by email.
      </Text>
      <View className="gap-4">
        <AppInput label="Your name" icon="person-outline" placeholder="John Doe" value={form.name}
          onChangeText={set('name')} autoCapitalize="words" error={errors.name} />
        <AppInput label="Email" icon="mail-outline" placeholder="your@email.com" value={form.email}
          onChangeText={set('email')} keyboardType="email-address" error={errors.email} />
        <AppInput label="Phone (optional)" icon="phone" placeholder="08012345678" value={form.phone}
          onChangeText={set('phone')} keyboardType="phone-pad" />
        <AppInput label="Subject" icon="subject" placeholder="What is this about?" value={form.subject}
          onChangeText={set('subject')} autoCapitalize="sentences" error={errors.subject} />

        <View>
          <Text className="mb-1.5 ml-1 text-sm font-medium text-ink-secondary">Message</Text>
          <TextInput
            value={form.message}
            onChangeText={set('message')}
            placeholder="Tell us what happened…"
            placeholderTextColor={colors.inkMuted}
            multiline
            textAlignVertical="top"
            className={`min-h-[140px] rounded-2xl border bg-white p-4 text-base text-ink shadow-sm ${
              errors.message ? 'border-danger' : 'border-transparent'
            }`}
          />
          {errors.message ? <Text className="ml-1 mt-1 text-xs text-danger">{errors.message}</Text> : null}
        </View>

        <View className="mt-2">
          <PrimaryButton text="Send Message" onPress={submit} loading={loading} />
        </View>
      </View>
    </FormScreen>
  );
}
