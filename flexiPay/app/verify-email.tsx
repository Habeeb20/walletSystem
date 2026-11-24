import { router, useLocalSearchParams } from 'expo-router';

import { CodeVerification } from '@/components/CodeVerification';
import { EMAIL_VERIFIED, events } from '@/lib/events';
import { AuthService } from '@/services/authService';

/** Step between registration and username selection: the backend requires a verified email. */
export default function VerifyEmailScreen() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();

  return (
    <CodeVerification
      title="Verify your email"
      subtitle={`Enter the 4-digit code we sent to ${email}`}
      resendMessage={`A new code has been sent to ${email}`}
      onSubmit={async (code) => {
        await AuthService.verifyEmail(email, code);
        router.back();
        events.emit(EMAIL_VERIFIED); // register screen moves on to the username step
      }}
      onResend={() => AuthService.resendVerification(email)}
    />
  );
}
