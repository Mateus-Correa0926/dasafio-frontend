import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Produtos from './pages/Produtos';
import Faturamento from './pages/Faturamento';
import CadastrarProduto from './pages/CadastrarProduto';
import NovoPedido from './pages/NovoPedido';

const AppContent = () => {
  const { loading } = useData();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Produtos />} />
      <Route path="/faturamento" element={<Faturamento />} />
      <Route path="/cadastrar" element={<CadastrarProduto />} />
      <Route path="/novo-pedido" element={<NovoPedido />} />
    </Routes>
  );
};

const App = () => {
  return (
    <HashRouter>
      <DataProvider>
        <Header />
        <Box sx={{ mt: '64px', p: { xs: 2, md: 5 }, maxWidth: 1400, mx: 'auto' }}>
          <AppContent />
        </Box>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </DataProvider>
    </HashRouter>
  );
};

export default App;
