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

Endpoints:
`GET /produtos_cadastrados`
`POST /produtos_cadastrados`
`PUT /produtos_cadastrados/{id}`
`DELETE /produtos_cadastrados/{id}`
`GET /grupos`
`GET /vendas`


## Tecnologias Utilizadas

React 18 (via CDN)
Babel Standalone (para JSX)
CSS Puro (sem framework)
Fetch API (requisições HTTP)
HTML5 Semântico


## Comportamento da API

### Importante
O My JSON Server simula operações de escrita. Isso significa:

POST, PUT, DELETE: Retornam sucesso (200/201) mas não persistem dados no servidor
GET: Retorna sempre os dados originais

Solução implementada: O frontend reflete as mudanças localmente no estado React, mostrando o resultado esperado ao usuário mesmo que não persista no servidor.

Exemplo:
1. Usuário cria novo produto
2. Frontend envia POST (recebe 201)
3. Frontend adiciona o produto ao estado local
4. Tabela atualiza imediatamente com o novo item


## Validações de Formulário

### Campos Obrigatórios
Nome: Não pode estar vazio
Grupo: Deve ser selecionado
Preco de Venda: Deve ser > 0

### Feedback Visual
Campo em erro: Borda vermelha (#d32f2f)
Toast de erro em vermelho
Mensagem de erro abaixo do campo


## Paginação

Padrão: 10 itens por página

Botões:
Primeira (vai para página 1)
Anterior (página anterior)
Números de página (máximo 5 visíveis)
Proxima (próxima página)
Ultima (última página)


## Filtros

### Produtos
Busca em: Nome e Grupo
Case-insensitive
Em tempo real

### Faturamento
Busca em: Numero Pedido
Case-insensitive


## Ordenação

Clique no header da coluna para ordenar:
▲: Crescente (ASC)
▼: Decrescente (DESC)

Funcionamento: Clica novamente para inverter direção


## Cores e Design

Fundo: #f8f8f8 (Cinza claro)
Texto Principal: #1a1a1a (Preto escuro)
Bordas: #e5e5e5 (Cinza médio)
Hover: #fafafa (Cinza mais claro)
Sucesso: #2e7d32 (Verde)
Erro: #d32f2f (Vermelho)
Primary: #000 (Preto)


## Responsividade

Layout fluido com:
Container max-width: 1400px
Grid automático
Flexbox para componentes

Testa bem em:
Desktop (1920px+)
Tablet (768px+)
Mobile (com ajustes)


## Troubleshooting

### Erro: "Failed to fetch from API"
Solução: Verifique conexão com internet e se a URL da API está correta

### Tabela vazia ao carregar
Solução: Aguarde 2-3 segundos para a API responder

### Toast não aparece
Solução: Verifique console para erros (F12 > Console)

### Estilos não aparecem
Solução: Limpe cache do navegador (Ctrl+Shift+Delete)


## Licença

MIT Use livremente em seus projetos

