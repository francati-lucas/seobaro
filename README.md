# Seo Baro

Site institucional e plataforma de pedidos da **Seo Baro** — fábrica de tortas artesanais que atende revendedores em todo o Brasil. O projeto apresenta a marca, convida novos parceiros e permite que clientes cadastrados montem pedidos de tortas salgadas inteiras com finalização pelo WhatsApp.

## Sobre o projeto

A Seo Baro produz tortas salgadas em pequenos lotes, com receitas de família e ingredientes selecionados. Este aplicativo web concentra três frentes:

- **Página inicial** — apresentação da marca, história, prévia do cardápio e convite para revenda.
- **Área de pedidos** — cardápio dinâmico com carrinho, acesso restrito a clientes/revendedores autenticados.
- **Painel administrativo** — gestão de produtos, visualização de pedidos e relatórios de vendas.

O fluxo de cadastro de novos revendedores e a confirmação final dos pedidos acontecem via **WhatsApp**, mantendo o atendimento próximo e personalizado.

## Funcionalidades

### Página inicial (`/`)

- Hero com destaque para oportunidade de revenda
- Seção de história da marca
- Prévia do cardápio (frango, palmito, costelinha)
- Convite para fazer parte da rede de revendedores
- Modal de acesso ao pedido (login ou cadastro via WhatsApp)

### Pedidos (`/pedido`)

- Login com e-mail e senha (Firebase Authentication)
- Cardápio carregado do Firestore (apenas produtos disponíveis)
- Busca por nome da torta
- Carrinho com quantidades, dados do cliente e validação de campos
- Registro do pedido no banco e redirecionamento para WhatsApp com resumo formatado

### Administração (`/admin`)

- Acesso exclusivo para usuários com `isAdmin: true` no Firestore
- Gerenciamento do cardápio: criar, editar, ativar/desativar e excluir tortas
- Carga inicial do cardápio padrão (seed)
- Listagem de pedidos recebidos
- Relatório por cliente (CNPJ), com totais de pedidos e tortas

## Tecnologias

- [React](https://react.dev/) 19
- [React Router](https://reactrouter.com/) 7
- [Firebase](https://firebase.google.com/) — Authentication e Firestore
- [Create React App](https://github.com/facebook/create-react-app) (react-scripts)

## Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis (Header, Hero, modais, etc.)
├── contexts/       # AuthContext — estado de autenticação e dados do usuário
├── pages/          # Home, Pedido e Admin
├── services/       # Configuração do Firebase
└── assets/         # Imagens e recursos estáticos
```

## Rotas

| Rota      | Acesso        | Descrição                          |
|-----------|---------------|------------------------------------|
| `/`       | Público       | Landing page da Seo Baro           |
| `/pedido` | Autenticado   | Cardápio e carrinho de pedidos     |
| `/admin`  | Autenticado   | Painel administrativo (só admins)  |

Usuários não autenticados que tentam acessar `/pedido` ou `/admin` são redirecionados para a home com o modal de login.

## Firebase

O projeto usa o Firebase para:

- **Authentication** — login de clientes/revendedores
- **Firestore** — coleções `users`, `products` e `orders`

A configuração está em `src/services/firebase.js`. Para rodar localmente, use um projeto Firebase com as regras de segurança adequadas e usuários cadastrados na coleção `users` (com `isAdmin` quando necessário).

## Como executar

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm start
```

Abre em [http://localhost:3000](http://localhost:3000) com hot reload.

### Build de produção

```bash
npm run build
```

Gera os arquivos otimizados na pasta `build/`.

### Testes

```bash
npm test
```

## Scripts disponíveis

| Comando         | Descrição                              |
|-----------------|----------------------------------------|
| `npm start`     | Servidor de desenvolvimento            |
| `npm run build` | Build para produção                    |
| `npm test`      | Executa os testes                      |
| `npm run eject` | Expõe a configuração do CRA (irreversível) |
