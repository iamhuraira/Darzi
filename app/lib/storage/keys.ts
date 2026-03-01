/**
 * Storage keys in one place. Change here when moving to API (e.g. remove or keep for cache).
 */
export const STORAGE_KEYS = {
  /** JSON array of registered users (MVP only). */
  USERS: "@darzi/users",
  /** Current session: AuthUser JSON (MVP only). */
  CURRENT_USER: "@darzi/current_user",
} as const;
