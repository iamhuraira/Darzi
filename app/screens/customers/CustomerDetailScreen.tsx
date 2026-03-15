import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CustomersStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useAppStore } from "../../stores/appStore";
import { useCustomerStore } from "../../stores/customerStore";
import { MEASUREMENT_TYPES } from "../../constants/measurementTypes";
import { t } from "../../utils/lang";
import type { MeasurementType } from "../../types/customers";

type Nav = NativeStackNavigationProp<CustomersStackParamList, "CustomerDetail">;
type Route = RouteProp<CustomersStackParamList, "CustomerDetail">;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export function CustomerDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const language = useAppStore((s) => s.language);
  const isRtl = language === "urdu";
  const { customerId } = route.params;
  const { getCustomerById, getMeasurementByType, loadMeasurements, deleteCustomer } = useCustomerStore();
  const customer = getCustomerById(customerId);

  useFocusEffect(
    useCallback(() => {
      loadMeasurements(customerId);
    }, [customerId, loadMeasurements])
  );

  if (!customer) {
    return (
      <View style={[styles.container, isRtl && styles.rtl]}>
        <Text style={[styles.errorText, { textAlign: isRtl ? "right" : "left" }]}>
          {t("customers.notFound", language)}
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>{t("common.goBack", language)}</Text>
        </Pressable>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      `Delete ${customer.name}?`,
      "This will also delete all their measurements and orders.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          await deleteCustomer(customer.id);
          navigation.navigate("CustomersList");
        } },
      ]
    );
  };

  const textAlign = isRtl ? "right" : "left";

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }, isRtl && styles.rtl]}>
      <View style={[styles.header, isRtl && styles.rtl]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name={isRtl ? "arrow-right" : "arrow-left"} size={24} color={colors.cream} />
        </Pressable>
        <Text style={[styles.headerTitle, getStyleForDynamicText(customer.name, 18)]} numberOfLines={1}>
          {customer.name}
        </Text>
        <Pressable onPress={() => navigation.navigate("EditCustomer", { customerId })} style={styles.iconBtn}>
          <MaterialCommunityIcons name="pencil" size={22} color={colors.cream} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.scrollContent, isRtl && styles.rtl]} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, isRtl && styles.rtl]}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={24} color={colors.copper} />
            <Text style={[styles.infoName, getStyleForDynamicText(customer.name, 18)]}>{customer.name}</Text>
          </View>
          <Text style={[styles.infoPhone, getStyleForDynamicText(customer.phone, 15)]}>{customer.phone}</Text>
          {customer.address ? (
            <Text style={[styles.infoAddress, getStyleForDynamicText(customer.address, 14)]}>{customer.address}</Text>
          ) : null}
          <Text style={styles.infoAdded}>Added: {formatDate(customer.createdAt)}</Text>
          <View style={styles.infoActions}>
            <Pressable
              style={({ pressed }) => [styles.editBtnOuter, pressed && styles.btnPressed]}
              onPress={() => navigation.navigate("EditCustomer", { customerId })}
            >
              <View style={styles.editBtn}>
                <Text style={[styles.editBtnText, getStyleForDynamicText(t("common.edit", language), 15)]}>{t("common.edit", language)}</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.deleteBtnOuter, pressed && styles.btnPressed]}
              onPress={handleDelete}
            >
              <View style={styles.deleteBtn}>
                <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
                <Text style={[styles.deleteBtnText, getStyleForDynamicText(t("common.delete", language), 15)]}>{t("common.delete", language)}</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={[styles.sectionHeader, isRtl && styles.rtl]}>
          <View style={styles.sectionDivider} />
          <Text style={[styles.sectionTitle, getStyleForDynamicText(t("customers.measurements", language), 18)]}>
            {t("customers.measurements", language)} 📏
          </Text>
          <View style={styles.sectionDivider} />
        </View>
        <View style={[styles.measurementList, isRtl && styles.rtl]}>
          {MEASUREMENT_TYPES.map((type) => {
            const saved = getMeasurementByType(customerId, type);
            const cardTitle = t(`measurementTypes.${type}`, language);
            return (
              <Pressable
                key={type}
                style={({ pressed }) => [styles.typeCardOuter, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate("MeasurementForm", { customerId, type })}
              >
                <View style={[styles.typeCard, isRtl && styles.rtl]}>
                  <Text style={[styles.typeCardTitle, getStyleForDynamicText(cardTitle, 16)]} numberOfLines={1}>
                    {cardTitle}
                  </Text>
                  {saved ? (
                    <View style={styles.statusBadge}>
                      <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, styles.badgeAdd]}>
                      <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.copper} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  rtl: { direction: "rtl" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8, marginStart: -8 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginHorizontal: 8,
  },
  iconBtn: { padding: 8 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  errorText: { color: colors.error, padding: 24 },
  link: { color: colors.copper, padding: 24 },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoName: { fontSize: 18, fontWeight: "600", color: colors.cream },
  infoPhone: { fontSize: 15, color: colors.mutedGray, marginTop: 6 },
  infoAddress: { fontSize: 14, color: colors.creamMuted, marginTop: 4 },
  infoAdded: { fontSize: 12, color: colors.mutedGray, marginTop: 8 },
  infoActions: { flexDirection: "row", gap: 12, marginTop: 16 },
  editBtnOuter: {
    flex: 1,
    minHeight: 44,
    alignSelf: "stretch",
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.input,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: { fontSize: 15, fontWeight: "600", color: colors.copper, fontFamily: "Poppins_600SemiBold" },
  deleteBtnOuter: {
    flex: 1,
    minHeight: 44,
    alignSelf: "stretch",
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: "transparent",
  },
  deleteBtnText: { fontSize: 15, fontWeight: "600", color: colors.error, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginHorizontal: 12,
  },
  measurementList: {
    gap: 10,
  },
  typeCardOuter: {
    width: "100%",
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 56,
  },
  typeCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.copper,
    fontFamily: "Poppins_600SemiBold",
    marginEnd: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeAdd: {
    gap: 8,
  },
  badgeText: {
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  badgeTextSaved: { fontSize: 13, color: colors.success },
  badgeTextAdd: { fontSize: 14, color: colors.copper },
  viewEditText: {
    fontSize: 12,
    color: colors.mutedGray,
  },
});
