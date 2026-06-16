import { getToken } from "./store";

const BASE_URL = "https://listfy-backend-616r.onrender.com";

async function authHeaders() {
  const token = await getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Erro ${res.status}`);
  }
  return data;
}

export async function validarToken(token) {
  const res = await fetch(`${BASE_URL}/auth/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return handleResponse(res);
}

export async function getItens(params = {}) {
  const headers = await authHeaders();
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.idLocal) query.append("idLocal", params.idLocal);

  const res = await fetch(`${BASE_URL}/itens?${query.toString()}`, { headers });
  return handleResponse(res);
}

export async function addItem({ nome, quantidade, descricao, idLocal }) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/itens`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome, quantidade, descricao, idLocal }),
  });
  return handleResponse(res);
}

export async function updateItem(id, campos) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/itens/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(campos),
  });
  return handleResponse(res);
}

export async function deleteItem(id) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/itens/${id}`, {
    method: "DELETE",
    headers,
  });
  if (res.status === 204) return null;
  return handleResponse(res);
}

export async function updateStatusItens(itens) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/itens/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ itens }),
  });
  return handleResponse(res);
}

export async function getLocais(ativo) {
  const headers = await authHeaders();
  const query = ativo !== undefined ? `?ativo=${ativo}` : "";
  const res = await fetch(`${BASE_URL}/locais${query}`, { headers });
  return handleResponse(res);
}

export async function addLocal(nome) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/locais`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nome }),
  });
  return handleResponse(res);
}

export async function updateLocal(id, nome) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/locais/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ nome }),
  });
  return handleResponse(res);
}

export async function toggleStatusLocal(id, ativo) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/locais/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ ativo }),
  });
  return handleResponse(res);
}

export async function gerarNovoToken() {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/tokens`, {
    method: "POST",
    headers,
  });
  return handleResponse(res);
}
