import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const LOGO_SIZE = 150;
const GOLD_BAR_HEIGHT = 4;
const GOLD_BAR_WIDTH = 100;

export function SplashScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Image
          source={require("../assets/darzii.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Darzi logo"
        />
        <View style={styles.goldBar} />
        <Text style={styles.title}>Darzi</Text>
      </View>
      <View style={styles.footer}>
        <View style={[styles.footerBar, { width: GOLD_BAR_WIDTH * 1.5 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    marginBottom: 24,
  },
  goldBar: {
    width: GOLD_BAR_WIDTH,
    height: GOLD_BAR_HEIGHT,
    backgroundColor: colors.gold,
    borderRadius: GOLD_BAR_HEIGHT / 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: colors.navy,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 22,
    color: colors.navy,
    marginTop: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    letterSpacing: 2,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerBar: {
    height: 3,
    backgroundColor: colors.goldPale,
    borderRadius: 2,
  },
});
