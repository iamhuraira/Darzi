import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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
import { getUrduStyle } from "../../theme/fonts";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useCustomerStore } from "../../stores/customerStore";
import { getMeasurementTypeLabel } from "../../constants/measurementTypes";
import { getSectionsForType, getEmptyFieldsForType } from "../../utils/measurementFields";
import { generateId } from "../../utils/customerStorage";
import { t, tLabel } from "../../utils/lang";
import type { Measurement, MeasurementType } from "../../types/customers";
import { useAppStore } from "../../stores/appStore";

type Nav = NativeStackNavigationProp<CustomersStackParamList, "MeasurementForm">;
type Route = RouteProp<CustomersStackParamList, "MeasurementForm">;

export function MeasurementFormScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { customerId, type } = route.params;
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const language = useAppStore((s) => s.language);
  const units = useAppStore((s) => s.units);
  const { getCustomerById, getMeasurementByType, saveMeasurement, deleteMeasurement, loadMeasurements, measurements } = useCustomerStore();
  const customer = getCustomerById(customerId);
  const existing = getMeasurementByType(customerId, type);
  const sections = getSectionsForType(type);
  const emptyFields = getEmptyFieldsForType(type);
  const unitLabel = units === "inches" ? "in" : "cm";

  const [fields, setFields] = useState<Record<string, string>>(emptyFields);
  const [notes, setNotes] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadMeasurements(customerId);
    }, [customerId, loadMeasurements])
  );

  useEffect(() => {
    const m = getMeasurementByType(customerId, type);
    if (m) {
      setFields(m.fields as unknown as Record<string, string>);
      setNotes(m.notes ?? "");
    } else {
      setFields(getEmptyFieldsForType(type));
      setNotes("");
    }
  }, [customerId, type, measurements[customerId], getMeasurementByType]);

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const now = new Date().toISOString();
    const measurement: Measurement = {
      id: existing?.id ?? generateId(),
      shopId,
      customerId,
      type,
      fields: fields as unknown as Measurement["fields"],
      notes: notes.trim() || undefined,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await saveMeasurement(measurement);
    Alert.alert(t("common.success", language), t("measurement.saved", language), [{ text: "OK", onPress: () => navigation.goBack() }]);
  };

  const handleDelete = () => {
    if (!existing) return;
    Alert.alert(
      t("common.delete", language),
      t("measurement.deleteConfirm", language),
      [
        { text: t("common.cancel", language), style: "cancel" },
        {
          text: t("common.delete", language),
          style: "destructive",
          onPress: async () => {
            await deleteMeasurement(customerId, type);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Customer not found</Text>
        <Pressable onPress={() => navigation.goBack()}><Text style={styles.link}>Go back</Text></Pressable>
      </View>
    );
  }

  const title = getMeasurementTypeLabel(type);

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
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, language === "urdu" && getUrduStyle(18)]}>{title}</Text>
          <Text style={[styles.headerSubtitle, language === "urdu" && getUrduStyle(13)]}>{customer?.name}</Text>
        </View>
        {existing ? (
          <Pressable onPress={handleDelete} style={styles.iconBtn}>
            <MaterialCommunityIcons name="delete" size={22} color={colors.error} />
          </Pressable>
        ) : <View style={styles.iconBtn} />}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionDivider}>
              <View style={styles.dividerLine} />
              <Text style={[styles.sectionTitle, language === "urdu" && getUrduStyle(14)]}>
                {language === "english" ? section.title : section.titleUrdu}
              </Text>
              <View style={styles.dividerLine} />
            </View>
            {section.fields.map((f) => {
              const isMultiline = f.key === "special_instructions";
              const label = tLabel(`measurement.${f.key}`, language);
              return (
                <View key={f.key} style={isMultiline ? styles.fieldRowMultiline : styles.fieldRow}>
                  <View style={styles.fieldLabelWrap}>
                    {label.primary ? <Text style={[styles.fieldLabelPrimary, language === "urdu" && getUrduStyle(15)]}>{label.primary}</Text> : null}
                    {label.secondary ? <Text style={styles.fieldLabelSecondary}>{label.secondary}</Text> : null}
                  </View>
                  {isMultiline ? (
                    <TextInput
                      style={[styles.input, styles.inputMultiline]}
                      placeholder={label.primary || "Special instructions..."}
                      placeholderTextColor={colors.creamMuted}
                      value={fields[f.key] ?? ""}
                      onChangeText={(v) => updateField(f.key, v)}
                      multiline
                      numberOfLines={3}
                    />
                  ) : (
                    <View style={styles.inputWithUnit}>
                      <TextInput
                        style={styles.input}
                        placeholder={unitLabel}
                        placeholderTextColor={colors.creamMuted}
                        value={fields[f.key] ?? ""}
                        onChangeText={(v) => updateField(f.key, v)}
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitText}>{unitLabel}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
        <View style={styles.section}>
          <Text style={[styles.label, language === "urdu" && getUrduStyle(14)]}>{t("measurement.notesOptional", language)}</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Notes"
            placeholderTextColor={colors.creamMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={handleSave}
        >
          <Text style={[styles.primaryBtnText, language === "urdu" && getUrduStyle(16)]}>{t("measurement.saveMeasurement", language)}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { padding: 8, marginLeft: -8 },
  headerCenter: { flex: 1, marginHorizontal: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  headerSubtitle: { fontSize: 13, color: colors.mutedGray, marginTop: 2 },
  iconBtn: { padding: 8, minWidth: 40 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  errorText: { color: colors.error, padding: 24 },
  link: { color: colors.copper, padding: 24 },
  section: { marginBottom: 24 },
  sectionDivider: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  sectionTitle: { fontSize: 14, color: colors.mutedGray, marginHorizontal: 12 },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  fieldRowMultiline: { marginBottom: 12 },
  fieldLabelWrap: { flex: 1 },
  fieldLabelPrimary: { fontSize: 15, color: colors.cream, fontWeight: "500" },
  fieldLabelSecondary: { fontSize: 13, color: colors.mutedGray, marginTop: 2 },
  inputWithUnit: { flexDirection: "row", alignItems: "center", gap: 8 },
  unitText: { fontSize: 13, color: colors.mutedGray, minWidth: 24 },
  input: {
    backgroundColor: colors.input,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  label: { fontSize: 14, fontWeight: "600", color: colors.cream, marginBottom: 8 },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream, fontFamily: "Poppins_600SemiBold" },
  btnPressed: { opacity: 0.9 },
});
