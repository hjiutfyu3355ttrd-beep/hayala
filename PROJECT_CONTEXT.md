# PROJECT_CONTEXT — حيالة القصيم

## تعليمات للمساعد
اقرأ هذا الملف أولًا، ثم نفّذ أول مرحلة غير مكتملة فقط، ولا تعيد بناء شيء منتهي.

## نبذة المشروع
منصة حجز شاليهات واستراحات في منطقة القصيم تضم عقارات ملاك متعددين (عربي RTL).
نفس بنية وآلية موقع https://rwqan.sa (المرجع للتخطيط وترتيب الأقسام) مع تغيير الهوية فقط.
كل البيانات من Supabase ولا شيء مكتوب في HTML.

## الـ Stack والنشر
HTML ثابت + JavaScript عادي (بدون frameworks أو build). Backend: Supabase. النشر: Cloudflare Pages من GitHub.
مكتبة supabase-js من CDN (jsdelivr) تُحمَّل قبل assets/supabase.js في كل صفحة.

## قواعد العمل
1. مرحلة واحدة فقط في كل رسالة، وبعدها اسكت وانتظر أمري.
2. ممنوع إعادة كتابة ملف كامل لتعديل بسيط؛ استخدم التعديل الجزئي (str_replace).
3. بعد كل مرحلة: سطرين بحد أقصى، بدون شرح أو مراجعة أو polish.
4. CSS كله في assets/style.css، وJS المشترك في assets/app.js، بدون تكرار.
5. الـ Header والـ Footer يتحقنوا من app.js.
6. اللوجو في assets/logo.png.
### قاعدة التسليم (إلزامية بعد كل مرحلة)
1. حدّث PROJECT_CONTEXT.md بتعديل جزئي (علّم المرحلة ✅، سجّل القرارات وتغييرات الجداول/الملفات).
2. اضغط المشروع في hayala-phase-N.zip واستبعد: .git و node_modules وأي مفاتيح/أسرار.
3. سلّم الزيب عبر present_files ثم سطر واحد: "المرحلة N خلصت، ارفع الزيب في محادثة جديدة لو عايز تكمل".
4. ممنوع أي مفتاح سري في الزيب أو هنا. الـ anon key placeholder فقط.
5. هذا الملف يكفي وحده لأي مساعد جديد، ولا يزيد عن صفحتين.

## الهوية
كحلي #14487F، سماوي #1E9BD7، سماوي فاتح #6CCBEF، أخضر #6BB82E، أصفر #F9B91E (أزرار الحجز والاشتراك)، خلفية #F5FAFD، نص #1B2A38. خط Tajawal. موبايل أولًا.
متغيرات CSS: --navy --sky --sky-l --green --yellow --bg --text.

## الأمان وRLS
- الفرونت: anon/publishable key فقط. ممنوع service_role.
- RLS على كل الجداول: قراءة عامة لـ cities, properties(status=approved), packages, posts(published).
- subscriptions, suggestions: INSERT فقط للزائر، القراءة للأدمن فقط.
- الكتابة على properties/cities/packages/posts للأدمن فقط.
- لا يُعرض جوال/إيميل أي عميل أو مشترك للعامة.

## هيكل الملفات الحالي
```
index.html  properties.html  property.html  subscription.html
suggest.html  blog.html  post.html
PROJECT_CONTEXT.md  NEW_CHAT_PROMPT.md  .gitignore
assets/ style.css  app.js  supabase.js  logo.png(placeholder)
admin/ index.html
sql/ schema.sql
```
المخطط النهائي: index, properties, property(?id=), subscription, suggest, blog, post .html، admin/index.html، assets/riyal-symbol.png، sql/schema.sql، _headers.

## مخطط قاعدة البيانات (المرحلة 2)
- cities(id, name, image, sort)
- properties(id, owner_name, owner_phone, name, city_id, district, type, price, capacity, rooms, amenities jsonb, images text[], description, featured, status, created_at)
- packages(id, name, price, period, features jsonb, sort, active)
- subscriptions(id, package_id, owner_name, phone, email, property_name, city, details jsonb, payment_method, status default 'pending', created_at)
- suggestions(id, name, phone, message, created_at)
- posts(id, title, slug, excerpt, body, cover, published, created_at)
- admins(user_id) + دالة is_admin() لسياسات الأدمن.
بيانات تجريبية: 5 مدن، 12 عقار، 3 باقات، 3 مقالات.

