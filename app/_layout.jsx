import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen"; // splashscreen é a tela de carregamento do APP (geralmente aparece a logo enquanto carrega)
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // segura a tela até q as fontes carreguem (pra não mostrar a tela com fontes padrão do dispositivo)

export default function RootLayout() {
  // carrega todas as fontes e quando termina manda um "true"
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // quando termina de carregar as fontes, esconde a SplashScreen
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <Stack screenOptions={{ headerShown: false }} /> // enquanto as fontes não carregam, não mostra nada
  );
}
