import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { shopRegistrationSchema, type ShopRegistrationInput } from "../utils/validation";
import { generateId, setTailorShop, setTailorUser } from "../utils/tailorStorage";
import { useTailorAuthStore } from "../stores/tailorAuthStore";
import { useAppStore } from "../stores/appStore";
import { t } from "../utils/lang";

const CITIES = ["Lahore"]; // Only Lahore for now

type Nav = NativeStackNavigationProp<RootStackParamList, "RegisterShop">;
type Route = RouteProp<RootStackParamList, "RegisterShop">;

export function RegisterShopScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const step1 = route.params?.step1;
  const setAuth = useTailorAuthStore((s) => s.setAuth);
  const language = useAppStore((s) => s.language);
  const isRtl = language === "urdu";

  const [shopName, setShopName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [city, setCity] = useState("Lahore");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ShopRegistrationInput, string>>>({});
  const [loading, setLoading] = useState(false);

  if (!step1) {
    navigation.replace("Signup");
    return null;
  }

  async function handleCreateShop() {
    setErrors({});
    const toValidate = {
      shopName: shopName.trim(),
      shopPhone: shopPhone.trim(),
      city: city.trim(),
      address: address.trim(),
      description: description.trim(),
    };
    const result = shopRegistrationSchema.safeParse(toValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShopRegistrationInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ShopRegistrationInput;
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const userId = generateId();
      const shopId = generateId();
      const now = new Date().toISOString();
      const phoneNorm = step1.phone.replace(/\D/g, "").slice(-11);
      const phoneFormatted = phoneNorm.startsWith("0") ? phoneNorm : "0" + phoneNorm;

      await setTailorUser({
        id: userId,
        name: step1.name,
        phone: phoneFormatted,
        password: step1.password,
        createdAt: now,
      });

      await setTailorShop({
        id: shopId,
        ownerId: userId,
        shopName: result.data.shopName,
        shopPhone: result.data.shopPhone,
        city: result.data.city,
        address: result.data.address,
        description: result.data.description ?? "",
        plan: "free",
        createdAt: now,
      });

      await setAuth({
        isLoggedIn: true,
        userId,
        shopId,
        role: "owner",
      });

      Alert.alert(t("common.success", language), t("auth.shopCreated", language), [
        { text: "OK" }, // RootNavigator already switched to Drawer (Dashboard) when auth was set
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
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
        <Text style={[styles.title, getStyleForDynamicText(t("auth.registerShop", language), 22)]}>{t("auth.registerShop", language)}</Text>
        <Text style={[styles.subtitle, getStyleForDynamicText(t("auth.step2Shop", language), 14)]}>{t("auth.step2Shop", language)}</Text>
        <View style={styles.stepDots}>
          <View style={[styles.dot, styles.dotInactive]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>

        <View style={[styles.card, isRtl && styles.rtl]}>
          <Text style={[styles.label, getStyleForDynamicText(t("auth.shopName", language), 14)]}>{t("auth.shopName", language)}</Text>
          <TextInput
            style={[styles.input, errors.shopName && styles.inputError, isRtl && styles.inputRtl]}
            placeholder={t("auth.shopName", language)}
            placeholderTextColor={colors.creamMuted}
            value={shopName}
            onChangeText={(t) => { setShopName(t); setErrors((e) => ({ ...e, shopName: undefined })); }}
          />
          {errors.shopName ? <Text style={styles.errorText}>{errors.shopName}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("auth.shopPhone", language), 14)]}>{t("auth.shopPhone", language)}</Text>
          <TextInput
            style={[styles.input, errors.shopPhone && styles.inputError, isRtl && styles.inputRtl]}
            placeholder={t("auth.phonePlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            value={shopPhone}
            onChangeText={(t) => { setShopPhone(t); setErrors((e) => ({ ...e, shopPhone: undefined })); }}
            keyboardType="phone-pad"
          />
          {errors.shopPhone ? <Text style={styles.errorText}>{errors.shopPhone}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("auth.city", language), 14)]}>{t("auth.city", language)}</Text>
          <View style={styles.cityRow}>
            {CITIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => { setCity(c); setErrors((e) => ({ ...e, city: undefined })); }}
                style={[styles.chip, city === c && styles.chipActive]}
              >
                <Text style={[styles.chipText, city === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("auth.shopAddress", language), 14)]}>{t("auth.shopAddress", language)}</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline, errors.address && styles.inputError, isRtl && styles.inputRtl]}
            placeholder={t("auth.shopAddressPlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            value={address}
            onChangeText={(t) => { setAddress(t); setErrors((e) => ({ ...e, address: undefined })); }}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }, getStyleForDynamicText(t("auth.shopDescription", language), 14)]}>{t("auth.shopDescription", language)}</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline, isRtl && styles.inputRtl]}
            placeholder={t("auth.shopDescriptionPlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
            maxLength={500}
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtnOuter, pressed && styles.btnPressed]}
          onPress={() => void handleCreateShop()}
          disabled={loading}
        >
          <View style={styles.primaryBtn}>
            {loading ? (
              <ActivityIndicator color={colors.cream} />
            ) : (
              <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("auth.createMyShop", language), 16)]}>{t("auth.createMyShop", language)}</Text>
            )}
          </View>
        </Pressable>
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
  subtitle: { fontSize: 14, color: colors.mutedGray, marginBottom: 8 },
  stepDots: { flexDirection: "row", gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotInactive: { backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.copper },
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
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  cityRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.copper, backgroundColor: "rgba(196,98,45,0.2)" },
  chipText: { fontSize: 14, color: colors.creamMuted },
  chipTextActive: { color: colors.copper, fontWeight: "600" },
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  primaryBtnOuter: {
    minHeight: 52,
    alignSelf: "stretch",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.copper,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
});
