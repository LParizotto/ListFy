import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  Alert,
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
import { formatarData } from "../../utils/formaterUtil";

// TODO: substituir pelo dado vindo da API

const TOKEN_MOCK = {
  valor: "ABCD-1234",
  dataCriacao: new Date("2025-01-10"),
};

export default function Token() {
  // TODO: substituir pelo dado vindo da API
  const [token, setToken] = useState(TOKEN_MOCK);
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    await Clipboard.setStringAsync(token.valor);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleGerarToken = () => {
    Alert.alert(
      "Gerar novo token",
      "O token atual será revogado e não poderá mais ser usado. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Revogar e gerar",
          style: "destructive",
          onPress: () => {
            // TODO: chamar API para revogar e gerar novo token
            setToken({
              valor: "XXXX-XXXX",
              dataCriacao: new Date(),
            });
            setCopiado(false);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* TODO: substituir pelo nome real vindo do contexto/store  */}
        <Text style={styles.nomeEmpresa}>Nome da empresa</Text>
        <View style={styles.empresaDivider} />

        <View style={styles.secaoHeader}>
          <View style={styles.accentBar} />
          <View>
            <Text style={styles.secaoTitulo}>Token de acesso</Text>
            <Text style={styles.secaoSubtitulo}>
              Compartilhe este token com sua equipe
            </Text>
          </View>
        </View>

        <View style={[styles.tokenCard, shadows.sm]}>
          <View style={styles.tokenRow}>
            <View style={styles.tokenDot} />
            <Text style={styles.tokenTexto}>Token: {token.valor}</Text>
            <TouchableOpacity
              onPress={handleCopiar}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons
                name={copiado ? "check" : "content-copy"}
                size={20}
                color={copiado ? colors.success : colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tokenDivider} />

          <Text style={styles.tokenData}>
            Data de criação: {formatarData(token.dataCriacao)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.gerarBtn, shadows.primary]}
          onPress={handleGerarToken}
          activeOpacity={0.85}
        >
          <Text style={styles.gerarBtnTexto}>Gerar Token</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
  },

  nomeEmpresa: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    letterSpacing: -0.5,
  },

  empresaDivider: {
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    marginBottom: 100,
    width: "100%",
  },

  secaoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    marginBottom: 20,
  },

  accentBar: {
    width: 4,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    marginTop: 2,
  },

  secaoTitulo: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.dark,
    letterSpacing: -0.3,
  },

  secaoSubtitulo: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular,
    color: colors.textMuted,
    marginTop: 2,
  },

  tokenCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
  },

  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  tokenDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },

  tokenTexto: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    color: colors.text,
  },

  tokenDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  tokenData: {
    fontSize: fontSizes.small,
    color: colors.textMuted,
    fontWeight: fontWeights.regular,
  },

  gerarBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
  },

  gerarBtnTexto: {
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
  },
});
