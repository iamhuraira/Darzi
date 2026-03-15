import { View, Text, StyleSheet } from "react-native";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";

interface OrderStatsCardProps {
  value: number;
  label: string;
}

export function OrderStatsCard({ value, label }: OrderStatsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.label, getStyleForDynamicText(label, 12)]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 90,
    marginEnd: 12,
    alignItems: "center",
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.copper,
    fontFamily: "Poppins_700Bold",
  },
  label: {
    fontSize: 12,
    color: colors.cream,
    marginTop: 4,
  },
});
