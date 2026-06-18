import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, fontSizes, fontWeights, radius, shadows, spacing } from "../constants/theme";
import { useLocais } from "../hooks/hooks";
import { addItem } from "../services/api";

export default function ModalAdicionar() {
  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [descricao, setDescricao] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const { locais } = useLocais();
  const locaisAtivos = locais.filter((l) => l.ativo);

  const handleSalvar = async () => {
    if (!nomeItem.trim()) return;

    const qtd = parseInt(quantidade, 10);
    if (!qtd || qtd <= 0) {
      Alert.alert("Aviso", "Quantidade deve ser maior que zero.");
      return;
    }

    setSalvando(true);
    try {
      await addItem({
        nome: nomeItem.trim(),
        quantidade: qtd,
        descricao: descricao.trim() || undefined,
        idLocal: localSelecionado?.idLocal ?? undefined,
      });
      router.back();
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setSalvando(false);
    }
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
          <TouchableOpacity onPress={() => router.back()} style={styles.botaoFechar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            placeholder="Ex: 1, 2, 3..."
            placeholderTextColor={colors.textMuted}
            value={quantidade}
            onChangeText={setQuantidade}
            style={styles.input}
            keyboardType="numeric"
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

        {locaisAtivos.length > 0 && (
          <View style={styles.secaoLocais}>
            <Text style={styles.label}>Onde encontrar este item?</Text>
            <View style={styles.chipsContainer}>
              {locaisAtivos.map((local) => {
                const selecionado = localSelecionado?.idLocal === local.idLocal;
                return (
                  <TouchableOpacity
                    key={local.idLocal}
                    activeOpacity={0.8}
                    onPress={() => setLocalSelecionado(selecionado ? null : local)}
                    style={[styles.chip, selecionado && styles.chipSelecionado]}
                  >
                    <Ionicons
                      name={selecionado ? "location" : "location-outline"}
                      size={14}
                      color={selecionado ? colors.white : colors.textMuted}
                    />
                    <Text style={[styles.chipTexto, selecionado && styles.chipTextoSelecionado]}>
                      {local.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.botaoSalvar,
            (!nomeItem.trim() || salvando) && styles.botaoSalvarDesativado,
            nomeItem.trim() && !salvando && shadows.primary,
          ]}
          onPress={handleSalvar}
          disabled={!nomeItem.trim() || salvando}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoSalvarTexto}>
            {salvando ? "Salvando..." : "Adicionar à Lista"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContainer: { padding: spacing.lg },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xl, marginTop: 50 },
  titulo: { fontSize: fontSizes.h2, fontWeight: fontWeights.bold, color: colors.dark, fontFamily: "Poppins_700Bold" },
  botaoFechar: { backgroundColor: colors.white, padding: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  inputGroup: { marginBottom: spacing.xl },
  label: { fontSize: fontSizes.body, fontWeight: fontWeights.semibold, color: colors.dark, fontFamily: "Inter_600SemiBold", marginBottom: spacing.sm },
  input: { backgroundColor: colors.white, borderRadius: radius.card, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.body, color: colors.text, borderWidth: 1, borderColor: colors.border, fontFamily: "Inter_400Regular" },
  textArea: { minHeight: 80, paddingTop: spacing.md },
  secaoLocais: { marginBottom: spacing.xxl },
  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs },
  chip: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 4 },
  chipSelecionado: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { fontSize: fontSizes.small, color: colors.text, fontWeight: fontWeights.medium, fontFamily: "Inter_500Medium" },
  chipTextoSelecionado: { color: colors.white, fontWeight: fontWeights.semibold },
  botaoSalvar: { backgroundColor: colors.primary, borderRadius: radius.button, paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.md },
  botaoSalvarDesativado: { backgroundColor: colors.textMuted, opacity: 0.4 },
  botaoSalvarTexto: { color: colors.white, fontSize: fontSizes.body, fontWeight: fontWeights.semibold, letterSpacing: 0.2 },
});