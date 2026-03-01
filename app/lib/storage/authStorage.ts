/**
 * Auth storage — MVP: all data in local storage.
 * When moving to API: keep these function names/signatures, replace body with
 * fetch/axios calls and use storage only for token/session cache if needed.
 */
import type { AuthUser, LoginInput, SignUpInput, User } from "./types";
import { getItem, removeItem, setItem } from "./storage";
import { STORAGE_KEYS } from "./keys";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Get all registered users (MVP). Replace with API call later. */
export async function getStoredUsers(): Promise<User[]> {
  const users = await getItem<User[]>(STORAGE_KEYS.USERS);
  return users ?? [];
}

/** Sign up: save user to local list and set as current. Later: POST /auth/signup then set session. */
export async function signUp(input: SignUpInput): Promise<AuthUser> {
  const users = await getStoredUsers();
  const exists = users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (exists) throw new Error("An account with this email already exists.");

  const user: User = {
    id: generateId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };
  await setItem(STORAGE_KEYS.USERS, [...users, user]);

  const authUser: AuthUser = { id: user.id, name: user.name, email: user.email };
  await setItem(STORAGE_KEYS.CURRENT_USER, authUser);
  return authUser;
}

/** Login: find user by email, check password, set session. Later: POST /auth/login then set token/user. */
export async function login(input: LoginInput): Promise<AuthUser> {
  const users = await getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (!user || user.password !== input.password)
    throw new Error("Invalid email or password.");

  const authUser: AuthUser = { id: user.id, name: user.name, email: user.email };
  await setItem(STORAGE_KEYS.CURRENT_USER, authUser);
  return authUser;
}

/** Current logged-in user. Later: decode token or GET /auth/me. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return getItem<AuthUser>(STORAGE_KEYS.CURRENT_USER);
}

/** Logout: clear session. Later: clear token and optionally call POST /auth/logout. */
export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.CURRENT_USER);
}
