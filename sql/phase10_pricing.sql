-- المرحلة 10: فئات الأسعار + الاتجاه والموقع والمسبح (آمن للتكرار)
alter table properties add column if not exists price_weekday numeric;
alter table properties add column if not exists price_weekend numeric;
alter table properties add column if not exists price_overnight numeric;
alter table properties add column if not exists price_holiday numeric;
alter table properties add column if not exists direction text;
alter table properties add column if not exists location text;
alter table properties add column if not exists has_pool boolean not null default false;
-- price يبقى = أقل سعر موجب (للبطاقات والفلاتر). للعقارات القديمة:
update properties set price_weekday = coalesce(price_weekday, price), price_weekend = coalesce(price_weekend, price)
 where price_weekday is null and price_weekend is null;
update properties set has_pool = true where amenities ? 'مسبح';
