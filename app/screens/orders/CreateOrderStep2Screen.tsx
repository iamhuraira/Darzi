import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useAppStore } from "../../stores/appStore";
import { getNextOrderNumber } from "../../utils/orderStorage";
import { t } from "../../utils/lang";
import type { OrdersStackParamList } from "../../navigation/types";
import { StepIndicator } from "../../components/orders/StepIndicator";

type Route = RouteProp<OrdersStackParamList, "CreateOrderStep2">;

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CreateOrderStep2Screen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const language = useAppStore((s) => s.language);
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const params = route.params;
  const suits = params?.suits ?? [];

  useEffect(() => {
    if (!params?.suits?.length) {
      (navigation as any).replace("CreateOrderStep1");
    }
  }, [params?.suits, navigation]);

  const [orderNumber, setOrderNumber] = useState("#—");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");

  useEffect(() => {
    if (shopId) {
      getNextOrderNumber(shopId).then(setOrderNumber);
    }
  }, [shopId]);

  const dueFormatted = dueDate ? formatDate(dueDate) : "";
  const isPastOrToday =
    dueDate && dueDate <= new Date(new Date().setHours(23, 59, 59, 999));

  const handleNext = () => {
    if (!dueDate) return;
    (navigation as any).navigate("CreateOrderStep3", {
      orderNumber,
      dueDate: dueDate.toISOString(),
      notes: notes.trim() || undefined,
      advancePaid: advancePaid ? parseFloat(advancePaid) || 0 : 0,
      suits,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
        </Pressable>
        <Text style={[styles.title, getStyleForDynamicText(t("orders.stepOrderInfo", language), 18)]}>
          {t("orders.stepOrderInfo", language)}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <StepIndicator currentStep={2} />
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={[styles.label, getStyleForDynamicText(t("orders.orderNumber", language), 14)]}>
              {t("orders.orderNumber", language)}
            </Text>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderNumberValue}>{orderNumber}</Text>
              <View style={styles.autoBadge}>
                <Text style={styles.autoBadgeText}>{t("orders.orderNumberAuto", language)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                isPastOrToday && styles.labelError,
                getStyleForDynamicText(t("orders.deliveryDueDate", language), 14),
              ]}
            >
              {t("orders.deliveryDueDate", language)} *
            </Text>
            <Pressable
              style={styles.dateBtn}
              onPress={() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                setDueDate(d);
              }}
            >
              <MaterialCommunityIcons name="calendar" size={20} color={colors.copper} />
              <Text style={styles.dateBtnText}>
                {dueFormatted || "Tap to set date"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, getStyleForDynamicText(t("orders.orderNotes", language), 14)]}>
              {t("orders.orderNotes", language)}
            </Text>
            <TextInput
              style={styles.inputMultiline}
              value={notes}
              onChangeText={setNotes}
              placeholder={t("orders.orderNotesPlaceholder", language)}
              placeholderTextColor={colors.creamMuted}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, getStyleForDynamicText(t("orders.advanceAmount", language), 14)]}>
              {t("orders.advanceAmount", language)}
            </Text>
            <TextInput
              style={styles.input}
              value={advancePaid}
              onChangeText={setAdvancePaid}
              placeholder="0"
              placeholderTextColor={colors.creamMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            (!dueDate || pressed) && styles.primaryBtnDisabled,
          ]}
          onPress={handleNext}
          disabled={!dueDate}
        >
          <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("orders.nextReviewOrder", language), 16)]}>
            {t("orders.nextReviewOrder", language)}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 8, marginRight: 8 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.cream,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 24,
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 14,
    color: colors.cream,
    marginBottom: 8,
  },
  labelError: { color: colors.error },
  orderNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderNumberValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.cream,
  },
  autoBadge: {
    backgroundColor: colors.input,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  autoBadgeText: {
    fontSize: 11,
    color: colors.mutedGray,
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.input,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dateBtnText: {
    fontSize: 16,
    color: colors.cream,
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: borderRadius.button,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.cream,
  },
});
