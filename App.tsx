import './global.css';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/utils/theme';

Sentry.init({
  dsn: 'https://886a3ee2b6df019e25983d7a17a58a5c@o4510409776627712.ingest.us.sentry.io/4510409778659328',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default Sentry.wrap(App);
