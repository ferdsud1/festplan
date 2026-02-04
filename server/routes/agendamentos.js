const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para Criar um Agendamento
router.post('/reservar', async (req, res) => {
    const { id_usuario, id_local, id_buffet, data_festa, qtd_convidados, forma_pagamento } = req.body;

    try {
        // 1. Opcional: Aqui no futuro podemos somar os preços do local + buffet
        // Por enquanto, vamos apenas inserir os dados que o usuário enviou
        
        const novoAgendamento = await pool.query(
            `INSERT INTO agendamentos 
            (id_usuario, id_local, id_buffet, data_festa, qtd_convidados, forma_pagamento, status_pagamento) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [id_usuario, id_local, id_buffet, data_festa, qtd_convidados, forma_pagamento, 'Pendente']
        );

        res.status(201).json({
            mensagem: "Reserva realizada com sucesso!",
            detalhes: novoAgendamento.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao processar agendamento. Verifique se os IDs estão corretos." });
    }
});

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