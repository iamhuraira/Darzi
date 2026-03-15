import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { useAppStore } from "../../stores/appStore";
import { getStyleForDynamicText } from "../../theme/fonts";
import { t } from "../../utils/lang";

// Step 1 = Suits, Step 2 = Order Info, Step 3 = Summary
const steps = [
  { key: "stepSuits", step: 1 },
  { key: "stepOrderInfo", step: 2 },
  { key: "stepSummary", step: 3 },
] as const;

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const language = useAppStore((s) => s.language);
  const isRtl = language === "urdu";

  const orderedSteps = isRtl ? [...steps].reverse() : steps;

  return (
    <View style={styles.container}>

      {/* ── TOP ROW: Labels centered above each circle ── */}
      {/* <View style={[styles.labelsRow, isRtl && styles.rowReverse]}>
        {steps.map(({ key, step }) => {
          const isActive = step === currentStep;
          const isPast = step < currentStep;
          const label = t(`orders.${key}`, language);
          return (
            <View key={step} style={styles.labelCell}>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  isPast && styles.labelDone,
                  getStyleForDynamicText(label, 11),
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View> */}

      {/* ── BOTTOM ROW: [circle1] [line] [circle2 centered] [line] [circle3] ── */}
      <View style={[styles.trackRow, isRtl && styles.rowReverse]}>
        {/* Step 1 circle — at start */}
        <View style={styles.circleSlot}>
          <View
            style={[
              styles.circle,
              currentStep === 1 && styles.circleActive,
              1 < currentStep && styles.circleDone,
            ]}
          >
            {1 < currentStep ? (
              <MaterialCommunityIcons name="check" size={13} color="#fff" />
            ) : (
              <Text style={[styles.circleText, currentStep === 1 && styles.circleTextActive]}>1</Text>
            )}
          </View>
        </View>
        <View style={[styles.trackLine, 1 < currentStep && styles.trackLineDone]} />
        {/* Step 2 circle — centered in middle slot */}
        <View style={styles.circleSlotCenter}>
          <View
            style={[
              styles.circle,
              currentStep === 2 && styles.circleActive,
              2 < currentStep && styles.circleDone,
            ]}
          >
            {2 < currentStep ? (
              <MaterialCommunityIcons name="check" size={13} color="#fff" />
            ) : (
              <Text style={[styles.circleText, currentStep === 2 && styles.circleTextActive]}>2</Text>
            )}
          </View>
        </View>
        <View style={[styles.trackLine, 2 < currentStep && styles.trackLineDone]} />
        {/* Step 3 circle — at end */}
        <View style={styles.circleSlot}>
          <View
            style={[
              styles.circle,
              currentStep === 3 && styles.circleActive,
              3 < currentStep && styles.circleDone,
            ]}
          >
            {3 < currentStep ? (
              <MaterialCommunityIcons name="check" size={13} color="#fff" />
            ) : (
              <Text style={[styles.circleText, currentStep === 3 && styles.circleTextActive]}>3</Text>
            )}
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 8,
    width: "100%",
  },

  // ── Labels row (above circles) ──
  labelsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  labelCell: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    color: colors.mutedGray,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    lineHeight: 16,
  },
  labelActive: {
    color: colors.copper,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  labelDone: {
    color: colors.success,
    fontFamily: "Poppins_600SemiBold",
  },

  // ── Track row (circles + lines) ──
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  trackSegment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  circleSlot: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  circleSlotCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 0,
  },

  // Circle
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.mutedGray,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    // subtle shadow on active
    shadowColor: colors.copper,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  circleActive: {
    borderColor: colors.copper,
    backgroundColor: colors.copper,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  circleDone: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  circleText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.mutedGray,
    fontFamily: "Poppins_700Bold",
  },
  circleTextActive: {
    color: "#fff",
  },

  // Connecting line
  trackLine: {
    flex: 2.5,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  trackLineDone: {
    backgroundColor: colors.success,
  },
});
