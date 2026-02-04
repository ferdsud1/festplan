const { Pool } = require('pg');
const path = require('path');

// Configura o dotenv para buscar o arquivo .env exatamente uma pasta acima deste arquivo
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD), // Garante que a senha seja lida como texto (string)
    port: process.env.DB_PORT,
});

// Teste de conexão imediato para facilitar o diagnóstico no terminal
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Erro de conexão com o Banco de Dados:', err.stack);
    }
    console.log('🐘 Conexão com o PostgreSQL estabelecida com sucesso!');
    release();
});

module.exports = pool;