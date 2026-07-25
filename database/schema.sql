-- Crear la base de datos (opcional si la creas manualmente)
-- CREATE DATABASE todo_db;

-- Crear la tabla de tareas
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Opcional) Datos de prueba iniciales
INSERT INTO todos (title, completed) VALUES
    ('Aprender Node.js y Express', true),
    ('Conectar PostgreSQL', true),
    ('Configurar CI/CD en VPS', false);