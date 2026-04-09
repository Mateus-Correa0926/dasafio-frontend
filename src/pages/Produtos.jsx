import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, TablePagination, Paper, IconButton,
  Tooltip, Collapse, Button, MenuItem, Grid,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const fmt = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Produtos = () => {
  const { produtos, grupos, deleteProduto, getGrupoNome } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('nome');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [filterGrupo, setFilterGrupo] = useState('');
  const [filterPrecoMin, setFilterPrecoMin] = useState('');
  const [filterPrecoMax, setFilterPrecoMax] = useState('');
  const [filterEstoqueMin, setFilterEstoqueMin] = useState('');
  const [filterEstoqueMax, setFilterEstoqueMax] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const clearFilters = () => {
    setFilterGrupo(''); setFilterPrecoMin(''); setFilterPrecoMax('');
    setFilterEstoqueMin(''); setFilterEstoqueMax(''); setSearch(''); setPage(0);
  };

  const hasFilters = filterGrupo || filterPrecoMin || filterPrecoMax || filterEstoqueMin || filterEstoqueMax;

  const filtered = useMemo(() => {
    return produtos.filter((p) => {
      if (search) {
        const term = search.toLowerCase();
        const grupoNome = getGrupoNome(p.idGrupo).toLowerCase();
        if (!p.nome.toLowerCase().includes(term) && !grupoNome.includes(term)) return false;
      }
      if (filterGrupo && p.idGrupo !== parseInt(filterGrupo)) return false;
      const preco = parseFloat(p.precoVenda) || 0;
      if (filterPrecoMin && preco < parseFloat(filterPrecoMin)) return false;
      if (filterPrecoMax && preco > parseFloat(filterPrecoMax)) return false;
      const estoque = p.quantidadeEstoque ?? 0;
      if (filterEstoqueMin && estoque < parseInt(filterEstoqueMin)) return false;
      if (filterEstoqueMax && estoque > parseInt(filterEstoqueMax)) return false;
      return true;
    });
  }, [produtos, search, filterGrupo, filterPrecoMin, filterPrecoMax, filterEstoqueMin, filterEstoqueMax, getGrupoNome]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];
      if (orderBy === 'grupo') { aVal = getGrupoNome(a.idGrupo); bVal = getGrupoNome(b.idGrupo); }
      if (typeof aVal === 'string') return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return order === 'asc' ? (aVal ?? 0) - (bVal ?? 0) : (bVal ?? 0) - (aVal ?? 0);
    });
  }, [filtered, orderBy, order, getGrupoNome]);

  const paginatedRows = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'nome', label: 'Nome' },
    { id: 'grupo', label: 'Grupo' },
    { id: 'precoVenda', label: 'Preço' },
    { id: 'quantidadeEstoque', label: 'Estoque' },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Produtos Cadastrados</Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <TextField fullWidth variant="outlined" placeholder="Buscar por nome ou grupo..." size="small"
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
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select size="small" label="Grupo" value={filterGrupo}
                onChange={(e) => { setFilterGrupo(e.target.value); setPage(0); }}>
                <MenuItem value="">Todos</MenuItem>
                {grupos.map((g) => <MenuItem key={g.id} value={g.id}>{g.nome}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField fullWidth size="small" label="Preço mín." type="number" inputProps={{ step: '0.01', min: '0' }}
                value={filterPrecoMin} onChange={(e) => { setFilterPrecoMin(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField fullWidth size="small" label="Preço máx." type="number" inputProps={{ step: '0.01', min: '0' }}
                value={filterPrecoMax} onChange={(e) => { setFilterPrecoMax(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField fullWidth size="small" label="Estoque mín." type="number" inputProps={{ min: '0' }}
                value={filterEstoqueMin} onChange={(e) => { setFilterEstoqueMin(e.target.value); setPage(0); }} />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField fullWidth size="small" label="Estoque máx." type="number" inputProps={{ min: '0' }}
                value={filterEstoqueMax} onChange={(e) => { setFilterEstoqueMax(e.target.value); setPage(0); }} />
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
              <TableCell align="center" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 12 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#999' }}>Nenhum produto encontrado</TableCell></TableRow>
            ) : (
              paginatedRows.map((produto) => (
                <TableRow key={produto.id} hover>
                  <TableCell>{produto.id}</TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{getGrupoNome(produto.idGrupo)}</TableCell>
                  <TableCell>{fmt(parseFloat(produto.precoVenda))}</TableCell>
                  <TableCell>{produto.quantidadeEstoque ?? 0}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => navigate('/cadastrar', { state: { produto } })}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(produto)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o produto <strong>{deleteTarget?.nome}</strong>? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={() => { deleteProduto(deleteTarget.id); setDeleteTarget(null); }}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Produtos;
