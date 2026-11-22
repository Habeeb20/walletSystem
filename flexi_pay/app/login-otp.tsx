import { useLocalSearchParams } from 'expo-router';

import { CodeVerification } from '@/components/CodeVerification';
import { onLoginVerified } from '@/lib/postLogin';
import { AuthService } from '@/services/authService';

/** Second half of passwordless login: exchange the emailed code for a session. */
export default function LoginOtpScreen() {
  const { email = '' } = useLocalSearchParams<{ email: string }>();

  return (
    <CodeVerification
      title="Verify it's you"
      subtitle={`Enter the code we sent to ${email}`}
      resendMessage={`A new code has been sent to ${email}`}
      onSubmit={async (code) => {
        await AuthService.verifyLoginOtp(email, code);
        await onLoginVerified();
      }}
      onResend={() => AuthService.requestLoginOtp(email)}
    />
  );
}
