import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { getTailorUser } from "../utils/tailorStorage";
import { useTailorAuthStore } from "../stores/tailorAuthStore";

type Nav = NativeStackNavigationProp<RootStackParamList, "Login">;

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const setAuth = useTailorAuthStore((s) => s.setAuth);

  const [phone, setPhone] = useState("03086173323");
  const [password, setPassword] = useState("4123004abh");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    setError("");
    const phoneNorm = phone.replace(/\D/g, "").slice(-11);
    if (!phoneNorm || phoneNorm.length < 11 || !password) {
      setError("Enter phone and password");
      return;
    }
    setLoading(true);
    try {
      const user = await getTailorUser();
      const match =
        user &&
        (user.phone.replace(/\D/g, "").endsWith(phoneNorm) || phoneNorm.endsWith(user.phone.replace(/\D/g, ""))) &&
        user.password === password;
      if (!match) {
        setError("Invalid phone or password");
        setLoading(false);
        return;
      }
      const shopId = user.id; // MVP: no separate shop lookup; use userId as placeholder if needed
      const { getTailorShop } = await import("../utils/tailorStorage");
      const shop = await getTailorShop();
      await setAuth({
        isLoggedIn: true,
        userId: user.id,
        shopId: shop?.id ?? user.id,
        role: "owner",
      });
      navigation.replace("Dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
          </Pressable>
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Sign in to your shop account</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="03XX-XXXXXXX"
            placeholderTextColor={colors.creamMuted}
            value={phone}
            onChangeText={(t) => { setPhone(t); setError(""); }}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View style={[styles.passwordInputWrapper, error ? styles.inputError : null]}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInputInner}
              placeholder="Password"
              placeholderTextColor={colors.creamMuted}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              secureTextEntry={!showPassword}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtnInner} hitSlop={12}>
              <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={22} color={colors.creamMuted} />
            </Pressable>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={colors.cream} /> : <Text style={styles.primaryBtnText}>Sign in</Text>}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate("Signup")} style={({ pressed }) => [pressed && styles.btnPressed]}>
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 32 },
  headerRow: { flexDirection: "row", marginBottom: 8 },
  backBtn: { padding: 8, marginLeft: -8 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: colors.mutedGray, marginBottom: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },
  label: { fontSize: 14, fontWeight: "600", color: colors.cream, marginBottom: 8 },
  input: {
    backgroundColor: colors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: { borderColor: colors.error },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  passwordInputInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 44,
    fontSize: 16,
    color: colors.cream,
  },
  eyeBtnInner: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: 12,
    paddingVertical: 16,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center" },
  footerText: { fontSize: 15, color: colors.cream },
  link: { fontSize: 15, fontWeight: "600", color: colors.copper },
});
