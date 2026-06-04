import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Switch } from "react-native-paper";
import FilterTabs from "../../components/ui/FilterTabs";
import {
  colors,
  fontSizes,
  fontWeights,
  radius,
  shadows,
  spacing,
} from "../../constants/theme";

function LocalItem({
  item,
  onToggle,
  onEdit,
  editingId,
  editingText,
  setEditingText,
  onSave,
}) {
  const isEditing = editingId === item.id;

  return (
    <View style={[styles.card, shadows.sm]}>
      <View
        style={[
          styles.cardAccent,
          { backgroundColor: item.ativo ? colors.primary : colors.dark },
        ]}
      />

      {isEditing ? (
        <TextInput
          value={editingText}
          onChangeText={setEditingText}
          autoFocus
          style={styles.input}
          placeholder="Nome do local"
          onSubmitEditing={() => onSave(item.id)}
        />
      ) : (
        <Text style={styles.cardText} numberOfLines={1}>
          {item.nome}
        </Text>
      )}

      <TouchableOpacity
        onPress={() =>
          isEditing ? onSave(item.id) : onEdit(item.id, item.nome)
        }
        style={styles.editBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name={isEditing ? "check" : "pencil-outline"}
          size={20}
          color={isEditing ? colors.primary : colors.textMuted}
        />
      </TouchableOpacity>

      <Switch
        value={item.ativo}
        onValueChange={() => onToggle(item.id)}
        color={colors.primary}
        style={styles.toggle}
      />
    </View>
  );
}

export default function LocaisDeCompra() {
  const [locais, setLocais] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const handleToggle = (id) => {
    setLocais((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ativo: !l.ativo } : l)),
    );
  };

  const handleEdit = (id, nomeAtual) => {
    setEditingId(id);
    setEditingText(nomeAtual);
  };

  const handleSave = (id) => {
    setLocais((prev) =>
      prev.map((l) => (l.id === id ? { ...l, nome: editingText } : l)),
    );

    setEditingId(null);
    setEditingText("");
  };

  const handleNovoLocal = () => {
    const next = (locais ?? []).length + 1;

    setLocais((prev) => [
      ...(prev ?? []),
      {
        id: String(next),
        nome: `Local número ${String(next).padStart(2, "0")}`,
        ativo: false,
      },
    ]);
  };

  const locaisFiltrados = (locais ?? []).filter((local) => {
    if (filtro === "ativos") {
      return local.ativo;
    }
    if (filtro === "inativos") {
      return !local.ativo;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.headerTitle}>{"Locais de\nCompra"}</Text>
          </View>

          <TouchableOpacity
            style={[styles.novoBtn, shadows.primary]}
            onPress={handleNovoLocal}
            activeOpacity={0.85}
          >
            <Text style={styles.novoBtnText}>+ Novo local</Text>
          </TouchableOpacity>
        </View>

        <FilterTabs value={filtro} onChange={setFiltro} />

        <FlatList
          data={locaisFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="store-search-outline"
                size={48}
                color={colors.textMuted}
              />
              <Text style={styles.emptyText}>
                {locais.length === 0
                  ? "Nenhum local cadastrado ainda.\nClique em '+ Novo local' para adicionar!"
                  : "Nenhum local encontrado para este filtro."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <LocalItem
              item={item}
              onToggle={handleToggle}
              onEdit={handleEdit}
              editingId={editingId}
              editingText={editingText}
              setEditingText={setEditingText}
              onSave={handleSave}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },

  accentBar: {
    width: 4,
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    marginTop: 2,
  },

  headerTitle: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  novoBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  novoBtnText: {
    color: colors.white,
    fontSize: fontSizes.small,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
  },

  listContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    paddingRight: spacing.sm,
    overflow: "hidden",
  },

  cardAccent: {
    width: 4,
    alignSelf: "stretch",
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },

  cardText: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    color: colors.text,
    letterSpacing: 0.1,
  },

  input: {
    flex: 1,
    fontSize: fontSizes.body,
    color: colors.text,
    paddingVertical: 0,
  },

  editBtn: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },

  toggle: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xxl * 3,
    paddingHorizontal: spacing.xl,
  },

  emptyText: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
  },
});
