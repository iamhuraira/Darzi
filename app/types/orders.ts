/**
 * Order and Suit types for the tailor shop.
 * AsyncStorage key: 'orders' → Order[]
 */

import type { MeasurementType } from "./customers";

export type OrderStatus =
  | "received"
  | "in_stitching"
  | "stitching_complete"
  | "delivered";

export type PaymentStatus =
  | "unpaid"
  | "advance_paid"
  | "fully_paid";

/** Garment type for a suit item; same as measurement type. */
export type GarmentType = MeasurementType;

export interface SuitItem {
  id: string;
  suitNumber: number;
  customerId: string;
  customerName: string;
  garmentType: GarmentType;
  measurementId: string | null;
  measurementSnapshot: Record<string, unknown> | null;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  shopId: string;
  orderNumber: string;
  suits: SuitItem[];
  status: OrderStatus;
  totalAmount: number;
  advancePaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
