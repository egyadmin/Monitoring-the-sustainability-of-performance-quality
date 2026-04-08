CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'inspector',
    allowed_sectors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    accreditation_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    center_id INT REFERENCES centers(id) ON DELETE CASCADE,
    inspector_id INT REFERENCES users(id),
    visit_date DATE NOT NULL,
    visit_type VARCHAR(50),
    strengths TEXT,
    improvements TEXT,
    total_score INT,
    status VARCHAR(50) DEFAULT 'pending',
    approved_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visit_scores (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    criteria_id VARCHAR(50) NOT NULL,
    score VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password_hash, full_name, role, allowed_sectors) 
VALUES 
('admin', '$2b$10$tZ2cK6qj40c79y8E5Ew52.nZb9b2R6HGHXyK0/W83Wd1xHbN6L/Fm', 'مدير النظام (Admin)', 'admin', 'All'),
('manager1', '$2b$10$tZ2cK6qj40c79y8E5Ew52.nZb9b2R6HGHXyK0/W83Wd1xHbN6L/Fm', 'د. جينا جوهر', 'manager', 'All')
ON CONFLICT (username) DO NOTHING;

INSERT INTO centers (name, sector, accreditation_status) VALUES
('مركز شرق اللقائط', 'سكاكا', 'Accredited'),
('مركز صحي الريوة', 'سكاكا', 'Denied'),
('مركز صحي الزهور', 'سكاكا', 'Denied'),
('مركز السوق والمطر', 'سكاكا', 'Accredited'),
('مركز صحي الشلهوب', 'سكاكا', 'Accredited'),
('مركز صحي الشمالي', 'سكاكا', 'Accredited'),
('مركز صحي الطوير', 'سكاكا', 'Accredited'),
('مركز صحي الفياض بسكاكا', 'سكاكا', 'Accredited'),
('مركز صحي الفيصلية', 'سكاكا', 'Accredited'),
('مركز صحي اللقائط', 'سكاكا', 'Accredited'),
('مركز صحي المخطط', 'سكاكا', 'Accredited'),
('مركز صحي المعاقلة', 'سكاكا', 'Denied'),
('مركز صحي النفل', 'سكاكا', 'Accredited'),
('مركز صحي خوعاء', 'سكاكا', 'Accredited'),
('مركز صحي عنقاء', 'سكاكا', 'Accredited'),
('مركز صحي قارا', 'سكاكا', 'Accredited'),
('مركز صحي الحميدية', 'دومة الجندل', 'Accredited'),
('مركز صحي الرديفة - القريات', 'القريات', 'Accredited'),
('مركز صحي الرقاع', 'القريات', 'Denied'),
('مركز صحي العزيزية - القريات', 'القريات', 'Denied'),
('مركز صحي العقيلة', 'القريات', 'Accredited'),
('مركز صحي العيساوية', 'القريات', 'Denied'),
('مركز صحي الغربي', 'القريات', 'Accredited'),
('مركز صحي الفيصلية - القريات', 'القريات', 'Accredited'),
('مركز صحي المزارع', 'القريات', 'Denied'),
('مركز صحي المطار', 'القريات', 'Accredited'),
('مركز صحي الناصفة', 'القريات', 'Accredited'),
('مركز صحي إسكان الحدينة', 'القريات', 'Accredited'),
('مركز صحي جناجم', 'طبرجل', 'Denied'),
('مركز صحي حصيدة', 'طبرجل', 'Accredited'),
('مركز صحي غطي', 'طبرجل', 'Accredited'),
('مركز صحي قليب خضر', 'طبرجل', 'Denied'),
('مركز صحي أبوعجرم', 'طبرجل', 'Accredited'),
('مركز صحي اصفان', 'طبرجل', 'Accredited'),
('مركز صحي الأضارع', 'طبرجل', 'Accredited'),
('مركز صحي الرديفة', 'طبرجل', 'Accredited'),
('مركز صحي الشرق', 'طبرجل', 'Accredited'),
('مركز صحي الشقيق', 'طبرجل', 'Denied'),
('مركز صحي الصفاة', 'طبرجل', 'Accredited'),
('مركز صحي الغرب', 'طبرجل', 'Denied'),
('مركز صحي الملك فهد', 'طبرجل', 'Accredited'),
('مركز صحي الوادي والبحيرات', 'طبرجل', 'Accredited'),
('مركز صحي الرفيعة', 'طبرجل', 'Denied'),
('مركز صحي الشويحطية', 'صوير', 'Accredited'),
('مركز صحي زلوم', 'صوير', 'Denied'),
('مركز صحي صوير', 'صوير', 'Accredited'),
('مركز صحي طلعة عمار', 'صوير', 'Denied'),
('مركز صحي هديب', 'صوير', 'Accredited'),
('مركز النيك أبو قصر', 'صوير', 'Accredited'),
('مركز صحي الصالحية', 'صوير', 'Accredited'),
('مركز صحي العزيزية', 'صوير', 'Accredited'),
('مركز صحي المنتزة', 'صوير', 'Accredited'),
('مركز صحي النياح', 'صوير', 'Accredited')
ON CONFLICT DO NOTHING;


