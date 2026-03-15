import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import type { SuitItem } from "../../types/orders";
import { getMeasurementTypeLabel } from "../../constants/measurementTypes";
import { t } from "../../utils/lang";
import type { AppLanguage } from "../../utils/lang";

interface SuitItemCardProps {
  suit: SuitItem;
  language: AppLanguage;
  onEdit: () => void;
  onDelete: () => void;
}

export function SuitItemCard({ suit, language, onEdit, onDelete }: SuitItemCardProps) {
  const garmentLabel = getMeasurementTypeLabel(suit.garmentType, language);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={[styles.suitLabel, getStyleForDynamicText(`${t("orders.suit", language)} ${suit.suitNumber}`, 14)]}>
          {t("orders.suit", language)} {suit.suitNumber}
        </Text>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} style={styles.iconBtn}>
            <MaterialCommunityIcons name="pencil" size={20} color={colors.copper} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.iconBtn}>
            <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error} />
          </Pressable>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <MaterialCommunityIcons name="account" size={16} color={colors.mutedGray} />
        <Text style={[styles.text, getStyleForDynamicText(suit.customerName, 14)]}>{suit.customerName}</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons name="tshirt-crew" size={16} color={colors.mutedGray} />
        <Text style={[styles.text, getStyleForDynamicText(garmentLabel, 14)]}>{garmentLabel}</Text>
      </View>
      <View style={styles.row}>
        <MaterialCommunityIcons name="ruler-square" size={16} color={colors.mutedGray} />
        <Text style={styles.text}>
          {suit.measurementId
            ? `✅ ${t("orders.useSavedMeasurements", language)}`
            : "—"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.price, getStyleForDynamicText(`Rs. ${suit.price.toLocaleString()}`, 14)]}>
          Rs. {suit.price.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gold,
  },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: { padding: 4 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: colors.cream,
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.copper,
  },
});
