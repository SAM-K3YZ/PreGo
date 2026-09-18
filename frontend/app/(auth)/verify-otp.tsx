import { Screen } from '@/components/ui';
import Typo from '@/components/Typo';

// TODO: OTP input + resend timer. Wire to authService.verifyOtp() ->
// routes to sign-in (or straight to home, depending on backend behavior)
// on success.
export default function VerifyOtp() {
  return (
    <Screen center>
      <Typo size={16} style={{ textAlign: 'center' }}>
        Verify OTP screen — build from Stitch prompt in Notion Phase 10
      </Typo>
    </Screen>
  );
}
