import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'USERNAME' || 'mk_one',
  password: 'PASSWORD' || '6vi_GrlP3SYV6cLqLd5nyQ',
  host: 'HOST' || 'apex-kelpie-3698.8nk.gcp-asia-southeast1.cockroachlabs.cloud',
  port: `PORT` || 26257,
  database: 'DATABASE' || 'mk_one',
    ssl: {
    rejectUnauthorized: false,
  },
});