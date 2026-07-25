const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'tododb',
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;