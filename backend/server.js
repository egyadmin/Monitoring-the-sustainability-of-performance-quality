import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cbahi_key_2026';

// ===================== MIDDLEWARE =====================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'غير مصرح للوصول' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'جلسة التوثيق غير صالحة' });
    req.user = user;
    next();
  });
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'صلاحيات غير كافية' });
  next();
};

// ===================== AUTH =====================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'المستخدم غير موجود' });
    const user = result.rows[0];
    // Support both bcrypt and plain-text passwords for dev
    let validPassword = false;
    try { validPassword = await bcrypt.compare(password, user.password_hash); } catch(e) {}
    if (!validPassword && password === user.password_hash) validPassword = true;
    if (!validPassword) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
    const allowed_sectors = user.allowed_sectors ? user.allowed_sectors.split(',').map(s => s.trim()) : ['All'];
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, full_name: user.full_name, allowed_sectors }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name, allowed_sectors } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطأ داخلي في الخادم' });
  }
});

// ===================== USERS =====================
app.get('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, full_name, role, allowed_sectors, created_at FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'خطأ' }); }
});

app.post('/api/users', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    const { username, password, full_name, role, allowed_sectors } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password_hash, full_name, role, allowed_sectors) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, full_name, role, allowed_sectors', [username, hash, full_name, role, allowed_sectors]);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'اسم المستخدم موجود مسبقاً' });
    res.status(500).json({ error: 'خطأ في إنشاء المستخدم' });
  }
});

app.delete('/api/users/:id', authenticateToken, checkRole(['admin']), async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'خطأ' }); }
});

app.put('/api/users/:id/password', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'خطأ' }); }
});

app.put('/api/users/:id/name', authenticateToken, async (req, res) => {
  try {
    const { full_name } = req.body;
    await pool.query('UPDATE users SET full_name = $1 WHERE id = $2', [full_name, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'خطأ' }); }
});


app.get('/api/centers', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT * FROM centers';
    let params = [];
    if (req.user.role !== 'admin' && req.user.allowed_sectors && !req.user.allowed_sectors.includes('All')) {
      const sectors = Array.isArray(req.user.allowed_sectors) ? req.user.allowed_sectors : req.user.allowed_sectors.split(',');
      query += ' WHERE sector = ANY($1)';
      params.push(sectors);
    }
    const result = await pool.query(query + ' ORDER BY sector, name', params);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

app.post('/api/centers', authenticateToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { name, sector, accreditation_status } = req.body;
    const result = await pool.query('INSERT INTO centers (name, sector, accreditation_status) VALUES ($1, $2, $3) RETURNING *', [name, sector, accreditation_status || 'Accredited']);
    res.json({ success: true, center: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'خطأ في إضافة المركز' }); }
});

// ===================== VISITS (التقييمات) =====================
app.post('/api/visits', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { center_id, visit_date, visit_type, strengths, improvements, total_score, answers, scores } = req.body;
    await client.query('BEGIN');
    const visitResult = await client.query(
      `INSERT INTO visits (center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING id`,
      [center_id, req.user.id, visit_date, visit_type || 'تقييم دوري', strengths, improvements, total_score]
    );
    const visitId = visitResult.rows[0].id;
    if (answers && typeof answers === 'object') {
      const scoreQueries = Object.keys(answers).map(criteriaId =>
        client.query('INSERT INTO visit_scores (visit_id, criteria_id, score) VALUES ($1, $2, $3)', [visitId, criteriaId, answers[criteriaId]])
      );
      await Promise.all(scoreQueries);
    }
    await client.query('COMMIT');

    // إضافة إشعار للمديرين
    try {
      const managers = await pool.query("SELECT id FROM users WHERE role IN ('admin','manager')");
      const centerInfo = await pool.query('SELECT name FROM centers WHERE id = $1', [center_id]);
      const centerName = centerInfo.rows[0]?.name || '';
      for (const m of managers.rows) {
        await pool.query(
          'INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)',
          [m.id, `📋 تقرير تقييم جديد من ${req.user.full_name} عن ${centerName} — النسبة: ${total_score}% — بانتظار الاعتماد`, 'new_report']
        );
      }
    } catch(e) { console.log('Notification insert skipped:', e.message); }

    res.status(201).json({ success: true, visit_id: visitId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Visit save error:', error);
    res.status(500).json({ error: 'حدث خطأ في حفظ التقييم' });
  } finally { client.release(); }
});

