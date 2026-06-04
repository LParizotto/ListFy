import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
  spacing,
} from "../constants/theme";

// MOCK: Token temporário para acesso
const TOKEN_VALIDO = "ABCD-1234";

export default function Inicio() {
  const [tokenDigitado, setTokenDigitado] = useState("");

  const handleAcesso = async () => {
    if (!tokenDigitado.trim()) {
      Alert.alert("Aviso", "Por favor, insira um token para entrar.");
      return;
    }

    const TOKEN_VALIDO = "ABCD-1234";

    if (tokenDigitado.trim().toUpperCase() === TOKEN_VALIDO) {
      try {
        await AsyncStorage.setItem("@listfy_token", TOKEN_VALIDO);

        router.replace("/");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar o seu acesso.");
      }
    } else {
      Alert.alert(
        "Acesso Negado",
        "Token inválido! Dica: O token de teste é ABCD-1234",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>ListFy</Text>
          <Text style={styles.subtitulo}>
            Compras organizadas.{"\n"}Equipe alinhada.
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Insira seu token aqui"
            placeholderTextColor="rgba(255, 255, 255, 0.75)"
            value={tokenDigitado}
            onChangeText={setTokenDigitado}
            autoCapitalize="characters"
            autoCorrect={false}
            onSubmitEditing={handleAcesso}
            returnKeyType="go"
          />
          <TouchableOpacity
            style={styles.botaoSeta}
            onPress={handleAcesso}
            activeOpacity={0.8}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons
              name="arrow-forward-outline"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7F4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: 80,
  },
  logo: {
    fontSize: 64,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontFamily: "Poppins_700Bold",
    letterSpacing: -1.5,
    marginBottom: spacing.sm,
  },
  subtitulo: {
    fontSize: fontSizes.body,
    color: colors.dark,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    height: 60,
    width: "100%",
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: fontSizes.body,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    paddingLeft: 24,
  },
  botaoSeta: {
    padding: spacing.xs,
  },
});
