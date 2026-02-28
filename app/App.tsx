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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SplashScreen as CustomSplash } from "./components/SplashScreen";

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

  useEffect(() => {
    if (!showCustomSplash) {
      SplashScreen.hideAsync();
    }
  }, [showCustomSplash]);

  if (showCustomSplash) {
    return (
      <SafeAreaProvider>
        <CustomSplash />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View className="flex-1 items-center justify-center bg-canvas">
        <Text className="font-heading text-2xl text-navy">Darzi</Text>
        <Text className="font-body mt-2 text-base text-charcoal">
          Open up App.tsx to start working on your app!
        </Text>
        <Text className="font-urdu mt-4 py-3 text-xl text-navy leading-loose">
          درزی — سلائی اور تیاری
        </Text>
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}