app.get('/api/visits', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.name as center_name, c.sector, u.full_name as inspector_name,
             a.full_name as approver_name
      FROM visits v 
      JOIN centers c ON v.center_id = c.id 
      JOIN users u ON v.inspector_id = u.id 
      LEFT JOIN users a ON v.approved_by = a.id
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

app.get('/api/visits/:id/scores', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT criteria_id, score FROM visit_scores WHERE visit_id = $1', [req.params.id]);
    const scores = {};
    result.rows.forEach(r => { scores[r.criteria_id] = r.score; });
    res.json(scores);
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

app.put('/api/visits/:id/approve', authenticateToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    await pool.query('UPDATE visits SET status = $1, approved_by = $2 WHERE id = $3', ['approved', req.user.id, req.params.id]);
    // إشعار للمفتش
    const visit = await pool.query('SELECT inspector_id, center_id FROM visits WHERE id = $1', [req.params.id]);
    if (visit.rows[0]) {
      const center = await pool.query('SELECT name FROM centers WHERE id = $1', [visit.rows[0].center_id]);
      await pool.query('INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)',
        [visit.rows[0].inspector_id, `✅ تم اعتماد تقريرك عن ${center.rows[0]?.name} بواسطة ${req.user.full_name}`, 'approved']
      ).catch(() => {});
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

app.put('/api/visits/:id/reject', authenticateToken, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { reason } = req.body;
    await pool.query('UPDATE visits SET status = $1, reject_reason = $2, approved_by = $3 WHERE id = $4', ['rejected', reason, req.user.id, req.params.id]);
    const visit = await pool.query('SELECT inspector_id, center_id FROM visits WHERE id = $1', [req.params.id]);
    if (visit.rows[0]) {
      const center = await pool.query('SELECT name FROM centers WHERE id = $1', [visit.rows[0].center_id]);
      await pool.query('INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)',
        [visit.rows[0].inspector_id, `❌ تم رفض تقريرك عن ${center.rows[0]?.name} — السبب: ${reason}`, 'rejected']
      ).catch(() => {});
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

app.put('/api/visits/:id/resubmit', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE visits SET status = $1 WHERE id = $2 AND inspector_id = $3', ['pending', req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: 'خطأ' }); }
});

// ===================== NOTIFICATIONS =====================
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    // Ensure table exists
    await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL, type VARCHAR(50) DEFAULT 'info',
      is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`).catch(() => {});
    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [req.user.id]);
    res.json(result.rows);
  } catch (error) { 
    console.error('Notification fetch error:', error.message);
    res.json([]); 
  }
});

app.put('/api/notifications/read', authenticateToken, async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL, type VARCHAR(50) DEFAULT 'info',
      is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`).catch(() => {});
    await pool.query('UPDATE notifications SET is_read = true WHERE user_id = $1', [req.user.id]);
    res.json({ success: true });
  } catch (error) { 
    console.error('Notification read error:', error.message);
    res.json({ success: true }); 
  }
});

// ===================== INIT DB =====================
const initDb = async () => {
  try {
    // Add missing columns and tables
    await pool.query(`
      ALTER TABLE visits ADD COLUMN IF NOT EXISTS reject_reason TEXT;
    `).catch(() => {});
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).catch(() => {});
    
    console.log('✅ Database tables verified');
  } catch(e) { console.log('DB init note:', e.message); }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Frontend for Replit/Production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ===================== START =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initDb();
  console.log(`🚀 Backend Server running on port ${PORT}`);
});