INSERT INTO users (id, username, password_hash, full_name, role, allowed_sectors, created_at) VALUES (1, 'admin', '$2b$10$GL9UgHckvFNcdXX.fqiE7.aDl30BsASEcQMS9CepKbeMeKBYXsqsC', 'مدير النظام (Admin)', 'admin', 'All', '2026-04-07T19:37:49.185Z');
INSERT INTO users (id, username, password_hash, full_name, role, allowed_sectors, created_at) VALUES (2, 'manager1', '$2b$10$GL9UgHckvFNcdXX.fqiE7.aDl30BsASEcQMS9CepKbeMeKBYXsqsC', 'د. جينا جوهر', 'manager', 'All', '2026-04-07T19:37:49.185Z');
INSERT INTO users (id, username, password_hash, full_name, role, allowed_sectors, created_at) VALUES (3, 'inspector1', '$2b$10$GL9UgHckvFNcdXX.fqiE7.aDl30BsASEcQMS9CepKbeMeKBYXsqsC', 'أحمد المقيّم', 'inspector', 'سكاكا,دومة الجندل', '2026-04-07T21:24:51.810Z');

INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (3, 'مركز صحي الفيصلية', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (4, 'مركز صحي فياض سكاكا', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (6, 'مركز صحي المعاقلة', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (7, 'مركز صحي المخطط', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (9, 'مركز صحي قارا', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (10, 'مركز صحي الربوة', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (11, 'مركز صحي الشمالي', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (12, 'مركز صحي الشلهوب', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (13, 'مركز صحي السوق والمطر', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (14, 'مركز صحي خوعاء', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (16, 'مركز صحي الطوير', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (17, 'مركز صحي مطار الجوف', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (18, 'مركز صحي صوير', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (19, 'مركز صحي هديب', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (20, 'مركز صحي زلوم', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (21, 'مركز صحي طلعة عمار', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (22, 'مركز صحي الرفيعة', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (23, 'مركز صحي الشويحطية', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (24, 'مركز صحي الملك فهد', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (25, 'مركز صحي الغرب', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (26, 'مركز صحي الصفاه', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (27, 'مركز صحي الوادي والبحيرات', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (28, 'مركز صحي الشقيق', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (29, 'مركز صحي الرديفة', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (30, 'مركز صحي اصفان', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (31, 'مركز صحي الأضارع', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (32, 'مركز صحي ابوعجرم', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (33, 'مركز صحي الشرق', 'دومة الجندل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (34, 'مركز صحي ميقوع', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (35, 'مركز صحي النبك ابوقصر', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (36, 'مركز صحي فياض طبرجل', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (37, 'مركز صحي الصالحية', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (38, 'مركز صحي المنتزه', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (39, 'مركز صحي النباج', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (40, 'مركز صحي حدرج والدعيجاء', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (41, 'مركز صحي العزيزية', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (42, 'مركز صحي الفيصلية', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (43, 'مركز صحي الحماد', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (44, 'مركز صحي جماجم', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (45, 'مركز صحي غطي', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (46, 'مركز صحي الرفاع', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (47, 'مركز صحي قليب خضر', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (48, 'مركز صحي العزيزية', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (49, 'مركز صحي الحديثه', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (50, 'مركز صحي المزارع', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (51, 'مركز صحي الرديفة', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (52, 'مركز صحي حصيده', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (53, 'مركز صحي الحميدية', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (54, 'مركز صحي العقيلة', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (55, 'مركز صحي العيساوية', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (56, 'مركز صحي الغربي', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (57, 'مركز صحي حي المطار', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (58, 'مركز صحي الناصفة', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (61, 'مستشفى النساء والولادة والأطفال', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (63, 'مستشفى أبوعجرم', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (64, 'مستشفى القريات العام', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (65, 'مستشفى صوير', 'صوير', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (66, 'مستشفى طبرجل', 'طبرجل', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (67, 'مستشفى الحديثة', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (68, 'مستشفى الأمل القريات', 'القريات', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (69, 'مستشفى إرادة بالجوف', 'سكاكا', 'Not Visited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (1, 'مركز صحي الزهور', 'سكاكا', 'Accredited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (2, 'مركز صحي شرق اللقائط', 'سكاكا', 'Accredited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (5, 'مركز صحي اللقائط', 'سكاكا', 'Denied', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (59, 'مستشفى الملك عبد العزيز', 'سكاكا', 'Accredited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (60, 'مستشفى الأمير متعب', 'سكاكا', 'Accredited', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (8, 'مركز صحي النفل', 'سكاكا', 'Pending', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (15, 'مركز صحي عذفاء', 'سكاكا', 'Denied', '2026-04-07T22:28:24.633Z');
INSERT INTO centers (id, name, sector, accreditation_status, created_at) VALUES (62, 'مستشفى دومة الجندل', 'دومة الجندل', 'Accredited', '2026-04-07T22:28:24.633Z');

INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (1, 1, 1, '2026-03-09T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 95, 'approved', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (2, 2, 1, '2026-03-11T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 88, 'approved', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (3, 5, 1, '2026-03-14T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 55, 'rejected', NULL, '2026-04-07T22:28:24.633Z', 'لم يتم اعتماد خطة الإخلاء');
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (4, 59, 1, '2026-03-19T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 92, 'approved', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (5, 60, 1, '2026-03-21T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 85, 'approved', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (6, 8, 1, '2026-03-24T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 75, 'pending', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (7, 15, 1, '2026-03-31T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 40, 'rejected', NULL, '2026-04-07T22:28:24.633Z', 'نقص حاد في كادر التمريض');
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (8, 62, 1, '2026-04-04T21:00:00.000Z', 'تقييم دوري', 'نقاط قوة تجريبية', 'تحسينات تجريبية', 98, 'approved', NULL, '2026-04-07T22:28:24.633Z', NULL);
INSERT INTO visits (id, center_id, inspector_id, visit_date, visit_type, strengths, improvements, total_score, status, approved_by, created_at, reject_reason) VALUES (9, 58, 1, '2026-04-06T21:00:00.000Z', 'تقييم دوري', '', '', 89, 'pending', NULL, '2026-04-07T22:33:36.317Z', NULL);

