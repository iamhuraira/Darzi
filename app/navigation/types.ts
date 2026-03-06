import type { MeasurementType } from "../types/customers";
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
  Customers: undefined;
};

export type CustomersStackParamList = {
  CustomersList: undefined;
  AddCustomer: undefined;
  EditCustomer: { customerId: string };
  CustomerDetail: { customerId: string };
  MeasurementForm: { customerId: string; type: MeasurementType };
};
