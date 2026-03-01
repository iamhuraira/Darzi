/**
 * Auth & user types.
 * Same types can be used when you switch to API (request/response shapes).
 */
export interface User {
  id: string;
  name: string;
  email: string;
  /** Only for MVP local storage; never send to a real API in plain form. */
  password?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
