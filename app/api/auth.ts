/**
 * Auth API layer. MVP: uses lib/storage. Later: replace with real API calls.
 * Same hook interface for React Query so switching to API only changes the fetchers.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AuthUser, LoginInput, SignUpInput } from "../lib/storage";
import * as authStorage from "../lib/storage";

export const AUTH_KEYS = {
  currentUser: ["auth", "currentUser"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => authStorage.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authStorage.login(input),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SignUpInput) => authStorage.signUp(input),
    onSuccess: (user: AuthUser) => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authStorage.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
    },
  });
}
