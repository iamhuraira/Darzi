import type { MeasurementType } from "../types/customers";
import { t } from "../utils/lang";
import type { AppLanguage } from "../utils/lang";

/** All measurement type ids. Labels come from locale: t("measurementTypes." + type, language). */
export const MEASUREMENT_TYPES: MeasurementType[] = [
  "kameez_shalwar",
  "kurta_pajama",
  "pant_kot",
  "waist_kot",
];

export function getMeasurementTypeLabel(type: MeasurementType, language: AppLanguage): string {
  return t(`measurementTypes.${type}`, language);
}
