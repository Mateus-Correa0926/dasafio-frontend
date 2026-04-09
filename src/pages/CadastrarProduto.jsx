import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useData } from '../context/DataContext';

const CadastrarProduto = () => {
  const { grupos, createProduto, updateProduto } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const editingProduto = location.state?.produto || null;

  const [formData, setFormData] = useState({
    nome: '',
    idGrupo: '',
    precoVenda: '',
    quantidadeEstoque: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduto) {
      setFormData({
        nome: editingProduto.nome || '',
        idGrupo: editingProduto.idGrupo || '',
        precoVenda: editingProduto.precoVenda || '',
        quantidadeEstoque: editingProduto.quantidadeEstoque ?? '',
      });
    }
  }, [editingProduto]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!formData.idGrupo) newErrors.idGrupo = 'Campo obrigatório';
    if (!formData.precoVenda || parseFloat(formData.precoVenda) <= 0) {
      newErrors.precoVenda = 'Preço de venda é obrigatório e deve ser maior que zero';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Preencha todos os campos obrigatórios');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      nome: formData.nome.trim(),
      idGrupo: parseInt(formData.idGrupo),
      precoVenda: parseFloat(formData.precoVenda),
      quantidadeEstoque: parseInt(formData.quantidadeEstoque) || 0,
    };

    let success;
    if (editingProduto) {
      success = await updateProduto(editingProduto.id, payload);
    } else {
      success = await createProduto(payload);
    }

    if (success) {
      setFormData({ nome: '', idGrupo: '', precoVenda: '', quantidadeEstoque: '' });
      setErrors({});
      navigate('/');
    }
  };

  const handleCancel = () => {
    setFormData({ nome: '', idGrupo: '', precoVenda: '', quantidadeEstoque: '' });
    setErrors({});
    navigate('/');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: { xs: 2, md: 4 }, fontSize: { xs: 20, md: 24 } }}>
        {editingProduto ? 'Editar Produto' : 'Cadastrar Novo Produto'}
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{ border: '1px solid #e5e5e5', p: 4, maxWidth: 600 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Nome *
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={formData.nome}
            onChange={handleChange('nome')}
            error={!!errors.nome}
            helperText={errors.nome}
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Grupo *
          </Typography>
          <TextField
            fullWidth
            select
            size="small"
            value={formData.idGrupo}
            onChange={handleChange('idGrupo')}
            error={!!errors.idGrupo}
            helperText={errors.idGrupo}
            sx={{ mt: 1 }}
          >
            <MenuItem value="">Selecione um grupo</MenuItem>
            {grupos.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.nome}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Preço de Venda *
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={formData.precoVenda}
            onChange={handleChange('precoVenda')}
            error={!!errors.precoVenda}
            helperText={errors.precoVenda}
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Quantidade em Estoque
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="number"
            inputProps={{ min: '0' }}
            value={formData.quantidadeEstoque}
            onChange={handleChange('quantidadeEstoque')}
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              flex: 1,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              borderColor: '#e0e0e0',
              color: '#000',
              '&:hover': { borderColor: '#000' },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              flex: 1,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              bgcolor: '#000',
              '&:hover': { bgcolor: '#1a1a1a' },
            }}
          >
            Salvar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CadastrarProduto;
