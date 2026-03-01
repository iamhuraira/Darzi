import type { OwnerSignupInput } from "../utils/validation";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  RegisterShop: { step1: OwnerSignupInput };
  Dashboard: undefined;
  Home: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
};
