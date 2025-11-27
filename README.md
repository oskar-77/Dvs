# Mr.OSKAR - نظام تحليلات التجزئة

<div dir="rtl">

## نظرة عامة على المشروع

**Mr.OSKAR** هو تطبيق ويب متكامل لتحليلات التجزئة يتميز بواجهة React حديثة وخلفية Flask قوية. يوفر النظام مراقبة حية للعملاء، تحليلات مدعومة بالذكاء الاصطناعي، ولوحة تحكم شاملة مع إمكانيات المراقبة في الوقت الفعلي.

## الميزات الرئيسية

### 1. لوحة المراقبة الحية (Live Monitor)
- **إحصائيات فورية**: عرض إجمالي الزوار، متوسط وقت البقاء، الإشغال الحالي، ومعدل التفاعل مع المناطق
- **بث الكاميرات**: عرض مباشر لكاميرات المراقبة مع كشف الأشخاص
- **خريطة حرارية**: تصور التفاعل مع مناطق المتجر المختلفة
- **الديموغرافيات**: تحليل توزيع العمر ونسب الجنس

### 2. صفحة التنبيهات (Alerts)
- **إنشاء تنبيهات جديدة**: إضافة تنبيهات حسب النوع (حرج، تحذير، معلومات)
- **إدارة التنبيهات**: عرض جميع التنبيهات مع إمكانية الفلترة والبحث
- **حل التنبيهات**: تحديث حالة التنبيهات من نشط إلى محلول
- **أنواع التنبيهات**:
  - تجاوز كثافة الحشود
  - طوابير طويلة في الدفع
  - اكتشاف التسكع
  - تنبيهات الأمان

### 3. التحليلات المتقدمة (Analytics)
- **اتجاهات المرور**: رسم بياني لحركة الزوار على مدار الساعة
- **الديموغرافيات**: تحليل تفصيلي للعملاء
- **معدلات التحويل**: نسبة التحويل لكل منطقة

### 4. إدارة الإعدادات (Settings)
- **إدارة الكاميرات**: إضافة/حذف كاميرات RTSP
- **معايير الرؤية الحاسوبية**: ضبط حساسية الكشف
- **خيارات الخصوصية**: تمويه الوجوه، استبعاد الموظفين

### 5. خرائط المناطق الحرارية (Zone Heatmaps)
- عرض تفاعل العملاء مع مناطق المتجر
- تحليل مناطق الدخول والخروج والتسوق

## التقنيات المستخدمة

### الواجهة الأمامية (Frontend)
- **React 19** + TypeScript
- **Vite** للبناء السريع
- **Tailwind CSS** للتصميم
- **React Query** لإدارة الحالة
- **Wouter** للتوجيه
- **Recharts** للرسوم البيانية
- **Lucide React** للأيقونات

### الخلفية (Backend)
- **Flask** إطار عمل Python
- **SQLAlchemy** للتعامل مع قاعدة البيانات
- **PostgreSQL** قاعدة البيانات
- **Flask-Sock** للاتصال المباشر (WebSocket)
- **OpenCV** للرؤية الحاسوبية
- **Gunicorn** خادم الإنتاج

## هيكل المشروع

```
/home/runner/workspace/
├── client/                      # واجهة React
│   ├── src/
│   │   ├── pages/              # صفحات التطبيق
│   │   │   ├── dashboard.tsx   # لوحة التحكم الرئيسية
│   │   │   ├── alerts.tsx      # صفحة التنبيهات
│   │   │   ├── analytics.tsx   # صفحة التحليلات
│   │   │   ├── heatmaps.tsx    # خرائط الحرارة
│   │   │   └── settings.tsx    # الإعدادات
│   │   ├── components/         # مكونات React
│   │   │   ├── dashboard/      # مكونات اللوحة
│   │   │   ├── layout/         # مكونات التخطيط
│   │   │   └── ui/             # مكونات واجهة المستخدم
│   │   └── hooks/              # خطافات React Query
│   │       ├── useStats.ts     # إحصائيات
│   │       ├── useCameras.ts   # الكاميرات
│   │       ├── useAlerts.ts    # التنبيهات
│   │       └── useZones.ts     # المناطق
│   └── index.html
│
├── python_backend/             # خلفية Flask
│   ├── app.py                  # تطبيق Flask الرئيسي
│   ├── models/models.py        # نماذج قاعدة البيانات
│   ├── routes/
│   │   ├── api_routes.py       # نقاط API
│   │   ├── camera_routes.py    # إدارة الكاميرات
│   │   └── websocket_routes.py # WebSocket
│   ├── camera/                 # إدارة الكاميرات
│   ├── ai_detection/           # كشف الذكاء الاصطناعي
│   └── config/database.py      # إعدادات قاعدة البيانات
│
├── dist/public/                # ملفات الواجهة المبنية
├── main.py                     # نقطة دخول التطبيق
└── pyproject.toml             # تبعيات Python
```

