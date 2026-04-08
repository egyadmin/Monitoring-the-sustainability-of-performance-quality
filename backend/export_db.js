import pool from './db.js';
import fs from 'fs';

async function dump() {
  let dumpText = fs.readFileSync('init_tables.sql', 'utf8') + '\n\n';

  const tables = ['users', 'centers', 'visits'];

  for (let table of tables) {
    const res = await pool.query(`SELECT * FROM ${table}`);
    if (res.rows.length === 0) continue;

    const keys = Object.keys(res.rows[0]);
    
    // Insert statements
    res.rows.forEach(row => {
      const vals = keys.map(k => {
        const val = row[k];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val;
        if (typeof val === 'object') {
             // likely Date or JSON
             if(val instanceof Date) return `'${val.toISOString()}'`;
             return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        }
        return `'${val.toString().replace(/'/g, "''")}'`;
      });
      dumpText += `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${vals.join(', ')});\n`;
    });
    dumpText += '\n';
  }

  fs.writeFileSync('../cbahi_db_dump.sql', dumpText);
  console.log('Database dumped successfully to cbahi_db_dump.sql');
  process.exit(0);
}

dump().catch(console.error);
