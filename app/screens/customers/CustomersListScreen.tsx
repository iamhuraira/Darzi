import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import type { CustomersStackParamList } from "../../navigation/types";
import { colors, borderRadius } from "../../theme/colors";
import { getUrduStyle } from "../../theme/fonts";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useCustomerStore } from "../../stores/customerStore";
import { useAppStore } from "../../stores/appStore";
import { t } from "../../utils/lang";
import type { Customer } from "../../types/customers";

type Nav = NativeStackNavigationProp<CustomersStackParamList, "CustomersList">;

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function CustomerCard({
  customer,
  measurementCount,
  lastOrderDate,
  onPress,
  onDelete,
  deleteLabel,
  measurementLabel,
  measurementPluralLabel,
  language,
}: {
  customer: Customer;
  measurementCount: number;
  lastOrderDate: string | null;
  onPress: () => void;
  onDelete: () => void;
  deleteLabel: string;
  measurementLabel: string;
  measurementPluralLabel: string;
  language: string;
}) {
  const initial = customer.name.trim().charAt(0).toUpperCase() || "?";
  const isUrdu = language === "urdu";
  const renderRightActions = () => (
    <Pressable style={styles.deleteAction} onPress={onDelete}>
      <MaterialCommunityIcons name="delete-outline" size={26} color="#fff" />
      <Text style={[styles.deleteActionText, isUrdu && getUrduStyle(12)]}>{deleteLabel}</Text>
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={onPress}>
        <View style={styles.card}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardName, isUrdu && getUrduStyle(17)]} numberOfLines={1}>{customer.name}</Text>
          <View style={styles.phoneRow}>
            <MaterialCommunityIcons name="phone-outline" size={14} color={colors.mutedGray} />
            <Text style={styles.cardPhone}>{customer.phone}</Text>
          </View>
          <View style={styles.cardMeta}>
            <View style={styles.badgePill}>
              <MaterialCommunityIcons name="ruler-square" size={12} color={colors.gold} />
              <Text style={[styles.badgeText, isUrdu && getUrduStyle(11)]}>
                {measurementCount} {measurementCount === 1 ? measurementLabel : measurementPluralLabel}
              </Text>
            </View>
            {lastOrderDate ? (
              <Text style={styles.lastOrder}>{lastOrderDate}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.chevronWrap}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.mutedGray} />
        </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

