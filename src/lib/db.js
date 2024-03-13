import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.USER_PG,
  host: process.env.HOST_PG,
  database: process.env.DATABASE_PG,
  password: process.env.PASSWORD_PG,
  port: process.env.PORT_PG,
});

export const query = (text, params) => pool.query(text, params);
