-- حيالة القصيم: شغّله في Supabase SQL Editor (مرة واحدة)
create extension if not exists pgcrypto;

create table if not exists cities(
  id uuid primary key default gen_random_uuid(),
  name text not null unique, image text, sort int default 0);
create table if not exists properties(
  id uuid primary key default gen_random_uuid(),
  owner_name text, owner_phone text,
  name text not null, city_id uuid references cities(id) on delete set null,
  district text, type text, price numeric not null, capacity int, rooms int,
  amenities jsonb default '[]', images text[] default '{}', description text,
  featured boolean default false,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now());
alter table properties add column if not exists price_weekday numeric;
alter table properties add column if not exists price_weekend numeric;
alter table properties add column if not exists price_overnight numeric;
alter table properties add column if not exists price_holiday numeric;
alter table properties add column if not exists direction text;
alter table properties add column if not exists location text;
alter table properties add column if not exists has_pool boolean not null default false;

create table if not exists packages(
  id uuid primary key default gen_random_uuid(),
  name text not null, price numeric not null, period text, features jsonb default '[]',
  sort int default 0, active boolean default true);
create table if not exists subscriptions(
  id uuid primary key default gen_random_uuid(),
  package_id uuid references packages(id), owner_name text not null, phone text not null, email text,
  property_name text, city text, details jsonb default '{}', payment_method text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now());
create table if not exists suggestions(
  id uuid primary key default gen_random_uuid(),
  name text, phone text, message text not null, created_at timestamptz default now());
create table if not exists posts(
  id uuid primary key default gen_random_uuid(),
  title text not null, slug text unique not null, excerpt text, body text, cover text,
  published boolean default false, created_at timestamptz default now());
create table if not exists admins(user_id uuid primary key references auth.users(id) on delete cascade);

create index if not exists idx_prop_city on properties(city_id);
create index if not exists idx_prop_status on properties(status, featured);

create or replace function is_admin() returns boolean
language sql security definer set search_path=public stable
as $$ select exists(select 1 from admins where user_id = auth.uid()) $$;

-- عرض المدن مع عدد العقارات المعتمدة
create or replace view cities_with_count with (security_invoker=true) as
select c.*, (select count(*) from properties p where p.city_id=c.id and p.status='approved')::int as properties_count
from cities c;

-- RLS
alter table cities enable row level security;
alter table properties enable row level security;
alter table packages enable row level security;
alter table subscriptions enable row level security;
alter table suggestions enable row level security;
alter table posts enable row level security;
alter table admins enable row level security;

create policy cities_read on cities for select using (true);
create policy props_read on properties for select using (status='approved' or is_admin());
create policy packages_read on packages for select using (active or is_admin());
create policy posts_read on posts for select using (published or is_admin());
create policy cities_admin on cities for all using (is_admin()) with check (is_admin());
create policy props_admin on properties for all using (is_admin()) with check (is_admin());
create policy packages_admin on packages for all using (is_admin()) with check (is_admin());
create policy posts_admin on posts for all using (is_admin()) with check (is_admin());

create policy subs_insert on subscriptions for insert to anon, authenticated
  with check (status='pending' and length(owner_name)<=120 and length(phone)<=20);
create policy subs_admin on subscriptions for all using (is_admin()) with check (is_admin());
create policy sugg_insert on suggestions for insert to anon, authenticated
  with check (length(message) between 3 and 2000);
create policy sugg_admin on suggestions for all using (is_admin()) with check (is_admin());
create policy admins_self on admins for select using (user_id = auth.uid());

grant select on cities_with_count to anon, authenticated;

-- بيانات تجريبية
insert into cities(name,sort) values ('بريدة',1),('عنيزة',2),('البكيرية',3),('البدائع',4),('عيون الجواء',5) on conflict do nothing;

