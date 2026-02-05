const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    try {
        const { id_local, data_evento, qtd_convidados, valor_total, status_pagamento } = req.body;
        
        const novoAgendamento = await pool.query(
            "INSERT INTO agendamentos (id_local, data_evento, qtd_convidados, valor_total, status_pagamento) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [id_local, data_evento, qtd_convidados, valor_total, status_pagamento]
        );

        res.json(novoAgendamento.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erro no servidor");
    }
});

module.exports = router;

// Rota para Listar os agendamentos de um usuário específico
router.get('/meus-agendamentos/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const result = await pool.query(
            `SELECT a.*, l.nome_local, b.nome_buffet 
             FROM agendamentos a
             JOIN locais l ON a.id_local = l.id_local
             JOIN buffets b ON a.id_buffet = b.id_buffet
             WHERE a.id_usuario = $1`, 
            [id_usuario]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar seus agendamentos." });
    }
});

module.exports = router;