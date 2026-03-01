# Storage (MVP → API)

This folder holds **local storage** for the MVP. Same API is designed so you can switch to a backend later without changing screens.

## Current (MVP)

- **storage.ts** — `getItem`, `setItem`, `removeItem` (AsyncStorage).
- **keys.ts** — All storage keys; adjust or remove when moving to API.
- **authStorage.ts** — `signUp`, `login`, `getCurrentUser`, `logout`. Data is stored locally.

## Switching to API

1. Keep **types.ts** and the same function names in **authStorage.ts**.
2. In **authStorage.ts**:
   - `signUp` → `POST /auth/signup`, then save token/user to storage (or use secure store).
   - `login` → `POST /auth/login`, then save token/user.
   - `getCurrentUser` → read from storage or `GET /auth/me` with token.
   - `logout` → clear storage and optionally `POST /auth/logout`.
3. Remove or repurpose `getStoredUsers` and `STORAGE_KEYS.USERS` if no longer needed.

Screens and `AuthContext` can keep using `signUp`, `login`, `getCurrentUser`, `logout` without changes.
