const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todas las tareas
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las tareas"
        });
    }
});

// Crear una tarea
router.post("/", async (req, res) => {
    try {

        const { title } = req.body;

        const result = await pool.query(
            "INSERT INTO tasks(title, completed) VALUES($1,false) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear la tarea"
        });

    }
});

// Actualizar una tarea
router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;
        const { title, completed } = req.body;

        const result = await pool.query(
            "UPDATE tasks SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
            [title, completed, id]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar"
        });

    }

});

// Eliminar tarea
router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            "DELETE FROM tasks WHERE id=$1",
            [id]
        );

        res.json({
            mensaje: "Tarea eliminada"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar"
        });

    }

});

module.exports = router;