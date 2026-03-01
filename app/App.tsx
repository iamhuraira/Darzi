import "./global.css";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import {
  NotoNastaliqUrdu_400Regular,
  NotoNastaliqUrdu_500Medium,
  NotoNastaliqUrdu_600SemiBold,
  NotoNastaliqUrdu_700Bold,
} from "@expo-google-fonts/noto-nastaliq-urdu";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { colors } from "./theme/colors";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { SplashScreen as CustomSplash } from "./components/SplashScreen";
import "./lib/i18n";
import { useAppStore } from "./stores/appStore";

const queryClient = new QueryClient();

const NavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.copper,
    background: colors.background,
    card: colors.background,
    text: colors.cream,
    border: colors.border,
    notification: colors.copper,
  },
};

const MIN_SPLASH_MS = 1800;

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [minSplashDone, setMinSplashDone] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrdu_500Medium,
    NotoNastaliqUrdu_600SemiBold,
    NotoNastaliqUrdu_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Minimum time so the custom full-screen splash is always visible
  useEffect(() => {
    const t = setTimeout(() => setMinSplashDone(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // Hide native splash once our custom splash has painted
  useEffect(() => {
    const t = setTimeout(() => SplashScreen.hideAsync(), 150);
    return () => clearTimeout(t);
  }, []);

  const appReady = (fontsLoaded || fontError) && minSplashDone;
  const showCustomSplash = !appReady;
  const hydrateLocale = useAppStore((s) => s.hydrateLocale);

  useEffect(() => {
    if (appReady) hydrateLocale();
  }, [appReady, hydrateLocale]);

  useEffect(() => {
    if (!showCustomSplash) {
      SplashScreen.hideAsync();
    }
  }, [showCustomSplash]);

  if (showCustomSplash) {
    return (
      <SafeAreaProvider>
        <CustomSplash />
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.navWrapper}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer theme={NavTheme}>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  navWrapper: { flex: 1, backgroundColor: colors.background },
});
