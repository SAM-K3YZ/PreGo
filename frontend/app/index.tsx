import { Redirect } from 'expo-router';

// Splash decides where to go: home, onboarding (not finished yet) or sign-in.
export default function Index() {
  return <Redirect href="/(onboarding)/splash" />;
}
