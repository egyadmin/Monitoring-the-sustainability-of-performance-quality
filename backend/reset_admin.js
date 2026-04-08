import bcrypt from 'bcrypt';
import pool from './db.js';

const hash = await bcrypt.hash('admin123', 10);
await pool.query("UPDATE users SET password_hash = $1 WHERE username = 'admin'", [hash]);
await pool.query("UPDATE users SET password_hash = $1 WHERE username = 'manager1'", [hash]);
await pool.query("UPDATE users SET password_hash = $1 WHERE username = 'inspector1'", [hash]);
console.log('✅ Passwords reset to admin123 for all users');
await pool.end();
