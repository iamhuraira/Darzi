import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, borderRadius } from "../../theme/colors";
import { getStyleForDynamicText } from "../../theme/fonts";
import { useAppStore } from "../../stores/appStore";
import { t } from "../../utils/lang";
import type { SuitItem } from "../../types/orders";
import { SuitItemCard } from "../../components/orders/SuitItemCard";
import { SuitBottomSheet } from "../../components/orders/SuitBottomSheet";
import { StepIndicator } from "../../components/orders/StepIndicator";

export function CreateOrderStep1Screen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const language = useAppStore((s) => s.language);

  const [suits, setSuits] = useState<SuitItem[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingSuit, setEditingSuit] = useState<SuitItem | null>(null);

  const totalAmount = suits.reduce((sum, s) => sum + s.price, 0);

  const handleAddSuit = () => {
    setEditingSuit(null);
    setSheetVisible(true);
  };

  const handleEditSuit = (suit: SuitItem) => {
    setEditingSuit(suit);
    setSheetVisible(true);
  };

  const handleDeleteSuit = (suit: SuitItem) => {
    Alert.alert(
      t("common.delete", language),
      `Remove ${t("orders.suit", language)} ${suit.suitNumber}?`,
      [
        { text: t("common.cancel", language), style: "cancel" },
        {
          text: t("common.delete", language),
          style: "destructive",
          onPress: () =>
            setSuits((prev) => prev.filter((s) => s.id !== suit.id)),
        },
      ]
    );
  };

  const handleSaveSuit = (suit: SuitItem) => {
    if (editingSuit) {
      setSuits((prev) =>
        prev.map((s) => (s.id === suit.id ? suit : s))
      );
    } else {
      setSuits((prev) => [...prev, suit]);
    }
    setSheetVisible(false);
    setEditingSuit(null);
  };

  const handleNext = () => {
    if (suits.length === 0) return;
    (navigation as any).navigate("CreateOrderStep2", { suits });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.cream} />
        </Pressable>
        <Text style={[styles.title, getStyleForDynamicText(t("orders.addSuits", language), 18)]}>
          {t("orders.addSuits", language)}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <StepIndicator currentStep={1} />
        {suits.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="tshirt-crew-outline" size={48} color={colors.mutedGray} />
            <Text style={[styles.emptyTitle, getStyleForDynamicText(t("orders.noSuitsYet", language), 16)]}>
              {t("orders.noSuitsYet", language)}
            </Text>
            <Text style={[styles.emptySub, getStyleForDynamicText(t("orders.tapToAddFirst", language), 14)]}>
              {t("orders.tapToAddFirst", language)}
            </Text>
          </View>
        ) : (
          suits.map((suit) => (
            <SuitItemCard
              key={suit.id}
              suit={suit}
              language={language}
              onEdit={() => handleEditSuit(suit)}
              onDelete={() => handleDeleteSuit(suit)}
            />
          ))
        )}

        <Pressable
          style={({ pressed }) => [styles.addSuitBtn, pressed && styles.btnPressed]}
          onPress={handleAddSuit}
        >
          <MaterialCommunityIcons name="plus" size={22} color={colors.copper} />
          <Text style={[styles.addSuitBtnText, getStyleForDynamicText(t("orders.addSuit", language), 16)]}>
            {t("orders.addSuit", language)}
          </Text>
        </Pressable>

        {suits.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={[styles.summaryText, getStyleForDynamicText(`${suits.length} ${t("orders.suitsAdded", language)} • ${t("orders.total", language)}: Rs. ${totalAmount.toLocaleString()}`, 14)]}>
              {suits.length} {t("orders.suitsAdded", language)} • {t("orders.total", language)}: Rs. {totalAmount.toLocaleString()}
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            suits.length === 0 && styles.primaryBtnDisabled,
            pressed && styles.btnPressed,
          ]}
          onPress={handleNext}
          disabled={suits.length === 0}
        >
          <Text style={[styles.primaryBtnText, getStyleForDynamicText(t("orders.nextOrderInfo", language), 16)]}>
            {t("orders.nextOrderInfo", language)}
          </Text>
        </Pressable>
      </ScrollView>

      <SuitBottomSheet
        visible={sheetVisible}
        onClose={() => {
          setSheetVisible(false);
          setEditingSuit(null);
        }}
        initialSuit={editingSuit}
        suitNumber={editingSuit ? editingSuit.suitNumber : suits.length + 1}
        onSave={handleSaveSuit}
      />
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
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 24,
  },
  emptyTitle: {
    marginTop: 16,
    color: colors.cream,
    fontWeight: "600",
  },
  emptySub: {
    marginTop: 8,
    color: colors.mutedGray,
  },
  addSuitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: colors.copper,
    borderRadius: borderRadius.button,
    marginBottom: 16,
  },
  addSuitBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.copper,
  },
  summaryBar: {
    paddingVertical: 12,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryText: {
    color: colors.cream,
    fontWeight: "600",
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
  btnPressed: { opacity: 0.9 },
});
