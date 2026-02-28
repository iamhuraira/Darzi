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
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function App() {
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
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
  );
}
