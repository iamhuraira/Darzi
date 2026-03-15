import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useAppStore } from "../../stores/appStore";
import { useCustomerStore } from "../../stores/customerStore";
import { MEASUREMENT_TYPES } from "../../constants/measurementTypes";
import { getMeasurementTypeLabel } from "../../constants/measurementTypes";
import { t } from "../../utils/lang";
import type { SuitItem } from "../../types/orders";
import type { GarmentType } from "../../types/orders";
import { CustomerSearchModal } from "./CustomerSearchModal";

type CustomerPick = { id: string; name: string; phone: string };

interface SuitBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  initialSuit: SuitItem | null;
  suitNumber: number;
  onSave: (suit: SuitItem) => void;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function SuitBottomSheet({
  visible,
  onClose,
  initialSuit,
  suitNumber,
  onSave,
}: SuitBottomSheetProps) {
  const { height } = useWindowDimensions();
  const language = useAppStore((s) => s.language);
  const getMeasurementByType = useCustomerStore((s) => s.getMeasurementByType);
  const loadMeasurements = useCustomerStore((s) => s.loadMeasurements);

  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customer, setCustomer] = useState<CustomerPick | null>(null);
  const [garmentType, setGarmentType] = useState<GarmentType | null>(null);
  const [measurementId, setMeasurementId] = useState<string | null>(null);
  const [measurementSnapshot, setMeasurementSnapshot] = useState<Record<string, unknown> | null>(null);
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialSuit) {
      setCustomer({
        id: initialSuit.customerId,
        name: initialSuit.customerName,
        phone: "",
      });
      setGarmentType(initialSuit.garmentType);
      setMeasurementId(initialSuit.measurementId);
      setMeasurementSnapshot(initialSuit.measurementSnapshot);
      setPrice(String(initialSuit.price));
      setNotes(initialSuit.notes ?? "");
    } else {
      setCustomer(null);
      setGarmentType(null);
      setMeasurementId(null);
      setMeasurementSnapshot(null);
      setPrice("");
      setNotes("");
    }
  }, [initialSuit, visible]);

  useEffect(() => {
    if (customer) loadMeasurements(customer.id);
  }, [customer, loadMeasurements]);

  useEffect(() => {
    if (!customer || !garmentType) {
      setMeasurementId(null);
      setMeasurementSnapshot(null);
      return;
    }
    const m = getMeasurementByType(customer.id, garmentType);
    if (m) {
      setMeasurementId(m.id);
      setMeasurementSnapshot(m.fields as unknown as Record<string, unknown>);
    } else {
      setMeasurementId(null);
      setMeasurementSnapshot(null);
    }
  }, [customer, garmentType, getMeasurementByType]);

  const handleSave = () => {
    const priceNum = parseFloat(price);
    if (!customer || !garmentType || !priceNum || priceNum <= 0) return;
    const suit: SuitItem = {
      id: initialSuit?.id ?? generateId(),
      suitNumber,
      customerId: customer.id,
      customerName: customer.name,
      garmentType,
      measurementId,
      measurementSnapshot,
      price: priceNum,
      notes: notes.trim() || undefined,
    };
    onSave(suit);
    onClose();
  };

  const isValid = customer && garmentType && price && parseFloat(price) > 0;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={[styles.sheet, { maxHeight: height * 0.85 }]}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, getStyleForDynamicText(initialSuit ? t("orders.editSuit", language) + " " + suitNumber : t("orders.addSuit", language), 18)]}>
                {initialSuit ? `${t("orders.editSuit", language)} ${suitNumber}` : t("orders.addSuit", language)}
              </Text>
            </View>
            <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent}>
              <Pressable
                style={styles.fieldRow}
                onPress={() => setCustomerModalVisible(true)}
              >
                <MaterialCommunityIcons name="account" size={20} color={colors.mutedGray} />
                <View style={styles.fieldBody}>
                  <Text style={styles.fieldLabel}>{t("orders.selectCustomer", language)}</Text>
                  <Text style={styles.fieldValue}>
                    {customer ? `${customer.name} • ${customer.phone}` : "Tap to search or select..."}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.mutedGray} />
              </Pressable>

              <Text style={[styles.sectionLabel, getStyleForDynamicText(t("orders.garmentType", language), 14)]}>
                {t("orders.garmentType", language)}
              </Text>
              <View style={styles.garmentGrid}>
                {MEASUREMENT_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.garmentCard,
                      garmentType === type && styles.garmentCardActive,
                    ]}
                    onPress={() => setGarmentType(type)}
                  >
                    <Text style={[styles.garmentCardText, getStyleForDynamicText(getMeasurementTypeLabel(type, language), 12)]}>
                      {getMeasurementTypeLabel(type, language)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {customer && garmentType && (
                <View style={styles.measurementRow}>
                  <Text style={styles.fieldLabel}>
                    {measurementId
                      ? `✅ ${t("orders.useSavedMeasurements", language)}`
                      : `⚠️ ${t("orders.noMeasurementsSaved", language)}`}
                  </Text>
                </View>
              )}

              <Text style={[styles.fieldLabel, getStyleForDynamicText(t("orders.priceRs", language), 14)]}>
                {t("orders.priceRs", language)} *
              </Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor={colors.creamMuted}
                keyboardType="numeric"
              />

              <Text style={[styles.fieldLabel, getStyleForDynamicText(t("orders.suitNotes", language), 14)]}>
                {t("orders.suitNotes", language)}
              </Text>
              <TextInput
                style={styles.inputMultiline}
                value={notes}
                onChangeText={setNotes}
                placeholder={t("orders.suitNotesPlaceholder", language)}
                placeholderTextColor={colors.creamMuted}
                multiline
              />

              <View style={styles.buttons}>
                <Pressable
                  style={({ pressed }) => [styles.primaryBtn, !isValid && styles.primaryBtnDisabled, pressed && styles.btnPressed]}
                  onPress={handleSave}
                  disabled={!isValid}
                >
                  <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("orders.saveSuit", language), 16)]}>
                    {t("orders.saveSuit", language)}
                  </Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]} onPress={onClose}>
                  <Text style={[styles.cancelBtnText, getStyleForDynamicText(t("common.cancel", language), 16)]}>
                    {t("common.cancel", language)}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <CustomerSearchModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        onSelect={(c) => setCustomer(c)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.mutedGray,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: { paddingHorizontal: 20, paddingBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: "600", color: colors.cream },
  sheetScroll: { maxHeight: 400 },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 24 },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  fieldBody: { flex: 1 },
  fieldLabel: {
    fontSize: 12,
    color: colors.mutedGray,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.cream,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.cream,
    marginBottom: 10,
  },
  garmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  garmentCard: {
    width: "47%",
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.card,
    padding: 12,
  },
  garmentCardActive: {
    borderColor: colors.copper,
    backgroundColor: "rgba(196,98,45,0.15)",
  },
  garmentCardText: {
    fontSize: 12,
    color: colors.cream,
    textAlign: "center",
  },
  measurementRow: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: colors.input,
    borderRadius: 8,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.cream,
    marginBottom: 16,
  },
  inputMultiline: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    paddingVertical: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.cream,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttons: { gap: 12 },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: borderRadius.button,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream },
  cancelBtn: { alignItems: "center", paddingVertical: 12 },
  cancelBtnText: { fontSize: 16, color: colors.mutedGray },
  btnPressed: { opacity: 0.9 },
});
