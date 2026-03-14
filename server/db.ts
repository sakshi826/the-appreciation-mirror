import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NEON_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
