import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { gerarNovoToken, validarToken } from "../../services/api";
import { getToken, removeToken, saveToken } from "../../services/store";

export default function Token() {
  const [tokenValor, setTokenValor] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [gerando, setGerando] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  useEffect(() => {
    async function inicializarTela() {
      try {
        const token = await getToken();
        setTokenValor(token ?? "");

        if (token) {
          const infoToken = await validarToken(token);
          if (infoToken && infoToken.valido && infoToken.role === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (e) {
        console.log("Erro ao validar nível de acesso:", e.message);
      } finally {
        setCarregandoPerfil(false);
      }
    }

    inicializarTela();
  }, []);

  const handleCopiar = async () => {
    if (!tokenValor) return;
    await Clipboard.setStringAsync(tokenValor);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleGerarToken = async () => {
    Alert.alert(
      "Gerar Novo Token",
      "Isso criará um novo token de acesso válido por 1 ano. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Gerar",
          onPress: async () => {
            setGerando(true);
            try {
              const resposta = await gerarNovoToken();
              if (resposta && resposta.token) {
                await saveToken(resposta.token);
                setTokenValor(resposta.token);
                Alert.alert(
                  "Sucesso",
                  `Novo token gerado com sucesso!\nExpira em: ${resposta.dataExpiracao}`,
                );
              }
            } catch (e) {
              Alert.alert(
                "Erro",
                "Falha ao gerar token ou falta de permissão.",
              );
            } finally {
              setGerando(false);
            }
          },
        },
      ],
    );
  };

  const handleSair = () => {
    Alert.alert("Sair", "Deseja encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await removeToken();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Text style={styles.nomeEmpresa}>Minha Conta</Text>
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
            <Text style={styles.tokenTexto} numberOfLines={1}>
              {tokenValor ? `Token: ${tokenValor}` : "Nenhum token encontrado"}
            </Text>
            {tokenValor ? (
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
            ) : null}
          </View>
        </View>

        {carregandoPerfil ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginBottom: spacing.md }}
          />
        ) : isAdmin ? (
          <TouchableOpacity
            style={[
              styles.gerarBtn,
              shadows.primary,
              gerando && styles.btnDesativado,
            ]}
            onPress={handleGerarToken}
            disabled={gerando}
            activeOpacity={0.85}
          >
            {gerando ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.gerarBtnTexto}>Gerar Novo Token</Text>
            )}
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.sairBtn, shadows.sm]}
          onPress={handleSair}
          activeOpacity={0.85}
        >
          <Text style={styles.sairBtnTexto}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: 80 },
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
    marginBottom: spacing.md,
  },
  tokenRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
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
  gerarBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  gerarBtnTexto: {
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
  },
  btnDesativado: { opacity: 0.6 },
  sairBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.button,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sairBtnTexto: {
    color: colors.dark,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.2,
  },
});
