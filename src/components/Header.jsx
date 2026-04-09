import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Produtos Cadastrados', path: '/' },
  { label: 'Faturamento', path: '/faturamento' },
  { label: 'Cadastrar Produtos', path: '/cadastrar' },
  { label: 'Novo Pedido', path: '/novo-pedido' },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: '#fff' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1400, width: '100%', mx: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Desafio Frontend Sifat
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: isActive ? '#000' : '#999',
                  borderBottom: isActive ? '2px solid #000' : '2px solid transparent',
                  borderRadius: 0,
                  '&:hover': { color: '#000', bgcolor: 'transparent' },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ width: 100 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
