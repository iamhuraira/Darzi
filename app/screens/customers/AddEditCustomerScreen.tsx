import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
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
import type { CustomersStackParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useCustomerStore } from "../../stores/customerStore";
import { customerSchema, type CustomerInput } from "../../utils/validation";
import { generateId } from "../../utils/customerStorage";

type Nav = NativeStackNavigationProp<CustomersStackParamList, "AddCustomer" | "EditCustomer">;
type Route = RouteProp<CustomersStackParamList, "AddCustomer" | "EditCustomer">;

export function AddEditCustomerScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const customerId = (route.params as { customerId?: string } | undefined)?.customerId;
  const isEdit = Boolean(customerId);
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const { getCustomerById, addCustomer, updateCustomer, loadCustomers } = useCustomerStore();
  const existing = customerId ? getCustomerById(customerId) : null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInput, string>>>({});

  useFocusEffect(
    useCallback(() => {
      if (existing) {
        setName(existing.name);
        setPhone(existing.phone);
        setAddress(existing.address ?? "");
        setNotes(existing.notes ?? "");
      }
    }, [existing?.id])
  );

  const handleSave = async () => {
    setErrors({});
    const rawPhone = phone.replace(/\D/g, "");
    const toValidate = {
      name: name.trim(),
      phone: rawPhone.length === 11 ? rawPhone : phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
    };
    const result = customerSchema.safeParse(toValidate);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CustomerInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof CustomerInput;
        if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const now = new Date().toISOString();
    if (isEdit && existing) {
      await updateCustomer(existing.id, {
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address || undefined,
        notes: result.data.notes || undefined,
      });
      Alert.alert("Saved", "Customer updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      const customer = {
        id: generateId(),
        shopId,
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address || undefined,
        notes: result.data.notes || undefined,
        createdAt: now,
        updatedAt: now,
      };
      await addCustomer(customer);
      Alert.alert("Saved", "Customer added.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={20}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
        </Pressable>
        <Text style={styles.headerTitle}>{isEdit ? "Edit Customer" : "Add Customer"}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Customer name"
            placeholderTextColor={colors.creamMuted}
            value={name}
            onChangeText={(t) => { setName(t); setErrors((e) => ({ ...e, name: undefined })); }}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }]}>Phone Number *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="03XX-XXXXXXX (11 digits)"
            placeholderTextColor={colors.creamMuted}
            value={phone}
            onChangeText={(t) => { setPhone(t); setErrors((e) => ({ ...e, phone: undefined })); }}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}

          <Text style={[styles.label, { marginTop: 16 }]}>Address (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Address"
            placeholderTextColor={colors.creamMuted}
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Any special notes about this customer..."
            placeholderTextColor={colors.creamMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={handleSave}
        >
          <Text style={styles.primaryBtnText}>Save Customer</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.cream,
    fontFamily: "Poppins_600SemiBold",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
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
  errorText: { fontSize: 12, color: colors.error, marginTop: 4 },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
});