export function CustomersListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const language = useAppStore((s) => s.language);
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const { customers, loadCustomers, deleteCustomer, measurements } = useCustomerStore();
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      if (shopId) loadCustomers(shopId);
    }, [shopId, loadCustomers])
  );

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      c.phone.replace(/\D/g, "").includes(query.replace(/\D/g, ""))
  );

  const getMeasurementCount = useCallback(
    (customerId: string) => (measurements[customerId] ?? []).length,
    [measurements]
  );
  const getLastOrderDate = useCallback((customerId: string) => {
    const list = measurements[customerId] ?? [];
    if (list.length === 0) return null;
    const sorted = [...list].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return formatDate(sorted[0].updatedAt);
  }, [measurements]);

  const handleDelete = (customer: Customer) => {
    Alert.alert(
      t("customers.deleteCustomer", language),
      t("customers.deleteConfirm", language, { name: customer.name }),
      [
        { text: t("common.cancel", language), style: "cancel" },
        { text: t("common.delete", language), style: "destructive", onPress: () => deleteCustomer(customer.id) },
      ]
    );
  };

  return (
    <GestureHandlerRootView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 8 : 16 }]}>
        <Pressable
          onPress={() => (navigation.getParent() as { openDrawer?: () => void })?.openDrawer?.()}
          style={styles.menuBtn}
        >
          <MaterialCommunityIcons name="menu" size={26} color={colors.cream} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, language === "urdu" && getUrduStyle(22)]}>{t("customers.title", language)}</Text>
          <Text style={[styles.headerSubtitle, language === "urdu" && getUrduStyle(13)]}>{t("customers.subtitle", language)}</Text>
        </View>
        <Pressable onPress={() => setSearchVisible((v) => !v)} style={styles.iconBtn}>
          <MaterialCommunityIcons name={searchVisible ? "close" : "magnify"} size={24} color={colors.cream} />
        </Pressable>
      </View>
      {searchVisible && (
        <View style={styles.searchWrap}>
          <View style={styles.searchIcon}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.creamMuted} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={t("customers.searchPlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      )}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          {customers.length === 0 ? (
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="account-group-outline" size={56} color={colors.mutedGray} />
              </View>
              <Text style={[styles.emptyTitle, language === "urdu" && getUrduStyle(20)]}>{t("customers.emptyNoCustomers", language)}</Text>
              <Text style={[styles.emptySub, language === "urdu" && getUrduStyle(14)]}>{t("customers.emptyAddFirst", language)}</Text>
              <View style={styles.addBtnEmptyWrap}>
                <Pressable
                  style={({ pressed }) => [styles.addBtnEmptyOuter, pressed && styles.btnPressed]}
                  onPress={() => navigation.navigate("AddCustomer")}
                >
                  <View style={styles.addBtnEmpty}>
                    <MaterialCommunityIcons name="plus" size={22} color={colors.cream} />
                    <Text style={[styles.addBtnText, language === "urdu" && getUrduStyle(16)]}>{t("customers.addCustomer", language)}</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.emptyContent}>
              <View style={styles.emptyIconWrap}>
                <MaterialCommunityIcons name="text-search" size={56} color={colors.mutedGray} />
              </View>
              <Text style={[styles.emptyTitle, language === "urdu" && getUrduStyle(20)]}>{t("customers.noMatches", language)}</Text>
              <Text style={[styles.emptySub, language === "urdu" && getUrduStyle(14)]}>{t("customers.noMatchesSub", language)}</Text>
            </View>
          )}
        </View>
      ) : (
        <>
          {customers.length > 0 && (
            <Text style={[styles.resultCount, language === "urdu" && getUrduStyle(13)]}>
              {filtered.length} {filtered.length === 1 ? t("customers.customer", language) : t("customers.customersCount", language)}
            </Text>
          )}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CustomerCard
                customer={item}
                measurementCount={getMeasurementCount(item.id)}
                lastOrderDate={getLastOrderDate(item.id)}
                onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
                onDelete={() => handleDelete(item)}
                deleteLabel={t("common.delete", language)}
                measurementLabel={t("customers.measurement", language)}
                measurementPluralLabel={t("customers.measurementPlural", language)}
                language={language}
              />
            )}
          />

        </>
      )}
    </GestureHandlerRootView>
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
  menuBtn: { padding: 8, marginLeft: -8 },
  headerCenter: { flex: 1, marginLeft: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.cream,
    fontFamily: "Poppins_700Bold",
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.mutedGray,
    marginTop: 2,
    fontFamily: "Poppins_400Regular",
  },
  iconBtn: { padding: 8 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderRadius: borderRadius.input,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginLeft: 14, justifyContent: "center" },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    paddingRight: 16,
    fontSize: 16,
    color: colors.cream,
  },
  resultCount: {
    fontSize: 13,
    color: colors.mutedGray,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: { opacity: 0.92 },
  avatarWrap: { marginRight: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.copper,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(196,98,45,0.3)",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: colors.cream, fontFamily: "Poppins_700Bold" },
  cardBody: { flex: 1, minWidth: 0 },
  cardName: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  cardPhone: { fontSize: 14, color: colors.mutedGray },
  cardMeta: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 10, flexWrap: "wrap" },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(184,151,58,0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(184,151,58,0.3)",
  },
  badgeText: { fontSize: 11, color: colors.gold, fontWeight: "600" },
  lastOrder: { fontSize: 12, color: colors.mutedGray },
  chevronWrap: { paddingLeft: 4 },
  deleteAction: {
    backgroundColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: 84,
    borderRadius: borderRadius.card,
    marginBottom: 12,
  },
  deleteActionText: { color: "#fff", fontSize: 12, fontWeight: "600", marginTop: 4 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
  },
  emptyContent: {
    width: "100%",
    alignItems: "stretch",
    maxWidth: 320,
    alignSelf: "center",
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 24,
    textAlign: "center",
    alignSelf: "center",
  },
  emptySub: {
    fontSize: 14,
    color: colors.mutedGray,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
  },
  addBtnEmptyWrap: {
    marginTop: 40,
    width: "100%",
  },
  addBtnEmptyOuter: {
    alignSelf: "stretch",
  },
  addBtnEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    minHeight: 54,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: colors.copper,
    borderRadius: borderRadius.button,
    borderWidth: 2,
    borderColor: "#A35220",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 10,
  },
  btnPressed: { opacity: 0.9 },
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
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  fabPressed: { opacity: 0.9 },
});
