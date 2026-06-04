import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
} from "../constants/theme";

const LOCAIS_ATIVOS_MOCK = [
  { id: "1", nome: "Local 01" },
  { id: "2", nome: "Local 02" },
  { id: "3", nome: "Local 03" },
  { id: "4", nome: "Local 04" },
];

export default function ModalAdicionar() {
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [descricao, setDescricao] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState(null);

  const handleSalvar = () => {
    if (!nomeItem.trim()) return;

    console.log({
      nome: nomeItem,
      quantidade: quantidade,
      descricao: descricao,
      local: localSelecionado ? localSelecionado.nome : "Sem local",
      comprado: false,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Novo Item</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.botaoFechar}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>O que você precisa comprar?</Text>
          <TextInput
            placeholder="Ex: Arroz, Feijão, Sabonete..."
            placeholderTextColor={colors.textMuted}
            value={nomeItem}
            onChangeText={setNomeItem}
            style={styles.input}
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            placeholder="Ex: 1, 2kg, 3 caixas..."
            placeholderTextColor={colors.textMuted}
            value={quantidade}
            onChangeText={setQuantidade}
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            placeholder="Ex: Marca específica, tamanho..."
            placeholderTextColor={colors.textMuted}
            value={descricao}
            onChangeText={setDescricao}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.secaoLocais}>
          <Text style={styles.label}>Onde encontrar este item?</Text>

          <View style={styles.chipsContainer}>
            {LOCAIS_ATIVOS_MOCK.map((local) => {
              const itemSelecionado = localSelecionado?.id === local.id;
              return (
                <TouchableOpacity
                  key={local.id}
                  activeOpacity={0.8}
                  onPress={() =>
                    setLocalSelecionado(itemSelecionado ? null : local)
                  }
                  style={[
                    styles.chip,
                    itemSelecionado && styles.chipSelecionado,
                  ]}
                >
                  <Ionicons
                    name={itemSelecionado ? "location" : "location-outline"}
                    size={14}
                    color={itemSelecionado ? colors.white : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.chipTexto,
                      itemSelecionado && styles.chipTextoSelecionado,
                    ]}
                  >
                    {local.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.botaoSalvar,
            !nomeItem.trim() && styles.botaoSalvarDesativado,
            nomeItem.trim() && shadows.primary,
          ]}
          onPress={handleSalvar}
          disabled={!nomeItem.trim()}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoSalvarTexto}>Adicionar à Lista</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
    marginTop: 50,
  },
  titulo: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    fontFamily: "Poppins_700Bold",
  },
  botaoFechar: {
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.dark,
    fontFamily: "Inter_600SemiBold",
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: "Inter_400Regular",
  },
  textArea: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  secaoLocais: {
    marginBottom: spacing.xxl,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  chipSelecionado: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTexto: {
    fontSize: fontSizes.small,
    color: colors.text,
    fontWeight: fontWeights.medium,
    fontFamily: "Inter_500Medium",
  },
  chipTextoSelecionado: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  botaoSalvar: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  botaoSalvarDesativado: {
    backgroundColor: colors.textMuted,
    opacity: 0.4,
  },
  botaoSalvarTexto: {
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
  },
});
