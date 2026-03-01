/**
 * Storage helpers for tailor MVP — tailor_user, tailor_shop, tailor_auth.
 * Uses storageAdapter (AsyncStorage with in-memory fallback when native module is null).
 */
import * as storage from "./storageAdapter";

export const TAILOR_KEYS = {
  AUTH: "tailor_auth",
  USER: "tailor_user",
  SHOP: "tailor_shop",
} as const;

export interface TailorUser {
  id: string;
  name: string;
  phone: string;
  password: string; // plain for MVP
  createdAt: string;
}

export interface TailorShop {
  id: string;
  ownerId: string;
  shopName: string;
  shopPhone: string;
  city: string;
  address: string;
  description: string;
  plan: "free" | "basic" | "pro";
  createdAt: string;
}

export interface TailorAuth {
  isLoggedIn: boolean;
  userId: string;
  shopId: string;
  role: "owner";
}

export async function getTailorAuth(): Promise<TailorAuth | null> {
  try {
    const raw = await storage.getItem(TAILOR_KEYS.AUTH);
    if (!raw) return null;
    const data = JSON.parse(raw) as TailorAuth;
    return data?.isLoggedIn ? data : null;
  } catch {
    return null;
  }
}

export async function setTailorAuth(auth: TailorAuth): Promise<void> {
  await storage.setItem(TAILOR_KEYS.AUTH, JSON.stringify(auth));
}

export async function getTailorUser(): Promise<TailorUser | null> {
  try {
    const raw = await storage.getItem(TAILOR_KEYS.USER);
    return raw ? (JSON.parse(raw) as TailorUser) : null;
  } catch {
    return null;
  }
}

export async function setTailorUser(user: TailorUser): Promise<void> {
  await storage.setItem(TAILOR_KEYS.USER, JSON.stringify(user));
}

export async function getTailorShop(): Promise<TailorShop | null> {
  try {
    const raw = await storage.getItem(TAILOR_KEYS.SHOP);
    return raw ? (JSON.parse(raw) as TailorShop) : null;
  } catch {
    return null;
  }
}

export async function setTailorShop(shop: TailorShop): Promise<void> {
  await storage.setItem(TAILOR_KEYS.SHOP, JSON.stringify(shop));
}

export async function clearTailorAuth(): Promise<void> {
  await storage.removeItem(TAILOR_KEYS.AUTH);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Default demo user/shop — seeded once when no data exists. */
const DEFAULT_USER_ID = "default_owner_1";
const DEFAULT_SHOP_ID = "default_shop_1";
const DEFAULT_CREATED = "2025-01-01T00:00:00.000Z";

export async function seedDefaultDataIfEmpty(): Promise<void> {
  const existingUser = await getTailorUser();
  if (existingUser) return; // already have data, don't overwrite

  const user: TailorUser = {
    id: DEFAULT_USER_ID,
    name: "Abu Huraira",
    phone: "03086173323",
    password: "4123004abh",
    createdAt: DEFAULT_CREATED,
  };
  const shop: TailorShop = {
    id: DEFAULT_SHOP_ID,
    ownerId: DEFAULT_USER_ID,
    shopName: "Master Arrain",
    shopPhone: "03086173323",
    city: "Lahore",
    address: "Johar Town",
    description: "",
    plan: "free",
    createdAt: DEFAULT_CREATED,
  };

  await setTailorUser(user);
  await setTailorShop(shop);
  // Do not set auth — user stays on Welcome and can log in with default credentials
}
