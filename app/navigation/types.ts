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
  Orders: undefined;
};

export type CreateOrderStep2Params = {
  suits: import("../types/orders").SuitItem[];
};

export type CreateOrderStep3Params = {
  orderNumber: string;
  dueDate: string;
  notes?: string;
  advancePaid: number;
  suits: import("../types/orders").SuitItem[];
};

export type OrdersStackParamList = {
  OrdersList: undefined;
  CreateOrderStep1: undefined;
  CreateOrderStep2: CreateOrderStep2Params;
  CreateOrderStep3: CreateOrderStep3Params;
};

export type CustomersStackParamList = {
  CustomersList: undefined;
  AddCustomer: undefined;
  EditCustomer: { customerId: string };
  CustomerDetail: { customerId: string };
  MeasurementForm: { customerId: string; type: MeasurementType };
};
