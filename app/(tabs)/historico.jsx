import { router } from "expo-router";
import { useEffect } from "react";

export default function Historico() {
  useEffect(() => {
    router.replace({ pathname: "/", params: { aba: "comprados" } });
  }, []);

  return null;
}
