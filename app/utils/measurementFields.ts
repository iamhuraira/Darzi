import type { MeasurementType } from "../types/customers";

export interface FieldDef {
  key: string;
  label: string;
  labelUrdu: string;
}

export interface SectionDef {
  title: string;
  titleUrdu: string;
  fields: FieldDef[];
}

const INCH_SUFFIX = " (inches)";

export const KAMEEZ_SHALWAR_SECTIONS: SectionDef[] = [
  {
    title: "Kameez",
    titleUrdu: "کمیز",
    fields: [
      { key: "qameez_length", label: "Kameez Length", labelUrdu: "قمیض لمبائی" },
      { key: "chaati", label: "Chest", labelUrdu: "چھاتی" },
      { key: "kamar", label: "Waist", labelUrdu: "کمر" },
      { key: "teera", label: "Back (Tira)", labelUrdu: "تیرہ" },
      { key: "baazu", label: "Sleeve", labelUrdu: "بازو" },
      { key: "collar", label: "Collar", labelUrdu: "کالر" },
      { key: "qameez_ghera", label: "Kameez Circumference", labelUrdu: "قمیض گھیرہ" },
      { key: "moda", label: "Shoulder", labelUrdu: "موڈہ" },
      { key: "cuff", label: "Cuff", labelUrdu: "کف" },
    ],
  },
  {
    title: "Shalwar",
    titleUrdu: "شلوار",
    fields: [
      { key: "shalwar_length", label: "Shalwar Length", labelUrdu: "شلوار لمبائی" },
      { key: "paincha", label: "Paincha", labelUrdu: "پانچھ" },
      { key: "shalwar_ghera", label: "Shalwar Circumference", labelUrdu: "شلوار گھیرہ" },
      { key: "aasan", label: "Aasan (Crotch)", labelUrdu: "اسن" },
    ],
  },
  {
    title: "Special Notes",
    titleUrdu: "خصوصی ہدایات",
    fields: [{ key: "special_instructions", label: "Special Instructions", labelUrdu: "خصوصی ہدایات" }],
  },
];

export const KURTA_PAJAMA_SECTIONS: SectionDef[] = [
  {
    title: "Kurta",
    titleUrdu: "کرتہ",
    fields: [
      { key: "kurta_length", label: "Kurta Length", labelUrdu: "کرتہ لمبائی" },
      { key: "chaati", label: "Chest", labelUrdu: "چھاتی" },
      { key: "kamar", label: "Waist", labelUrdu: "کمر" },
      { key: "teera", label: "Back (Tira)", labelUrdu: "تیرہ" },
      { key: "baazu", label: "Sleeve", labelUrdu: "بازو" },
      { key: "collar", label: "Collar", labelUrdu: "کالر" },
      { key: "kurta_ghera", label: "Kurta Circumference", labelUrdu: "کرتہ گھیرہ" },
      { key: "moda", label: "Shoulder", labelUrdu: "موڈہ" },
      { key: "cuff", label: "Cuff", labelUrdu: "کف" },
    ],
  },
  {
    title: "Pajama",
    titleUrdu: "پاجامہ",
    fields: [
      { key: "pajama_length", label: "Pajama Length", labelUrdu: "پاجامہ لمبائی" },
      { key: "paincha", label: "Paincha", labelUrdu: "پانچھ" },
      { key: "pajama_ghera", label: "Pajama Circumference", labelUrdu: "پاجامہ گھیرہ" },
      { key: "aasan", label: "Aasan (Crotch)", labelUrdu: "اسن" },
    ],
  },
  {
    title: "Special Notes",
    titleUrdu: "خصوصی ہدایات",
    fields: [{ key: "special_instructions", label: "Special Instructions", labelUrdu: "خصوصی ہدایات" }],
  },
];

export const PANT_KOT_SECTIONS: SectionDef[] = [
  {
    title: "Coat",
    titleUrdu: "کوٹ",
    fields: [
      { key: "coat_length", label: "Length", labelUrdu: "کوٹ لمبائی" },
      { key: "shoulder", label: "Shoulder", labelUrdu: "کندھا" },
      { key: "chest", label: "Chest", labelUrdu: "سینہ" },
      { key: "waist", label: "Waist", labelUrdu: "کمر" },
      { key: "sleeve", label: "Sleeve", labelUrdu: "آستین" },
      { key: "back", label: "Back", labelUrdu: "پشت" },
    ],
  },
  {
    title: "Pant",
    titleUrdu: "پینٹ",
    fields: [
      { key: "pant_length", label: "Length", labelUrdu: "پینٹ لمبائی" },
      { key: "pant_waist", label: "Waist", labelUrdu: "کمر" },
      { key: "hip", label: "Hip", labelUrdu: "ہپ" },
      { key: "thigh", label: "Thigh", labelUrdu: "ران" },
      { key: "knee", label: "Knee", labelUrdu: "گھٹنا" },
      { key: "bottom", label: "Bottom", labelUrdu: "پائنچہ" },
      { key: "crotch", label: "Crotch", labelUrdu: "استر" },
    ],
  },
];

export const WAIST_KOT_SECTIONS: SectionDef[] = [
  {
    title: "Waist Kot",
    titleUrdu: "ویسٹ کوٹ",
    fields: [
      { key: "length", label: "Length", labelUrdu: "لمبائی" },
      { key: "shoulder", label: "Shoulder", labelUrdu: "کندھا" },
      { key: "chest", label: "Chest", labelUrdu: "سینہ" },
      { key: "waist", label: "Waist", labelUrdu: "کمر" },
      { key: "hip", label: "Hip", labelUrdu: "ہپ" },
      { key: "back", label: "Back", labelUrdu: "پشت" },
      { key: "armhole", label: "Armhole", labelUrdu: "بازو کا گھیرا" },
    ],
  },
];

export function getSectionsForType(type: MeasurementType): SectionDef[] {
  switch (type) {
    case "kameez_shalwar":
      return KAMEEZ_SHALWAR_SECTIONS;
    case "kurta_pajama":
      return KURTA_PAJAMA_SECTIONS;
    case "pant_kot":
      return PANT_KOT_SECTIONS;
    case "waist_kot":
      return WAIST_KOT_SECTIONS;
    default:
      return [];
  }
}

/** Returns empty field values for a measurement type (all keys → "") */
export function getEmptyFieldsForType(
  type: MeasurementType
): Record<string, string> {
  const sections = getSectionsForType(type);
  const out: Record<string, string> = {};
  for (const sec of sections) {
    for (const f of sec.fields) {
      out[f.key] = "";
    }
  }
  return out;
}
