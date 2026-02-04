const express = require('express');
const cors = require('cors');

// 1. Importando as rotas (que estão na pasta routes)
const usuariosRoutes = require('./routes/usuarios');
const locaisRoutes = require('./routes/locais');
const buffetsRoutes = require('./routes/buffets');

const app = express();
const PORT = 3000;

// 2. Middlewares (Configurações de entrada)
app.use(cors()); // Permite que o Front-end acesse o Back-end
app.use(express.json()); // Permite que o servidor receba dados em formato JSON

// 3. Definição das Rotas Principais
// Quando o site acessar /usuarios, ele usa o arquivo usuarios.js
app.use('/usuarios', usuariosRoutes);

// Quando o site acessar /locais, ele usa o arquivo locais.js
app.use('/locais', locaisRoutes);

// Quando o site acessar /buffets, ele usa o arquivo buffets.js
app.use('/buffets', buffetsRoutes);

// 4. Rota de teste inicial (apenas para saber se o servidor está online)
app.get('/', (req, res) => {
    res.send("Servidor do FestPlan rodando com sucesso!");
});

// 5. Iniciando o servidor
app.listen(PORT, () => {
    console.log('=========================================');
    console.log('✅ Servidor rodando com sucesso!');
    console.log('🔗 Acesse em: http://localhost:3000'); 
    console.log('=========================================');
});