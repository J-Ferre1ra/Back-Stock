const app = require('./src/app')
const PORT = process.env.PORT || 3000
const cors = require('cors');

const allowedOrigins = [
  "https://estoquemaster.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
})
