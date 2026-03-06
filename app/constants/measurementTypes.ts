import type { MeasurementType } from "../types/customers";

export const MEASUREMENT_TYPES: { type: MeasurementType; label: string; labelUrdu: string }[] = [
  { type: "kameez_shalwar", label: "Kameez Shalwar", labelUrdu: "کمیز شلوار" },
  { type: "kurta_pajama", label: "Kurta Pajama", labelUrdu: "کرتہ پاجامہ" },
  { type: "pant_kot", label: "Pant Kot", labelUrdu: "پینٹ کوٹ" },
  { type: "waist_kot", label: "Waist Kot", labelUrdu: "ویسٹ کوٹ" },
];

export function getMeasurementTypeLabel(type: MeasurementType): string {
  return MEASUREMENT_TYPES.find((t) => t.type === type)?.label ?? type;
}

export function getMeasurementTypeLabelUrdu(type: MeasurementType): string {
  return MEASUREMENT_TYPES.find((t) => t.type === type)?.labelUrdu ?? "";
}
