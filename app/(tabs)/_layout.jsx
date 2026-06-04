import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, router, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

function BotaoAdicionar() {
  return (
    <TouchableOpacity
      onPress={() => router.push("modal-adicionar")}
      style={{ flex: 1, alignItems: "center" }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <Ionicons name="add-outline" size={32} color={colors.white} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarAcesso = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem("@listfy_token");

        if (!tokenSalvo) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
      } finally {
        setCarregando(false);
      }
    };

    verificarAcesso();
  }, [pathname]);
  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const naIndex = pathname === "/";
  const naAbaComprados = params.aba === "comprados";
  const listasAtivo = naIndex && !naAbaComprados;
  const historicoAtivo = naIndex && naAbaComprados;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 80,
          paddingBottom: 12,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Listas",
          tabBarIcon: () => (
            <Ionicons
              name="cart-outline"
              size={32}
              color={listasAtivo ? colors.primary : colors.textMuted}
            />
          ),
          tabBarLabelStyle: {
            color: listasAtivo ? colors.primary : colors.textMuted,
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate({ pathname: "/", params: { aba: "pendentes" } });
          },
        }}
      />

      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ size }) => (
            <Ionicons
              name="time-outline"
              size={size}
              color={historicoAtivo ? colors.primary : colors.textMuted}
            />
          ),
          tabBarLabelStyle: {
            color: historicoAtivo ? colors.primary : colors.textMuted,
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate({ pathname: "/", params: { aba: "comprados" } });
          },
        }}
      />
      <Tabs.Screen
        name="adicionar"
        options={{
          title: "",
          tabBarButton: () => <BotaoAdicionar />,
        }}
      />
      <Tabs.Screen
        name="locais"
        options={{
          title: "Locais",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="token"
        options={{
          title: "Token",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
