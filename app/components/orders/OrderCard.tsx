import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import type { Order, OrderStatus, PaymentStatus } from "../../types/orders";
import { t } from "../../utils/lang";
import type { AppLanguage } from "../../utils/lang";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getStatusLabel(status: OrderStatus, lang: AppLanguage): string {
  const key =
    status === "received"
      ? "filterReceived"
      : status === "in_stitching"
        ? "filterInStitching"
        : status === "stitching_complete"
          ? "filterReady"
          : "filterDelivered";
  return t(`orders.${key}`, lang);
}

function getPaymentLabel(payment: PaymentStatus, lang: AppLanguage): string {
  const key =
    payment === "unpaid"
      ? "unpaid"
      : payment === "advance_paid"
        ? "advancePaid"
        : "fullyPaid";
  return t(`orders.${key}`, lang);
}

interface OrderCardProps {
  order: Order;
  language: AppLanguage;
  onPress: () => void;
}

export function OrderCard({ order, language, onPress }: OrderCardProps) {
  const dueFormatted = formatDate(order.dueDate);
  const isOverdue =
    order.status !== "delivered" && new Date(order.dueDate) < new Date();
  const firstCustomer = order.suits[0]?.customerName ?? "";
  const moreCount = order.suits.length - 1;
  const suitsLabel =
    order.suits.length === 1
      ? t("orders.suit", language)
      : t("orders.suits", language);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.orderNumber}>{order.orderNumber}</Text>
        <Text
          style={[
            styles.dueDate,
            isOverdue && styles.dueOverdue,
            getStyleForDynamicText(dueFormatted, 12),
          ]}
        >
          📅 {t("orders.dueDate", language)}: {dueFormatted}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.suitsRow}>
        <MaterialCommunityIcons name="tshirt-crew" size={16} color={colors.mutedGray} />
        <Text style={[styles.suitsText, getStyleForDynamicText(`${order.suits.length} ${suitsLabel} • ${firstCustomer}${moreCount > 0 ? ` +${moreCount} ${t("orders.more", language)}` : ""}`, 13)]}>
          {order.suits.length} {suitsLabel} • {firstCustomer}
          {moreCount > 0 ? ` +${moreCount} ${t("orders.more", language)}` : ""}
        </Text>
      </View>
      <View style={styles.badgesRow}>
        <View style={[styles.badge, styles.badgeStatus]}>
          <Text style={[styles.badgeText, getStyleForDynamicText(getStatusLabel(order.status, language), 11)]}>
            {getStatusLabel(order.status, language)}
          </Text>
        </View>
        <View style={[styles.badge, styles.badgePayment]}>
          <Text style={[styles.badgeText, getStyleForDynamicText(getPaymentLabel(order.paymentStatus, language), 11)]}>
            💰 {getPaymentLabel(order.paymentStatus, language)}
          </Text>
        </View>
      </View>
      <View style={styles.amountRow}>
        <Text style={styles.amountText}>
          Rs. {order.remainingAmount > 0 ? order.remainingAmount.toLocaleString() : order.totalAmount.toLocaleString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.9 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.copper,
    fontFamily: "Poppins_700Bold",
  },
  dueDate: {
    fontSize: 12,
    color: colors.mutedGray,
  },
  dueOverdue: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  suitsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  suitsText: {
    fontSize: 13,
    color: colors.cream,
    flex: 1,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeStatus: {
    backgroundColor: "rgba(196,98,45,0.2)",
    borderWidth: 1,
    borderColor: "rgba(196,98,45,0.4)",
  },
  badgePayment: {
    backgroundColor: "rgba(184,151,58,0.15)",
    borderWidth: 1,
    borderColor: "rgba(184,151,58,0.3)",
  },
  badgeText: {
    fontSize: 11,
    color: colors.cream,
    fontWeight: "600",
  },
  amountRow: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gold,
  },
});
