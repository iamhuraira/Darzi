import { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useOrderStore } from "../../stores/orderStore";
import { useAppStore } from "../../stores/appStore";
import { t } from "../../utils/lang";
import type { OrdersStackParamList } from "../../navigation/types";
import { OrderCard } from "../../components/orders/OrderCard";
import { OrderStatsCard } from "../../components/orders/OrderStatsCard";

type Nav = NativeStackNavigationProp<OrdersStackParamList, "OrdersList">;

const FILTERS: { value: "all" | "received" | "in_stitching" | "stitching_complete" | "delivered"; key: string }[] = [
  { value: "all", key: "filterAll" },
  { value: "received", key: "filterReceived" },
  { value: "in_stitching", key: "filterInStitching" },
  { value: "stitching_complete", key: "filterReady" },
  { value: "delivered", key: "filterDelivered" },
];

export function OrdersListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const language = useAppStore((s) => s.language);
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const {
    orders,
    loadOrders,
    activeFilter,
    setFilter,
    getFilteredOrders,
    getOrderStats,
  } = useOrderStore();

  useFocusEffect(
    useCallback(() => {
      if (shopId) loadOrders(shopId);
    }, [shopId, loadOrders])
  );

  const filtered = getFilteredOrders();
  const stats = getOrderStats();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            (navigation.getParent() as { openDrawer?: () => void })?.openDrawer?.()
          }
          style={styles.menuBtn}
        >
          <MaterialCommunityIcons name="menu" size={26} color={colors.cream} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, getStyleForDynamicText(t("orders.title", language), 22)]}>
            {t("orders.title", language)}
          </Text>
        </View>
        <Pressable style={styles.iconBtn}>
          <MaterialCommunityIcons name="filter-outline" size={24} color={colors.cream} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
        style={styles.statsScrollWrap}
      >
        <OrderStatsCard value={stats.total} label={t("orders.totalOrders", language)} />
        <OrderStatsCard value={stats.stitching} label={t("orders.stitching", language)} />
        <OrderStatsCard value={stats.ready} label={t("orders.readyPickup", language)} />
        <OrderStatsCard value={stats.delivered} label={t("orders.delivered", language)} />
      </ScrollView>

      <View style={styles.tabs}>
        {FILTERS.map(({ value, key }) => (
          <Pressable
            key={value}
            style={[styles.tab, activeFilter === value && styles.tabActive]}
            onPress={() => setFilter(value)}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === value && styles.tabTextActive,
                getStyleForDynamicText(t(`orders.${key}`, language), 13),
              ]}
            >
              {t(`orders.${key}`, language)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, getStyleForDynamicText(t("orders.orders", language), 16)]}>
              {t("orders.orders", language)}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            language={language}
            onPress={() => {}}
          />
        )}
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate("CreateOrderStep1")}
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.cream} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuBtn: { padding: 8, marginStart: -8 },
  headerCenter: { flex: 1, marginLeft: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.cream,
    fontFamily: "Poppins_700Bold",
  },
  iconBtn: { padding: 8 },
  statsScrollWrap: { maxHeight: 100 },
  statsScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    flexDirection: "row",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.copper,
  },
  tabText: {
    fontSize: 13,
    color: colors.mutedGray,
  },
  tabTextActive: {
    color: colors.copper,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  empty: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: colors.mutedGray,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.copper,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabPressed: { opacity: 0.9 },
});
