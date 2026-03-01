import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DrawerParamList } from "../navigation/types";
import { colors } from "../theme/colors";
import { getTailorShop } from "../utils/tailorStorage";
import type { TailorShop } from "../utils/tailorStorage";
import { useTailorAuthStore } from "../stores/tailorAuthStore";

type Nav = DrawerNavigationProp<DrawerParamList, "Dashboard">;

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const auth = useTailorAuthStore((s) => s.auth);
  const [shop, setShop] = useState<TailorShop | null>(null);

  useEffect(() => {
    if (auth?.shopId) {
      getTailorShop().then((s) => s && setShop(s));
    }
  }, [auth?.shopId]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
          <MaterialCommunityIcons name="menu" size={28} color={colors.cream} />
        </Pressable>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.shopName}>{shop?.shopName ?? "My Shop"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  headerRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  menuBtn: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  content: { paddingTop: 8 },
  title: { fontSize: 24, fontWeight: "600", color: colors.cream, marginBottom: 8 },
  shopName: { fontSize: 18, color: colors.creamMuted },
});
