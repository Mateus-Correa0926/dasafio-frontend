import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const API_BASE = 'https://my-json-server.typicode.com/Sifat-devs/db-desafio-frontend';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [produtos, setProdutos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProdutos = useCallback(async (signal) => {
    const res = await fetch(`${API_BASE}/produtos_cadastrados`, { signal });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, []);

  const fetchGrupos = useCallback(async (signal) => {
    const res = await fetch(`${API_BASE}/grupos`, { signal });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, []);

  const fetchVendas = useCallback(async (signal) => {
    const res = await fetch(`${API_BASE}/vendas`, { signal });
    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadAll = async () => {
      setLoading(true);
      try {
        const [p, g, v] = await Promise.all([
          fetchProdutos(controller.signal),
          fetchGrupos(controller.signal),
          fetchVendas(controller.signal),
        ]);
        setProdutos(p);
        setGrupos(g);
        setVendas(v);
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Erro ao carregar dados da API');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    loadAll();
    return () => controller.abort();
  }, [fetchProdutos, fetchGrupos, fetchVendas]);

  const createProduto = useCallback(async (produto) => {
    try {
      const res = await fetch(`${API_BASE}/produtos_cadastrados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!res.ok) throw new Error();
      const novo = await res.json();
      setProdutos((prev) => [...prev, { ...novo, id: Date.now() }]);
      toast.success('Produto criado com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao criar produto');
      return false;
    }
  }, []);

  const updateProduto = useCallback(async (id, produto) => {
    try {
      const res = await fetch(`${API_BASE}/produtos_cadastrados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });
      if (!res.ok) throw new Error();
      setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, ...produto } : p)));
      toast.success('Produto atualizado com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao atualizar produto');
      return false;
    }
  }, []);

  const deleteProduto = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/produtos_cadastrados/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produto removido com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao remover produto');
      return false;
    }
  }, []);

  const getGrupoNome = useCallback(
    (idGrupo) => grupos.find((g) => g.id === idGrupo)?.nome || 'N/A',
    [grupos]
  );

  const criarPedido = useCallback(async (pedido) => {
    try {
      const res = await fetch(`${API_BASE}/vendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!res.ok) throw new Error();
    } catch {
    }
    setVendas((prev) => [...prev, pedido]);
    setProdutos((prev) =>
      prev.map((p) => {
        const item = pedido.itens.find((i) => i.idProduto === p.id);
        if (item) {
          return { ...p, quantidadeEstoque: (p.quantidadeEstoque ?? 0) - item.quantidadeVendida };
        }
        return p;
      })
    );
    toast.success('Pedido criado com sucesso!');
  }, []);

  return (
    <DataContext.Provider
      value={{
        produtos,
        grupos,
        vendas,
        loading,
        createProduto,
        updateProduto,
        deleteProduto,
        getGrupoNome,
        criarPedido,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
