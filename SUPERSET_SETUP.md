# إعداد Apache Superset للتحليلات

## نظرة عامة
تم تكوين النظام للعمل مع Apache Superset لتوفير لوحات تحكم تحليلية متقدمة.

## خطوات التثبيت

### 1. تثبيت Apache Superset
```bash
pip install apache-superset
```

### 2. تكوين Superset
```bash
export SUPERSET_CONFIG_PATH=$(pwd)/python_backend/config/superset_config.py
export SUPERSET_SECRET_KEY=$(openssl rand -base64 42)
```

### 3. تهيئة قاعدة البيانات
```bash
superset db upgrade
superset fab create-admin
superset init
```

### 4. تشغيل Superset
```bash
superset run -p 8088 --with-threads --reload
```

## الاتصال بقاعدة البيانات

في واجهة Superset:

1. انتقل إلى **Data > Databases**
2. اضغط على **+ Database**
3. اختر **PostgreSQL**
4. استخدم DATABASE_URL من متغيرات البيئة

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

## الجداول المتاحة للتحليل

- `zones` - معلومات المناطق في المتجر
- `customers` - بيانات العملاء والتركيبة السكانية
- `visits` - زيارات العملاء وأوقات التواجد
- `tracking_events` - أحداث التتبع من الذكاء الاصطناعي
- `alerts` - التنبيهات والإشعارات
- `zone_stats` - إحصائيات المناطق بالساعة

## لوحات التحكم المقترحة

### 1. لوحة المبيعات والزيارات
- عدد الزوار بالساعة
- متوسط وقت التواجد
- توزيع العملاء حسب المناطق
- معدل التحويل بين المناطق

### 2. لوحة التركيبة السكانية
- توزيع العمر والجنس
- أنماط الزيارة حسب الفئات
- ساعات الذروة لكل فئة
- معدلات العودة

### 3. لوحة الذكاء الاصطناعي
- دقة الكشف
- أحداث التتبع في الوقت الفعلي
- التنبيهات الأمنية
- تحليل السلوك

### 4. لوحة تحليل المناطق
- خريطة حرارية للمناطق
- معدل الاستخدام
- أوقات الذروة
- تحليل الطاقة الاستيعابية

## استعلامات SQL مفيدة

### الزوار اليوم
```sql
SELECT COUNT(*) as total_visitors 
FROM visits 
WHERE DATE(entry_time) = CURRENT_DATE;
```

### التركيبة السكانية
```sql
SELECT 
    gender,
    age_range,
    COUNT(*) as count
FROM customers
GROUP BY gender, age_range;
```

### المناطق الأكثر ازدحاماً
```sql
SELECT 
    z.name,
    COUNT(te.id) as activity_count
FROM zones z
LEFT JOIN tracking_events te ON z.id = te.zone_id
WHERE te.timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY z.name
ORDER BY activity_count DESC;
```

### معدل الزيارات بالساعة
```sql
SELECT 
    EXTRACT(HOUR FROM entry_time) as hour,
    COUNT(*) as visits
FROM visits
WHERE DATE(entry_time) = CURRENT_DATE
GROUP BY hour
ORDER BY hour;
```

## ملاحظات مهمة

1. **الأداء**: استخدم الـ caching في Superset لتحسين الأداء
2. **الأمان**: غيّر SUPERSET_SECRET_KEY في الإنتاج
3. **التحديثات**: قم بإعداد جدولة للتحديث التلقائي للبيانات
4. **الصلاحيات**: حدد الصلاحيات المناسبة للمستخدمين

## الموارد

- [Apache Superset Documentation](https://superset.apache.org/docs/intro)
- [SQL Lab Guide](https://superset.apache.org/docs/creating-charts-dashboards/creating-your-first-dashboard)
