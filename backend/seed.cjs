const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cbahi_db',
  password: 'postgres', // Based on env variable
  port: 5432,
});

const initialCenters = [
  { name: 'مركز صحي الزهور', sector: 'سكاكا' },
  { name: 'مركز صحي شرق اللقائط', sector: 'سكاكا' },
  { name: 'مركز صحي الفيصلية', sector: 'سكاكا' },
  { name: 'مركز صحي فياض سكاكا', sector: 'سكاكا' },
  { name: 'مركز صحي اللقائط', sector: 'سكاكا' },
  { name: 'مركز صحي المعاقلة', sector: 'سكاكا' },
  { name: 'مركز صحي المخطط', sector: 'سكاكا' },
  { name: 'مركز صحي النفل', sector: 'سكاكا' },
  { name: 'مركز صحي قارا', sector: 'سكاكا' },
  { name: 'مركز صحي الربوة', sector: 'سكاكا' },
  { name: 'مركز صحي الشمالي', sector: 'سكاكا' },
  { name: 'مركز صحي الشلهوب', sector: 'سكاكا' },
  { name: 'مركز صحي السوق والمطر', sector: 'سكاكا' },
  { name: 'مركز صحي خوعاء', sector: 'سكاكا' },
  { name: 'مركز صحي عذفاء', sector: 'سكاكا' },
  { name: 'مركز صحي الطوير', sector: 'سكاكا' },
  { name: 'مركز صحي مطار الجوف', sector: 'سكاكا' },
  { name: 'مركز صحي صوير', sector: 'صوير' },
  { name: 'مركز صحي هديب', sector: 'صوير' },
  { name: 'مركز صحي زلوم', sector: 'صوير' },
  { name: 'مركز صحي طلعة عمار', sector: 'صوير' },
  { name: 'مركز صحي الرفيعة', sector: 'صوير' },
  { name: 'مركز صحي الشويحطية', sector: 'صوير' },
  { name: 'مركز صحي الملك فهد', sector: 'دومة الجندل' },
  { name: 'مركز صحي الغرب', sector: 'دومة الجندل' },
  { name: 'مركز صحي الصفاه', sector: 'دومة الجندل' },
  { name: 'مركز صحي الوادي والبحيرات', sector: 'دومة الجندل' },
  { name: 'مركز صحي الشقيق', sector: 'دومة الجندل' },
  { name: 'مركز صحي الرديفة', sector: 'دومة الجندل' },
  { name: 'مركز صحي اصفان', sector: 'دومة الجندل' },
  { name: 'مركز صحي الأضارع', sector: 'دومة الجندل' },
  { name: 'مركز صحي ابوعجرم', sector: 'دومة الجندل' },
  { name: 'مركز صحي الشرق', sector: 'دومة الجندل' },
  { name: 'مركز صحي ميقوع', sector: 'طبرجل' },
  { name: 'مركز صحي النبك ابوقصر', sector: 'طبرجل' },
  { name: 'مركز صحي فياض طبرجل', sector: 'طبرجل' },
  { name: 'مركز صحي الصالحية', sector: 'طبرجل' },
  { name: 'مركز صحي المنتزه', sector: 'طبرجل' },
  { name: 'مركز صحي النباج', sector: 'طبرجل' },
  { name: 'مركز صحي حدرج والدعيجاء', sector: 'طبرجل' },
  { name: 'مركز صحي العزيزية', sector: 'طبرجل' },
  { name: 'مركز صحي الفيصلية', sector: 'القريات' },
  { name: 'مركز صحي الحماد', sector: 'القريات' },
  { name: 'مركز صحي جماجم', sector: 'القريات' },
  { name: 'مركز صحي غطي', sector: 'القريات' },
  { name: 'مركز صحي الرفاع', sector: 'القريات' },
  { name: 'مركز صحي قليب خضر', sector: 'القريات' },
  { name: 'مركز صحي العزيزية', sector: 'القريات' },
  { name: 'مركز صحي الحديثه', sector: 'القريات' },
  { name: 'مركز صحي المزارع', sector: 'القريات' },
  { name: 'مركز صحي الرديفة', sector: 'القريات' },
  { name: 'مركز صحي حصيده', sector: 'القريات' },
  { name: 'مركز صحي الحميدية', sector: 'القريات' },
  { name: 'مركز صحي العقيلة', sector: 'القريات' },
  { name: 'مركز صحي العيساوية', sector: 'القريات' },
  { name: 'مركز صحي الغربي', sector: 'القريات' },
  { name: 'مركز صحي حي المطار', sector: 'القريات' },
  { name: 'مركز صحي الناصفة', sector: 'القريات' },
  // المستشفيات
  { name: 'مستشفى الملك عبد العزيز', sector: 'سكاكا', isHospital: true },
  { name: 'مستشفى الأمير متعب', sector: 'سكاكا', isHospital: true },
  { name: 'مستشفى النساء والولادة والأطفال', sector: 'سكاكا', isHospital: true },
  { name: 'مستشفى دومة الجندل', sector: 'دومة الجندل', isHospital: true },
  { name: 'مستشفى أبوعجرم', sector: 'طبرجل', isHospital: true },
  { name: 'مستشفى القريات العام', sector: 'القريات', isHospital: true },
  { name: 'مستشفى صوير', sector: 'صوير', isHospital: true },
  { name: 'مستشفى طبرجل', sector: 'طبرجل', isHospital: true },
  { name: 'مستشفى الحديثة', sector: 'القريات', isHospital: true },
  { name: 'مستشفى الأمل القريات', sector: 'القريات', isHospital: true },
  { name: 'مستشفى إرادة بالجوف', sector: 'سكاكا', isHospital: true },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Beginning database seed...');
    await client.query('BEGIN');
    
    // 1. Truncate tables (Keep users so they do not lose login! Or just wipe all visits and centers)
    console.log('Truncating tables...');
    await client.query('TRUNCATE TABLE visit_scores, visits, notifications, centers RESTART IDENTITY CASCADE');

    // 2. Insert Centers
    console.log(`Inserting ${initialCenters.length} centers...`);
    for (const c of initialCenters) {
      await client.query('INSERT INTO centers (name, sector, accreditation_status) VALUES ($1, $2, $3)', [
        c.name, c.sector, 'Not Visited'
      ]);
    }

    // 3. Optional: add a generic inspector if none exist
    let adminResult = await client.query("SELECT id FROM users WHERE username = 'admin'");
    if (adminResult.rows.length === 0) {
      const hash = await bcrypt.hash('123456', 10);
      adminResult = await client.query("INSERT INTO users (username, password_hash, full_name, role, allowed_sectors) VALUES ($1, $2, $3, 'admin', 'All') RETURNING id", ['admin', hash, 'Admin User']);
    }
    const inspectorId = adminResult.rows[0].id;

    // 4. Insert dummy visits (some high score, some low)
    console.log('Inserting mock visits to test system...');
    const dummyVisits = [
      { center_id: 1,  date: '2026-03-10', status: 'approved', score: 95 },
      { center_id: 2,  date: '2026-03-12', status: 'approved', score: 88 },
      { center_id: 5,  date: '2026-03-15', status: 'rejected', score: 55, reason: 'لم يتم اعتماد خطة الإخلاء' },
      { center_id: 59, date: '2026-03-20', status: 'approved', score: 92 },
      { center_id: 60, date: '2026-03-22', status: 'approved', score: 85 },
      { center_id: 8,  date: '2026-03-25', status: 'pending',  score: 75 },
      { center_id: 15, date: '2026-04-01', status: 'rejected', score: 40, reason: 'نقص حاد في كادر التمريض' },
      { center_id: 62, date: '2026-04-05', status: 'approved', score: 98 },
    ];

    for (const dv of dummyVisits) {
      // First, update center status
      const centerStatus = dv.status === 'approved' && dv.score > 60 ? 'Accredited' : 
                           (dv.status === 'rejected' ? 'Denied' : 'Pending');
      await client.query('UPDATE centers SET accreditation_status = $1 WHERE id = $2', [centerStatus, dv.center_id]);

      const visitResult = await client.query(
        `INSERT INTO visits (center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [dv.center_id, inspectorId, dv.date, 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', dv.score, dv.status]
      );
      const vid = visitResult.rows[0].id;
      if (dv.status === 'rejected') {
        await client.query('UPDATE visits SET reject_reason = $1 WHERE id = $2', [dv.reason, vid]);
      }
    }

    await client.query('COMMIT');
    console.log('Database seed completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during seed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
