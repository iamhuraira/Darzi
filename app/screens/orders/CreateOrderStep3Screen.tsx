import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, type RouteProp, CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useOrderStore } from "../../stores/orderStore";
import { useAppStore } from "../../stores/appStore";
import { getMeasurementTypeLabel } from "../../constants/measurementTypes";
import { t } from "../../utils/lang";
import type { OrdersStackParamList } from "../../navigation/types";
import type { Order, SuitItem } from "../../types/orders";
import { StepIndicator } from "../../components/orders/StepIndicator";

type Route = RouteProp<OrdersStackParamList, "CreateOrderStep3">;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function CreateOrderStep3Screen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const language = useAppStore((s) => s.language);
  const auth = useTailorAuthStore((s) => s.auth);
  const createOrder = useOrderStore((s) => s.createOrder);

  const params = route.params;
  const orderNumber = params?.orderNumber ?? "#1";
  const dueDate = params?.dueDate ?? new Date().toISOString();
  const notes = params?.notes;
  const advancePaid = params?.advancePaid ?? 0;
  const suits = params?.suits ?? [];

  const totalAmount = useMemo(
    () => suits.reduce((sum, s) => sum + s.price, 0),
    [suits]
  );
  const remaining = totalAmount - advancePaid;
  const paymentStatus =
    advancePaid <= 0
      ? "unpaid"
      : advancePaid >= totalAmount
        ? "fully_paid"
        : "advance_paid";

  const handleConfirm = async () => {
    const shopId = auth?.shopId ?? "";
    if (!shopId) return;
    const now = new Date().toISOString();
    const order: Order = {
      id: generateId(),
      shopId,
      orderNumber,
      suits,
      status: "received",
      totalAmount,
      advancePaid,
      remainingAmount: remaining,
      paymentStatus,
      dueDate,
      notes,
      createdAt: now,
      updatedAt: now,
    };
    await createOrder(order);
    Alert.alert(
      t("orders.orderCreated", language),
      "",
      [
        {
          text: "OK",
          onPress: () =>
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: "OrdersList" }] })
            ),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
        </Pressable>
        <Text style={[styles.title, getStyleForDynamicText(t("orders.reviewOrder", language), 18)]}>
          {t("orders.reviewOrder", language)}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <StepIndicator currentStep={3} />
        <View style={styles.card}>
          <Text style={[styles.cardTitle, getStyleForDynamicText(`Order ${orderNumber}`, 16)]}>
            Order {orderNumber}
          </Text>
          <Text style={[styles.rowText, getStyleForDynamicText(`${t("orders.dueDateLabel", language)}: ${formatDate(dueDate)}`, 14)]}>
            {t("orders.dueDateLabel", language)}: {formatDate(dueDate)}
          </Text>
          {notes ? (
            <Text style={[styles.rowText, getStyleForDynamicText(notes, 14)]}>
              {t("orders.orderNotes", language)}: {notes}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, getStyleForDynamicText(t("orders.orderSummary", language), 16)]}>
            {t("orders.orderSummary", language)}
          </Text>
          {suits.map((suit: SuitItem, i: number) => (
            <View key={suit.id} style={styles.suitRow}>
              <Text style={styles.suitRowText}>
                {t("orders.suit", language)} {i + 1} • {suit.customerName} • {getMeasurementTypeLabel(suit.garmentType, language)} — Rs. {suit.price.toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, getStyleForDynamicText(`${suits.length} ${t("orders.suits", language)}`, 14)]}>
              {suits.length} {t("orders.suits", language)}
            </Text>
            <Text style={styles.totalValue}>
              {t("orders.total", language)}: Rs. {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, getStyleForDynamicText(t("orders.orderSummary", language), 16)]}>
            Payment
          </Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("orders.totalAmount", language)}</Text>
            <Text style={styles.paymentValue}>Rs. {totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("orders.advancePaid", language)}</Text>
            <Text style={styles.paymentValue}>Rs. {advancePaid.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("orders.remaining", language)}</Text>
            <Text style={styles.paymentValue}>Rs. {remaining.toLocaleString()}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>
              {paymentStatus === "fully_paid"
                ? t("orders.fullyPaid", language)
                : paymentStatus === "advance_paid"
                  ? t("orders.statusAdvancePaid", language)
                  : t("orders.unpaid", language)}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          onPress={handleConfirm}
        >
          <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("orders.confirmSaveOrder", language), 16)]}>
            {t("orders.confirmSaveOrder", language)}
          </Text>
        </Pressable>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 8, marginRight: 8 },
  title: { fontSize: 18, fontWeight: "600", color: colors.cream },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.copper,
    marginBottom: 12,
  },
  rowText: { fontSize: 14, color: colors.cream, marginBottom: 6 },
  suitRow: { marginBottom: 8 },
  suitRowText: { fontSize: 14, color: colors.cream },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { color: colors.cream },
  totalValue: { fontSize: 16, fontWeight: "600", color: colors.gold },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: { fontSize: 14, color: colors.cream },
  paymentValue: { fontSize: 14, color: colors.cream, fontWeight: "600" },
  statusRow: { marginTop: 8 },
  statusLabel: { fontSize: 14, color: colors.gold },
  primaryBtn: {
    backgroundColor: colors.copper,
    borderRadius: borderRadius.button,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: colors.cream },
  btnPressed: { opacity: 0.9 },
});