## كيفية تشغيل المشروع

### 1. إعداد قاعدة البيانات

قاعدة البيانات PostgreSQL مطلوبة للمشروع. في Replit:

1. اذهب إلى تبويب "Database" في الشريط الجانبي
2. انقر "Create a database"
3. اختر PostgreSQL
4. سيتم إعداد DATABASE_URL تلقائياً

### 2. تثبيت التبعيات

التبعيات تُثبَّت تلقائياً عند بدء التشغيل:

```bash
# تبعيات Python
uv sync

# تبعيات Node.js
npm install
```

### 3. بناء الواجهة الأمامية

```bash
npm run build
```

### 4. تشغيل الخادم

يعمل الخادم تلقائياً عبر Workflow:

```bash
gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
```

### 5. ملء قاعدة البيانات بالبيانات الأولية (اختياري)

```bash
python python_backend/seed_data.py
```

## نقاط API المتاحة

### الإحصائيات
- `GET /api/stats/overview` - إحصائيات عامة

### الكاميرات
- `GET /api/cameras` - قائمة الكاميرات
- `POST /api/cameras` - إضافة كاميرا
- `DELETE /api/cameras/:id` - حذف كاميرا
- `GET /api/cameras/:index/stream` - بث الكاميرا

### التنبيهات
- `GET /api/alerts` - قائمة التنبيهات
- `POST /api/alerts` - إنشاء تنبيه
- `PATCH /api/alerts/:id/resolve` - حل تنبيه

### التحليلات
- `GET /api/analytics/demographics` - الديموغرافيات
- `GET /api/analytics/traffic` - حركة المرور

### المناطق
- `GET /api/zones` - قائمة المناطق
- `POST /api/zones` - إضافة منطقة
- `GET /api/zones/stats` - إحصائيات المناطق

### WebSocket
- `WS /ws/camera/:index` - بث الكاميرا المباشر

## استخدام الميزات

### إضافة كاميرا جديدة

1. اذهب إلى صفحة **Settings**
2. انقر على **Add Camera**
3. أدخل:
   - اسم الكاميرا
   - رقم الفهرس (0, 1, 2, ...)
   - الموقع (اختياري)
   - رابط RTSP (اختياري)
4. انقر **Add Camera**

### إنشاء تنبيه جديد

1. اذهب إلى صفحة **Alerts**
2. انقر على **New Alert**
3. اختر نوع التنبيه (Critical, Warning, Info)
4. أدخل العنوان والرسالة والموقع
5. انقر **Create Alert**

### حل تنبيه

1. في صفحة **Alerts**
2. ابحث عن التنبيه النشط (ACTIVE)
3. انقر على زر **Resolve**

## ملاحظات هامة

- **الكاميرات**: في بيئة Replit لا تتوفر كاميرات فعلية، لذا ستظهر رسالة "Camera not available"
- **البيانات**: عند تشغيل seed_data.py، ستُملأ قاعدة البيانات ببيانات تجريبية
- **الأداء**: يُفضَّل استخدام النظام مع كاميرات حقيقية للحصول على تجربة كاملة

## النشر (Deployment)

المشروع مُعَد للنشر على Replit:

- **النوع**: autoscale
- **البناء**: `npm run build`
- **التشغيل**: `gunicorn --bind 0.0.0.0:5000 --reuse-port main:app`

## الدعم

للمساعدة أو الاستفسارات، يرجى فتح Issue في المستودع أو التواصل مع فريق التطوير.

---

**Mr.OSKAR** - نظام ذكي لتحليلات التجزئة

</div>

---

# Mr.OSKAR - Retail Analytics Dashboard (English)

## Overview

Mr.OSKAR is a comprehensive retail analytics web application with React frontend and Flask backend. It provides real-time customer monitoring, AI-powered analytics, and a complete dashboard with live surveillance capabilities.

## Features

- **Live Dashboard**: Real-time stats, camera feeds, heatmaps, demographics
- **Alerts Management**: Create, view, filter, and resolve alerts
- **Analytics**: Traffic trends, demographic analysis, zone conversion rates
- **Camera Management**: Add/remove RTSP cameras, configure AI parameters
- **Zone Heatmaps**: Visualize customer engagement across store zones

## Quick Start

1. Create PostgreSQL database in Replit Database tab
2. Dependencies install automatically
3. Run `npm run build` to build frontend
4. Start server via Flask Backend workflow
5. Optional: Run `python python_backend/seed_data.py` for sample data

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Query
- **Backend**: Flask, SQLAlchemy, PostgreSQL, Flask-Sock, OpenCV
- **Server**: Gunicorn

## API Endpoints

- `GET /api/stats/overview` - Stats
- `GET/POST /api/cameras` - Camera management
- `GET/POST /api/alerts` - Alerts
- `GET /api/analytics/*` - Analytics data
- `GET /api/zones` - Zone data
- `WS /ws/camera/:index` - Live stream

For detailed Arabic documentation, see the Arabic section above.
