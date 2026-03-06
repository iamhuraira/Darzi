import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CustomersStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { useCustomerStore } from "../../stores/customerStore";
import { MEASUREMENT_TYPES } from "../../constants/measurementTypes";
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
      <View style={styles.container}>
        <Text style={styles.errorText}>Customer not found</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Go back</Text>
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

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>{customer.name}</Text>
        <Pressable onPress={() => navigation.navigate("EditCustomer", { customerId })} style={styles.iconBtn}>
          <MaterialCommunityIcons name="pencil" size={22} color={colors.cream} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={24} color={colors.copper} />
            <Text style={styles.infoName}>{customer.name}</Text>
          </View>
          <Text style={styles.infoPhone}>{customer.phone}</Text>
          {customer.address ? <Text style={styles.infoAddress}>{customer.address}</Text> : null}
          <Text style={styles.infoAdded}>Added: {formatDate(customer.createdAt)}</Text>
          <View style={styles.infoActions}>
            <Pressable
              style={({ pressed }) => [styles.editBtn, pressed && styles.btnPressed]}
              onPress={() => navigation.navigate("EditCustomer", { customerId })}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.btnPressed]}
              onPress={handleDelete}
            >
              <MaterialCommunityIcons name="delete" size={20} color={colors.error} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Measurements 📏</Text>
        <View style={styles.grid}>
          {MEASUREMENT_TYPES.map(({ type, label, labelUrdu }) => {
            const saved = getMeasurementByType(customerId, type);
            return (
              <Pressable
                key={type}
                style={({ pressed }) => [styles.typeCard, pressed && styles.btnPressed]}
                onPress={() => navigation.navigate("MeasurementForm", { customerId, type })}
              >
                <Text style={styles.typeCardUrdu}>{labelUrdu}</Text>
                <Text style={styles.typeCardLabel}>{label}</Text>
                {saved ? (
                  <>
                    <View style={styles.savedBadge}>
                      <MaterialCommunityIcons name="check" size={16} color={colors.success} />
                      <Text style={styles.savedText}>Saved</Text>
                    </View>
                    <Text style={styles.viewEditText}>View / Edit</Text>
                  </>
                ) : (
                  <View style={styles.addBadge}>
                    <MaterialCommunityIcons name="plus" size={18} color={colors.copper} />
                    <Text style={styles.addText}>Add</Text>
                  </View>
                )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8, marginLeft: -8 },
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
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.input,
    borderRadius: 10,
  },
  editBtnText: { fontSize: 14, fontWeight: "600", color: colors.copper },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteBtnText: { fontSize: 14, color: colors.error },
  btnPressed: { opacity: 0.9 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  typeCardUrdu: { fontSize: 16, color: colors.copper, marginBottom: 4 },
  typeCardLabel: { fontSize: 14, color: colors.creamMuted, marginBottom: 12 },
  savedBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  savedText: { fontSize: 13, color: colors.success, fontWeight: "600" },
  viewEditText: { fontSize: 12, color: colors.mutedGray, marginTop: 4 },
  addBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  addText: { fontSize: 14, fontWeight: "600", color: colors.copper },
});
