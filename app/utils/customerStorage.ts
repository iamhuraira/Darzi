/**
 * AsyncStorage helpers for customers and measurements.
 * Keys: 'customers' → Customer[], 'measurements' → Measurement[].
 */
import * as storage from "./storageAdapter";
import type { Customer, Measurement, MeasurementType } from "../types/customers";
import { getDummyCustomersAndMeasurements } from "../data/dummyCustomers";

const CUSTOMERS_KEY = "customers";
const MEASUREMENTS_KEY = "measurements";

/** Seed 5 dummy customers with measurements when the shop has no customers. */
export async function seedDummyCustomersIfEmpty(shopId: string): Promise<void> {
  const existing = await getCustomers(shopId);
  if (existing.length > 0) return;
  const { customers, measurements } = getDummyCustomersAndMeasurements(shopId);
  const rawC = await storage.getItem(CUSTOMERS_KEY);
  const listC: Customer[] = rawC ? JSON.parse(rawC) : [];
  const rawM = await storage.getItem(MEASUREMENTS_KEY);
  const listM: Measurement[] = rawM ? JSON.parse(rawM) : [];
  await storage.setItem(CUSTOMERS_KEY, JSON.stringify([...listC, ...customers]));
  await storage.setItem(MEASUREMENTS_KEY, JSON.stringify([...listM, ...measurements]));
}

export async function getCustomers(shopId: string): Promise<Customer[]> {
  try {
    const raw = await storage.getItem(CUSTOMERS_KEY);
    const list: Customer[] = raw ? JSON.parse(raw) : [];
    return list.filter((c) => c.shopId === shopId);
  } catch {
    return [];
  }
}

export async function saveCustomer(customer: Customer): Promise<void> {
  const raw = await storage.getItem(CUSTOMERS_KEY);
  const list: Customer[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex((c) => c.id === customer.id);
  if (idx >= 0) list[idx] = customer;
  else list.push(customer);
  await storage.setItem(CUSTOMERS_KEY, JSON.stringify(list));
}

export async function deleteCustomer(customerId: string): Promise<void> {
  const raw = await storage.getItem(CUSTOMERS_KEY);
  const list: Customer[] = raw ? JSON.parse(raw) : [];
  const next = list.filter((c) => c.id !== customerId);
  await storage.setItem(CUSTOMERS_KEY, JSON.stringify(next));
  // Also delete all measurements for this customer
  const mRaw = await storage.getItem(MEASUREMENTS_KEY);
  const mList: Measurement[] = mRaw ? JSON.parse(mRaw) : [];
  const mNext = mList.filter((m) => m.customerId !== customerId);
  await storage.setItem(MEASUREMENTS_KEY, JSON.stringify(mNext));
}

export async function getMeasurements(customerId: string): Promise<Measurement[]> {
  try {
    const raw = await storage.getItem(MEASUREMENTS_KEY);
    const list: Measurement[] = raw ? JSON.parse(raw) : [];
    return list.filter((m) => m.customerId === customerId);
  } catch {
    return [];
  }
}

export async function getAllMeasurementsForShop(shopId: string): Promise<Measurement[]> {
  try {
    const raw = await storage.getItem(MEASUREMENTS_KEY);
    const list: Measurement[] = raw ? JSON.parse(raw) : [];
    return list.filter((m) => m.shopId === shopId);
  } catch {
    return [];
  }
}

export async function getMeasurement(
  customerId: string,
  type: MeasurementType
): Promise<Measurement | null> {
  const list = await getMeasurements(customerId);
  return list.find((m) => m.type === type) ?? null;
}

export async function saveMeasurement(measurement: Measurement): Promise<void> {
  const raw = await storage.getItem(MEASUREMENTS_KEY);
  const list: Measurement[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex(
    (m) => m.customerId === measurement.customerId && m.type === measurement.type
  );
  if (idx >= 0) list[idx] = measurement;
  else list.push(measurement);
  await storage.setItem(MEASUREMENTS_KEY, JSON.stringify(list));
}

export async function deleteMeasurement(
  customerId: string,
  type: MeasurementType
): Promise<void> {
  const raw = await storage.getItem(MEASUREMENTS_KEY);
  const list: Measurement[] = raw ? JSON.parse(raw) : [];
  const next = list.filter(
    (m) => !(m.customerId === customerId && m.type === type)
  );
  await storage.setItem(MEASUREMENTS_KEY, JSON.stringify(next));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