do $$ begin if not exists (select 1 from properties where owner_name like 'مالك %') then
insert into properties(owner_name,owner_phone,name,city_id,district,type,price,capacity,rooms,amenities,images,description,featured,status)
select 'مالك '||v.n, '0500000'||lpad(v.n::text,3,'0'), v.name, c.id, v.district, v.type, v.price, v.cap, v.rooms,
 '["مسبح","واي فاي","مطبخ مجهز","جلسة خارجية","موقف سيارات"]'::jsonb,
 array['https://images.unsplash.com/'||v.img||'?w=800&h=600&fit=crop&q=80','https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80'],
 'عقار تجريبي مجهز بالكامل للعائلات والمجموعات، بتصميم مريح وإطلالة هادئة. (بيانات تجريبية)', v.feat, 'approved'
from (values
 (1,'شاليه بيت القمر','بريدة','البصر','شاليه',300,8,3,true,'photo-1564013799919-ab600027ffc6'),
 (2,'منتجع الودق','بريدة','الشقة','منتجع',500,15,5,true,'photo-1571896349842-33c89424de2d'),
 (3,'شاليه ذا سيزون','بريدة','ضراس','شاليه',650,12,4,true,'photo-1512917774080-9991f1c4c750'),
 (4,'استراحة الفاروق','بريدة','الفاروق','استراحة',400,20,4,true,'photo-1613490493576-7fde63acd811'),
 (5,'منتجع القيروان','بريدة','البصر','منتجع',399,10,3,true,'photo-1582268611958-ebfd161ef9cf'),
 (6,'شاليه فلورا','عنيزة','الرحاب','شاليه',450,10,3,true,'photo-1600585154340-be6161a56a0c'),
 (7,'شاليه الريف المائي','عنيزة','حي الهدية','شاليه',390,8,2,true,'photo-1600596542815-ffad4c1539a9'),
 (8,'شاليه درة الجوهرة','بريدة','قرب حديقة البصر','شاليه',250,6,2,false,'photo-1520250497591-112f2f40a3f4'),
 (9,'شاليهات فهدة','البكيرية','النقيب','شاليه',430,10,3,false,'photo-1564013799919-ab600027ffc6'),
 (10,'استراحة المودة','بريدة','حي الحزم','استراحة',400,25,5,false,'photo-1613490493576-7fde63acd811'),
 (11,'شاليه ثمانية','البدائع','حي الغماس','شاليه',350,8,3,false,'photo-1512917774080-9991f1c4c750'),
 (12,'استراحة الجواء','عيون الجواء','الوسط','استراحة',300,15,3,false,'photo-1600585154340-be6161a56a0c')
) as v(n,name,city,district,type,price,cap,rooms,feat,img)
join cities c on c.name=v.city;
end if; end $$;

do $$ begin if not exists (select 1 from packages) then
insert into packages(name,price,period,features,sort) values
 ('الأساسية',299,'سنويًا','["عقار واحد","ظهور في القائمة","زر واتساب"]',1),
 ('المميزة',599,'سنويًا','["حتى 3 عقارات","شارة مميز","ظهور في الرئيسية"]',2),
 ('الذهبية',999,'سنويًا','["عقارات غير محدودة","أولوية الظهور","دعم مباشر"]',3);
end if; end $$;

insert into posts(title,slug,excerpt,body,published) values
 ('أفضل الأوقات لحجز شاليه في القصيم','best-time-to-book','متى تحجز لتحصل على أفضل سعر وتوفر.','محتوى تجريبي للمقال الأول عن أفضل أوقات الحجز في القصيم.',true),
 ('نصائح لاختيار الاستراحة المناسبة لعائلتك','choose-the-right-rest-house','ما الذي تنظر إليه قبل الحجز؟','محتوى تجريبي للمقال الثاني عن اختيار الاستراحة.',true),
 ('كيف تسجّل عقارك وتبدأ باستقبال الحجوزات','list-your-property','خطوات الاشتراك للملاك.','محتوى تجريبي للمقال الثالث عن تسجيل العقار.',true)
 on conflict (slug) do nothing;

-- backfill المرحلة 10 للبيانات التجريبية
-- price يبقى = أقل سعر موجب (للبطاقات والفلاتر). للعقارات القديمة:
update properties set price_weekday = coalesce(price_weekday, price), price_weekend = coalesce(price_weekend, price)
 where price_weekday is null and price_weekend is null;
update properties set has_pool = true where amenities ? 'مسبح';

-- بعد إنشاء حساب الأدمن من Authentication > Users:
-- insert into admins(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL';
