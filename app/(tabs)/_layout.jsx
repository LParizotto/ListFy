import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

function BotaoAdicionar() {
  return (
    <TouchableOpacity
      onPress={() => router.push("/modal-adicionar")}
      style={{
        flex: 1,
        alignItems: "center",
      }}
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
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
