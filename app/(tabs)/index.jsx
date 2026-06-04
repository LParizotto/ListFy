import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  colors,
  fontSizes,
  fontWeights,
  radius,
  shadows,
  spacing,
} from "../../constants/theme";

const ITENS_MOCK = [
  { id: "1", nome: "Item 01", local: "Local 01", comprado: false },
  { id: "2", nome: "Item 02", local: "Local 01", comprado: false },
  { id: "3", nome: "Item 03", local: "Local 02", comprado: false },
  { id: "4", nome: "Item 04", local: "Local 03", comprado: false },
  { id: "5", nome: "Item 05", local: "Local 03", comprado: false },
  { id: "6", nome: "Item 06", local: "Local 04", comprado: false },
  { id: "7", nome: "Item 07", local: "Local 04", comprado: false },
];

function ItemLista({ item, onToggle }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(item.id)}
      style={[styles.card, shadows.sm]}
    >
      <View
        style={[
          styles.cardAccent,
          { backgroundColor: item.comprado ? colors.success : colors.primary },
        ]}
      />

      <View style={styles.cardInfo}>
        <Text
          style={[styles.cardNome, item.comprado && styles.cardNomeComprado]}
        >
          {item.nome}
        </Text>
        <View style={styles.cardLocalRow}>
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textMuted}
          />
          <Text style={styles.cardLocal}>{item.local}</Text>
        </View>
      </View>

      <View
        style={
          item.comprado ? styles.checkboxChecked : styles.checkboxUnchecked
        }
      >
        {item.comprado && (
          <Ionicons name="checkmark" size={16} color={colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ListaPrincipal() {
  const [itens, setItens] = useState(ITENS_MOCK);
  const { aba = "pendentes" } = useLocalSearchParams();

  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
  });

  const handleToggle = (id) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, comprado: !item.comprado } : item,
      ),
    );
  };

  const itensFiltrados = itens.filter((item) =>
    aba === "pendentes" ? !item.comprado : item.comprado,
  );

  const totalPendentes = itens.filter((i) => !i.comprado).length;

  return (
    <View style={styles.containerPrincipal}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.headerConteudo}>
            <View>
              <Text style={styles.headerNome}>Nome</Text>
              <Text style={styles.headerPendentes}>
                {aba === "pendentes"
                  ? `${totalPendentes} pendentes`
                  : `${itens.filter((i) => i.comprado).length} comprados`}
              </Text>
            </View>
            <Text style={styles.headerData}>{hoje}</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.abasContainer}>
        <Text style={styles.abaTitulo}>
          {aba === "pendentes" ? "Pendentes" : "Comprados"}
        </Text>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="filter-outline" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={itensFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>
              {aba === "pendentes"
                ? "Tudo comprado!"
                : "Nenhum item comprado ainda"}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ItemLista item={item} onToggle={handleToggle} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerSafeArea: {
    width: "100%",
  },

  header: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerConteudo: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerNome: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.white,
    fontFamily: "Poppins_700Bold",
    letterSpacing: -0.5,
  },

  headerPendentes: {
    fontSize: fontSizes.small,
    color: colors.white,
    opacity: 0.85,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },

  headerData: {
    fontSize: fontSizes.body,
    color: colors.white,
    fontFamily: "Inter_400Regular",
    opacity: 0.9,
    marginTop: 6,
  },

  abasContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  abaTitulo: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },

  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
    overflow: "hidden",
    minHeight: 76,
    paddingLeft: 4 + spacing.sm,
  },

  cardAccent: {
    width: 4,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },

  cardInfo: {
    flex: 1,
    gap: 4,
  },

  cardNome: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },

  cardNomeComprado: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
    fontWeight: fontWeights.regular,
  },

  cardLocalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  cardLocal: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontFamily: "Inter_400Regular",
  },

  checkboxUnchecked: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },

  checkboxChecked: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },

  vazio: {
    paddingTop: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },

  vazioEmoji: {
    fontSize: 40,
  },

  vazioTexto: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
    fontFamily: "Inter_400Regular",
    marginTop: 50,
  },
});
