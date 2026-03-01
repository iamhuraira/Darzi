import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";

type Nav = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.top}>
        <MaterialCommunityIcons name="scissors-cutting" size={80} color={colors.copper} />
        <Text style={styles.appName}>Darzi App</Text>
        <Text style={styles.tagline}>Manage your tailor shop smartly</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.primaryBtnText}>Create Shop Account</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.outlineBtn, pressed && styles.btnPressed]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.outlineBtnText}>Sign in</Text>
        </Pressable>
      </View>

      <Text style={styles.terms}>By continuing you agree to our Terms & Privacy Policy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.cream,
    marginTop: 24,
    fontFamily: "Poppins_700Bold",
  },
  tagline: {
    fontSize: 14,
    color: colors.mutedGray,
    marginTop: 8,
    fontFamily: "Poppins_400Regular",
  },
  buttons: {
    gap: 16,
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtn: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.copper,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.copper,
    fontFamily: "Poppins_600SemiBold",
  },
  btnPressed: {
    opacity: 0.9,
  },
  terms: {
    fontSize: 12,
    color: colors.mutedGray,
    textAlign: "center",
    marginBottom: 16,
  },
});
