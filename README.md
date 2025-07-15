# 📦 Back Stock Master – API de Gestão de Estoque e Vendas

Este sistema foi desenvolvido como projeto freelancer para uso interno da empresa com o objetivo de gerenciar produtos, vendas, clientes e controle financeiro, oferecendo relatórios e indicadores através de uma API REST.

---

## 🚀 Instalação e Setup

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/Back-Stock-Master.git
cd Back-Stock-Master
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Crie o arquivo `.env` com as variáveis:**
```
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/stock
JWT_SECRET=sua_chave_secreta
CREATOR_KEY=sua_chave_de_criador
CLOUDINARY_CLOUD_NAME=seu_nome
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_secret_key
```

4. **Inicie o servidor:**
```bash
npm run dev
```

---

## 🧪 Testes no Postman

Você pode testar toda a API usando o Postman.

### ✅ Checklist de Testes:
- [x] Cadastro e Login de usuário com token (via `CREATOR_KEY`)
- [x] CRUD de Produtos (com imagem no Cloudinary)
- [x] CRUD de Clientes
- [x] Entradas e Saídas
- [x] Vendas com preço dinâmico (por item)
- [x] Geração de Logs (ações do usuário)
- [x] Geração de Relatórios PDF:
  - [x] Vendas por período
  - [x] Estoque com Imagens
- [x] Dashboard de indicadores

---

## 🛠️ Tecnologias

- **Back-end:** Node.js, Express, MongoDB Atlas, Mongoose
- **Autenticação:** JWT + Bcrypt
- **Imagens:** Cloudinary
- **Uploads:** Multer
- **PDFs:** PDFKit
- **Logs:** MongoDB
- **Deploy recomendado:** Render ou DigitalOcean (para API)

---

## 📚 Rotas da API

### 🔐 Autenticação

- `POST /auth/login`: Login com email/senha → retorna token
- `POST /auth/criar-com-chave`: Criação de usuário (requer `creatorKey`)

### 👤 Usuário
- Proteção por token JWT obrigatório em todas rotas abaixo.

---

### 📦 Produtos
- `GET /api/produtos`: Listar produtos
- `POST /api/produtos`: Criar produto (com imagem)
- `PUT /api/produtos/:id`: Editar produto
- `DELETE /api/produtos/:id`: Excluir produto

**Campos esperados no cadastro:**
```json
{
  "nome": "Produto X",
  "quantidade": 10,
  "preco": 99.9,
  "imagem": <file>
}
```

---

### 👥 Clientes
- `GET /api/clientes`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

---

### 💰 Despesas
- `POST /api/despesas`: Criar
- `GET /api/despesas`: Listar

---

### 💸 Vendas
- `POST /api/vendas`: Criar venda
```json
{
  "produtos": [
    {
      "nomeProduto": "Produto X",
      "quantidade": 2,
      "precoVenda": 150
    }
  ]
}
```
- `GET /api/vendas`: Listar vendas

---

### 🔄 Transações (entrada/saída/venda)
- `POST /api/transacoes/entrada`
- `POST /api/transacoes/saida`
- `GET /api/transacoes`: Listar

---

### 📈 Dashboard
- `GET /api/dashboard`: Indicadores do sistema

---

### 📃 Relatórios em PDF
- `GET /api/relatorios/vendas`: PDF de vendas com filtros (semana, mês, intervalo)
- `GET /api/relatorios/estoque`: PDF com produtos e imagens

---

### 🧾 Logs
- `GET /api/logs`: Listar ações dos usuários

---

## ☁️ Upload de Imagens com Cloudinary

- As imagens são enviadas usando `multipart/form-data`
- Campo esperado: `imagem`
- A URL da imagem é salva no Mongo e exibida nos relatórios em PDF

---

## 🧼 Considerações

- O campo `descricao` do produto é opcional, mas pode ser utilizado para relatórios.
- O limite de usuários é controlado com base na chave `CREATOR_KEY`.
- A geração de PDFs funciona via streaming (resposta binária).
- É possível adicionar melhorias como gráficos ou exportação em CSV futuramente.

---

## 🛰️ Deploy

- Use **Render** ou **DigitalOcean** para subir o backend.
- MongoDB Atlas é usado como banco de dados remoto.

---



Desenvolvido com 💻 por João Henrique F. C. da Silva
