# 📦 Back‑Stock‑Master: Sistema de Gestão de Estoque e Vendas

## Descrição

O **Back‑Stock‑Master** é uma API RESTful desenvolvida para gerenciar o estoque de produtos, realizar transações de vendas e reposição de estoque, e gerar relatórios detalhados em PDF. A API também permite autenticação de usuários, cadastro de clientes e controle de despesas.

Este sistema foi desenvolvido como um projeto freelance e está autorizado para ser apresentado como portfólio. O backend foi construído com **Node.js**, **Express**, e **MongoDB**, com autenticação baseada em **JWT** e utilização de cookies HttpOnly para garantir segurança.

## Funcionalidades

- **Gestão de Produtos**: Criação, leitura, atualização e exclusão de produtos.
- **Gestão de Transações**: Registra transações de entrada (reposições) e saída (vendas e leilões).
- **Dashboard**: Visualização de métricas como total de vendas, despesas, estoque atual, etc.
- **Relatórios em PDF**: Geração de relatórios detalhados de vendas e estoque com imagens.
- **Autenticação**: Protege rotas sensíveis com **JWT** e **cookies HttpOnly**.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: MongoDB (com Mongoose para modelagem de dados)
- **Autenticação**: JWT com cookies HttpOnly
- **Relatórios**: PDF gerado com base nas transações e estoque
- **Envio de Arquivos**: Cloudinary (para imagens de produtos)

## Instalação

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (recomendado: versão 14 ou superior)
- **MongoDB** (ou conta no MongoDB Atlas)

### Passos

1. Clone o repositório:
    ```bash
    git clone https://github.com/seuusuario/back-stock-master.git
    cd back-stock-master
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie o arquivo `.env` na raiz do projeto e defina as variáveis de ambiente:
    ```
    MONGO_URI=mongodb://localhost:27017/back-stock
    JWT_SECRET=sua-chave-secreta
    CREATOR_KEY=sua-chave-de-administrador
    CLOUDINARY_URL=sua-url-do-cloudinary
    ```

4. Inicie o servidor:
    ```bash
    npm start
    ```

O servidor estará rodando em **http://localhost:3000**.

### Variáveis de Ambiente

- **MONGO_URI**: URL do banco de dados MongoDB.
- **JWT_SECRET**: Chave secreta para assinatura de tokens JWT.
- **CREATOR_KEY**: Chave para permitir o cadastro de novos administradores.
- **CLOUDINARY_URL**: URL da sua conta no Cloudinary para o upload de imagens de produtos.

## Endpoints

### 1. Autenticação

- **POST** `/api/login`: Login de usuário. Retorna um token JWT.
- **POST** `/api/cadastroComKey`: Cadastro de usuário administrador com chave secreta.

### 2. Produtos

- **POST** `/api/produtos`: Criação de um novo produto.
- **GET** `/api/produtos`: Listagem de todos os produtos.
- **PUT** `/api/produtos/:id`: Atualização de produto existente.
- **DELETE** `/api/produtos/:id`: Exclusão de produto.

### 3. Transações

- **POST** `/api/transacoes`: Criação de transação (entrada/saída/venda).
- **GET** `/api/transacoes`: Listagem de transações realizadas.

### 4. Relatórios

- **GET** `/api/relatorio/estoque-com-imagens`: Geração de relatório de estoque com imagens.
- **GET** `/api/relatorio/vendas`: Geração de relatório de vendas.

### 5. Dashboard

- **GET** `/api/dashboard`: Visão geral do sistema com totais de vendas, despesas, estoque e transações recentes.

## Autenticação

As rotas que exigem autenticação requerem um **token JWT**, que é gerado ao realizar o login no sistema. O token é enviado no **cookie HttpOnly**, para maior segurança contra ataques XSS. 

O token JWT deve ser enviado automaticamente pelo navegador em todas as requisições subsequentes, através do **cookie**.

### Exemplo de Requisição com Token

```bash
fetch('http://localhost:3000/api/produtos', {
    method: 'GET',
    credentials: 'include'
})
````
Cadastro de Funcionários
Para cadastrar um novo administrador (funcionário com permissões de acesso ao sistema), você precisará inserir a CREATOR_KEY no corpo da requisição de cadastro:
````json
{
    "nome": "Nome do Funcionário",
    "email": "email@dominio.com",
    "senha": "senha123",
    "creatorKey": "<chave-para-cadastro>"
}
````
### Observações Importantes
CREATOR_KEY é uma variável sensível, e deve ser configurada no arquivo .env como uma chave secreta.

Evite commitar o arquivo .env no repositório para não expor suas credenciais.

### Testes
Os testes podem ser realizados utilizando o Postman ou qualquer outro cliente HTTP. O fluxo básico de testes envolve:

Criar um administrador com a CREATOR_KEY.

Fazer login e pegar o token JWT.

Testar as rotas de CRUD de produtos e transações.

Validar o funcionamento do dashboard e geração de relatórios.

### Licença
Desenvolvido por João Henrique Ferreira Constantino da Silva.

### Considerações Finais
Este backend foi desenvolvido para ser robusto e seguro, com foco em controle de estoque e transações de vendas. As próximas melhorias podem incluir a integração com sistemas de pagamento, gráficos de desempenho e testes automatizados.
