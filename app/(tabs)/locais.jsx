import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useLocais } from "../../hooks/hooks";

function LocalItem({
  item,
  onToggle,
  onEdit,
  editingId,
  editingText,
  setEditingText,
  onSave,
}) {
  const isEditing = editingId === item.idLocal;

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
          onSubmitEditing={() => onSave(item.idLocal)}
        />
      ) : (
        <Text style={styles.cardText} numberOfLines={1}>
          {item.nome}
        </Text>
      )}
      <TouchableOpacity
        onPress={() =>
          isEditing ? onSave(item.idLocal) : onEdit(item.idLocal, item.nome)
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
        onValueChange={() => onToggle(item.idLocal, item.ativo)}
        color={colors.primary}
        style={styles.toggle}
      />
    </View>
  );
}

export default function LocaisDeCompra() {
  const { locais, carregando, erro, adicionar, renomear, toggleAtivo } =
    useLocais();
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [adicionando, setAdicionando] = useState(false);

  const handleToggle = async (id, ativoAtual) => {
    try {
      await toggleAtivo(id, ativoAtual);
    } catch (e) {
      Alert.alert("Erro", e.message);
    }
  };

  const handleEdit = (id, nomeAtual) => {
    setEditingId(id);
    setEditingText(nomeAtual);
  };

  const handleSave = async (id) => {
    if (!editingText.trim()) return;
    try {
      await renomear(id, editingText.trim());
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleNovoLocal = () => {
    Alert.prompt(
      "Novo Local de Compra",
      "Digite o nome do estabelecimento (Máx. 50 caracteres):", //
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Adicionar",
          onPress: async (nomeDigitado) => {
            if (!nomeDigitado || !nomeDigitado.trim()) {
              Alert.alert("Erro", "O nome do local não pode ser vazio."); //
              return;
            }

            if (nomeDigitado.trim().length > 50) {
              Alert.alert("Erro", "O nome deve ter no máximo 50 caracteres."); //
              return;
            }

            setAdicionando(true);
            try {
              await adicionar(nomeDigitado.trim());
            } catch (e) {
              Alert.alert("Erro", e.message);
            } finally {
              setAdicionando(false);
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const locaisFiltrados = locais.filter((local) => {
    if (filtro === "ativos") return local.ativo;
    if (filtro === "inativos") return !local.ativo;
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
            disabled={adicionando}
            activeOpacity={0.85}
          >
            <Text style={styles.novoBtnText}>
              {adicionando ? "..." : "+ Novo local"}
            </Text>
          </TouchableOpacity>
        </View>

        <FilterTabs value={filtro} onChange={setFiltro} />

        {carregando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : erro ? (
          <View style={styles.centrado}>
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        ) : (
          <FlatList
            data={locaisFiltrados}
            keyExtractor={(item) => String(item.idLocal)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: spacing.xs }} />
            )}
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
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.md, paddingTop: 40 },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  listContent: { paddingBottom: spacing.xl, flexGrow: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingRight: spacing.sm,
    overflow: "hidden",
  },
  cardAccent: {
    width: 4,
    alignSelf: "stretch",
    marginRight: spacing.sm,
  },
  cardText: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    color: colors.text,
    letterSpacing: 0.1,
    paddingVertical: spacing.md, 
  },
  input: {
    flex: 1,
    fontSize: fontSizes.body,
    color: colors.text,
    paddingVertical: spacing.md, 
  },
  editBtn: {
    padding: spacing.xs,
    marginRight: spacing.xs,
    paddingVertical: spacing.md,
  },
  toggle: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
    marginVertical: spacing.md,
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
  erroTexto: {
    fontSize: fontSizes.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