## ملاحظات المرحلة 2 (مهمة للفرونت)
- عدد عقارات كل مدينة: من العرض `cities_with_count` (عمود properties_count). فلتر المدينة بـ ?city=<اسم المدينة> (يُحوَّل لـ city_id عبر جدول cities).
- insert للزائر في subscriptions/suggestions: بدون `.select()` بعد الإدراج (القراءة للأدمن فقط)، وstatus='pending'.
- عمود owner_phone في properties يظهر لأنه رقم تواصل المالك المقصود في صفحة التفاصيل؛ بيانات المشتركين (subscriptions) محمية.
- الأدمن: حساب Supabase Auth ثم إدراجه في جدول admins (سطر جاهز آخر schema.sql). is_admin() تستخدمها كل سياسات الكتابة.
- type القيم: شاليه / استراحة / منتجع / شقة. صور البيانات التجريبية من Unsplash.
- نمط الصفحة (اتبعه في بقية الصفحات): head فيه style.css + 3 سكربتات defer بالترتيب (supabase CDN ← assets/supabase.js ← assets/app.js)، `<body data-hold>`، `<main id="main">`، وسكربت inline في DOMContentLoaded يجلب من `sb` ثم يعرض بـ H.card وينادي H.hideLoader() (حتى عند الخطأ).
- index.html: "عرض الكل" للمميزة يفتح properties.html?featured=1 (يجب دعمه في المرحلة 4)، وللأحدث properties.html.
- properties.html: فلاتر city(اسم) / type / min / max / sort(new|asc|desc) / featured=1 تتزامن مع الرابط (replaceState)، وترقيم 24 + زر "عرض المزيد". كلاسات جديدة في CSS: page-title, filters, btn-line, result-count.
- property.html?id=: معرض صور بمصغرات، وصف، مميزات (chips)، سعر، بيانات (مدينة/حي/نوع/سعة/غرف)، زر "احجز عبر واتساب" (H.waLink برقم owner_phone) وزر "اتصل بالمالك". الجلب: select('*, cities(name)').maybeSingle(). كلاسات جديدة: back, detail, gallery-main, thumbs, panel, meta, actions-col, block, chips/chip, desc.
- subscription.html: 3 خطوات (باقة ← بيانات العقار ← طريقة الدفع + ملخص). تحقق: جوال سعودي (05xxxxxxxx/9665/+9665 ويُخزَّن 05..)، إيميل اختياري، حقول إلزامية. insert في subscriptions بدون select، status='pending'، details jsonb(district,type,price,capacity,rooms,notes)، honeypot ضد السبام. طريقة الدفع (تحويل بنكي/مدى/STC Pay) تُسجَّل فقط؛ لا بوابة دفع ويتواصل الأدمن مع المالك. كلاسات جديدة: steps, pkgs/pkg, form-grid, pay, summary, nav-btns, success, hp.
- suggest.html: فورم (اسم اختياري، جوال اختياري بنفس تحقق الاشتراك، message 3-2000 إلزامي) + honeypot، insert في suggestions بدون select. blog.html: قائمة المنشور (published=true) بكروت H-style. post.html?slug=: يجلب بالـ slug ويعرض body كنص آمن (esc، فقرة لكل سطر فاضي، بدون HTML خام). كلاسات جديدة: cover-ph, post-date, article(-cover,-cta).
- admin/index.html: صفحة واحدة noindex. دخول signInWithPassword ثم التحقق من الأدمن بـ select على admins (سياسة admins_self)؛ غير الأدمن يُسجَّل خروجه. تبويبات من كائن ENT (subscriptions, properties, cities, packages, posts, suggestions) وجدول عام + نموذج عام (أنواع الحقول t/n/a/l/c/s؛ l = أسطر ↔ مصفوفة). إجراءات: اعتماد/رفض (status)، تمييز، تعديل، حذف (confirm)، إضافة، و"إنشاء عقار" من طلب اشتراك (يعبّي النموذج مسبقًا بحالة pending). كل الكتابة تمر عبر RLS (is_admin). كلاسات جديدة: adm-bar, adm-tabs, btn-sm, tbl-wrap, table.adm. لا رفع صور بعد (روابط نصية فقط).
- المرحلة 9: _headers (CSP تسمح بـ jsdelivr وfonts.googleapis/gstatic وsupabase.co وصور https)، SEO meta تُحقن بعد <title> في كل صفحة عامة، admin بـ noindex. إن أضفت سكربتات/مضيفين جدد حدّث CSP في _headers.
- المرحلة 10: أعمدة جديدة في properties: price_weekday, price_weekend, price_overnight, price_holiday, direction, location, has_pool. العمود price = أقل سعر موجب ويحسبه الأدمن عند الحفظ (للبطاقات والفلاتر/الترتيب). property.html يعرض جدول .tiers للفئات الأكبر من صفر (وإلا السعر القديم). فلتر pool=1 في properties.html. للقواعد الموجودة نفّذ sql/phase10_pricing.sql؛ schema.sql محدّث لنفس الغرض. نموذج الاشتراك العام ما زال بسعر واحد، والأدمن يملأ الفئتين تلقائيًا عند "إنشاء عقار".
- المرجع الفعلي لروقان (تحقق من صفحة عقار): نموذج Lead-gen لا حجز؛ زر "تواصل مع المعلن" يسجّل الطلب قبل واتساب؛ العقار المجاني حد 3 محاولات واتساب يوميًا (محرك الاشتراكات)؛ أسعار 4 فئات؛ حقول اتجاه وموقع؛ روابط /property/<رقم>. المحتوى يُحمَّل بجافاسكربت فأدوات الجلب ترى الهيكل فقط. حد المحاولات في الفرونت وحده يُتخطّى؛ الفرض الحقيقي يحتاج Edge Function.
- NEW_CHAT_PROMPT.md: نص جاهز للصق في أي محادثة جديدة مع الزيب.

