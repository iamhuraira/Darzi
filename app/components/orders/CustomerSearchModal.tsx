import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useCustomerStore } from "../../stores/customerStore";
import { useTailorAuthStore } from "../../stores/tailorAuthStore";
import { useAppStore } from "../../stores/appStore";
import { t } from "../../utils/lang";
import type { Customer } from "../../types/customers";


interface CustomerSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
}

export function CustomerSearchModal({
  visible,
  onClose,
  onSelect,
}: CustomerSearchModalProps) {
  const [query, setQuery] = useState("");
  const language = useAppStore((s) => s.language);
  const auth = useTailorAuthStore((s) => s.auth);
  const shopId = auth?.shopId ?? "";
  const { customers, loadCustomers } = useCustomerStore();

  useEffect(() => {
    if (visible && shopId) loadCustomers(shopId);
  }, [visible, shopId, loadCustomers]);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      c.phone.replace(/\D/g, "").includes(query.replace(/\D/g, ""))
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, getStyleForDynamicText(t("orders.selectCustomerTitle", language), 18)]}>
            {t("orders.selectCustomerTitle", language)}
          </Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <MaterialCommunityIcons name="close" size={24} color={colors.cream} />
          </Pressable>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.creamMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={t("orders.searchPlaceholder", language)}
            placeholderTextColor={colors.creamMuted}
            autoFocus
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <MaterialCommunityIcons name="account" size={24} color={colors.copper} />
              <View style={styles.rowBody}>
                <Text style={[styles.name, getStyleForDynamicText(item.name, 16)]}>{item.name}</Text>
                <Text style={styles.phone}>{item.phone}</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: "600", color: colors.cream },
  closeBtn: { padding: 8 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.input,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.cream,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowPressed: { opacity: 0.8 },
  rowBody: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: colors.cream },
  phone: { fontSize: 14, color: colors.mutedGray, marginTop: 2 },
});
