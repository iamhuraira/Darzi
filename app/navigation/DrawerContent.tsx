import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { getStyleForDynamicText } from "../theme/fonts";
import { getTailorShop } from "../utils/tailorStorage";
import type { TailorShop } from "../utils/tailorStorage";
import { useTailorAuthStore } from "../stores/tailorAuthStore";
import { useAppStore } from "../stores/appStore";
import { t } from "../utils/lang";
import type { AppLanguage } from "../utils/lang";
export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const logout = useTailorAuthStore((s) => s.logout);
  const auth = useTailorAuthStore((s) => s.auth);
  const language = useAppStore((s) => s.language);
  const isRtl = language === "urdu";
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [shop, setShop] = useState<TailorShop | null>(null);
  const { state, navigation } = props;

  useEffect(() => {
    if (auth?.shopId) {
      getTailorShop().then((s) => s && setShop(s));
    }
  }, [auth?.shopId]);

  async function handleLogout() {
    await logout();
  }

  const shopName = shop?.shopName ?? "My Shop";
  const shopNameStyle = getStyleForDynamicText(shopName, 20);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>Darzi</Text>
        <View style={[styles.shopRow, isRtl && styles.rtl]}>
          <MaterialCommunityIcons name="store" size={32} color={colors.copper} />
          <View style={styles.shopNameWrap}>
            <Text
              style={[
                styles.shopName,
                shopNameStyle,
                { lineHeight: 34, textAlignVertical: "center" },
              ]}
              numberOfLines={2}
            >
              {shopName}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.menu, isRtl && styles.rtl]}>
        <Pressable
          style={[styles.menuItem, state.routes[state.index]?.name === "Dashboard" && styles.menuItemActive]}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <MaterialCommunityIcons name="view-dashboard" size={22} color={colors.cream} />
          <Text style={[styles.menuItemText, getStyleForDynamicText(t("drawer.dashboard", language), 16)]}>{t("drawer.dashboard", language)}</Text>
        </Pressable>
        <Pressable
          style={[styles.menuItem, state.routes[state.index]?.name === "Customers" && styles.menuItemActive]}
          onPress={() => navigation.navigate("Customers")}
        >
          <MaterialCommunityIcons name="account-group" size={22} color={colors.cream} />
          <Text style={[styles.menuItemText, getStyleForDynamicText(t("drawer.customers", language), 16)]}>{t("drawer.customers", language)}</Text>
        </Pressable>
        <Pressable
          style={[styles.menuItem, state.routes[state.index]?.name === "Orders" && styles.menuItemActive]}
          onPress={() => navigation.navigate("Orders")}
        >
          <MaterialCommunityIcons name="clipboard-list-outline" size={22} color={colors.cream} />
          <Text style={[styles.menuItemText, getStyleForDynamicText(t("drawer.orders", language), 16)]}>{t("drawer.orders", language)}</Text>
        </Pressable>
      </View>
      <View style={[styles.drawerSection, isRtl && styles.rtl]}>
        {/* <Text style={[styles.sectionLabel, getStyleForDynamicText(t("drawer.language", language), 13)]}>{t("drawer.language", language)}</Text> */}
        <View style={styles.pillRow}>
          {(["english", "urdu"] as AppLanguage[]).map((lang) => (
            <Pressable
              key={lang}
              style={[styles.pill, language === lang && styles.pillActive]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.pillText, language === lang && styles.pillTextActive, getStyleForDynamicText(lang === "english" ? t("language.en", language) : t("language.ur", language), 13)]}>
                {lang === "english" ? t("language.en", language) : t("language.ur", language)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={[styles.footer, isRtl && styles.rtl]}>
        <Pressable
          style={({ pressed }) => [styles.logoutBtnOuter, pressed && styles.btnPressed]}
          onPress={handleLogout}
        >
          <View style={styles.logoutBtn}>
            <View style={styles.logoutBtnRow}>
              <MaterialCommunityIcons name="logout" size={22} color={colors.copper} />
              <Text style={[styles.logoutText, getStyleForDynamicText(t("drawer.logout", language), 16)]}>{t("drawer.logout", language)}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
  },
  rtl: { direction: "rtl" },
  header: {
    marginBottom: 24,
  },
  appName: {
    fontSize: 54,
    color: colors.copper,
    marginBottom: 0,
    fontFamily: "Poppins_700Bold",
  },
  shopRow: {
    marginTop: -14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shopNameWrap: {
    flex: 1,
    justifyContent: "center",
    minHeight: 40,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  menu: { marginBottom: 24 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  menuItemActive: { backgroundColor: "rgba(196,98,45,0.2)" },
  menuItemText: { fontSize: 16, color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  drawerSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 13, color: colors.mutedGray, marginBottom: 8 },
  pillRow: { flexDirection: "row", gap: 8 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.input,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { borderColor: colors.copper, backgroundColor: "rgba(196,98,45,0.2)" },
  pillText: { fontSize: 13, color: colors.creamMuted },
  pillTextActive: { color: colors.copper, fontWeight: "600" },
  footer: {
    marginTop: "auto",
    width: "100%",
    marginBottom: 24,
  },
  logoutBtnOuter: {
    alignSelf: "stretch",
  },
  logoutBtn: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.copper,
    fontFamily: "Poppins_600SemiBold",
  },
  btnPressed: { opacity: 0.9 },
});