## المراحل
| # | المرحلة | الحالة |
|---|---|---|
| 1 | style.css + app.js + supabase.js + PROJECT_CONTEXT | ✅ |
| 2 | sql/schema.sql + RLS + بيانات تجريبية | ✅ (المالك ينفّذه في SQL Editor) |
| 3 | index.html | ✅ |
| 4 | properties.html | ✅ |
| 5 | property.html | ✅ |
| 6 | subscription.html (3 خطوات + تحقق) | ✅ |
| 7 | suggest + blog + post | ✅ |
| 8 | admin/index.html (Supabase Auth) | ✅ |
| 9 | _headers + SEO meta + تصليحات | ✅ |
| 10 | فئات الأسعار + اتجاه/موقع/مسبح (properties.html فلتر مسبح، property.html جدول أسعار، admin) | ✅ |
| 11 | سجل طلبات التواصل contact_requests (يُسجَّل قبل فتح واتساب) + تبويب أدمن + عدّاد طلبات لكل عقار | ⬜ |
| 12 | SEO حقيقي: سكربت Node يولّد صفحات ثابتة للمدن والعقارات والمقالات من Supabase + sitemap ديناميكي | ⬜ |
| 13 | تقويم توافر يديره المالك/الأدمن يدويًا (متاح/محجوز/مغلق) يظهر في property.html | ⬜ |
| 14 | لوحة مالك (Supabase Auth للملاك: عقاراتهم وطلباتهم فقط) + باقات/حدود مجانية | ⬜ |
| لاحقًا | حجز ودفع أونلاين (بوابة دفع + Edge Functions + اعتبارات نظامية، لا يبدأ إلا بعد إثبات الطلب) | ⬜ |

