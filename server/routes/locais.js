const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para buscar todos os locais disponíveis
router.get('/', async (req, res) => {
    try {
        const todosLocais = await pool.query("SELECT * FROM locais");
        res.json(todosLocais.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar locais." });
    }
});

module.exports = router;