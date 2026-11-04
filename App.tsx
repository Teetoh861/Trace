import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_600SemiBold, BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans';
import { colors, fonts } from './src/theme';
import { StoreProvider } from './src/store';
import { RootParams } from './src/nav';
import { Home } from './src/screens/Home';
import { Cases } from './src/screens/Cases';
import { Profile } from './src/screens/Profile';
import { Describe, Docs, Scope, Review, Quote, Payment } from './src/screens/Request';
import { CaseScreen, Report, FindingScreen, Grades } from './src/screens/CaseReport';

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

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.cream } };

export default function App() {
  const [loaded] = useFonts({
    BricolageGrotesque_600SemiBold, BricolageGrotesque_700Bold,
    InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold,
  });
  const [splash, setSplash] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1400);
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

  const header = {
    headerStyle: { backgroundColor: colors.cream },
    headerShadowVisible: false,
    headerTintColor: colors.rust,
    headerTitleStyle: { fontFamily: fonts.displayMed, color: colors.ink },
    headerBackTitleVisible: false,
  } as const;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={header}>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="Describe" component={Describe} options={{ title: 'New review' }} />
            <Stack.Screen name="Docs" component={Docs} options={{ title: 'New review' }} />
            <Stack.Screen name="Scope" component={Scope} options={{ title: 'New review' }} />
            <Stack.Screen name="Review" component={Review} options={{ title: 'New review' }} />
            <Stack.Screen name="Quote" component={Quote} options={{ title: 'Quote' }} />
            <Stack.Screen name="Payment" component={Payment} options={{ title: 'Payment' }} />
            <Stack.Screen name="Case" component={CaseScreen} options={{ title: 'Case tracking' }} />
            <Stack.Screen name="Report" component={Report} options={{ title: 'Report' }} />
            <Stack.Screen name="Finding" component={FindingScreen} options={{ title: 'Finding' }} />
            <Stack.Screen name="Grades" component={Grades} options={{ title: 'Grades' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
