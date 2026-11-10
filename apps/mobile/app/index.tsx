import { Redirect } from 'expo-router';

export default function Index() {
  // Directs to authentication on cold launch
  return <Redirect href="/(auth)/login" />;
}
