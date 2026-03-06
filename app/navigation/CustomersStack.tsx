import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomersListScreen } from "../screens/customers/CustomersListScreen";
import { AddEditCustomerScreen } from "../screens/customers/AddEditCustomerScreen";
import { CustomerDetailScreen } from "../screens/customers/CustomerDetailScreen";
import { MeasurementFormScreen } from "../screens/customers/MeasurementFormScreen";
import type { CustomersStackParamList } from "./types";

const Stack = createNativeStackNavigator<CustomersStackParamList>();

const SCREEN_OPTIONS = {
  headerShown: false as const,
  contentStyle: { backgroundColor: "#0F1C2E" as const },
  animation: "slide_from_right" as const,
};

export function CustomersStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS} initialRouteName="CustomersList">
      <Stack.Screen name="CustomersList" component={CustomersListScreen} />
      <Stack.Screen name="AddCustomer" component={AddEditCustomerScreen} />
      <Stack.Screen name="EditCustomer" component={AddEditCustomerScreen} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      <Stack.Screen name="MeasurementForm" component={MeasurementFormScreen} />
    </Stack.Navigator>
  );
}
