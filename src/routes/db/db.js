import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mk_jewels',
  password: 'your_password',
  port: 5432,
});
