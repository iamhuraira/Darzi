import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const LOGO_SIZE = 150;
const BAR_HEIGHT = 4;
const BAR_WIDTH = 100;

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
        <View style={styles.copperBar} />
        <Text style={styles.title}>Darzi</Text>
      </View>
      <View style={styles.footer}>
        <View style={[styles.footerBar, { width: BAR_WIDTH * 1.5 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  copperBar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: colors.copper,
    borderRadius: BAR_HEIGHT / 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: colors.cream,
    letterSpacing: 1,
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerBar: {
    height: 3,
    backgroundColor: colors.gold,
    borderRadius: 2,
  },
});
