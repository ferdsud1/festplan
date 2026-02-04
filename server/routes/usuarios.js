const express = require('express');
const router = express.Router();
const pool = require('../db'); // Seu arquivo de conexão com o banco

// ROTA DE CADASTRO (O servidor RECEBE os dados)
router.post('/cadastro', async (req, res) => {
    const { nome, email, senha, cpf, telefone } = req.body;
    try {
        const novoUsuario = await pool.query(
            'INSERT INTO usuarios (nome, email, senha, cpf, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nome, email, senha, cpf, telefone]
        );
        res.status(201).json(novoUsuario.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});

// ROTA DE LOGIN (O servidor VERIFICA os dados)
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
            [email, senha]
        );

        if (usuario.rows.length > 0) {
            res.status(200).json({ 
                mensagem: "Login realizado!", 
                usuario: usuario.rows[0].nome 
            });
        } else {
            res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro no servidor" });
    }
});

module.exports = router;