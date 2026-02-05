const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Rota para buscar TODOS os buffets (Vitrine)
router.get('/', async (req, res) => {
    try {
        const todosBuffets = await pool.query("SELECT * FROM buffets ORDER BY id_buffet ASC");
        res.json(todosBuffets.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar buffets." });
    }
});

// 2. Rota para buscar UM buffet específico (Para o Modal de Detalhes)
// O ":id" captura o id_buffet enviado pelo seu frontend
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const buffet = await pool.query("SELECT * FROM buffets WHERE id_buffet = $1", [id]);

        if (buffet.rows.length === 0) {
            return res.status(404).json({ erro: "Buffet não encontrado." });
        }

        res.json(buffet.rows[0]); // Retorna apenas o objeto do buffet encontrado
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar detalhes do buffet." });
    }
});

module.exports = router;