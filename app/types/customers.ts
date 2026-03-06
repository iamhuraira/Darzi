/**
 * Customer and Measurement types for the tailor shop MVP.
 */

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MeasurementType =
  | "kameez_shalwar"
  | "kurta_pajama"
  | "pant_kot"
  | "waist_kot";

export interface KameezShalwarFields {
  qameez_length: string;
  chaati: string;
  kamar: string;
  teera: string;
  baazu: string;
  collar: string;
  qameez_ghera: string;
  moda: string;
  cuff: string;
  shalwar_length: string;
  paincha: string;
  shalwar_ghera: string;
  aasan: string;
  special_instructions: string;
}

export interface KurtaPajamaFields {
  kurta_length: string;
  chaati: string;
  kamar: string;
  teera: string;
  baazu: string;
  collar: string;
  kurta_ghera: string;
  moda: string;
  cuff: string;
  pajama_length: string;
  paincha: string;
  pajama_ghera: string;
  aasan: string;
  special_instructions: string;
}

export interface PantKotFields {
  coat_length: string;
  shoulder: string;
  chest: string;
  waist: string;
  sleeve: string;
  back: string;
  pant_length: string;
  pant_waist: string;
  hip: string;
  thigh: string;
  knee: string;
  bottom: string;
  crotch: string;
}

export interface WaistKotFields {
  length: string;
  shoulder: string;
  chest: string;
  waist: string;
  hip: string;
  back: string;
  armhole: string;
}

export type MeasurementFields =
  | KameezShalwarFields
  | KurtaPajamaFields
  | PantKotFields
  | WaistKotFields;

export interface Measurement {
  id: string;
  shopId: string;
  customerId: string;
  type: MeasurementType;
  fields: MeasurementFields;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
