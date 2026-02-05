const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Rota para buscar TODOS os locais (Vitrine)
router.get('/', async (req, res) => {
    try {
        const todosLocais = await pool.query("SELECT * FROM locais ORDER BY id_local ASC");
        res.json(todosLocais.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar locais." });
    }
});

// 2. Rota para buscar UM local específico (Para o Modal de Detalhes)
// O ":id" aceita o id_local enviado pelo seu frontend
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const local = await pool.query("SELECT * FROM locais WHERE id_local = $1", [id]);

        if (local.rows.length === 0) {
            return res.status(404).json({ erro: "Local não encontrado." });
        }

        res.json(local.rows[0]); // Retorna apenas o objeto do local
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar detalhes do local." });
    }
});

module.exports = router;