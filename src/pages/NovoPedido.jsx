import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Paper, Button, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Autocomplete, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const NovoPedido = () => {
  const { produtos, criarPedido, getGrupoNome } = useData();
  const navigate = useNavigate();

  const [itens, setItens] = useState([]);
  const [selectedProduto, setSelectedProduto] = useState(null);

  const produtosDisponiveis = useMemo(() => {
    return produtos.filter((p) => {
      const jaAdicionado = itens.some((i) => i.idProduto === p.id);
      const estoque = p.quantidadeEstoque ?? 0;
      return !jaAdicionado && estoque > 0;
    });
  }, [produtos, itens]);

  const addItem = (produto) => {
    if (!produto) return;
    const estoque = produto.quantidadeEstoque ?? 0;
    if (estoque <= 0) {
      toast.error('Produto sem estoque disponível');
      return;
    }
    setItens((prev) => [
      ...prev,
      {
        idProduto: produto.id,
        nomeProduto: produto.nome,
        quantidadeVendida: 1,
        valorProduto: parseFloat(produto.precoVenda),
        estoqueDisponivel: estoque,
      },
    ]);
    setSelectedProduto(null);
  };

  const updateQty = (idProduto, delta) => {
    setItens((prev) =>
      prev.map((item) => {
        if (item.idProduto !== idProduto) return item;
        const newQty = item.quantidadeVendida + delta;
        if (newQty < 1) return item;
        if (newQty > item.estoqueDisponivel) {
          toast.error(`Estoque insuficiente. Disponível: ${item.estoqueDisponivel}`);
          return item;
        }
        return { ...item, quantidadeVendida: newQty };
      })
    );
  };

  const setQty = (idProduto, value) => {
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 1) return;
    setItens((prev) =>
      prev.map((item) => {
        if (item.idProduto !== idProduto) return item;
        if (qty > item.estoqueDisponivel) {
          toast.error(`Estoque insuficiente. Disponível: ${item.estoqueDisponivel}`);
          return item;
        }
        return { ...item, quantidadeVendida: qty };
      })
    );
  };

  const removeItem = (idProduto) => {
    setItens((prev) => prev.filter((i) => i.idProduto !== idProduto));
  };

  const totalPedido = itens.reduce((s, i) => s + i.valorProduto * i.quantidadeVendida, 0);
  const totalItens = itens.reduce((s, i) => s + i.quantidadeVendida, 0);

  const handleFinalizarPedido = () => {
    if (itens.length === 0) {
      toast.error('Adicione pelo menos um produto ao pedido');
      return;
    }

    const pedido = {
      idPedido: Date.now(),
      data: new Date().toISOString().split('T')[0],
      totalItensPedido: totalItens,
      valorTotalPedido: totalPedido,
      itens: itens.map(({ idProduto, nomeProduto, quantidadeVendida, valorProduto }) => ({
        idProduto,
        nomeProduto,
        quantidadeVendida,
        valorProduto,
      })),
    };

    criarPedido(pedido);
    setItens([]);
    navigate('/faturamento');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
        Novo Pedido
      </Typography>

      <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', p: 3, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', mb: 2, letterSpacing: 0.5 }}>
          Adicionar Produto
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Autocomplete
            sx={{ flex: 1 }}
            options={produtosDisponiveis}
            getOptionLabel={(option) => option.nome}
            value={selectedProduto}
            onChange={(_, value) => setSelectedProduto(value)}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box>
                  <Typography variant="body2">{option.nome}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getGrupoNome(option.idGrupo)} — Estoque: {option.quantidadeEstoque ?? 0}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  R$ {parseFloat(option.precoVenda).toFixed(2)}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField {...params} size="small" placeholder="Pesquisar produto por nome..." />
            )}
            noOptionsText="Nenhum produto disponível"
          />
          <Button
            variant="contained"
            onClick={() => addItem(selectedProduto)}
            disabled={!selectedProduto}
            sx={{ bgcolor: '#000', '&:hover': { bgcolor: '#1a1a1a' }, fontWeight: 700, textTransform: 'uppercase' }}
          >
            Adicionar
          </Button>
        </Box>
      </Paper>

      {itens.length > 0 && (
        <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', mb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Produto</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Preço Unit.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Quantidade</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Estoque</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Subtotal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itens.map((item) => (
                  <TableRow key={item.idProduto} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.nomeProduto}</Typography>
                    </TableCell>
                    <TableCell align="center">R$ {item.valorProduto.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => updateQty(item.idProduto, -1)}
                          disabled={item.quantidadeVendida <= 1}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantidadeVendida}
                          onChange={(e) => setQty(item.idProduto, e.target.value)}
                          inputProps={{ style: { textAlign: 'center', width: 40 } }}
                          sx={{ '& .MuiOutlinedInput-root': { height: 32 } }}
                        />
                        <IconButton size="small" onClick={() => updateQty(item.idProduto, 1)}
                          disabled={item.quantidadeVendida >= item.estoqueDisponivel}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={item.estoqueDisponivel - item.quantidadeVendida}
                        color={item.estoqueDisponivel - item.quantidadeVendida <= 3 ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      R$ {(item.valorProduto * item.quantidadeVendida).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Remover">
                        <IconButton size="small" color="error" onClick={() => removeItem(item.idProduto)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderTop: '2px solid #000' }}>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total ({totalItens} {totalItens === 1 ? 'item' : 'itens'})
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              R$ {totalPedido.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      )}

      {itens.length === 0 && (
        <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Pesquise e adicione produtos para criar um novo pedido
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => { setItens([]); navigate('/faturamento'); }}
          sx={{ flex: 1, fontWeight: 700, textTransform: 'uppercase', borderColor: '#e0e0e0', color: '#000', '&:hover': { borderColor: '#000' } }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleFinalizarPedido}
          disabled={itens.length === 0}
          sx={{ flex: 1, fontWeight: 700, textTransform: 'uppercase', bgcolor: '#000', '&:hover': { bgcolor: '#1a1a1a' } }}
        >
          Finalizar Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default NovoPedido;
