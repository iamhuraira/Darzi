import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { DashboardScreen } from "../screens/DashboardScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterShopScreen } from "../screens/RegisterShopScreen";
import { SignupScreen } from "../screens/SignupScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { CustomDrawerContent } from "./DrawerContent";
import type { DrawerParamList, RootStackParamList } from "./types";
import { useTailorAuthStore } from "../stores/tailorAuthStore";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const STACK_OPTIONS = {
  headerShown: false as const,
  contentStyle: { backgroundColor: "#0F1C2E" as const },
  animation: "slide_from_right" as const,
};

export function RootNavigator() {
  const auth = useTailorAuthStore((s) => s.auth);
  const hydrated = useTailorAuthStore((s) => s.hydrated);
  const hydrate = useTailorAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!hydrated) return null;

  if (auth?.isLoggedIn) {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          drawerStyle: { backgroundColor: "#1A2D42" },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      </Drawer.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={STACK_OPTIONS} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="RegisterShop" component={RegisterShopScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
