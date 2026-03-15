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
import { getStyleForDynamicText } from "../theme/fonts";
import { ownerSignupSchema, type OwnerSignupInput } from "../utils/validation";
import { useAppStore } from "../stores/appStore";
import { t } from "../utils/lang";

type Nav = NativeStackNavigationProp<RootStackParamList, "Signup">;

export function SignupScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const language = useAppStore((s) => s.language);
  const isRtl = language === "urdu";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+92 ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof OwnerSignupInput, string>>>({});
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  function handleContinue() {
    setErrors({});
    const rawPhone = phone.replace(/\D/g, "");
    const toValidate = {
      name: name.trim(),
      phone: rawPhone.length >= 11 ? rawPhone : phone.trim(),
      password,
      confirmPassword,
    };
    const result = ownerSignupSchema.safeParse(toValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OwnerSignupInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof OwnerSignupInput;
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("RegisterShop", { step1: result.data });
    }, 600);
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }, isRtl && styles.rtl]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={20}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isRtl && styles.rtl]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerRow, isRtl && styles.rtl]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name={isRtl ? "arrow-right" : "arrow-left"} size={24} color={colors.cream} />
          </Pressable>
        </View>
        <Text style={[styles.title, getStyleForDynamicText(t("auth.createAccount", language), 22)]}>{t("auth.createAccount", language)}</Text>
        <Text style={[styles.subtitle, getStyleForDynamicText(t("auth.step1Personal", language), 14)]}>{t("auth.step1Personal", language)}</Text>

        <View style={[styles.card, isRtl && styles.rtl]}>
          <Text style={[styles.label, getStyleForDynamicText(t("common.fullName", language), 14)]}>{t("common.fullName", language)}</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError, isRtl && styles.inputRtl]}
            placeholder={t("auth.enterFullName", language)}
            placeholderTextColor={colors.creamMuted}
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            autoCapitalize="words"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("common.phoneNumber", language), 14)]}>{t("common.phoneNumber", language)}</Text>
          <TextInput
            ref={phoneRef}
            style={[styles.input, errors.phone && styles.inputError, isRtl && styles.inputRtl]}
            placeholder={t("auth.phonePlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            value={phone}
            onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: undefined })); }}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("common.password", language), 14)]}>{t("common.password", language)}</Text>
          <View style={[styles.passwordInputWrapper, errors.password && styles.inputError, isRtl && styles.rtl]}>
            <TextInput
              ref={passwordRef}
              style={[styles.passwordInputInner, isRtl && styles.inputRtl]}
              placeholder={t("auth.passwordPlaceholder", language)}
              placeholderTextColor={colors.creamMuted}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors((e) => ({ ...e, password: undefined })); }}
              secureTextEntry={!showPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtnInner} hitSlop={12}>
              <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={22} color={colors.creamMuted} />
            </Pressable>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("common.confirmPassword", language), 14)]}>{t("common.confirmPassword", language)}</Text>
          <View style={[styles.passwordInputWrapper, errors.confirmPassword && styles.inputError, isRtl && styles.rtl]}>
            <TextInput
              ref={confirmRef}
              style={[styles.passwordInputInner, isRtl && styles.inputRtl]}
              placeholder={t("common.confirmPassword", language)}
              placeholderTextColor={colors.creamMuted}
              value={confirmPassword}
              onChangeText={(t) => { setConfirmPassword(t); setErrors((e) => ({ ...e, confirmPassword: undefined })); }}
              secureTextEntry={!showConfirm}
              returnKeyType="go"
              onSubmitEditing={handleContinue}
            />
            <Pressable onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtnInner} hitSlop={12}>
              <MaterialCommunityIcons name={showConfirm ? "eye-off" : "eye"} size={22} color={colors.creamMuted} />
            </Pressable>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtnOuter, pressed && styles.btnPressed]}
          onPress={handleContinue}
          disabled={loading}
        >
          <View style={styles.primaryBtn}>
            {loading ? (
              <ActivityIndicator color={colors.cream} size="small" />
            ) : (
              <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("auth.continueToShopDetails", language), 16)]}>{t("auth.continueToShopDetails", language)}</Text>
            )}
          </View>
        </Pressable>

        <View style={[styles.footer, isRtl && styles.rtl]}>
          <Text style={[styles.footerText, getStyleForDynamicText(t("auth.haveAccount", language), 15)]}>{t("auth.haveAccount", language)} </Text>
          <Pressable onPress={() => navigation.navigate("Login")} style={({ pressed }) => [pressed && styles.btnPressed]}>
            <Text style={[styles.link, getStyleForDynamicText(t("common.signIn", language), 15)]}>{t("common.signIn", language)}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  rtl: { direction: "rtl" },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 32 },
  headerRow: { flexDirection: "row", marginBottom: 8 },
  backBtn: { padding: 8, marginStart: -8 },
  inputRtl: { textAlign: "right" },
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
  primaryBtnOuter: {
    marginTop: 8,
    marginBottom: 24,
    minHeight: 52,
    alignSelf: "stretch",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.copper,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#A35220",
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
  footer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", marginTop: 20},
  footerText: { fontSize: 15, color: colors.cream },
  link: { fontSize: 15, fontWeight: "600", color: colors.copper },
});
