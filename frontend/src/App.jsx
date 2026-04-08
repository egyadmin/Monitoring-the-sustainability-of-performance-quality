import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { LogOut, Save, CheckCircle2, User, Lock, Mail, Users, Settings, BarChart2, ShieldCheck, ClipboardList, Trash2, Bell, XCircle, RotateCcw, Send, MoreHorizontal, FileText, Edit3, List, Activity, Award, Shield, TrendingUp, Eye, Calendar, MapPin, Building2, ChevronDown, Sparkles, Target, AlertTriangle, CircleDot, ArrowUpRight, Zap, Heart, Star, Globe2, Briefcase, BookOpen, PlusCircle, Search, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";

const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
const api = async (method, url, data) => {
  const token = localStorage.getItem('cbahi_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  try {
    return await axios({ method, url: `${API}${url}`, data, headers });
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('cbahi_token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    throw error;
  }
};

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

const SECTORS = ['جميع القطاعات','سكاكا','دومة الجندل','القريات','طبرجل','صوير'];

const INIT_CRITERIA = [
  { id:'esr', label:'متطلبات سلامة المرضى', color:'#2C82C9', items:[
    { name:'esr1', label:'HR.2.EC.1 — تخصيص وسيلة تعريف وحيدة', hint:'التحقق من هوية المريض' },
    { name:'esr2', label:'GC.13.EC.1 \u2014 \u062a\u0648\u062b\u064a\u0642 \u0627\u0644\u062d\u0633\u0627\u0633\u064a\u0629', hint:'\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062d\u0633\u0627\u0633\u064a\u0629', icon:'\ud83d\udcdd' },
    { name:'esr3', label:'GC.19.EC.1 \u2014 \u062a\u0648\u062b\u064a\u0642 \u0627\u0644\u062e\u0637\u0629 \u0627\u0644\u0639\u0644\u0627\u062c\u064a\u0629', hint:'\u062e\u0637\u0629 \u0639\u0644\u0627\u062c\u064a\u0629 \u0645\u0633\u062c\u0644\u0629', icon:'\ud83d\udccb' },
    { name:'esr4', label:'PH.14.EC.2 \u2014 \u0627\u0644\u0648\u0635\u0641\u0627\u062a \u0627\u0644\u0637\u0628\u064a\u0629 \u0627\u0644\u0645\u0643\u062a\u0645\u0644\u0629', hint:'\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0643\u0627\u0645\u0644\u0629', icon:'\ud83d\udc8a' },
    { name:'esr5', label:'QM.11.EC.3 \u2014 \u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0623\u0647\u062f\u0627\u0641 \u0627\u0644\u062f\u0648\u0644\u064a\u0629', hint:'\u0627\u0644\u0623\u0647\u062f\u0627\u0641 \u0627\u0644\u062f\u0648\u0644\u064a\u0629 \u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0631\u0636\u0649', icon:'\ud83c\udf10' },
    { name:'esr6', label:'IPC.14.EC.3 \u2014 \u0623\u0645\u0627\u0646 \u0627\u0644\u0646\u0641\u0627\u064a\u0627\u062a \u0627\u0644\u0637\u0628\u064a\u0629', hint:'\u0627\u0644\u062a\u0639\u0627\u0645\u0644 \u0645\u0639 \u0627\u0644\u0646\u0641\u0627\u064a\u0627\u062a', icon:'\u2622\ufe0f' },
    { name:'esr7', label:'IPC.22.EC.3 \u2014 \u0627\u0644\u062a\u0639\u0642\u064a\u0645 \u0623\u062d\u0627\u062f\u064a \u0627\u0644\u0627\u062a\u062c\u0627\u0647', hint:'\u062a\u0639\u0642\u064a\u0645 \u0627\u0644\u0623\u062f\u0648\u0627\u062a', icon:'\ud83e\uddec' },
    { name:'esr8', label:'IPC.22.EC.5 \u2014 \u0643\u0641\u0627\u0621\u0629 \u0627\u0644\u062a\u0639\u0642\u064a\u0645', hint:'\u0645\u0624\u0634\u0631\u0627\u062a \u062d\u064a\u0648\u064a\u0629 \u0648\u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629', icon:'\ud83e\uddea' },
    { name:'esr9', label:'FMS.6.EC.1 \u2014 \u0627\u0644\u062c\u0648\u0644\u0627\u062a \u0627\u0644\u0628\u064a\u0646\u064a\u0629', hint:'\u062c\u0648\u0644\u0627\u062a \u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0645\u0648\u062b\u0642\u0629', icon:'\ud83d\udeb6' },
    { name:'esr10', label:'ES.12.EC.2 \u2014 \u0639\u0631\u0628\u0629 \u0627\u0644\u0637\u0648\u0627\u0631\u0626', hint:'\u062c\u0627\u0647\u0632\u064a\u0629 \u0642\u0633\u0645 \u0627\u0644\u0637\u0648\u0627\u0631\u0626', icon:'\ud83d\ude91' },
    { name:'esr11', label:'FMS.8.EC.1 \u2014 \u0646\u0638\u0627\u0645 \u0627\u0644\u0625\u0646\u0630\u0627\u0631', hint:'\u0625\u0646\u0630\u0627\u0631 \u0627\u0644\u062d\u0631\u064a\u0642', icon:'\ud83d\udea8' },
    { name:'esr12', label:'LB.10.EC.3 \u2014 \u0627\u0644\u0642\u064a\u0645 \u0627\u0644\u0645\u062e\u0628\u0631\u064a\u0629 \u0627\u0644\u062e\u0637\u064a\u0631\u0629', hint:'\u0625\u0628\u0644\u0627\u063a \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0627\u0644\u062d\u0631\u062c\u0629', icon:'\ud83e\ude78' },
    { name:'esr13', label:'FMS.8.EC.6 \u2014 \u0637\u0641\u0627\u064a\u0627\u062a \u0627\u0644\u062d\u0631\u064a\u0642 \u0643\u0627\u0641\u064a\u0629', hint:'\u0635\u0644\u0627\u062d\u064a\u0629 \u0627\u0644\u0637\u0641\u0627\u064a\u0627\u062a', icon:'\ud83e\uddef' },
    { name:'esr14', label:'RS.5.EC.2 \u2014 \u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0645\u0633\u062a\u0641\u064a\u062f\u064a\u0646 \u0645\u0646 \u0627\u0644\u0627\u0634\u0639\u0627\u0639\u0627\u062a', hint:'\u0627\u0644\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0627\u0634\u0639\u0627\u0639\u064a\u0629', icon:'\u2623\ufe0f' },
  ]},
  { id:'meet', label:'\u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u0627\u062a', color:'#D97706', items:[
    { name:'m1', label:'\u0644\u062c\u0646\u0629 \u0627\u0644\u062c\u0648\u062f\u0629', hint:'\u0645\u062d\u0627\u0636\u0631 \u0645\u0648\u062b\u0642\u0629', icon:'\ud83c\udfc5' },
    { name:'m2', label:'\u0627\u0644\u0644\u062c\u0646\u0629 \u0627\u0644\u0641\u0646\u064a\u0629', hint:'\u0642\u0631\u0627\u0631\u0627\u062a \u0641\u0646\u064a\u0629', icon:'\ud83d\udd27' },
    { name:'m3', label:'\u0627\u0644\u0644\u062c\u0646\u0629 \u0627\u0644\u062a\u0646\u0641\u064a\u0630\u064a\u0629', hint:'\u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u062e\u0637\u0637', icon:'\ud83d\udcc8' },
    { name:'m4', label:'\u0644\u062c\u0646\u0629 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629', hint:'\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u062c\u062a\u0645\u0639', icon:'\ud83e\udd1d' },
  ]},
  { id:'pol', label:'الوثائق', color:'#1DB3A4', items:[
    { name:'p1', label:'الوثائق محدثة ومعتمدة', hint:'3 سنوات', icon:'📄' },
    { name:'p2', label:'الوثائق متوفرة لجميع العاملين', hint:'توزيع الوثائق لكل قسم', icon:'✅' },
    { name:'p3', label:'أدلة الامتثال المحدثة', hint:'تحديث الأدلة بشكل دوري', icon:'📱' },
    { name:'p4', label:'التوثيق في السجلات الصحية', hint:'اكتمال التوثيق في رقيم', icon:'🎓' },
  ]},
  { id:'imp', label:'التحسين', color:'#E63946', items:[
    { name:'i1', label:'خطة تحسين سنوية معتمدة', hint:'أهداف SMART تطبيق دورة PDCA', icon:'🎯' },
    { name:'i2', label:'متابعة مؤشرات الأداء KPIs', hint:'تقارير دورية وتحليل', icon:'📊' },
    { name:'i3', label:'بناء قدرات الموظفين', hint:'دورات، محاضرات، ورش عمل لمنهجية التحسين المستمر', icon:'💡' },
    { name:'i4', label:'الإجراءات التصحيحية', hint:'RCA، CAP، OVR', icon:'⚠️' },
  ]}
];

const HOSPITAL_CRITERIA = [
  { id: 'esr_hospital', label: 'المتطلبات الوطنية الأساسية لسلامة المرضى (ESR)', color: '#2C82C9', items: [
    { name: 'h_esr1', label: 'HR.5 — آلية لاعتماد الممارسين الصحيين المؤهلين', hint: 'اعتماد الممارسين', icon: '👨‍⚕️' },
    { name: 'h_esr2', label: 'MS.7 — امتيازات سريرية محددة وسارية للطاقم الطبي', hint: 'الامتيازات السريرية', icon: '📋' },
    { name: 'h_esr3', label: 'PC.25 — سياسات واضحة لعملية نقل الدم ومشتقاته', hint: 'سلامة نقل الدم', icon: '🩸' },
    { name: 'h_esr4', label: 'PC.26 — التعرف على المرضى المعرضين لخطر الجلطات', hint: 'مخاطر الجلطات الوريدية', icon: '🫀' },
    { name: 'h_esr5', label: 'AN.2 — أطباء وفنيو التخدير يمتلكون المؤهلات', hint: 'مؤهلات التخدير', icon: '👨‍🔬' },
    { name: 'h_esr6', label: 'AN.15 — التخدير المتوسط والعميق وتسكين الألم', hint: 'تسكين الألم', icon: '💉' },
    { name: 'h_esr7', label: 'QM.17 — آلية مناسبة لضمان التعرف الصحيح على المرضى', hint: 'تعريف المريض', icon: '🆔' },
    { name: 'h_esr8', label: 'QM.18 — آلية لاتقاء الخطأ في هوية المريض أو الإجراء', hint: 'اتقاء الأخطاء الطبية', icon: '✅' },
    { name: 'h_esr9', label: 'IPC.4 — لجنة متعددة التخصصات لبرنامج مكافحة العدوى', hint: 'لجنة مكافحة العدوى', icon: '🦠' },
    { name: 'h_esr10', label: 'IPC.15 — ممارسات عزل المرضى عند الحاجة', hint: 'غرف العزل', icon: '🚪' },
    { name: 'h_esr11', label: 'MM.5 — نظام لسلامة الأدوية الخطرة', hint: 'الأدوية الخطرة', icon: '☢️' },
    { name: 'h_esr12', label: 'MM.6 — نظام للسلامة من الأدوية المتشابهة (LASA)', hint: 'أدوية متشابهة الشكل/الاسم', icon: '💊' },
    { name: 'h_esr13', label: 'MM.41 — آلية للرصد والتصرف حيال الأخطاء الطبية', hint: 'رصد الأخطاء الجسيمة', icon: '⚠️' },
    { name: 'h_esr14', label: 'LB.51 — بنك الدم مناسب لتجنب انتقال الأمراض', hint: 'بنك الدم', icon: '🔬' },
    { name: 'h_esr15', label: 'FMS.9 — أمن العاملين من أخطار الإشعاعات', hint: 'الحماية من الإشعاع', icon: '☢️' },
    { name: 'h_esr16', label: 'FMS.21 — نظام فعال للإنذار ضد الحريق', hint: 'إنذار الحريق', icon: '🔔' },
    { name: 'h_esr17', label: 'FMS.22 — نظام إخماد حريق فعال في المناطق المطلوبة', hint: 'إخماد الحريق', icon: '🧯' },
    { name: 'h_esr18', label: 'FMS.23 — مخارج الطوارئ متوفرة وموزعة بشكل صحيح', hint: 'مخارج الطوارئ', icon: '🏃‍♂️' },
    { name: 'h_esr19', label: 'FMS.24 — مباني المستشفى ومرافقه بمأمن من الحريق', hint: 'سلامة المباني', icon: '🏢' },
    { name: 'h_esr20', label: 'FMS.32 — الصيانة السليمة لنظام الغازات الطبية', hint: 'الغازات الطبية', icon: '💨' }
  ]}
];

const INIT_USERS = [
  { id: 1, username: 'admin', password: 'admin123', full_name: 'مدير النظام (Admin)', role: 'admin', allowed_sectors: ['All'] },
  { id: 2, username: 'manager', password: 'admin123', full_name: 'د. جينا جوهر', role: 'manager', allowed_sectors: ['All'] },
  { id: 3, username: 'inspector1', password: 'admin123', full_name: 'أحمد المقيّم', role: 'inspector', allowed_sectors: ['سكاكا', 'دومة الجندل'] },
];

function scoreGroup(answers, names) {
  let total = 0, count = 0;
  names.forEach(n => {
    const v = answers[n]; if (!v || v === 'na') return;
    count++; if (v === 'yes') total += 100; else if (v === 'partial') total += 50;
  });
  return count === 0 ? 0 : Math.round(total / count);
}

const getColor = v => v >= 80 ? '#1DB3A4' : v >= 60 ? '#D97706' : '#DC2626';
const getBg = v => v >= 80 ? '#DCFCE7' : v >= 60 ? '#FEF3C7' : '#FEE2E2';

function DonutChart({ data }) {
  const total = data.reduce((s,d) => s+d.value, 0);
  if (total === 0) return <div style={{textAlign:'center',color:'#9CA3AF',padding:20}}>لا توجد بيانات</div>;
  let offset = 0;
  const r = 70, cx = 90, cy = 90, circumference = 2*Math.PI*r;
  const slices = data.map(d => {
    const pct = d.value/total; const stroke = circumference * pct; const gap = circumference * (1 - pct);
    const slice = { ...d, stroke, gap, offset }; offset += stroke; return slice;
  });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth={24}/>
        {slices.map(s => s.value > 0 && (<circle key={s.label} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={24} strokeDasharray={`${s.stroke} ${s.gap}`} strokeDashoffset={circumference/4 - s.offset} />))}
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={13} fill="#6B7280" fontFamily="Tajawal">الإجمالي</text>
        <text x={cx} y={cy+16} textAnchor="middle" fontSize={20} fontWeight="900" fill="#0A2540" fontFamily="Tajawal">{total}</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map(d => (
          <div key={d.label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:d.color }}/>
            <span style={{ fontWeight:600, color:'#374151' }}>{d.label}</span>
            <span style={{ fontWeight:900, color:d.color }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: 'center', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
        <h2 style={{ color: '#DC2626' }}>⚠️ حدث خطأ في النظام</h2>
        <p style={{ color: '#6B7280' }}>{this.state.error?.message}</p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '12px 24px', background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}>🔄 إعادة تعيين وتحديث</button>
      </div>
    );
    return this.props.children;
  }
}

function AppInner() {
  const safeLoad = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e) { localStorage.removeItem(key); return fallback; } };
  const [usersDb, setUsersDb] = useState(() => safeLoad('cbahi_users', INIT_USERS));
  const [criteriaDb, setCriteriaDb] = useState(() => {
    const ver = localStorage.getItem('cbahi_ver');
    if(ver !== 'v6') { localStorage.removeItem('cbahi_criteria'); localStorage.setItem('cbahi_ver','v6'); return INIT_CRITERIA; }
    return safeLoad('cbahi_criteria', INIT_CRITERIA);
  });
  const [visitsDb, setVisitsDb] = useState(() => safeLoad('cbahi_visits', []));
  const [notifications, setNotifications] = useState(() => safeLoad('cbahi_notifs', []));
  const [showNotifs, setShowNotifs] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [editingVisit, setEditingVisit] = useState(null);
  const [editCriteria, setEditCriteria] = useState(null);
  const [editUserPw, setEditUserPw] = useState(null);
  const [newPw, setNewPw] = useState('');
  const [editingStandardId, setEditingStandardId] = useState(null);
  const [editingStandardValue, setEditingStandardValue] = useState('');
  
  const [user, setUser] = useState(() => safeLoad('user', null));
  const [loginForm, setLoginForm] = useState({ username:'', password:'' });
  const [loginError, setLoginError] = useState('');
  const [editUserName, setEditUserName] = useState(null);
  const [newName, setNewName] = useState('');
  
  useEffect(()=>{ localStorage.setItem('cbahi_users', JSON.stringify(usersDb)); }, [usersDb]);
  useEffect(()=>{ localStorage.setItem('cbahi_criteria', JSON.stringify(criteriaDb)); }, [criteriaDb]);
  useEffect(()=>{ localStorage.setItem('cbahi_visits', JSON.stringify(visitsDb)); }, [visitsDb]);
  useEffect(()=>{ localStorage.setItem('cbahi_notifs', JSON.stringify(notifications)); }, [notifications]);

  const addNotif = (to, msg, type='info') => setNotifications(p=>[{id:Date.now(), to, msg, type, read:false, time:new Date().toLocaleString('ar-SA')}, ...p]);
  const myNotifs = notifications;
  const unreadCount = myNotifs.filter(n=>!(n.read || n.is_read)).length;
  const markAllRead = async () => {
    setNotifications(p=>p.map(n=>({...n, read:true, is_read:true})));
    try { await api('put', '/notifications/read'); } catch(e) {}
  };
  const reloadNotifications = async () => {
    try { const r = await api('get', '/notifications'); setNotifications(r.data || []); } catch(e) {}
  };

  const [tab, setTab] = useState(() => localStorage.getItem('cbahi_tab') || 'form');
  const [sector, setSector] = useState(() => localStorage.getItem('cbahi_sector') || '');
  const [center, setCenter] = useState(() => localStorage.getItem('cbahi_center') || '');
  const currentCenterTypeHosp = initialCenters.find(c=>c.name===center)?.isHospital;
  const activeCriteria = currentCenterTypeHosp ? HOSPITAL_CRITERIA : criteriaDb;

  const [formData, setFormData] = useState(() => safeLoad('cbahi_formdata', { date: new Date().toISOString().split('T')[0], inspector:'', manager:'', strengths:'', improvements:'' }));
  const [answers, setAnswers] = useState(() => safeLoad('cbahi_answers', {}));
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [compareType, setCompareType] = useState('phc');
  const [facType, setFacType] = useState('All');
  const [facStatus, setFacStatus] = useState('All');
  const [searchFac, setSearchFac] = useState('');

  useEffect(()=>{ localStorage.setItem('cbahi_answers', JSON.stringify(answers)); }, [answers]);
  useEffect(()=>{ localStorage.setItem('cbahi_center', center); }, [center]);
  useEffect(()=>{ localStorage.setItem('cbahi_sector', sector); }, [sector]);
  useEffect(()=>{ localStorage.setItem('cbahi_tab', tab); }, [tab]);
  useEffect(()=>{ localStorage.setItem('cbahi_formdata', JSON.stringify(formData)); }, [formData]);

  // Users Admin states
  const [newUser, setNewUser] = useState({ username:'', password:'', full_name:'', role:'inspector', allowed_sectors:'' });

  const filteredCenters = sector ? initialCenters.filter(c=>c.sector===sector) : initialCenters;
  const userRole = user?.role;
  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';
  
  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await axios.post(`${API}/login`, { username: loginForm.username, password: loginForm.password });
      const { token, user: u } = res.data;
      localStorage.setItem('cbahi_token', token);
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setFormData(p => ({...p, inspector: u.full_name}));
      setTab('form');
      // Load data from DB
      try {
        const [visitsRes, notifsRes] = await Promise.all([
          api('get', '/visits'),
          api('get', '/notifications')
        ]);
        setVisitsDb(visitsRes.data || []);
        setNotifications(notifsRes.data || []);
      } catch(e) { console.log('Data load:', e.message); }
    } catch (err) {
      setLoginError(err.response?.data?.error || 'بيانات الدخول غير صحيحة!');
    }
  };
  
  const logout = () => { localStorage.removeItem('user'); localStorage.removeItem('cbahi_token'); setUser(null); };

  // Load visits & notifications on startup if user exists
  useEffect(() => {
    if (user && localStorage.getItem('cbahi_token')) {
      api('get', '/visits').then(r => setVisitsDb(r.data || [])).catch(() => {});
      api('get', '/notifications').then(r => setNotifications(r.data || [])).catch(() => {});
    }
  }, [user?.id]);

  const calcScores = () => {
    const scores = {}; let allVals = [];
    activeCriteria.forEach(cr => {
      const names = cr.items.map(i=>i.name);
      scores[cr.id] = scoreGroup(answers, names);
      allVals.push(scores[cr.id]);
    });
    scores.total = allVals.length ? Math.round(allVals.reduce((a,b)=>a+b,0)/allVals.length) : 0;
    return scores;
  };
  const sc = calcScores();

  const handleSaveVisit = async () => {
    if(!center) return alert("الرجاء اختيار المركز!");
    try {
      // Find center_id from initialCenters list (use index+1 as DB id)
      const centerIdx = initialCenters.findIndex(c => c.name === center);
      const centerId = centerIdx >= 0 ? centerIdx + 1 : 1;
      await api('post', '/visits', {
        center_id: centerId,
        visit_date: formData.date,
        visit_type: 'تقييم دوري',
        strengths: formData.strengths,
        improvements: formData.improvements,
        total_score: sc.total,
        answers: {...answers}
      });
      // Reload visits from DB
      const visitsRes = await api('get', '/visits');
      setVisitsDb(visitsRes.data || []);
      alert("✅ تم الحفظ في قاعدة البيانات وإرسال إشعار للمديرة للاعتماد.");
      setTab('analytics');
    } catch(err) {
      console.error('Save error:', err);
      alert("❌ حدث خطأ في الحفظ: " + (err.response?.data?.error || err.message));
    }
  };

  const approveVisit = async (vid) => {
    try {
      await api('put', `/visits/${vid}/approve`);
      const visitsRes = await api('get', '/visits');
      setVisitsDb(visitsRes.data || []);
      await reloadNotifications();
      alert("✅ تم الاعتماد بنجاح");
    } catch(e) { alert("خطأ في الاعتماد"); }
  };

  const rejectVisit = async () => {
    if(!rejectModal || !rejectReason.trim()) return;
    try {
      await api('put', `/visits/${rejectModal}/reject`, { reason: rejectReason });
      const visitsRes = await api('get', '/visits');
      setVisitsDb(visitsRes.data || []);
      setRejectModal(null); setRejectReason('');
      await reloadNotifications();
      alert("تم الرفض");
    } catch(e) { alert("خطأ في الرفض"); }
  };

  const resubmitVisit = async (vid) => {
    try {
      await api('put', `/visits/${vid}/resubmit`);
      const visitsRes = await api('get', '/visits');
      setVisitsDb(visitsRes.data || []);
      setTab('form');
    } catch(e) { alert("خطأ"); }
  };

  const deleteVisit = (vid) => {
    if(confirm('متأكد من الحذف؟')) setVisitsDb(p => p.filter(v => v.id !== vid));
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api('post', '/users', { ...newUser });
      setNewUser({ username:'', password:'', full_name:'', role:'inspector', allowed_sectors:'' });
      alert("✅ تم إضافة المستخدم بنجاح!");
      const usersRes = await api('get', '/users');
      setUsersDb(usersRes.data || []);
    } catch(err) { alert("❌ خطأ: " + (err.response?.data?.error || err.message)); }
  };

  const deleteCriteriaGroup = (id) => setCriteriaDb(p=>p.filter(c=>c.id!==id));
  const updateCriteriaItem = (groupId, itemName, newLabel) => {
    setCriteriaDb(p => p.map(g => g.id === groupId ? {...g, items: g.items.map(i => i.name === itemName ? {...i, label: newLabel} : i)} : g));
  };
  const deleteUser = async (uid) => {
    if(confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await api('delete', `/users/${uid}`);
        const usersRes = await api('get', '/users');
        setUsersDb(usersRes.data || []);
      } catch(e) { alert("خطأ في حذف المستخدم"); }
    }
  };
  const changePassword = async (uid) => {
    if(newPw.trim()) {
      try {
        await api('put', `/users/${uid}/password`, { password: newPw });
        setEditUserPw(null); setNewPw('');
        alert('✅ تم تغيير كلمة المرور بنجاح');
      } catch(e) { alert("خطأ"); }
    }
  };

  const changeName = async (uid) => {
    if(newName.trim()) {
      try {
        await api('put', `/users/${uid}/name`, { full_name: newName });
        const usersRes = await api('get', '/users');
        setUsersDb(usersRes.data || []);
        setEditUserName(null); setNewName('');
        alert('✅ تم تغيير الاسم بنجاح');
      } catch(e) { alert("خطأ في تغيير الاسم"); }
    }
  };

  const exportEmail = () => {
     const sub = encodeURIComponent(`تقرير تقييم - ${center}`);
     const body = encodeURIComponent(`سعادة المديرة / د. جينا جوهر\n\nنرفق لكم تقرير مبدئي للزيارة الخاصة بـ ${center}:\nنسبة الامتثال: ${sc.total}%\nالمفتش: ${formData.inspector}\n\nنرجو مراجعة النظام للاعتماد.`);
     window.location.href = `mailto:manager@jouf.health?subject=${sub}&body=${body}`;
  };

  const exportExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportPDF = async () => {
    const el = document.querySelector('.print-area');
    if (!el) return;
    try {
      // Force white background for the capture
      const originalBg = el.style.background;
      el.style.background = '#ffffff';
      
      const canvas = await html2canvas(el, { 
        scale: 2, 
        useCORS: true,
        logging: false
      });
      el.style.background = originalBg;
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`تقرير_${center ? center.replace(/\s+/g,'_') : 'المنشأة'}.pdf`);
    } catch(err) {
      alert("حدث خطأ في تصدير التقرير يرجى المحاولة مرة أخرى.");
      console.error(err);
    }
  };

  if(!user) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(160deg, #FFFFFF 0%, #E0F2FE 30%, #BAE6FD 60%, #7DD3FC 100%)', direction:'rtl', position:'relative', overflow:'hidden' }}>
       {/* Background decorations matching logo palette */}
       <div style={{ position:'absolute', top:'-5%', right:'-5%', width:400, height:400, background:'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', borderRadius:'50%' }}></div>
       <div style={{ position:'absolute', bottom:'-10%', left:'-5%', width:500, height:500, background:'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', borderRadius:'50%' }}></div>
       <div style={{ position:'absolute', top:'40%', left:'30%', width:200, height:200, background:'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', borderRadius:'50%' }}></div>

       <div style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(24px)', padding:'48px 40px', borderRadius:28, width:'90%', maxWidth:440, boxShadow:'0 24px 64px rgba(14,165,233,0.15), 0 0 0 1px rgba(255,255,255,0.5)', border:'1px solid rgba(186,230,253,0.4)', position:'relative', animation:'scaleIn 0.5s ease' }}>
           
           {/* Top accent bar */}
           <div style={{ position:'absolute', top:-1, left:-1, right:-1, height:4, background:'linear-gradient(90deg, #38BDF8, #0EA5E9, #0284C7)', borderRadius:'28px 28px 0 0' }}></div>

           <div style={{ textAlign:'center', marginBottom:32 }}>
               {/* Large clear logo */}
               <div style={{ marginBottom:20 }}>
                 <img src="/logo.png" alt="تجمع الجوف الصحي" style={{ width:'100%', maxWidth:340, height:'auto', objectFit:'contain', mixBlendMode:'multiply' }} onError={(e)=>e.target.style.display='none'}/>
               </div>
               <h2 style={{ margin:'0 0 8px', color:'#0C4A6E', fontSize:22, fontWeight:900, lineHeight:1.4 }}>متابعة استدامة جودة الأداء والامتثال للمعايير</h2>
               <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                 <div style={{ width:32, height:2, background:'linear-gradient(90deg, transparent, #0EA5E9)', borderRadius:2 }}></div>
                 <p style={{ margin:0, color:'#64748B', fontSize:12, fontWeight:700 }}>قسم الجودة والاعتماد</p>
                 <div style={{ width:32, height:2, background:'linear-gradient(90deg, #0EA5E9, transparent)', borderRadius:2 }}></div>
               </div>
           </div>
           {loginError && <div style={{ background:'linear-gradient(135deg, #FEF2F2, #FEE2E2)', color:'#DC2626', padding:'12px 16px', borderRadius:12, marginBottom:20, fontSize:13, fontWeight:700, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:8, border:'1px solid #FECACA' }}><AlertTriangle size={16}/>{loginError}</div>}
           <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:20 }}>
               <div>
                   <label style={{ display:'block', fontSize:12, fontWeight:800, color:'#334155', marginBottom:8, letterSpacing:0.3 }}>اسم المستخدم</label>
                   <div style={{ position:'relative' }}>
                     <User size={18} style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }}/>
                     <input value={loginForm.username} onChange={e=>setLoginForm({...loginForm, username:e.target.value})} placeholder="أدخل اسم المستخدم" style={{ width:'100%', padding:'14px 48px 14px 16px', borderRadius:14, border:'2px solid #E2E8F0', fontSize:14, fontFamily:'Tajawal', background:'#F8FAFC', transition:'all 0.3s' }} required />
                   </div>
               </div>
               <div>
                   <label style={{ display:'block', fontSize:12, fontWeight:800, color:'#334155', marginBottom:8, letterSpacing:0.3 }}>كلمة المرور</label>
                   <div style={{ position:'relative' }}>
                     <Lock size={18} style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }}/>
                     <input type="password" value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})} placeholder="••••••••" style={{ width:'100%', padding:'14px 48px 14px 16px', borderRadius:14, border:'2px solid #E2E8F0', fontSize:14, fontFamily:'Tajawal', background:'#F8FAFC', transition:'all 0.3s' }} required />
                   </div>
               </div>
               <button type="submit" style={{ background:'linear-gradient(135deg, #0EA5E9, #0284C7)', color:'#fff', padding:'16px', borderRadius:14, fontSize:15, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 6px 20px rgba(14,165,233,0.35)', transition:'all 0.3s', letterSpacing:0.5 }}><Shield size={18}/> تسجيل الدخول</button>
           </form>
           
           {/* Bottom branding */}
           <div style={{ textAlign:'center', marginTop:24, paddingTop:20, borderTop:'1px solid #E2E8F0' }}>
             <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:'#94A3B8', fontSize:11, fontWeight:600 }}>
               <Globe2 size={13}/> تجمع الجوف الصحي — {new Date().getFullYear()}
             </div>
           </div>
       </div>
    </div>
  );

  const TABS = [
    { id:'about', label:'نبذة عن القسم', icon:<BookOpen size={18}/>, show:true },
    { id:'form', label:'التقييم', icon:<ClipboardList size={18}/>, show:true },
    { id:'analytics', label:'التحليل', icon:<Activity size={18}/>, show:true },
    { id:'compare', label:'المقارنة', icon:<TrendingUp size={18}/>, show:true },
    { id:'reports', label:'التقارير', icon:<FileText size={18}/>, show:true },
    { id:'approvals', label:'الاعتمادات', icon:<Award size={18}/>, show: isManagerOrAdmin },
    { id:'manage', label:'المعايير', icon:<Target size={18}/>, show: userRole === 'admin' },
    { id:'users', label:'المستخدمين', icon:<Users size={18}/>, show: userRole === 'admin' },
    { id:'more', label:'حسابي', icon:<Briefcase size={18}/>, show:true }
  ];

  const allowedSectors = (user?.allowed_sectors || []).includes('All') ? SECTORS : SECTORS.filter(s => (user?.allowed_sectors || []).includes(s) || s==='جميع القطاعات');
  const dChartData = [{label:'ممتاز',value:activeCriteria.filter(c=>sc[c.id]>=80).length,color:'#1DB3A4'},{label:'جزئي',value:activeCriteria.filter(c=>sc[c.id]>=60&&sc[c.id]<80).length,color:'#D97706'},{label:'ضعيف',value:activeCriteria.filter(c=>sc[c.id]<60).length,color:'#DC2626'}];

  return (
    <div style={{ fontFamily:'Tajawal,sans-serif', direction:'rtl', background:'#F1F5F9', minHeight:'100vh', color:'#0F172A', position:'relative', overflow:'hidden' }}>
      
      {/* Background Logo Watermark */}
      <div style={{ position:'fixed', top:'15%', left:'-15%', width:'80vw', maxWidth:'600px', height:'80vw', maxHeight:'600px', backgroundImage:'url(/logo.png)', opacity:0.04, zIndex:0, pointerEvents:'none', backgroundSize:'contain', backgroundRepeat:'no-repeat', filter:'grayscale(100%) blur(1px)' }} />
      <div style={{ position:'fixed', bottom:'-5%', right:'-10%', width:'50vw', maxWidth:'400px', height:'50vw', maxHeight:'400px', backgroundImage:'url(/logo.png)', opacity:0.03, zIndex:0, pointerEvents:'none', backgroundSize:'contain', backgroundRepeat:'no-repeat', filter:'grayscale(100%) blur(1px)' }} />

      {/* Premium Header */}
      <div className="mobile-header" style={{ position:'relative', zIndex:1000, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(24px)', borderBottom:'none', boxShadow:'0 1px 0 rgba(13,148,136,0.08), 0 8px 32px rgba(0,0,0,0.04)' }}>
        {/* Top accent gradient bar */}
        <div style={{ height:3, background:'linear-gradient(90deg, #0D9488, #14B8A6, #0EA5E9, #0D9488)', backgroundSize:'200% 100%', animation:'gradient-shift 4s ease infinite' }}></div>
        <div style={{ padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* Logo Cell — unified card */}
          <div className="header-logo-cell" onClick={()=>setTab('form')} style={{ display:'flex', alignItems:'center', gap:12, background:'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(14,165,233,0.03))', border:'1px solid rgba(13,148,136,0.12)', borderRadius:16, padding:'8px 16px 8px 20px', cursor:'pointer', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position:'relative', overflow:'hidden', zIndex:2 }}>
            {/* Subtle shimmer accent */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'100%', background:'linear-gradient(135deg, transparent 40%, rgba(13,148,136,0.03) 50%, transparent 60%)', pointerEvents:'none' }}></div>
            <div style={{ position:'relative', width:42, height:42, borderRadius:12, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.08)', flexShrink:0, overflow:'hidden' }}>
              <img className="header-logo" src="/logo.png" alt="تجمع الجوف الصحي" style={{ width:34, height:34, objectFit:'contain' }} onError={(e)=>e.target.style.display='none'}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:1 }}>
              <div className="header-title" style={{ color:'#0F172A', fontSize:14, fontWeight:900, lineHeight:1.3, letterSpacing:-0.2 }}>نظام استدامة الأداء</div>
              <div className="header-subtitle" style={{ color:'#0D9488', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', gap:4, letterSpacing:0.2 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#14B8A6', display:'inline-block', animation:'pulse-dot 2.5s infinite' }}></span>
                تجمع الجوف الصحي
              </div>
            </div>
          </div>
          {/* Right controls — matching card style */}
          <div className="header-right" style={{ display:'flex', alignItems:'center', gap:8, zIndex:2 }}>
            <div style={{ position:'relative' }}>
              <button onClick={()=>{setShowNotifs(!showNotifs);markAllRead();}} style={{ background:'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(14,165,233,0.03))', border:'1px solid rgba(13,148,136,0.12)', cursor:'pointer', position:'relative', padding:10, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s', width:42, height:42 }}><Bell size={18} color="#0D9488"/>{unreadCount>0&&<span style={{ position:'absolute', top:-4, right:-4, background:'linear-gradient(135deg, #EF4444, #DC2626)', color:'#fff', borderRadius:'50%', width:18, height:18, fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff', boxShadow:'0 2px 6px rgba(239,68,68,0.4)' }}>{unreadCount}</span>}</button>
              {showNotifs && <div className="notif-dropdown">
                <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontWeight:800, fontSize:13, color:'#0F172A', display:'flex', justifyContent:'space-between', alignItems:'center' }}><span style={{display:'flex',alignItems:'center',gap:6}}><Bell size={15} color="#0D9488"/> الإشعارات ({myNotifs.length})</span><button onClick={()=>setShowNotifs(false)} style={{ background:'#F1F5F9', border:'none', cursor:'pointer', color:'#94A3B8', padding:4, borderRadius:8 }}><XCircle size={16}/></button></div>
                {myNotifs.length===0?<div style={{ padding:40, textAlign:'center', color:'#94A3B8', fontSize:12 }}><Bell size={28} color="#E2E8F0" style={{marginBottom:10}}/><br/>لا توجد إشعارات جديدة</div>:myNotifs.slice(0,10).map(n=>(<div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid #F8FAFC', fontSize:12, transition:'all 0.2s' }}><div style={{ fontWeight:700, color:n.type==='approved'?'#10B981':n.type==='rejected'?'#EF4444':'#0F172A', lineHeight:1.6 }}>{n.msg||n.message}</div><div style={{ color:'#94A3B8', fontSize:9, marginTop:4, display:'flex', alignItems:'center', gap:4 }}><Calendar size={10}/>{n.time||new Date(n.created_at).toLocaleString('ar-SA')}</div></div>))}
              </div>}
            </div>
            <div className="header-user" style={{ color:'#0F172A', fontSize:12, fontWeight:800, background:'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(14,165,233,0.03))', padding:'5px 8px 5px 14px', borderRadius:14, display:'flex', alignItems:'center', gap:8, border:'1px solid rgba(13,148,136,0.12)', height:42, transition:'all 0.3s' }}>
              <span className="hide-on-print header-user-name" style={{ fontSize:12, fontWeight:800, color:'#334155' }}>{user.full_name?.split(' ')[0]}</span>
              <div style={{ width:30, height:30, borderRadius:10, background:'linear-gradient(135deg, #0D9488, #14B8A6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff', boxShadow:'0 2px 8px rgba(13,148,136,0.3)', flexShrink:0 }}>{user.full_name?.charAt(0)}</div>
            </div>
            <button className="desktop-nav" onClick={logout} style={{ background:'linear-gradient(135deg, rgba(239,68,68,0.04), rgba(239,68,68,0.06))', color:'#EF4444', padding:10, borderRadius:12, border:'1px solid rgba(239,68,68,0.12)', cursor:'pointer', width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s' }}><LogOut size={18}/></button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar">
        <div style={{ padding:'24px 16px 20px', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ background:'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))', padding:14, borderRadius:20, display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:14, border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', width:100, height:100 }}>
            <img src="/logo.png" alt="Logo" style={{ width:'100%', height:'100%', objectFit:'contain', borderRadius:12, filter:'brightness(1.1) drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }} onError={e=>e.target.style.display='none'}/>
          </div>
          <div style={{ fontSize:15, fontWeight:900, color:'#E2E8F0', letterSpacing:-0.3, lineHeight:1.5 }}>متابعة استدامة جودة الأداء</div>
          <div style={{ fontSize:11, color:'#94A3B8', fontWeight:700, marginTop:6, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#14B8A6', boxShadow:'0 0 8px #14B8A6' }}></div>تجمع الجوف الصحي</div>
        </div>
        <nav style={{ padding:'14px 6px', flex:1 }}>
          {TABS.filter(t=>t.show && t.id !== 'more').map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`sidebar-btn ${tab===t.id?'active':''}`}>{t.icon}<span>{t.label}</span></button>
          ))}
        </nav>
        {/* Sidebar user info */}
        <div style={{ padding:'14px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'rgba(255,255,255,0.04)', borderRadius:12, marginBottom:8 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg, #0D9488, #14B8A6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', flexShrink:0 }}>{user.full_name?.charAt(0)}</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ color:'#E2E8F0', fontSize:12, fontWeight:800, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.full_name}</div>
              <div style={{ color:'#64748B', fontSize:10, fontWeight:600 }}>{user.role === 'admin' ? 'مدير النظام' : user.role === 'manager' ? 'مدير' : 'مقيّم'}</div>
            </div>
          </div>
          <button onClick={logout} className="sidebar-btn" style={{ color:'#EF4444' }}><LogOut size={18}/><span>تسجيل الخروج</span></button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="mobile-nav">
        {[
          { id: 'analytics', label: 'التحليل', icon: <Activity size={20}/> },
          { id: 'compare', label: 'المقارنة', icon: <TrendingUp size={20}/> },
          { id: 'form', isFab: true },
          { id: 'reports', label: 'التقارير', icon: <FileText size={20}/> },
          { id: 'more', label: 'المزيد', icon: <MoreHorizontal size={20}/> }
        ].map(t => {
          if(t.isFab) return (
            <div key="fab-group" className="mobile-fab-container">
              <button onClick={()=>setTab('form')} className={`mobile-fab ${tab==='form'?'active':''}`}><ClipboardList size={24}/></button>
            </div>
          );
          return <button key={t.id} onClick={()=>setTab(t.id)} className={`mobile-nav-btn ${tab===t.id || (!['analytics','compare','reports','form'].includes(tab) && t.id==='more') ?'active':''}`}>{t.icon}<span>{t.label}</span></button>;
        })}
      </div>

      <div className="main-content" style={{ padding:'24px', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} style={{ width: '100%', minHeight: '100%' }}>
        {tab === 'more' && (
          <div style={{ animation:'fadeIn 0.3s', maxWidth: 900, margin: '0 auto', width: '100%' }}>
            {/* User Info Card */}
            <div style={{ background:'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius:20, padding:'32px 24px', color:'#fff', marginBottom:20, textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'0 10px 30px rgba(0,0,0,0.1)' }}>
               <div style={{ position:'absolute', top:-20, left:-20, width:100, height:100, background:'rgba(255,255,255,0.03)', borderRadius:20, transform:'rotate(45deg)' }}></div>
               <div style={{ position:'absolute', bottom:-20, right:-20, width:80, height:80, background:'rgba(20,184,166,0.1)', borderRadius:'50%' }}></div>
               
               <div style={{ position:'relative', zIndex:1 }}>
                 <div style={{ width:72, height:72, borderRadius:20, background:'linear-gradient(135deg, #0D9488, #14B8A6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:900, margin:'0 auto 16px', border:'4px solid rgba(255,255,255,0.1)' }}>{user.full_name?.charAt(0)}</div>
                 <h2 style={{ margin:'0 0 6px', fontSize:20, fontWeight:900, color:'#fff' }}>{user.full_name}</h2>
                 <div style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', padding:'4px 12px', borderRadius:20, color:'#E2E8F0', fontSize:12, fontWeight:700 }}>{user.role === 'admin' ? 'مدير النظام' : user.role === 'manager' ? 'مدير' : 'مقيّم'}</div>
               </div>
            </div>

            {/* Menu Items */}
            <div style={{ background:'#fff', borderRadius:20, padding:12, border:'1px solid #E2E8F0', boxShadow:'0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ padding:'0 12px 12px', fontSize:13, fontWeight:800, color:'#94A3B8', borderBottom:'1px solid #F1F5F9', marginBottom:8, marginTop:8 }}>القائمة الإضافية</div>
              {TABS.filter(t => t.show && !['analytics', 'compare', 'reports', 'form', 'more'].includes(t.id)).map((t, idx, arr) => (
                <button key={t.id} onClick={()=>setTab(t.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'16px 12px', background:'transparent', border:'none', borderBottom:idx<arr.length-1?'1px solid #F8FAFC':'none', fontSize:15, fontWeight:800, color:'#0F172A', cursor:'pointer', transition:'all 0.2s' }}>
                  <div style={{ background:'rgba(13,148,136,0.1)', color:'#0D9488', padding:10, borderRadius:12, display:'flex' }}>{t.icon}</div>
                  <div style={{ flex:1, textAlign:'right' }}>{t.label}</div>
                  <div style={{ color:'#CBD5E1', transform:'rotate(90deg)', display:'flex' }}><ChevronDown size={18}/></div>
                </button>
              ))}
              
              <div style={{ height:1, background:'#F1F5F9', margin:'8px 0' }} />
              
              <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'16px 12px', background:'transparent', border:'none', fontSize:15, fontWeight:800, color:'#DC2626', cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ background:'rgba(220,38,38,0.1)', color:'#DC2626', padding:10, borderRadius:12, display:'flex' }}><LogOut size={18}/></div>
                <div style={{ flex:1, textAlign:'right' }}>تسجيل الخروج</div>
              </button>
            </div>
          </div>
        )}

        {tab === 'form' && (
          <div style={{ background:'#fff', borderRadius:20, padding:28, boxShadow:'0 4px 24px rgba(0,0,0,0.04)', border:'1px solid #E2E8F0', animation:'fadeIn 0.3s' }}>
             
             {/* Clean Hero Banner */}
             <div style={{ width:'100%', borderRadius:18, overflow:'hidden', marginBottom:28, position:'relative', background:'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0D9488 100%)', padding:'32px 28px' }}>
               <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, border:'20px solid rgba(255,255,255,0.03)', borderRadius:'50%' }}></div>
               <div style={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, background:'rgba(255,255,255,0.03)', borderRadius:20, transform:'rotate(45deg)' }}></div>
               <div style={{ position:'absolute', top:'20%', left:'8%', width:10, height:10, background:'#14B8A6', borderRadius:'50%', boxShadow:'0 0 12px #14B8A6', animation:'pulse-dot 3s infinite' }}></div>
               
               <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                 <div>
                   <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                     <div style={{ background:'rgba(13,148,136,0.2)', padding:8, borderRadius:10 }}><Award size={20} color="#14B8A6"/></div>
                     <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>نموذج التقييم الميداني</span>
                   </div>
                   <h2 style={{ color:'#fff', fontSize:22, fontWeight:900, margin:0, lineHeight:1.4 }}>تقييم جودة الأداء والامتثال</h2>
                   <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, margin:'8px 0 0', fontWeight:600 }}>قم بتعبئة جميع المعايير لإكمال التقييم</p>
                 </div>
                 <div style={{ background:'rgba(255,255,255,0.08)', padding:'16px 24px', borderRadius:16, textAlign:'center', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.06)' }}>
                   <div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>{sc.total}%</div>
                   <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>نسبة الامتثال</div>
                 </div>
               </div>
             </div>

             <h3 style={{ margin:'0 0 20px', color:'#0F172A', fontSize:17, display:'flex', alignItems:'center', gap:10 }}><div style={{ background:'linear-gradient(135deg, #0D9488, #14B8A6)', padding:8, borderRadius:10, display:'flex' }}><ClipboardList size={18} color="#fff"/></div> بيانات نموذج التقييم</h3>
             <div className="grid-responsive" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}><label style={{ fontSize:11, fontWeight:800, color:'#64748B', letterSpacing:0.3, display:'flex', alignItems:'center', gap:5 }}><MapPin size={13} color="#0D9488"/>القطاع</label><select value={sector} onChange={e=>setSector(e.target.value)} style={{ padding:'12px 14px', borderRadius:12, border:'2px solid #E2E8F0', background:'#F8FAFC', fontFamily:'Tajawal', outline:'none', fontSize:13, fontWeight:600 }}>{allowedSectors.map(s=><option key={s}>{s}</option>)}</select></div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}><label style={{ fontSize:11, fontWeight:800, color:'#64748B', letterSpacing:0.3, display:'flex', alignItems:'center', gap:5 }}><Building2 size={13} color="#0D9488"/>المنشأة الصحية</label><select value={center} onChange={e=>{setCenter(e.target.value); setAnswers({});}} style={{ padding:'12px 14px', borderRadius:12, border:'2px solid #E2E8F0', background:'#F8FAFC', fontFamily:'Tajawal', outline:'none', fontSize:13, fontWeight:600 }}><option value="">اختر المنشأة...</option>{filteredCenters.map(c=><option key={c.name}>{c.name}</option>)}</select></div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}><label style={{ fontSize:11, fontWeight:800, color:'#64748B', letterSpacing:0.3, display:'flex', alignItems:'center', gap:5 }}><User size={13} color="#0D9488"/>المقيّم</label><input type="text" value={formData.inspector} readOnly style={{ padding:'12px 14px', borderRadius:12, border:'2px solid #E2E8F0', background:'#F1F5F9', fontFamily:'Tajawal', outline:'none', color:'#94A3B8', fontSize:13 }}/></div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}><label style={{ fontSize:11, fontWeight:800, color:'#64748B', letterSpacing:0.3, display:'flex', alignItems:'center', gap:5 }}><Calendar size={13} color="#0D9488"/>التاريخ</label><input type="date" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} style={{ padding:'12px 14px', borderRadius:12, border:'2px solid #E2E8F0', background:'#F8FAFC', fontFamily:'Tajawal', outline:'none', fontSize:13, fontWeight:600 }}/></div>
             </div>

             {activeCriteria.map(cr=>(
                <div key={cr.id} style={{ background:'#fff', borderRadius:16, marginBottom:18, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.04)', border:'1px solid #E2E8F0' }}>
                   <div style={{ background:'linear-gradient(135deg, #0F172A, #1E293B)', padding:'16px 20px', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                     <span style={{ fontSize:14, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}><Star size={16} color="#F59E0B"/>{cr.label}</span>
                     <span style={{ background:getColor(sc[cr.id]), padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:800, color:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>{sc[cr.id]}%</span>
                   </div>
                   <div style={{ padding:'6px 16px' }}>
                     {cr.items.map((item, index)=>(
                       <div key={item.name} style={{ padding:'16px 0', borderBottom:index<cr.items.length-1?'1px solid #F1F5F9':'none' }}>
                          <div style={{ marginBottom:14 }}>
                            <div style={{ fontWeight:800, fontSize:13, color:'#0F172A', display:'flex', alignItems:'center', gap:6 }}>{item.icon && <span style={{fontSize:16}}>{item.icon}</span>}<CircleDot size={14} color="#0D9488"/>{item.label}</div>
                            <div style={{ fontSize:11, color:'#94A3B8', marginTop:4, paddingRight:20 }}>{item.hint}</div>
                          </div>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, direction:'rtl' }}>
                            {['yes','partial','no','na'].map(v=>(
                               <button key={v} onClick={()=>setAnswers(p=>({...p, [item.name]:answers[item.name]===v?'':v}))} 
                                 style={{ padding:'11px 0', borderRadius:12, 
                                 background:answers[item.name]===v?(v==='yes'?'#ECFDF5':v==='partial'?'#FFFBEB':v==='no'?'#FEF2F2':'#F1F5F9'):'#F8FAFC', 
                                 color:answers[item.name]===v?(v==='yes'?'#059669':v==='partial'?'#D97706':v==='no'?'#DC2626':'#475569'):'#94A3B8', 
                                 border:`2px solid ${answers[item.name]===v?(v==='yes'?'#059669':v==='partial'?'#D97706':v==='no'?'#DC2626':'#94A3B8'):'#F1F5F9'}`, 
                                 fontWeight:800, fontSize:12, cursor:'pointer', transition:'all 0.2s', display:'flex', justifyContent:'center', alignItems:'center', gap:5 }}>
                                 {v==='yes'?<><CheckCircle2 size={14}/> مطابق</>:v==='partial'?<><Zap size={14}/> جزئي</>:v==='no'?<><XCircle size={14}/> غير مطابق</>:'غير مطبق'}
                               </button>
                            ))}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
             ))}
             <button onClick={handleSaveVisit} style={{ background:'linear-gradient(135deg, #0D9488, #0F766E)', boxShadow:'0 6px 20px rgba(13,148,136,0.4)', color:'#fff', padding:'18px 24px', borderRadius:16, fontWeight:900, border:'none', width:'100%', fontSize:16, cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginTop:12, letterSpacing:0.3, transition:'all 0.3s' }}><Send size={20}/> إرسال تقرير التقييم</button>
          </div>
        )}

        {tab === 'analytics' && (
          <div style={{ animation:'fadeIn 0.3s' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:10, marginBottom:20 }}>
              <div style={{ background:'#fff', padding:'20px 14px', borderRadius:16, border:'1px solid #E5E7EB', textAlign:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize:28, fontWeight:900, color:getColor(sc.total) }}>{sc.total}%</div><div style={{ fontSize:12, color:'#6B7280', fontWeight:800, marginTop:4 }}>النتيجة الكلية</div>
              </div>
              {criteriaDb.slice(0,3).map(cr => (
                <div key={cr.id} style={{ background:'#fff', padding:'20px 14px', borderRadius:16, border:'1px solid #E5E7EB', textAlign:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.02)' }}>
                   <div style={{ fontSize:22, fontWeight:900, color:getColor(sc[cr.id]) }}>{sc[cr.id]}%</div><div style={{ fontSize:12, color:'#6B7280', fontWeight:800, marginTop:4 }}>{cr.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:20, marginBottom:20 }}>
               <div style={{ background:'#fff', borderRadius:16, padding:24, border:'1px solid #E5E7EB', boxShadow:'0 4px 12px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ margin:'0 0 20px', fontSize:15, color:'#0A2540', display:'flex', alignItems:'center', gap:8 }}><BarChart2 size={18} color="#1DB3A4"/> توزيع مستويات الامتثال</h3>
                  <DonutChart data={dChartData} />
               </div>
               <div style={{ background:'#fff', borderRadius:16, padding:24, border:'1px solid #E5E7EB', boxShadow:'0 4px 12px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ margin:'0 0 20px', fontSize:15, color:'#0A2540', display:'flex', alignItems:'center', gap:8 }}><Settings size={18} color="#D97706"/> تحليل الامتثال لكل محور</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {activeCriteria.map(cr => (
                      <div key={cr.id}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:800, marginBottom:6, color:'#374151' }}><span>{cr.label}</span><span style={{ color:getColor(sc[cr.id]) }}>{sc[cr.id]}%</span></div>
                        <div style={{ height:8, background:'#F3F4F6', borderRadius:4, overflow:'hidden' }}><div style={{ width:`${sc[cr.id]}%`, height:'100%', background:cr.color, borderRadius:4, transition:'width 1s' }}/></div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            <div style={{ background:'#0A2540', borderRadius:16, padding:24, color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, boxShadow:'0 10px 25px rgba(10,37,64,0.3)' }}>
              <div>
                <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:900 }}>جاهز لإصدار التقرير؟</h3>
                <p style={{ margin:0, fontSize:13, color:'rgba(255,255,255,0.7)' }}>يمكنك الآن الانتقال لتبويب التقارير ومعاينة التقرير النهائي وتوليد صورة للمشاركة.</p>
              </div>
              <button onClick={()=>setTab('reports')} style={{ background:'#1DB3A4', color:'#fff', padding:'12px 24px', borderRadius:10, fontWeight:800, border:'none', cursor:'pointer', display:'flex', gap:8, alignItems:'center' }}><FileText size={18}/> عرض التقرير</button>
            </div>
          </div>
        )}

        {tab === 'approvals' && isManagerOrAdmin && (
          <div style={{ animation:'fadeIn 0.3s' }}>
             <h3 style={{ margin:'0 0 20px', color:'#0A2540', fontSize:18, display:'flex', alignItems:'center', gap:8 }}><ShieldCheck size={22} color="#1DB3A4"/> الاعتمادات والمراجعات</h3>
             {visitsDb.length === 0 ? (
               <div style={{ background:'#fff', borderRadius:16, padding:60, textAlign:'center', border:'1px solid #E5E7EB' }}>
                 <CheckCircle2 size={48} color="#E5E7EB" style={{ marginBottom:12 }}/>
                 <div style={{ color:'#9CA3AF', fontSize:15, fontWeight:700 }}>لا توجد تقارير معلقة</div>
                 <div style={{ color:'#D1D5DB', fontSize:12, marginTop:6 }}>عند رفع المقيّمين لتقاريرهم ستظهر هنا</div>
               </div>
             ) : visitsDb.map(v => (
               <div key={v.id} style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:14, border:`2px solid ${v.status==='approved'?'#86EFAC':v.status==='rejected'?'#FCA5A5':'#FDE68A'}`, boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
                 <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:8 }}>
                   <div style={{ flex:1 }}>
                     <div style={{ fontWeight:800, fontSize:15, color:'#0A2540' }}>{v.center}</div>
                     <div style={{ fontSize:12, color:'#6B7280', marginTop:6, lineHeight:1.8 }}>📍 {v.sector} &nbsp; 📅 {v.date} &nbsp; 👤 {v.inspector}</div>
                   </div>
                   <div style={{ textAlign:'center' }}>
                     <div style={{ fontSize:28, fontWeight:900, color:getColor(v.total_score ?? v.scores?.total ?? 0) }}>{v.total_score ?? v.scores?.total ?? 0}%</div>
                     <span style={{ padding:'4px 12px', borderRadius:20, fontSize:10, fontWeight:800, background:v.status==='approved'?'#DCFCE7':v.status==='rejected'?'#FEE2E2':'#FEF3C7', color:v.status==='approved'?'#16A34A':v.status==='rejected'?'#DC2626':'#D97706' }}>{v.status==='approved'?'✅ معتمد':v.status==='rejected'?'❌ مرفوض':'⏳ انتظار'}</span>
                   </div>
                 </div>
                 {v.status==='rejected' && v.reject_reason && <div style={{ marginTop:10, padding:10, background:'#FEF2F2', borderRadius:8, fontSize:12, color:'#DC2626' }}>💬 {v.reject_reason}</div>}
                 <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                   {v.status==='pending' && <button onClick={()=>approveVisit(v.id)} style={{ flex:1, padding:'10px', background:'#1DB3A4', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:13 }}>✅ اعتماد</button>}
                   {v.status==='pending' && <button onClick={()=>setRejectModal(v.id)} style={{ flex:1, padding:'10px', background:'#DC2626', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:13 }}>❌ رفض</button>}
                   {userRole==='admin' && <button onClick={()=>deleteVisit(v.id)} style={{ padding:'10px 16px', background:'#F4F6FA', color:'#9CA3AF', border:'none', borderRadius:10, cursor:'pointer' }}><Trash2 size={14}/></button>}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Modal رفض التقرير */}
        {rejectModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setRejectModal(null)}>
            <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, padding:32, width:'90%', maxWidth:440, boxShadow:'0 20px 50px rgba(0,0,0,0.3)' }}>
              <h3 style={{ margin:'0 0 16px', color:'#DC2626', display:'flex', alignItems:'center', gap:8 }}><XCircle size={22}/> رفض التقرير مع ذكر الأسباب</h3>
              <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} placeholder="اكتب أسباب الرفض والنقاط المطلوب تصحيحها..." rows={4} style={{ width:'100%', padding:14, borderRadius:12, border:'2px solid #FCA5A5', fontFamily:'Tajawal', fontSize:14, resize:'vertical', outline:'none' }}/>
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button onClick={rejectVisit} disabled={!rejectReason.trim()} style={{ flex:1, padding:14, background:rejectReason.trim()?'#DC2626':'#E5E7EB', color:'#fff', border:'none', borderRadius:12, fontWeight:800, cursor:rejectReason.trim()?'pointer':'not-allowed' }}>إرسال الرفض للمقيّم</button>
                <button onClick={()=>setRejectModal(null)} style={{ padding:'14px 20px', background:'#F4F6FA', color:'#374151', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer' }}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* التقارير المرفوضة للمفتش */}
        {tab === 'analytics' && userRole === 'inspector' && visitsDb.filter(v=>v.inspectorUser===user.username && v.status==='rejected').length > 0 && (
          <div style={{ background:'#fff', borderRadius:16, padding:24, marginTop:24, border:'2px solid #FCA5A5' }}>
            <h3 style={{ margin:'0 0 16px', color:'#DC2626', display:'flex', alignItems:'center', gap:8 }}><RotateCcw size={20}/> تقارير مرفوضة — مطلوب تعديلها وإعادة إرسالها</h3>
            {visitsDb.filter(v=>v.inspectorUser===user.username && v.status==='rejected').map(v=>(
              <div key={v.id} style={{ background:'#FEF2F2', padding:16, borderRadius:12, marginBottom:12 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>{v.center} — {v.date}</div>
                <div style={{ color:'#DC2626', fontSize:13, margin:'8px 0', padding:10, background:'#fff', borderRadius:8, border:'1px solid #FCA5A5' }}>💬 سبب الرفض: <b>{v.reject_reason}</b></div>
                <button onClick={()=>resubmitVisit(v.id)} style={{ padding:'10px 20px', background:'#D97706', color:'#fff', border:'none', borderRadius:10, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}><RotateCcw size={16}/> تعديل وإعادة إرسال</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && userRole === 'admin' && (
          <div style={{ animation:'fadeIn 0.3s' }}>
             <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.03)', border:'1px solid #E5E7EB' }}>
                <h3 style={{ margin:'0 0 20px' }}>👥 إضافة مقيّم/مستخدم جديد</h3>
                <form onSubmit={createUser} className="grid-responsive" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, alignItems:'flex-end' }}>
                   <div style={{ display:'flex', flexDirection:'column', gap:6 }}><label style={{ fontSize:12, fontWeight:700 }}>اسم الموظف</label><input value={newUser.full_name} onChange={e=>setNewUser({...newUser, full_name:e.target.value})} style={{ padding:12, borderRadius:8, border:'1px solid #E5E7EB', fontFamily:'Tajawal' }} required/></div>
                   <div style={{ display:'flex', flexDirection:'column', gap:6 }}><label style={{ fontSize:12, fontWeight:700 }}>اسم المستخدم</label><input value={newUser.username} onChange={e=>setNewUser({...newUser, username:e.target.value})} style={{ padding:12, borderRadius:8, border:'1px solid #E5E7EB', fontFamily:'Tajawal' }} required/></div>
                   <div style={{ display:'flex', flexDirection:'column', gap:6 }}><label style={{ fontSize:12, fontWeight:700 }}>كلمةالمرور</label><input type="password" value={newUser.password} onChange={e=>setNewUser({...newUser, password:e.target.value})} style={{ padding:12, borderRadius:8, border:'1px solid #E5E7EB', fontFamily:'Tajawal' }} required/></div>
                   <div style={{ display:'flex', flexDirection:'column', gap:6 }}><label style={{ fontSize:12, fontWeight:700 }}>الدور</label><select value={newUser.role} onChange={e=>setNewUser({...newUser, role:e.target.value})} style={{ padding:12, borderRadius:8, border:'1px solid #E5E7EB', fontFamily:'Tajawal' }}><option value="inspector">مقيّم (Evaluator)</option><option value="manager">مدير (Manager)</option></select></div>
                   <div style={{ display:'flex', flexDirection:'column', gap:6, gridColumn:'1 / -1' }}>
                     <label style={{ fontSize:12, fontWeight:700 }}>القطاعات المسموحة (اختر قطاع أو أكثر)</label>
                     <div style={{ display:'flex', gap:10, flexWrap:'wrap', padding:12, borderRadius:8, border:'1px solid #E5E7EB', background:'#F8FAFC' }}>
                       {['All', ...new Set(initialCenters.map(c=>c.sector))].map(sec => (
                         <label key={sec} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:20, background:newUser.allowed_sectors.includes(sec)?'#0D9488':'#fff', color:newUser.allowed_sectors.includes(sec)?'#fff':'#64748B', border:`1px solid ${newUser.allowed_sectors.includes(sec)?'#0D9488':'#E2E8F0'}`, cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.2s' }}>
                           <input type="checkbox" style={{ display:'none' }} checked={newUser.allowed_sectors.includes(sec)} onChange={e => {
                             let arr = newUser.allowed_sectors.split(',').map(s=>s.trim()).filter(Boolean);
                             if(e.target.checked) { if(sec==='All') arr=['All']; else { arr=arr.filter(a=>a!=='All'); arr.push(sec); } }
                             else arr = arr.filter(s=>s!==sec);
                             setNewUser({...newUser, allowed_sectors: arr.length?arr.join(','):''});
                           }} />
                           {sec === 'All' ? 'الكل' : sec}
                         </label>
                       ))}
                     </div>
                   </div>
                   <button style={{ padding:12, background:'#0A2540', color:'#fff', borderRadius:8, border:'none', cursor:'pointer', fontWeight:800 }}>+ حفظ</button>
                </form>
             </div>
             
             <div style={{ marginTop:24 }}>
                <h3 style={{ margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }}><Users size={20} color="#0A2540"/> القائمة الحالية للمستخدمين</h3>
                {usersDb.map(u => (
                  <div key={u.id} style={{ background:'#fff', borderRadius:14, padding:16, marginBottom:12, border:'1px solid #E5E7EB', boxShadow:'0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                      <div style={{ flex:1, minWidth:150 }}>
                        <div style={{ fontWeight:800, fontSize:14, color:'#0A2540' }}>{u.full_name}</div>
                        <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>@{u.username} • {u.role === 'admin' ? 'مدير النظام' : u.role === 'manager' ? 'مدير' : 'مقيّم'} • {u.allowed_sectors.join(', ')}</div>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>{setEditUserName(editUserName===u.id?null:u.id); setNewName(u.full_name); setEditUserPw(null);}} style={{ padding:'6px 12px', background:'rgba(59,130,246,0.1)', color:'#3B82F6', border:'none', borderRadius:8, cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}><Settings size={12}/> تعديل الاسم</button>
                        <button onClick={()=>{setEditUserPw(editUserPw===u.id?null:u.id); setNewPw(''); setEditUserName(null);}} style={{ padding:'6px 12px', background:'rgba(29,179,164,0.1)', color:'#1DB3A4', border:'none', borderRadius:8, cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}><Settings size={12}/> كلمة المرور</button>
                        {u.username !== 'admin' && <button onClick={()=>deleteUser(u.id)} style={{ padding:'6px 12px', background:'rgba(220,38,38,0.1)', color:'#DC2626', border:'none', borderRadius:8, cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}><Trash2 size={12}/> حذف</button>}
                      </div>
                    </div>
                    {editUserPw === u.id && (
                      <div style={{ display:'flex', gap:8, marginTop:10, background:'#F0FDF4', padding:12, borderRadius:10 }}>
                        <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="كلمة المرور الجديدة" style={{ flex:1, padding:10, borderRadius:8, border:'1px solid #86EFAC', fontFamily:'Tajawal', fontSize:13 }}/>
                        <button onClick={()=>changePassword(u.id)} disabled={!newPw.trim()} style={{ padding:'10px 16px', background:newPw.trim()?'#1DB3A4':'#E5E7EB', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:newPw.trim()?'pointer':'not-allowed', fontSize:12 }}>حفظ</button>
                      </div>
                    )}
                    {editUserName === u.id && (
                      <div style={{ display:'flex', gap:8, marginTop:10, background:'#EFF6FF', padding:12, borderRadius:10 }}>
                        <input type="text" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="الاسم بالعربي الجديد" style={{ flex:1, padding:10, borderRadius:8, border:'1px solid #93C5FD', fontFamily:'Tajawal', fontSize:13 }}/>
                        <button onClick={()=>changeName(u.id)} disabled={!newName.trim()} style={{ padding:'10px 16px', background:newName.trim()?'#3B82F6':'#E5E7EB', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:newName.trim()?'pointer':'not-allowed', fontSize:12 }}>حفظ</button>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === 'manage' && userRole === 'admin' && (
          <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.03)', border:'1px solid #E5E7EB', animation:'fadeIn 0.3s' }}>
             <h3 style={{ margin:'0 0 20px', color:'#0A2540', fontSize:18, display:'flex', alignItems:'center', gap:8 }}><Settings size={22} color="#1DB3A4"/> الإدارة الشاملة للمعايير</h3>
             <p style={{ color:'#6B7280', fontSize:13, marginBottom:24 }}>يمكنك حذف المعايير الموجودة أو تخصيصها. هذه اللوحة مخفية عن بقية المستخدمين.</p>
             {criteriaDb.map(cr=>(
               <div key={cr.id} style={{ border:'1px solid #E5E7EB', borderRadius:12, marginBottom:16, overflow:'hidden' }}>
                 <div style={{ background:'#0A2540', padding:'12px 16px', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                   <div style={{ fontWeight:800 }}>{cr.label} <span style={{ fontSize:11, opacity:0.6 }}>({cr.items.length} بند)</span></div>
                   <button onClick={()=>deleteCriteriaGroup(cr.id)} style={{ background:'transparent', border:'none', color:'#FCA5A5', cursor:'pointer' }}><Trash2 size={16}/></button>
                 </div>
                 <div style={{ padding:16 }}>
                   {cr.items.map((item, index)=>(
                     <div key={item.name} style={{ padding:'12px 0', borderBottom:index<cr.items.length-1?'1px dashed #E5E7EB':'none', fontSize:13, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                       {editingStandardId === item.name ? (
                         <div style={{ flex:1, display:'flex', gap:8, alignItems:'center' }}>
                           <span style={{ fontWeight:800, color:'#1DB3A4' }}>{item.name}</span>
                           <input type="text" value={editingStandardValue} onChange={e=>setEditingStandardValue(e.target.value)} style={{ flex:1, padding:'8px 12px', border:'2px solid #1DB3A4', borderRadius:8, fontFamily:'Cairo', fontSize:13, outline:'none' }} autoFocus />
                         </div>
                       ) : (
                         <div style={{ flex:1 }}><span style={{ fontWeight:800, color:'#1DB3A4' }}>{item.name}</span> — {item.label}</div>
                       )}
                       <div style={{ display:'flex', gap:6 }}>
                         {editingStandardId === item.name ? (
                           <>
                             <button onClick={()=>{
                               if(editingStandardValue.trim()) setCriteriaDb(prev => prev.map(c => c.id===cr.id ? {...c, items:c.items.map(i=>i.name===item.name?{...i,label:editingStandardValue.trim()}:i)} : c));
                               setEditingStandardId(null);
                             }} style={{ background:'rgba(22,163,74,0.1)', color:'#16A34A', border:'none', padding:'6px 12px', borderRadius:8, cursor:'pointer', display:'flex', gap:4, alignItems:'center', fontSize:11, fontWeight:800 }}><CheckCircle2 size={12}/> حفظ</button>
                             <button onClick={()=>setEditingStandardId(null)} style={{ background:'rgba(107,114,128,0.1)', color:'#6B7280', border:'none', padding:'6px 12px', borderRadius:8, cursor:'pointer', fontSize:11, fontWeight:800 }}>إلغاء</button>
                           </>
                         ) : (
                           <button onClick={()=>{
                             setEditingStandardId(item.name); setEditingStandardValue(item.label);
                           }} style={{ background:'rgba(217,119,6,0.1)', color:'#D97706', border:'none', padding:'6px 12px', borderRadius:8, cursor:'pointer', display:'flex', gap:4, alignItems:'center', fontSize:11, fontWeight:800 }}><Edit3 size={12}/> تعديل</button>
                         )}
                         <button onClick={()=>{
                           if(window.confirm('تأكيد حذف البند؟')) setCriteriaDb(prev => prev.map(c => c.id===cr.id ? {...c, items:c.items.filter(i=>i.name!==item.name)} : c));
                         }} style={{ background:'rgba(220,38,38,0.1)', color:'#DC2626', border:'none', padding:'6px 12px', borderRadius:8, cursor:'pointer', display:'flex', gap:4, alignItems:'center', fontSize:11, fontWeight:800 }}><Trash2 size={12}/> حذف</button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}

        {tab === 'compare' && (() => {
          // Facility List Logic (states moved to component level)

          const getLatestVisit = (cname) => {
            const v = visitsDb.filter(vi => (vi.center_name || vi.center) === cname);
            return v.length ? v.sort((a,b)=>new Date(b.visit_date||b.date) - new Date(a.visit_date||a.date))[0] : null;
          };

          let stats = { accredited:0, rejected:0, unvisited:0 };
          
          const enrichedCenters = initialCenters.map(c => {
             const lv = getLatestVisit(c.name);
             let status = 'لم يُزر';
             if(lv) { status = lv.status === 'approved' ? 'معتمد' : (lv.status === 'rejected' ? 'مرفوض' : 'لم يُزر'); }
             if(status==='معتمد') stats.accredited++;
             else if(status==='مرفوض') stats.rejected++;
             else stats.unvisited++;

             return { ...c, lastVisit: lv, status };
          });

          const filteredCenters = enrichedCenters.filter(c => {
             if(facType === 'Hospitals' && !c.isHospital) return false;
             if(facType === 'Centers' && c.isHospital) return false;
             if(facStatus !== 'All' && c.status !== (facStatus === 'Accredited' ? 'معتمد' : facStatus === 'Rejected' ? 'مرفوض' : 'لم يُزر')) return false;
             if(searchFac && !c.name.includes(searchFac)) return false;
             return true;
          });

          return (
          <div style={{ animation:'fadeIn 0.3s', width: '100%' }}>
            <div style={{ background:'#fff', borderRadius:20, padding:28, border:'1px solid #E2E8F0', boxShadow:'0 10px 40px rgba(0,0,0,0.04)' }}>
               
               {/* Header */}
               <div style={{ textAlign:'center', marginBottom:28 }}>
                 <h2 style={{ fontSize:24, fontWeight:900, color:'#0F172A', margin:'0 0 8px' }}>قائمة المنشآت الصحية</h2>
                 <p style={{ color:'#64748B', fontSize:14, margin:0, fontWeight:600 }}>{initialCenters.length} منشأة — اختر منشأة للتحقق من امتثالها</p>
               </div>

               {/* Stats Cards */}
               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:28 }}>
                 <div style={{ background:'#F8FAFC', border:'2px solid #E2E8F0', borderRadius:16, padding:16, textAlign:'center' }}>
                   <div style={{ display:'flex', justifyContent:'center', marginBottom:6, color:'#94A3B8' }}><Calendar size={22}/></div>
                   <div style={{ fontSize:22, fontWeight:900, color:'#0F172A' }}>{stats.unvisited}</div>
                   <div style={{ fontSize:12, fontWeight:800, color:'#94A3B8', marginTop:4 }}>لم يُزر</div>
                 </div>
                 <div style={{ background:'#FEF2F2', border:'2px solid #FCA5A5', borderRadius:16, padding:16, textAlign:'center' }}>
                   <div style={{ display:'flex', justifyContent:'center', marginBottom:6, color:'#EF4444' }}><XCircle size={22}/></div>
                   <div style={{ fontSize:22, fontWeight:900, color:'#EF4444' }}>{stats.rejected}</div>
                   <div style={{ fontSize:12, fontWeight:800, color:'#EF4444', marginTop:4 }}>مرفوض</div>
                 </div>
                 <div style={{ background:'#F0FDF4', border:'2px solid #86EFAC', borderRadius:16, padding:16, textAlign:'center' }}>
                   <div style={{ display:'flex', justifyContent:'center', marginBottom:6, color:'#10B981' }}><CheckCircle2 size={22}/></div>
                   <div style={{ fontSize:22, fontWeight:900, color:'#10B981' }}>{stats.accredited}</div>
                   <div style={{ fontSize:12, fontWeight:800, color:'#10B981', marginTop:4 }}>معتمد</div>
                 </div>
               </div>

               {/* Search */}
               <div style={{ position:'relative', marginBottom:20 }}>
                 <input value={searchFac} onChange={e=>setSearchFac(e.target.value)} placeholder="ابحث عن منشأة..." style={{ width:'100%', padding:'16px 20px', borderRadius:14, border:'2px solid #E2E8F0', background:'#fff', outline:'none', fontFamily:'Tajawal', fontSize:14, fontWeight:600, color:'#333', paddingRight:48 }} />
                 <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', color:'#94A3B8' }}><Search size={20}/></div>
               </div>

               {/* Chips */}
               <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                 <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                    {['All', 'Accredited', 'Rejected', 'Unvisited'].map(s => (
                      <button key={s} onClick={()=>setFacStatus(s)} style={{ padding:'8px 16px', borderRadius:20, border:'none', background:facStatus===s?'#0F172A':'#F1F5F9', color:facStatus===s?'#fff':'#64748B', fontWeight:800, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>{s==='All'?'الكل':s==='Accredited'?'معتمد':s==='Rejected'?'مرفوض':'لم يُزر'}</button>
                    ))}
                 </div>
                 <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
                    {['All', 'Hospitals', 'Centers'].map(t => (
                      <button key={t} onClick={()=>setFacType(t)} style={{ padding:'8px 16px', borderRadius:20, border:'none', background:facType===t?'#16A34A':'#F1F5F9', color:facType===t?'#fff':'#64748B', fontWeight:800, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>{t==='All'?'الكل':t==='Hospitals'?'مستشفيات':'مراكز'}</button>
                    ))}
                 </div>
               </div>

               {/* Facility List */}
               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                 {filteredCenters.map((c, idx) => (
                   <div key={idx} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:'#fff', borderRadius:16, border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                        <div style={{ background:'rgba(13,148,136,0.1)', padding:12, borderRadius:12, color:'#0D9488' }}><Building2 size={24}/></div>
                        <div>
                          <div style={{ fontWeight:900, color:'#0F172A', fontSize:15, marginBottom:4 }}>{c.name}</div>
                          <div style={{ fontSize:12, color:'#94A3B8', fontWeight:700 }}>{c.lastVisit ? (c.lastVisit.visit_date||c.lastVisit.date).split('T')[0] : 'لم يُقيّم'}</div>
                        </div>
                      </div>
                      <div style={{ padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:800, background:c.status==='معتمد'?'#ECFDF5':c.status==='مرفوض'?'#FEF2F2':'#F1F5F9', color:c.status==='معتمد'?'#059669':c.status==='مرفوض'?'#DC2626':'#64748B' }}>{c.status}</div>
                   </div>
                 ))}
                 {filteredCenters.length === 0 && (
                   <div style={{ textAlign:'center', padding:40, color:'#9CA3AF', fontSize:14, fontWeight:700 }}>لم نجد منشآت مطابقة للبحث أو الفلتر...</div>
                 )}
               </div>

            </div>
          </div>
          );
        })()}

        {tab === 'about' && (
          <div style={{ animation:'fadeIn 0.3s', width: '100%' }}>
            {/* Hero Card */}
            <div style={{ background:'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0D9488 100%)', borderRadius:24, padding:'36px 32px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden', boxShadow:'0 16px 48px rgba(15,23,42,0.25)' }}>
              <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, border:'30px solid rgba(255,255,255,0.03)', borderRadius:'50%' }}></div>
              <div style={{ position:'absolute', bottom:-30, left:-20, width:120, height:120, background:'rgba(20,184,166,0.08)', borderRadius:24, transform:'rotate(45deg)' }}></div>
              <div style={{ position:'absolute', top:'30%', left:'10%', width:8, height:8, background:'#14B8A6', borderRadius:'50%', boxShadow:'0 0 12px #14B8A6', animation:'pulse-dot 3s infinite' }}></div>
              <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
                <div style={{ background:'rgba(13,148,136,0.15)', display:'inline-flex', padding:16, borderRadius:20, marginBottom:16, border:'1px solid rgba(20,184,166,0.2)' }}><BookOpen size={32} color="#14B8A6"/></div>
                <h2 style={{ fontSize:26, fontWeight:900, margin:'0 0 8px', lineHeight:1.4 }}>قسم الاستدامة والالتزام بالاعتماد</h2>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14, margin:0, fontWeight:700 }}>استدامة جودة الأداء والامتثال للمعايير</p>
              </div>
            </div>

            {/* Mission Card */}
            <div style={{ background:'#fff', borderRadius:20, padding:28, border:'1px solid #E2E8F0', boxShadow:'0 4px 20px rgba(0,0,0,0.03)', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ background:'linear-gradient(135deg, #0D9488, #14B8A6)', padding:10, borderRadius:14, display:'flex' }}><Target size={20} color="#fff"/></div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:'#0F172A' }}>مهام القسم</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { icon: <ClipboardList size={18}/>, text: 'تنفيذ التقييمات والزيارات الميدانية للاعتماد', color: '#0D9488' },
                  { icon: <FileText size={18}/>, text: 'توثيق الملاحظات وإعداد تقارير الزيارة', color: '#0EA5E9' },
                  { icon: <RotateCcw size={18}/>, text: 'متابعة تنفيذ الإجراءات التصحيحية ميدانيًا بعد الزيارات', color: '#D97706' },
                  { icon: <Users size={18}/>, text: 'التنسيق مع فرق المنشآت أثناء مراحل الاعتماد', color: '#8B5CF6' },
                  { icon: <Shield size={18}/>, text: 'دعم جاهزية المنشآت خلال فترات الزيارات الرسمية', color: '#059669' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'#F8FAFC', borderRadius:14, border:'1px solid #F1F5F9', transition:'all 0.2s' }}>
                    <div style={{ background:`${item.color}15`, color:item.color, padding:10, borderRadius:12, display:'flex', flexShrink:0 }}>{item.icon}</div>
                    <span style={{ fontSize:14, fontWeight:700, color:'#1E293B', lineHeight:1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scope Card */}
            <div style={{ background:'#fff', borderRadius:20, padding:28, border:'1px solid #E2E8F0', boxShadow:'0 4px 20px rgba(0,0,0,0.03)', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ background:'linear-gradient(135deg, #0EA5E9, #38BDF8)', padding:10, borderRadius:14, display:'flex' }}><Globe2 size={20} color="#fff"/></div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:'#0F172A' }}>نطاق العمل</h3>
              </div>
              <p style={{ fontSize:15, fontWeight:700, color:'#334155', lineHeight:1.8, margin:'0 0 20px', background:'linear-gradient(135deg, rgba(14,165,233,0.04), rgba(13,148,136,0.03))', padding:'16px 20px', borderRadius:14, border:'1px solid rgba(14,165,233,0.1)' }}>
                يشمل نطاق عمل القسم <strong style={{ color:'#0D9488' }}>جميع المنشآت الصحية</strong> التابعة لتجمع الجوف الصحي بما يشمل:
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12 }}>
                {[
                  { label: 'المستشفيات', icon: '🏥', count: initialCenters.filter(c=>c.isHospital).length },
                  { label: 'المراكز الأولية', icon: '🏨', count: initialCenters.filter(c=>!c.isHospital).length },
                  { label: 'القطاعات', icon: '📍', count: [...new Set(initialCenters.map(c=>c.sector))].length },
                  { label: 'إجمالي المنشآت', icon: '📊', count: initialCenters.length },
                ].map((item, idx) => (
                  <div key={idx} style={{ background:'#F8FAFC', borderRadius:16, padding:'20px 14px', textAlign:'center', border:'1px solid #F1F5F9' }}>
                    <div style={{ fontSize:28, marginBottom:6 }}>{item.icon}</div>
                    <div style={{ fontSize:24, fontWeight:900, color:'#0F172A', marginBottom:4 }}>{item.count}</div>
                    <div style={{ fontSize:11, fontWeight:800, color:'#64748B' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors Breakdown */}
            <div style={{ background:'#fff', borderRadius:20, padding:28, border:'1px solid #E2E8F0', boxShadow:'0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ background:'linear-gradient(135deg, #8B5CF6, #A78BFA)', padding:10, borderRadius:14, display:'flex' }}><MapPin size={20} color="#fff"/></div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:'#0F172A' }}>توزيع المنشآت حسب القطاع</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[...new Set(initialCenters.map(c=>c.sector))].map(sec => {
                  const count = initialCenters.filter(c=>c.sector===sec).length;
                  const pct = Math.round((count/initialCenters.length)*100);
                  return (
                    <div key={sec} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:'#F8FAFC', borderRadius:14, border:'1px solid #F1F5F9' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                          <span style={{ fontWeight:800, fontSize:14, color:'#0F172A' }}>{sec}</span>
                          <span style={{ fontWeight:900, fontSize:13, color:'#0D9488' }}>{count} منشأة</span>
                        </div>
                        <div style={{ height:6, background:'#E2E8F0', borderRadius:3, overflow:'hidden' }}>
                          <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg, #0D9488, #14B8A6)', borderRadius:3, transition:'width 1s ease' }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div style={{ animation:'fadeIn 0.3s' }}>
            {/* Export Actions */}
            <div className="hide-on-print" style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              <button onClick={exportPDF} style={{ flex:1, background:'linear-gradient(135deg, #0F172A, #1E293B)', color:'#fff', padding:'14px 24px', borderRadius:14, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:14, boxShadow:'0 4px 16px rgba(15,23,42,0.3)' }}><FileText size={18}/> PDF</button>
              <button onClick={() => exportExcel(filteredVisits, 'تقرير_الزيارات')} style={{ flex:1, background:'linear-gradient(135deg, #10B981, #059669)', color:'#fff', padding:'14px 24px', borderRadius:14, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:14, boxShadow:'0 4px 16px rgba(16,185,129,0.3)' }}><Download size={18}/> تصدير (Excel)</button>
              <button onClick={()=>window.print()} style={{ background:'#F1F5F9', color:'#0F172A', padding:'14px 24px', borderRadius:14, fontWeight:800, border:'2px solid #E2E8F0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:14 }}><FileText size={18}/> طباعة</button>
              <button onClick={exportEmail} style={{ flex:1, background:'linear-gradient(135deg, #0D9488, #0F766E)', color:'#fff', padding:'14px 24px', borderRadius:14, fontWeight:800, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:14 }}><Send size={18}/> إرسال إيميل</button>
            </div>

            <div className="print-area" style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1px solid #E2E8F0', boxShadow:'0 4px 24px rgba(0,0,0,0.04)' }}>
               
               {/* Report Header */}
               <div style={{ background:'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0D9488 100%)', padding:'28px 30px', color:'#fff', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, border:'20px solid rgba(255,255,255,0.03)', borderRadius:'50%' }}></div>
                  <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
                     <div style={{ flex:1 }}>
                       <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:800, letterSpacing:1.5, marginBottom:4 }}>تجمع الجوف الصحي — قسم الجودة والاعتماد</div>
                       <h2 style={{ fontSize:22, margin:'0 0 6px', fontWeight:900 }}>تقرير التقييم الميداني</h2>
                       <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700 }}>رئيس قسم الاستدامة والإلتزام: المقيّم {formData.inspector || '-'}</div>
                     </div>
                     <div style={{ background:'rgba(255,255,255,0.08)', padding:'16px 28px', borderRadius:16, textAlign:'center', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.06)' }}>
                       <div style={{ fontSize:36, fontWeight:900 }}>{sc.total}%</div>
                       <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>نسبة الامتثال</div>
                     </div>
                  </div>
               </div>

               <div style={{ padding:'24px 28px' }}>
                  <div style={{ background:'#F8FAFC', borderRadius:16, border:'1px solid #F1F5F9', padding:20, display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:20, marginBottom:24 }}>
                     <div style={{ display:'flex', flexDirection:'column', gap:4 }}><div style={{ fontSize:11, color:'#64748B', fontWeight:800 }}>تاريخ الإصدار</div><div style={{ fontSize:15, color:'#0F172A', fontWeight:900 }}>{formData.date || '-'}</div></div>
                     <div style={{ display:'flex', flexDirection:'column', gap:4 }}><div style={{ fontSize:11, color:'#64748B', fontWeight:800 }}>المركز</div><div style={{ fontSize:15, color:'#0A2540', fontWeight:900 }}>{center || '-'}</div></div>
                     <div style={{ display:'flex', flexDirection:'column', gap:4 }}><div style={{ fontSize:11, color:'#64748B', fontWeight:800 }}>القطاع</div><div style={{ fontSize:15, color:'#0F172A', fontWeight:900 }}>{initialCenters.find(c=>c.name===center)?.sector || '-'}</div></div>
                     <div style={{ display:'flex', flexDirection:'column', gap:4 }}><div style={{ fontSize:11, color:'#64748B', fontWeight:800 }}>المقيّم</div><div style={{ fontSize:15, color:'#0F172A', fontWeight:900 }}>{formData.inspector || '-'}</div></div>
                  </div>

                  {/* Compliance Level Badge */}
                  <div style={{ background:sc.total>=80?'#ECFDF5':sc.total>=60?'#FFFBEB':'#FEF2F2', padding:'16px 20px', borderRadius:16, textAlign:'center', fontWeight:800, fontSize:15, marginBottom:28, display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:sc.total>=80?'#059669':sc.total>=60?'#D97706':'#DC2626', border:`1px solid ${sc.total>=80?'#A7F3D0':sc.total>=60?'#FDE68A':'#FECACA'}` }}>
                    {sc.total>=80?<><CheckCircle2 size={20}/> مستوى امتثال مقبول — أداء جيد</>:sc.total>=60?<><AlertTriangle size={20}/> مستوى امتثال متوسط — يحتاج تحسين</>:<><XCircle size={20}/> مستوى امتثال غير مقبول — تدخل فوري مطلوب | النسبة: {sc.total}%</>}
                  </div>

                  {/* Score Cards */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:16, marginBottom:32 }}>
                    {activeCriteria.slice(0,4).map(cr=>(
                      <div key={cr.id} style={{ background:'#fff', borderRadius:16, padding:'24px 16px', textAlign:'center', border:`1px solid #E2E8F0`, borderBottom:`4px solid ${cr.color}`, boxShadow:'0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize:32, fontWeight:900, color:cr.color }}>{sc[cr.id]}%</div>
                        <div style={{ fontSize:13, color:'#64748B', fontWeight:800, marginTop:8 }}>{cr.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20, marginBottom:28 }}>
                     {/* Donut Chart - Compliance Distribution */}
                     <div style={{ border:'1px solid #E2E8F0', borderRadius:16, padding:22 }}>
                        <h4 style={{ margin:'0 0 16px', fontSize:14, color:'#0F172A', display:'flex', alignItems:'center', gap:8 }}><BarChart2 size={16} color="#0D9488"/> توزيع مستوى الامتثال</h4>
                        <DonutChart data={dChartData} />
                     </div>
                     {/* Bar Chart - Per Standard */}
                     <div style={{ border:'1px solid #E2E8F0', borderRadius:16, padding:22 }}>
                        <h4 style={{ margin:'0 0 16px', fontSize:14, color:'#0F172A', display:'flex', alignItems:'center', gap:8 }}><Star size={16} color="#F59E0B"/> نسبة الامتثال لكل معيار</h4>
                        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                          {activeCriteria.map(cr => (
                            <div key={cr.id}>
                              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:800, marginBottom:6, color:'#334155' }}><span>{cr.label}</span><span style={{ color:getColor(sc[cr.id]) }}>{sc[cr.id]}%</span></div>
                              <div style={{ height:10, background:'#F1F5F9', borderRadius:5, overflow:'hidden' }}><div style={{ width:`${sc[cr.id]}%`, height:'100%', background:`linear-gradient(90deg, ${cr.color}, ${cr.color}AA)`, borderRadius:5, transition:'width 1s' }}/></div>
                            </div>
                          ))}
                        </div>
                     </div>
                  </div>

                  {/* Center Comparison */}
                  <div style={{ border:'1px solid #E2E8F0', borderRadius:16, padding:22, marginBottom:28 }}>
                    <h4 style={{ margin:'0 0 16px', fontSize:14, color:'#0F172A', display:'flex', alignItems:'center', gap:8 }}><TrendingUp size={16} color="#6366F1"/> مقارنة المراكز الصحية</h4>
                    {visitsDb.length === 0 ? (
                      <div style={{ textAlign:'center', padding:24, color:'#94A3B8', fontSize:13 }}>لا توجد بيانات مقارنة</div>
                    ) : (
                      <div style={{ overflowX:'auto' }}>
                        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                          <thead><tr style={{ background:'#F8FAFC' }}><th style={{ padding:10, textAlign:'right', borderBottom:'2px solid #E2E8F0', fontWeight:800, color:'#64748B' }}>المركز</th><th style={{ padding:10, textAlign:'center', borderBottom:'2px solid #E2E8F0', fontWeight:800, color:'#64748B' }}>الإجمالي</th><th style={{ padding:10, textAlign:'center', borderBottom:'2px solid #E2E8F0', fontWeight:800, color:'#64748B' }}>التاريخ</th><th style={{ padding:10, textAlign:'center', borderBottom:'2px solid #E2E8F0', fontWeight:800, color:'#64748B' }}>الحالة</th></tr></thead>
                          <tbody>{visitsDb.map(v=>(<tr key={v.id} style={{ borderBottom:'1px solid #F1F5F9' }}><td style={{ padding:10, fontWeight:800, color:'#0F172A' }}>{v.center_name || v.center}</td><td style={{ padding:10, textAlign:'center', fontWeight:900, color:getColor(v.total_score ?? v.scores?.total ?? 0) }}>{v.total_score ?? v.scores?.total ?? 0}%</td><td style={{ padding:10, textAlign:'center', color:'#64748B' }}>{v.visit_date || v.date}</td><td style={{ padding:10, textAlign:'center' }}><span style={{ padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:800, background:v.status==='approved'?'#ECFDF5':v.status==='rejected'?'#FEF2F2':'#FFFBEB', color:v.status==='approved'?'#059669':v.status==='rejected'?'#DC2626':'#D97706' }}>{v.status==='approved'?'معتمد':v.status==='rejected'?'مرفوض':'انتظار'}</span></td></tr>))}</tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Strengths & Improvements */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
                    <div style={{ border:'1px solid #A7F3D0', borderRadius:14, padding:20, background:'#F0FDF4' }}>
                      <h4 style={{ margin:'0 0 12px', color:'#059669', fontSize:14, display:'flex', alignItems:'center', gap:8 }}><CheckCircle2 size={16}/> نقاط القوة</h4>
                      <textarea value={formData.strengths||''} onChange={e=>setFormData({...formData, strengths:e.target.value})} placeholder="اكتب نقاط القوة الملاحظة..." rows={4} style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #BBF7D0', fontFamily:'Tajawal', fontSize:13, resize:'vertical', outline:'none', background:'#fff' }}/>
                    </div>
                    <div style={{ border:'1px solid #FECACA', borderRadius:14, padding:20, background:'#FEF2F2' }}>
                      <h4 style={{ margin:'0 0 12px', color:'#DC2626', fontSize:14, display:'flex', alignItems:'center', gap:8 }}><AlertTriangle size={16}/> فرص التحسين</h4>
                      <textarea value={formData.improvements||''} onChange={e=>setFormData({...formData, improvements:e.target.value})} placeholder="اكتب فرص التحسين والتوصيات..." rows={4} style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #FECACA', fontFamily:'Tajawal', fontSize:13, resize:'vertical', outline:'none', background:'#fff' }}/>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop:'1px solid #E2E8F0', paddingTop:16, textAlign:'center', color:'#94A3B8', fontSize:10, fontWeight:600 }}>
                    تم إصدار هذا التقرير بواسطة نظام متابعة استدامة جودة الأداء — قسم الجودة والاعتماد | تجمع الجوف الصحي
                  </div>
               </div>
            </div>
          </div>
        )}

        {tab === 'more' && (
          <div style={{ animation:'fadeIn 0.3s' }}>
            <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 4px 16px rgba(0,0,0,0.03)', border:'1px solid #E5E7EB', marginBottom:20 }}>
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <img src="/logo.png" alt="شعار" style={{ width:120, marginBottom:12, mixBlendMode:'multiply' }} onError={e=>e.target.style.display='none'}/>
                <div style={{ fontWeight:900, fontSize:18, color:'#0A2540' }}>{user.full_name}</div>
                <div style={{ color:'#1DB3A4', fontSize:13, fontWeight:700, marginTop:4 }}>{user.role === 'admin' ? 'مدير النظام' : user.role === 'manager' ? 'مديرة الجودة' : 'مقيّم ميداني'}</div>
                <div style={{ color:'#9CA3AF', fontSize:12, marginTop:4 }}>@{user.username}</div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ background:'#fff', borderRadius:14, padding:'16px 20px', border:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:12 }}>
                <ShieldCheck size={20} color="#1DB3A4"/><div><div style={{ fontWeight:700, fontSize:14 }}>القطاعات المسموحة</div><div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{user.allowed_sectors.join(' • ')}</div></div>
              </div>
              <div style={{ background:'#fff', borderRadius:14, padding:'16px 20px', border:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:12 }}>
                <BarChart2 size={20} color="#D97706"/><div><div style={{ fontWeight:700, fontSize:14 }}>إحصائياتي</div><div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>التقارير المرسلة: {visitsDb.filter(v=>v.inspectorUser===user.username).length} • المعتمدة: {visitsDb.filter(v=>v.inspectorUser===user.username&&v.status==='approved').length}</div></div>
              </div>
              <div style={{ background:'#fff', borderRadius:14, padding:'16px 20px', border:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:12 }}>
                <Settings size={20} color="#6B7280"/><div><div style={{ fontWeight:700, fontSize:14 }}>إصدار النظام</div><div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>متابعة استدامة جودة الأداء v3.0 — تجمع الجوف الصحي</div></div>
              </div>
              <button onClick={logout} style={{ background:'linear-gradient(to right, #DC2626, #B91C1C)', color:'#fff', padding:16, borderRadius:14, fontWeight:800, fontSize:15, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:10 }}><LogOut size={18}/> تسجيل الخروج</button>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return <ErrorBoundary><AppInner /></ErrorBoundary>;
}
