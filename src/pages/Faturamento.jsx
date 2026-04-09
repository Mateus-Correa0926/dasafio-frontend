import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, TablePagination, Paper, Tabs, Tab,
  Collapse, IconButton, Tooltip, Button, Grid, Card, CardContent,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useData } from '../context/DataContext';

const Dashboard = ({ vendas }) => {
  const stats = useMemo(() => {
    const totalFaturamento = vendas.reduce((s, v) => s + (parseFloat(v.valorTotalPedido) || 0), 0);
    const totalPedidos = vendas.length;
    const totalItens = vendas.reduce((s, v) => s + (v.totalItensPedido || 0), 0);
    const ticketMedio = totalPedidos > 0 ? totalFaturamento / totalPedidos : 0;

    const porMes = {};
    vendas.forEach((v) => {
      const mes = v.data ? v.data.substring(0, 7) : 'N/A';
      if (!porMes[mes]) porMes[mes] = { total: 0, pedidos: 0 };
      porMes[mes].total += parseFloat(v.valorTotalPedido) || 0;
      porMes[mes].pedidos += 1;
    });

    const topProdutos = {};
    vendas.forEach((v) => {
      (v.itens || []).forEach((item) => {
        if (!topProdutos[item.nomeProduto]) topProdutos[item.nomeProduto] = { qtd: 0, valor: 0 };
        topProdutos[item.nomeProduto].qtd += item.quantidadeVendida;
        topProdutos[item.nomeProduto].valor += item.valorProduto * item.quantidadeVendida;
      });
    });
    const topList = Object.entries(topProdutos)
      .sort((a, b) => b[1].qtd - a[1].qtd)
      .slice(0, 5);

    return { totalFaturamento, totalPedidos, totalItens, ticketMedio, porMes, topList };
  }, [vendas]);

  const meses = Object.entries(stats.porMes).sort((a, b) => a[0].localeCompare(b[0]));
  const maxVal = Math.max(...meses.map(([, d]) => d.total), 1);

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Faturamento Total', value: `R$ ${stats.totalFaturamento.toFixed(2)}`, icon: <AttachMoneyIcon />, color: '#2e7d32' },
          { label: 'Total de Pedidos', value: stats.totalPedidos, icon: <ReceiptIcon />, color: '#1565c0' },
          { label: 'Itens Vendidos', value: stats.totalItens, icon: <ShoppingCartIcon />, color: '#e65100' },
          { label: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toFixed(2)}`, icon: <TrendingUpIcon />, color: '#6a1b9a' },
        ].map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card elevation={0} sx={{ border: '1px solid #e5e5e5' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: card.color + '14', p: 1.5, borderRadius: 2, color: card.color, display: 'flex' }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 11 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{card.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Faturamento por Mês</Typography>
            {meses.map(([mes, d]) => (
              <Box key={mes} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 600 }}>{mes}</Typography>
                <Box sx={{ flex: 1, bgcolor: '#f5f5f5', borderRadius: 1, height: 28, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ width: `${(d.total / maxVal) * 100}%`, bgcolor: '#1565c0', height: '100%', borderRadius: 1, transition: 'width 0.3s' }} />
                </Box>
                <Typography variant="body2" sx={{ minWidth: 110, textAlign: 'right', fontWeight: 600 }}>
                  R$ {d.total.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Produtos Mais Vendidos</Typography>
            {stats.topList.map(([nome, d], i) => (
              <Box key={nome} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: i < stats.topList.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{nome}</Typography>
                  <Typography variant="caption" color="text.secondary">{d.qtd} unidades vendidas</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>R$ {d.valor.toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const VendasTable = ({ vendas: allVendas }) => {
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('idPedido');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [filterValorMin, setFilterValorMin] = useState('');
  const [filterValorMax, setFilterValorMax] = useState('');
  const [filterDataDe, setFilterDataDe] = useState('');
  const [filterDataAte, setFilterDataAte] = useState('');

  const hasFilters = filterValorMin || filterValorMax || filterDataDe || filterDataAte;

  const clearFilters = () => {
    setFilterValorMin(''); setFilterValorMax(''); setFilterDataDe(''); setFilterDataAte('');
    setSearch(''); setPage(0);
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const filtered = useMemo(() => {
    return allVendas.filter((v) => {
      if (search && !v.idPedido.toString().includes(search)) return false;
      const valor = parseFloat(v.valorTotalPedido) || 0;
      if (filterValorMin && valor < parseFloat(filterValorMin)) return false;
      if (filterValorMax && valor > parseFloat(filterValorMax)) return false;
      if (filterDataDe && v.data < filterDataDe) return false;
      if (filterDataAte && v.data > filterDataAte) return false;
      return true;
    });
  }, [allVendas, search, filterValorMin, filterValorMax, filterDataDe, filterDataAte]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[orderBy]; const bVal = b[orderBy];
      if (typeof aVal === 'string') return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return order === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    });
  }, [filtered, orderBy, order]);

  const paginatedRows = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const columns = [
    { id: 'idPedido', label: 'Nº Pedido' },
    { id: 'data', label: 'Data' },
    { id: 'totalItensPedido', label: 'Quantidade' },
    { id: 'valorTotalPedido', label: 'Total' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <TextField fullWidth variant="outlined" placeholder="Buscar pelo número do pedido..." size="small"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        <Tooltip title="Filtros avançados">
          <IconButton onClick={() => setShowFilters(!showFilters)} color={hasFilters ? 'primary' : 'default'}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showFilters}>
        <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth size="small" label="Valor mín. (R$)" type="number" inputProps={{ step: '0.01', min: '0' }}
                value={filterValorMin} onChange={(e) => { setFilterValorMin(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth size="small" label="Valor máx. (R$)" type="number" inputProps={{ step: '0.01', min: '0' }}
                value={filterValorMax} onChange={(e) => { setFilterValorMax(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth size="small" label="Data de" type="date" InputLabelProps={{ shrink: true }}
                value={filterDataDe} onChange={(e) => { setFilterDataDe(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth size="small" label="Data até" type="date" InputLabelProps={{ shrink: true }}
                value={filterDataAte} onChange={(e) => { setFilterDataAte(e.target.value); setPage(0); }} />
            </Grid>
          </Grid>
          {hasFilters && (
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button size="small" color="error" onClick={clearFilters}>Limpar filtros</Button>
            </Box>
          )}
        </Paper>
      </Collapse>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e5e5' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>
                  <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}>{col.label}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: '#999' }}>Nenhuma venda encontrada</TableCell></TableRow>
            ) : (
              paginatedRows.map((venda) => (
                <TableRow key={venda.idPedido} hover>
                  <TableCell>{venda.idPedido}</TableCell>
                  <TableCell>{venda.data}</TableCell>
                  <TableCell>{venda.totalItensPedido}</TableCell>
                  <TableCell>R$ {(parseFloat(venda.valorTotalPedido) || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination component="div" count={sorted.length} page={page}
          onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]} labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`} />
      </TableContainer>
    </Box>
  );
};

const Faturamento = () => {
  const { vendas } = useData();
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Faturamento</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: '1px solid #e5e5e5' }}>
        <Tab label="Dashboard" />
        <Tab label="Vendas" />
      </Tabs>
      {tab === 0 && <Dashboard vendas={vendas} />}
      {tab === 1 && <VendasTable vendas={vendas} />}
    </Box>
  );
};

export default Faturamento;
