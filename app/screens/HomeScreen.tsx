import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUserQuery, useLogoutMutation } from "../api/auth";
import { colors } from "../theme/colors";
import { useAppStore } from "../stores/appStore";
import type { Locale } from "../lib/i18n";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation(["home", "common"]);
  const { data: user } = useCurrentUserQuery();
  const { mutate: logout, isPending } = useLogoutMutation();
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const nextLocale: Locale = locale === "en" ? "ur" : "en";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingHorizontal: 24,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={() => setLocale(nextLocale)}
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 24,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 14,
          backgroundColor: colors.surface,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.copper }}>
          {locale === "en" ? "اردو" : "English"}
        </Text>
      </Pressable>
      <Text style={{ fontSize: 24, fontWeight: "600", color: colors.cream, marginBottom: 8 }}>
        {t("home:appName")}
      </Text>
      <Text style={{ fontSize: 16, color: colors.creamMuted, marginBottom: 24 }}>
        {t("home:hello", { name: user?.name ?? "User" })}
      </Text>
      <Pressable
        onPress={() => logout()}
        disabled={isPending}
        style={({ pressed }) => ({
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 14,
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.cream }}>
          {t("common:signOut")}
        </Text>
      </Pressable>
    </View>
  );
}
