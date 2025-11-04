import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'mk_one',
  password: '6vi_GrlP3SYV6cLqLd5nyQ',
  host: 'apex-kelpie-3698.8nk.gcp-asia-southeast1.cockroachlabs.cloud',
  port: 26257,
  database: 'mk_one',
    ssl: {
    rejectUnauthorized: false,
  },
});