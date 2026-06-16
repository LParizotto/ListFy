import { useCallback, useEffect, useState } from "react";
import {
    addItem,
    addLocal,
    deleteItem,
    getItens,
    getLocais,
    toggleStatusLocal,
    updateItem,
    updateLocal,
    updateStatusItens,
} from "../services/api";

export function useItens() {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const [dataItens, dataLocais] = await Promise.all([
        getItens(),
        getLocais(),
      ]);

      const itensComNomeDoLocal = dataItens.map((item) => {
        const localCorrespondente = dataLocais.find(
          (l) => l.idLocal === item.idLocal,
        );

        return {
          ...item,
          nomeLocal: localCorrespondente
            ? localCorrespondente.nome
            : "Sem local",
        };
      });

      setItens(itensComNomeDoLocal);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (campos) => {
    await addItem(campos);
    await carregar();
  };

  const atualizar = async (id, campos) => {
    await updateItem(id, campos);
    await carregar();
  };

  const remover = async (id) => {
    await deleteItem(id);
    setItens((prev) => prev.filter((i) => i.idCompra !== id));
  };

  const toggleStatus = async (id, comprado) => {
    const novoStatus = comprado ? "pendente" : "comprado";
    setItens((prev) =>
      prev.map((i) =>
        i.idCompra === id
          ? {
              ...i,
              comprado: !comprado,
              dataCompra: !comprado
                ? new Date().toISOString().split("T")[0]
                : null,
            }
          : i,
      ),
    );
    try {
      await updateStatusItens([{ id, status: novoStatus }]);
    } catch {
      await carregar();
    }
  };

  return {
    itens,
    carregando,
    erro,
    carregar,
    adicionar,
    atualizar,
    remover,
    toggleStatus,
  };
}

export function useLocais() {
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const data = await getLocais();
      setLocais(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionar = async (nome) => {
    const novo = await addLocal(nome);
    setLocais((prev) => [...prev, novo]);
    return novo;
  };

  const renomear = async (id, nome) => {
    await updateLocal(id, nome);
    setLocais((prev) =>
      prev.map((l) => (l.idLocal === id ? { ...l, nome } : l)),
    );
  };

  const toggleAtivo = async (id, ativoAtual) => {
    await toggleStatusLocal(id, !ativoAtual);
    setLocais((prev) =>
      prev.map((l) => (l.idLocal === id ? { ...l, ativo: !ativoAtual } : l)),
    );
  };

  return {
    locais,
    carregando,
    erro,
    carregar,
    adicionar,
    renomear,
    toggleAtivo,
  };
}
