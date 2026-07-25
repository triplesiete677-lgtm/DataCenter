const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir la carpeta frontend (HTML, CSS, JS) en la raíz (http://localhost:3000)
app.use(express.static(path.join(__dirname, '../frontend')));

// --------------------------------------------------
// RUTAS DE LA API (/api/tasks)
// --------------------------------------------------

// 1. GET: Obtener todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener tareas:', err.message);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// 2. POST: Crear una nueva tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    const result = await pool.query(
      'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
      [title, false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear tarea:', err.message);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// 3. PUT: Actualizar el estado o título de una tarea por ID
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const result = await pool.query(
      'UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
      [title, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar tarea:', err.message);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// 4. DELETE: Eliminar una tarea por ID
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente', task: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar tarea:', err.message);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// --------------------------------------------------
// INICIALIZACIÓN DEL SERVIDOR
// --------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});