const app = require('./src/app')
const PORT = process.env.PORT || 3000
const cors = require('cors');

const allowedOrigins = [
  "http://localhost:5173",
  "https://estoquemaster.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta ${PORT}`);
})
