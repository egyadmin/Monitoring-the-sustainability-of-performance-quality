-- قم بتنفيذ هذا الكود في قاعدة بيانات PostgreSQL
CREATE DATABASE cbahi_db;

\c cbahi_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'inspector', -- admin, manager, inspector
    allowed_sectors TEXT, -- e.g., 'سكاكا,طبرجل' or 'All'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    accreditation_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    center_id INT REFERENCES centers(id) ON DELETE CASCADE,
    inspector_id INT REFERENCES users(id),
    visit_date DATE NOT NULL,
    visit_type VARCHAR(50),
    strengths TEXT,
    improvements TEXT,
    total_score INT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    approved_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visit_scores (
    id SERIAL PRIMARY KEY,
    visit_id INT REFERENCES visits(id) ON DELETE CASCADE,
    criteria_id VARCHAR(50) NOT NULL,
    score VARCHAR(20) NOT NULL
);

-- إدخال المستخدم الافتراضي للإدارة
-- كلمة المرور الافتراضية هي: admin123 
INSERT INTO users (username, password_hash, full_name, role, allowed_sectors) 
VALUES 
('admin', '$2b$10$tZ2cK6qj40c79y8E5Ew52.nZb9b2R6HGHXyK0/W83Wd1xHbN6L/Fm', 'مدير النظام (Admin)', 'admin', 'All'),
('manager1', '$2b$10$tZ2cK6qj40c79y8E5Ew52.nZb9b2R6HGHXyK0/W83Wd1xHbN6L/Fm', 'د. جينا جوهر', 'manager', 'All');

-- المراكز الافتراضية
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
('مركز صحي النياح', 'صوير', 'Accredited');
