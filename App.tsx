import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_600SemiBold, BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans';
import { colors, fonts } from './src/theme';
import { StoreProvider, useStore } from './src/store';
import { RootParams } from './src/nav';
import { Home } from './src/screens/Home';
import { Cases } from './src/screens/Cases';
import { Profile } from './src/screens/Profile';
import { Describe, Docs, Scope, Review, Quote, Payment } from './src/screens/Request';
import { CaseScreen, Report, FindingScreen, Grades } from './src/screens/CaseReport';
import { Welcome, Phone, Otp, Receipt, Messages, Notifications, Verify, Help } from './src/screens/Extra';

const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.rust,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.cream, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.bodyMed, fontSize: 12 },
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Cases" component={Cases} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// The app lives under /app so the marketing site can own /.
const linking: LinkingOptions<RootParams> = {
  prefixes: [],
  config: {
    screens: {
      Tabs: { path: 'app', screens: { Home: '', Cases: 'cases', Profile: 'profile' } },
      Describe: 'app/new/describe',
      Docs: 'app/new/documents',
      Scope: 'app/new/scope',
      Review: 'app/new/review',
      Quote: 'app/new/quote',
      Payment: 'app/new/payment',
      Receipt: 'app/receipt/:id',
      Case: 'app/case/:id',
      Messages: 'app/case/:id/messages',
      Report: 'app/report/:id',
      Finding: 'app/report/:id/finding/:fid',
      Verify: 'app/verify/:id?',
      Grades: 'app/grades',
      Notifications: 'app/notifications',
      Help: 'app/help',
    },
  } as LinkingOptions<RootParams>['config'],
};

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.cream } };

const header = {
  headerStyle: { backgroundColor: colors.cream },
  headerShadowVisible: false,
  headerTintColor: colors.rust,
  headerTitleStyle: { fontFamily: fonts.displayMed, color: colors.ink },
  headerBackTitleVisible: false,
} as const;

function Root() {
  const { signedIn } = useStore();
  return (
    <NavigationContainer theme={theme} linking={linking} documentTitle={{ formatter: () => 'TRACE' }}>
      <StatusBar style={signedIn ? 'dark' : 'light'} />
      <Stack.Navigator screenOptions={header}>
        {!signedIn ? (
          <>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="Phone" component={Phone} options={{ title: 'Sign in' }} />
            <Stack.Screen name="Otp" component={Otp} options={{ title: 'Verify' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Describe" component={Describe} options={{ title: 'New review' }} />
            <Stack.Screen name="Docs" component={Docs} options={{ title: 'New review' }} />
            <Stack.Screen name="Scope" component={Scope} options={{ title: 'New review' }} />
            <Stack.Screen name="Review" component={Review} options={{ title: 'New review' }} />
            <Stack.Screen name="Quote" component={Quote} options={{ title: 'Quote' }} />
            <Stack.Screen name="Payment" component={Payment} options={{ title: 'Payment' }} />
            <Stack.Screen name="Receipt" component={Receipt} options={{ title: 'Receipt', headerBackVisible: false }} />
            <Stack.Screen name="Case" component={CaseScreen} options={{ title: 'Case tracking' }} />
            <Stack.Screen name="Messages" component={Messages} options={{ title: 'Messages' }} />
            <Stack.Screen name="Report" component={Report} options={{ title: 'Report' }} />
            <Stack.Screen name="Finding" component={FindingScreen} options={{ title: 'Finding' }} />
            <Stack.Screen name="Verify" component={Verify} options={{ title: 'Verify' }} />
            <Stack.Screen name="Grades" component={Grades} options={{ title: 'Grades' }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
            <Stack.Screen name="Help" component={Help} options={{ title: 'Help' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [loaded] = useFonts({
    BricolageGrotesque_600SemiBold, BricolageGrotesque_700Bold,
    InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold,
  });
  const [splash, setSplash] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (!loaded || splash) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.rust, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar style="light" />
        {loaded ? (
          <Text style={{ fontFamily: fonts.display, fontSize: 44, color: '#fff', letterSpacing: 6 }}>TRACE</Text>
        ) : (
          <ActivityIndicator color="#fff" />
        )}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
