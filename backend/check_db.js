import pg from 'pg';
const pool = new pg.Pool({user:'postgres',password:'postgres',host:'localhost',port:5432,database:'cbahi_db'});

try {
  const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables:', tables.rows.map(r => r.table_name));
  
  const users = await pool.query('SELECT id, username, full_name, role FROM users');
  console.log('Users:', users.rows);
  
  const centers = await pool.query('SELECT COUNT(*) as count FROM centers');
  console.log('Centers count:', centers.rows[0].count);
  
  const visits = await pool.query('SELECT COUNT(*) as count FROM visits');
  console.log('Visits count:', visits.rows[0].count);
} catch(e) {
  console.error('Error:', e.message);
}
pool.end();
