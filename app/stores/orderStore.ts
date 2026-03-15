import { create } from "zustand";
import type { Order, OrderStatus } from "../types/orders";
import * as orderStorage from "../utils/orderStorage";

export type OrderFilter = OrderStatus | "all";

interface OrderState {
  orders: Order[];
  activeFilter: OrderFilter;

  loadOrders: (shopId: string) => Promise<void>;
  createOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  setFilter: (filter: OrderFilter) => void;

  getFilteredOrders: () => Order[];
  getOrderStats: () => {
    total: number;
    stitching: number;
    ready: number;
    delivered: number;
  };
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  activeFilter: "all",

  loadOrders: async (shopId) => {
    const list = await orderStorage.getOrders(shopId);
    set({ orders: list });
  },

  createOrder: async (order) => {
    await orderStorage.saveOrder(order);
    set((s) => ({ orders: [order, ...s.orders] }));
  },

  updateOrder: async (id, data) => {
    const prev = get().orders.find((o) => o.id === id);
    if (!prev) return;
    const updated: Order = {
      ...prev,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await orderStorage.saveOrder(updated);
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? updated : o)),
    }));
  },

  setFilter: (filter) => set({ activeFilter: filter }),

  getFilteredOrders: () => {
    const { orders, activeFilter } = get();
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  },

  getOrderStats: () => {
    const orders = get().orders;
    const total = orders.length;
    const stitching = orders.filter(
      (o) => o.status === "received" || o.status === "in_stitching"
    ).length;
    const ready = orders.filter((o) => o.status === "stitching_complete").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { total, stitching, ready, delivered };
  },
}));
