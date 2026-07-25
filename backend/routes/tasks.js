const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Crear una nueva tarea
router.post('/', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'El título es obligatorio' });

    try {
        const result = await db.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Cambiar estado (completada / pendiente)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    try {
        await db.query('UPDATE tasks SET completed = $1 WHERE id = $2', [completed, id]);
        res.json({ message: 'Tarea actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Eliminar una tarea
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;