import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || 'mk_one',
  password: process.env.DB_PASSWORD || '6vi_GrlP3SYV6cLqLd5nyQ',
  host: process.env.DB_HOST || 'apex-kelpie-3698.8nk.gcp-asia-southeast1.cockroachlabs.cloud',
  port: parseInt(process.env.DB_PORT, 10) || 26257,
  database: process.env.DB_NAME || 'mk_one',
  ssl: {
    rejectUnauthorized: false,
  },
});