## قرارات وملاحظات
- المرجع rwqan.sa: لودر ← بانر "لديك عقار؟" ← المدن (اسم + عدد العقارات، رابط ?city=) ← العروض المميزة ← أحدث العقارات (عرض الكل). كارت العقار: صورة، شارة "مميز"، الاسم، الحي، السعر + رمز الريال. الفوتر: نبذة، روابط سريعة، تواصل، حقوق.
- الصفحات تحمّل: `<script defer src="assets/app.js">` في head؛ الصفحة التي تجلب بيانات تضع `data-hold` على body وتنادي `H.hideLoader()` بعد التحميل.
- مساعدات جاهزة في app.js عبر `window.H`: esc, url, qs, price(n), card(property), waLink(phone,text), toast, hideLoader, CONFIG.
- كلاسات جاهزة في CSS: container, section, section-head, grid, card, badge, cities/city-card, owner-banner, btn(-yellow/-navy/-wa/-block), field, empty.
- جوال/إيميل التواصل في CONFIG داخل app.js placeholders (05XXXXXXXX / info@example.com) — يعدّلها المالك.
- logo.png حاليًا placeholder؛ riyal-symbol.png يضيفه المالك (assets/).
- صور العقارات روابط خارجية (Unsplash/R2) في images text[].
- صفحات admin تستخدم ../assets/ (المسارات محسوبة تلقائيًا في app.js).

## حالة التصليحات (بعد المرحلة 9)
✅ تثبيت supabase-js@2.45.4 (بدون SRI: لا يمكن حسابه من البيئة) · ✅ schema.sql idempotent (DO blocks + on conflict) · ✅ sql/phase9_hardening.sql (تحقق جوال 05xxxxxxxx وأطوال في RLS) · ✅ حذف BASE · ✅ fallback "ر.س" لو riyal-symbol.png ناقص · ✅ SEO meta/OG/favicon · ✅ _headers (CSP+أمان+كاش) · ✅ robots.txt · ✅ sitemap.xml
✅ ربط Supabase (مشروع hayala، ref: onktlkgabkjlxnhumoez، eu-west-1): تم تنفيذ schema.sql (شامل المرحلة 10) ثم phase9_hardening.sql، والبيانات التجريبية موجودة، وassets/supabase.js فيه الرابط ومفتاح anon العام (ليس سرًا؛ الحماية بالـ RLS وتم اختبارها كزائر). تنبيه Supabase عن is_admin() مقصود: لا تسحب EXECUTE منها وإلا تنكسر سياسات القراءة.
✅ رفع الصور من لوحة التحكم (admin/index.html): زر رفع من الجهاز في العقارات (صور متعددة، الأولى غلاف، ترتيب/حذف) والمدن والمقالات (صورة واحدة). الصورة تُصغَّر تلقائيًا (أطول ضلع 1600px، JPEG) وتُرفع لـ Supabase Storage في bucket عام اسمه property-images، ويُحفظ الرابط فقط في الجداول. الرفع والحذف للأدمن فقط (سياسات storage.objects بـ is_admin()). الصور المحذوفة/المستبدلة/المهجورة تُمسح من التخزين تلقائيًا (روابط مجلدنا فقط).
⬜ على المالك: وضع اللوجو الأصلي + assets/riyal-symbol.png · تعديل CONFIG في app.js (جوال/إيميل) · استبدال YOUR-DOMAIN في robots.txt وsitemap.xml · إنشاء الأدمن (Authentication > Users ثم `insert into admins(user_id) select id from auth.users where email='...'`)
⬜ اختياري مستقبلي: Cloudflare Turnstile + التحقق عبر Supabase Edge Function (التحقق من جهة الفرونت وحده لا يحمي) · إخفاء owner_phone عن العامة · نقل الصور إلى Supabase Storage/R2 مع رفع من الأدمن · SRI · sitemap ديناميكي للعقارات والمقالات
## الخطوة التالية
المراحل 1-10 منتهية؛ التالية المرحلة 11 (راجع الجدول).
ملاحظة قديمة: كل المراحل (1-9) منتهية. المطلوب فقط: خطوات المالك أعلاه ثم النشر (GitHub → Cloudflare Pages: Build command فاضي، Output directory = /). أي تطوير إضافي يُطلب كمرحلة جديدة 10+.
