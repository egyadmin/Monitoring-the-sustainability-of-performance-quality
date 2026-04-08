import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({user:'postgres',password:'postgres',host:'localhost',port:5432,database:'cbahi_db'});

const fixNames = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  
  // Fix Arabic names (encoding issue) and passwords
  await pool.query("UPDATE users SET full_name = $1, password_hash = $2 WHERE username = 'admin'", ['مدير النظام (Admin)', hash]);
  await pool.query("UPDATE users SET full_name = $1, password_hash = $2 WHERE username = 'manager1'", ['د. جينا جوهر', hash]);
  await pool.query("UPDATE users SET full_name = $1, password_hash = $2 WHERE username = 'inspector1'", ['أحمد المقيّم', hash]);

  // Verify
  const users = await pool.query('SELECT id, username, full_name, role FROM users');
  console.log('✅ Users fixed:', users.rows);
  pool.end();
};

fixNames().catch(e => { console.error(e); pool.end(); });
