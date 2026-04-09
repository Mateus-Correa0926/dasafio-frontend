# Desafio Frontend Sifat

Sistema de Gestão de Estoque e Faturamento feito em React, com Vite, Material UI e Context API.


## O que foi feito

O projeto é uma SPA que consome a API REST do desafio e entrega todas as funcionalidades pedidas: CRUD de produtos, visualização de faturamento, dashboard com métricas e criação de pedidos com controle de estoque.

A tela de Produtos Cadastrados é uma tabela com todos os produtos vindos da API. Tem busca por nome ou grupo, ordenação em todas as colunas (ID, nome, grupo, preço, estoque) e paginação. Coloquei um painel de filtros avançados que filtra por grupo, faixa de preço e faixa de estoque. Cada produto tem ícone de editar (lápis) e excluir (lixeira), e a exclusão pede confirmação antes de apagar.

O Faturamento eu dividi em duas abas, Dashboard e Vendas. O Dashboard mostra 4 cards de resumo (faturamento total, total de pedidos, itens vendidos e ticket médio), um gráfico de barras de faturamento por mês e os 5 produtos mais vendidos. A aba Vendas é uma tabela com as vendas da API, com busca por número de pedido, filtros avançados de valor e data, ordenação e paginação.

O Cadastrar Produto é um formulário para criar ou editar produto. Os campos são nome, grupo (select), preço de venda e quantidade em estoque. Tem validação nos campos obrigatórios e mostra toast de sucesso ou erro. Quando vem da edição, o formulário já vem preenchido com os dados do produto.

A página de Novo Pedido é pra criar pedidos. Tem um Autocomplete que pesquisa produtos por nome (mostrando grupo, estoque e preço de cada um). Dá pra controlar a quantidade com botões +/ou digitando direto, e o sistema valida pra não deixar vender mais do que tem em estoque. Ao finalizar, o pedido é adicionado às vendas e o estoque dos produtos é descontado automaticamente.


## Lógica e estrutura

A stack é Vite como build tool, React 18 com hooks e functional components, Material UI pros componentes visuais (customizados pro estilo minimalista do projeto), react-router-dom pra roteamento SPA com 4 rotas (/, /faturamento, /cadastrar, /novo-pedido), react-toastify pras notificações toast e Context API pro gerenciamento de estado centralizado.

Todo o estado da aplicação fica no DataContext. Quando o app carrega, ele faz Promise.all pra buscar produtos, grupos e vendas da API em paralelo. Usei AbortController no useEffect pra cancelar as requisições se o componente desmontar antes de terminar (evita leak de conexão). Todas as respostas da API são validadas com res.ok e Array.isArray pra não quebrar se a API devolver algo inesperado.

As funções de CRUD (createProduto, updateProduto, deleteProduto) fazem a chamada pra API e atualizam o estado local com o resultado. A função criarPedido adiciona o pedido na lista de vendas e desconta o estoque dos produtos afetados, tudo no estado local.

Os arquivos ficam em src/main.jsx (bootstrap com ThemeProvider), src/App.jsx (rotas e providers), src/context/DataContext.jsx (estado global e chamadas à API), src/components/Header.jsx (barra de navegação fixa) e as páginas em src/pages/ (Produtos.jsx, Faturamento.jsx, CadastrarProduto.jsx, NovoPedido.jsx).

A API consumida é https://my-json-server.typicode.com/Sifat-devs/db-desafio-frontend com os endpoints /produtos_cadastrados, /grupos e /vendas.


## Como rodar

Roda npm install pra instalar as dependências e npm run dev pra subir o servidor local. O Vite abre geralmente na porta 5173. Pra build de produção, npm run build gera a pasta dist/ pronta pra deploy.


## Sobre a API

A API é o my-json-server do typicode. Ela simula operações de escrita (POST, PUT, DELETE retornam sucesso) mas não persiste nada no servidor. Ou seja, se recarregar a página, volta tudo pro estado original.

Pra contornar isso, todas as operações de CRUD (criar, editar, deletar produto e criar pedido) fazem a chamada pra API normalmente e depois atualizam o estado local no React. O usuário vê o resultado na hora, mas se der F5 volta ao original. Isso é limitação da API gratuita, não do frontend.


## Responsivo pra mobile

O sistema foi pensado pra funcionar no celular também, pra aquele cenário de alguém que precisa checar o estoque rápido sem estar na frente do computador. No mobile o menu vira um drawer lateral (ícone de hambúrguer), as tabelas rolam na horizontal pra não quebrar layout e os botões e campos se empilham pra caber na tela. Dá pra consultar produtos, ver vendas e até criar pedido direto pelo celular sem problema.

