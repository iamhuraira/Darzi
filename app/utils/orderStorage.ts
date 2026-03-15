/**
 * AsyncStorage helpers for orders.
 * Key: 'orders' → Order[]
 */
import * as storage from "./storageAdapter";
import type { Order } from "../types/orders";

const ORDERS_KEY = "orders";

export async function getOrders(shopId: string): Promise<Order[]> {
  try {
    const raw = await storage.getItem(ORDERS_KEY);
    const list: Order[] = raw ? JSON.parse(raw) : [];
    return list.filter((o) => o.shopId === shopId);
  } catch {
    return [];
  }
}

/** Returns next order number e.g. '#1086' from existing orders. */
export async function getNextOrderNumber(shopId: string): Promise<string> {
  const orders = await getOrders(shopId);
  let max = 0;
  for (const o of orders) {
    const num = parseInt(o.orderNumber.replace(/^#/, ""), 10);
    if (!Number.isNaN(num) && num > max) max = num;
  }
  return `#${max + 1}`;
}

export async function saveOrder(order: Order): Promise<void> {
  const raw = await storage.getItem(ORDERS_KEY);
  const list: Order[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex((o) => o.id === order.id);
  if (idx >= 0) list[idx] = order;
  else list.push(order);
  await storage.setItem(ORDERS_KEY, JSON.stringify(list));
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  const raw = await storage.getItem(ORDERS_KEY);
  const list: Order[] = raw ? JSON.parse(raw) : [];
  const order = list.find((o) => o.id === orderId);
  if (!order) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  await storage.setItem(ORDERS_KEY, JSON.stringify(list));
}

export async function updatePaymentStatus(
  orderId: string,
  advancePaid: number
): Promise<void> {
  const raw = await storage.getItem(ORDERS_KEY);
  const list: Order[] = raw ? JSON.parse(raw) : [];
  const order = list.find((o) => o.id === orderId);
  if (!order) return;
  order.advancePaid = advancePaid;
  order.remainingAmount = order.totalAmount - advancePaid;
  order.paymentStatus =
    advancePaid <= 0
      ? "unpaid"
      : advancePaid >= order.totalAmount
        ? "fully_paid"
        : "advance_paid";
  order.updatedAt = new Date().toISOString();
  await storage.setItem(ORDERS_KEY, JSON.stringify(list));
}
