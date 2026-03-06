import { create } from "zustand";
import type { Customer, Measurement, MeasurementType } from "../types/customers";
import * as customerStorage from "../utils/customerStorage";

interface CustomerState {
  customers: Customer[];
  measurements: Record<string, Measurement[]>; // customerId -> Measurement[]

  loadCustomers: (shopId: string) => Promise<void>;
  addCustomer: (customer: Customer) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  loadMeasurements: (customerId: string) => Promise<void>;
  saveMeasurement: (measurement: Measurement) => Promise<void>;
  deleteMeasurement: (customerId: string, type: MeasurementType) => Promise<void>;

  getCustomerById: (id: string) => Customer | undefined;
  getMeasurementByType: (customerId: string, type: MeasurementType) => Measurement | null;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  measurements: {},

  loadCustomers: async (shopId) => {
    await customerStorage.seedDummyCustomersIfEmpty(shopId);
    const [list, allMeasurements] = await Promise.all([
      customerStorage.getCustomers(shopId),
      customerStorage.getAllMeasurementsForShop(shopId),
    ]);
    const byCustomer: Record<string, Measurement[]> = {};
    for (const m of allMeasurements) {
      if (!byCustomer[m.customerId]) byCustomer[m.customerId] = [];
      byCustomer[m.customerId].push(m);
    }
    set({ customers: list, measurements: byCustomer });
  },

  addCustomer: async (customer) => {
    await customerStorage.saveCustomer(customer);
    set((s) => ({ customers: [...s.customers, customer] }));
  },

  updateCustomer: async (id, data) => {
    const prev = get().customers.find((c) => c.id === id);
    if (!prev) return;
    const updated: Customer = {
      ...prev,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await customerStorage.saveCustomer(updated);
    set((s) => ({
      customers: s.customers.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCustomer: async (id) => {
    await customerStorage.deleteCustomer(id);
    set((s) => ({
      customers: s.customers.filter((c) => c.id !== id),
      measurements: { ...s.measurements, [id]: [] },
    }));
  },

  loadMeasurements: async (customerId) => {
    const list = await customerStorage.getMeasurements(customerId);
    set((s) => ({
      measurements: { ...s.measurements, [customerId]: list },
    }));
  },

  saveMeasurement: async (measurement) => {
    await customerStorage.saveMeasurement(measurement);
    const { customerId } = measurement;
    set((s) => {
      const list = s.measurements[customerId] ?? [];
      const idx = list.findIndex((m) => m.type === measurement.type);
      const next =
        idx >= 0
          ? list.map((m) => (m.type === measurement.type ? measurement : m))
          : [...list, measurement];
      return {
        measurements: { ...s.measurements, [customerId]: next },
      };
    });
  },

  deleteMeasurement: async (customerId, type) => {
    await customerStorage.deleteMeasurement(customerId, type);
    set((s) => {
      const list = (s.measurements[customerId] ?? []).filter((m) => m.type !== type);
      return {
        measurements: { ...s.measurements, [customerId]: list },
      };
    });
  },

  getCustomerById: (id) => get().customers.find((c) => c.id === id),

  getMeasurementByType: (customerId, type) => {
    const list = get().measurements[customerId] ?? [];
    return list.find((m) => m.type === type) ?? null;
  },
}));
