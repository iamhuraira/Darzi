import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OrdersListScreen } from "../screens/orders/OrdersListScreen";
import { CreateOrderStep1Screen } from "../screens/orders/CreateOrderStep1Screen";
import { CreateOrderStep2Screen } from "../screens/orders/CreateOrderStep2Screen";
import { CreateOrderStep3Screen } from "../screens/orders/CreateOrderStep3Screen";
import type { OrdersStackParamList } from "./types";

const Stack = createNativeStackNavigator<OrdersStackParamList>();

const SCREEN_OPTIONS = {
  headerShown: false as const,
  contentStyle: { backgroundColor: "#0F1C2E" as const },
  animation: "slide_from_right" as const,
};

export function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS} initialRouteName="OrdersList">
      <Stack.Screen name="OrdersList" component={OrdersListScreen} />
      <Stack.Screen name="CreateOrderStep1" component={CreateOrderStep1Screen} />
      <Stack.Screen name="CreateOrderStep2" component={CreateOrderStep2Screen} />
      <Stack.Screen name="CreateOrderStep3" component={CreateOrderStep3Screen} />
    </Stack.Navigator>
  );
}
