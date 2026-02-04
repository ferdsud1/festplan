const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rota para buscar todos os buffets
router.get('/', async (req, res) => {
    try {
        const todosBuffets = await pool.query("SELECT * FROM buffets");
        res.json(todosBuffets.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao buscar buffets." });
    }
});

module.exports = router;