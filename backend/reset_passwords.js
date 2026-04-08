import pg from 'pg';
import bcrypt from 'bcrypt';

const pool = new pg.Pool({user:'postgres',password:'postgres',host:'localhost',port:5432,database:'cbahi_db'});

const resetPasswords = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('New hash for admin123:', hash);
  
  // Reset admin password
  await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, 'admin']);
  await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, 'manager1']);
  
  // Add inspector1 if not exists
  const exists = await pool.query("SELECT id FROM users WHERE username = 'inspector1'");
  if (exists.rows.length === 0) {
    const inspHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      "INSERT INTO users (username, password_hash, full_name, role, allowed_sectors) VALUES ($1, $2, $3, $4, $5)",
      ['inspector1', inspHash, 'أحمد المقيّم', 'inspector', 'سكاكا,دومة الجندل']
    );
    console.log('✅ Added inspector1');
  }
  
  // Verify
  const users = await pool.query('SELECT id, username, full_name, role FROM users');
  console.log('✅ Users after reset:', users.rows);
  
  pool.end();
};

resetPasswords().catch(e => { console.error(e); pool.end(); });
