import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: '#fff' }}>
        <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1400, width: '100%', mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: 14, sm: 20 } }}>
            Desafio Frontend Sifat
          </Typography>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: isActive(item.path) ? '#000' : '#999',
                  borderBottom: isActive(item.path) ? '2px solid #000' : '2px solid transparent',
                  borderRadius: 0,
                  '&:hover': { color: '#000', bgcolor: 'transparent' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ width: 100, display: { xs: 'none', md: 'block' } }} />
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="subtitle2" sx={{ px: 2, pb: 1, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#999' }}>
            Menu
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                  selected={isActive(item.path)}
                  sx={{ '&.Mui-selected': { bgcolor: '#f5f5f5', borderLeft: '3px solid #000' } }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 400, fontSize: 14 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
