import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { getTailorShop } from "../utils/tailorStorage";
import type { TailorShop } from "../utils/tailorStorage";
import { useTailorAuthStore } from "../stores/tailorAuthStore";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const logout = useTailorAuthStore((s) => s.logout);
  const auth = useTailorAuthStore((s) => s.auth);
  const [shop, setShop] = useState<TailorShop | null>(null);

  useEffect(() => {
    if (auth?.shopId) {
      getTailorShop().then((s) => s && setShop(s));
    }
  }, [auth?.shopId]);

  async function handleLogout() {
    await logout();
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Text style={styles.appName}>Darzi</Text>
        <View style={styles.shopRow}>
          <MaterialCommunityIcons name="store" size={32} color={colors.copper} />
          <Text style={styles.shopName} numberOfLines={2}>
            {shop?.shopName ?? "My Shop"}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.btnPressed]}
          onPress={handleLogout}
        >
          <View style={styles.logoutBtnRow}>
            <MaterialCommunityIcons name="logout" size={22} color={colors.copper} />
            <Text style={styles.logoutText}>Logout</Text>
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
  shopName: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  footer: {
    marginTop: "auto",
    width: "100%",
    marginBottom: 24,
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
