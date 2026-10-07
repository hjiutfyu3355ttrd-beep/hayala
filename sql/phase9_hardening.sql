-- حيالة القصيم: تشديد RLS (نفّذه مرة واحدة في SQL Editor بعد schema.sql)
-- تحقق صيغة الجوال السعودي + حدود الأطوال على الإدراج العام
drop policy if exists subs_insert on subscriptions;
create policy subs_insert on subscriptions for insert to anon, authenticated
  with check (status='pending'
    and length(owner_name) between 2 and 120
    and phone ~ '^05[0-9]{8}$'
    and (email is null or (length(email) <= 160 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    and length(coalesce(property_name,'')) <= 120
    and length(coalesce(payment_method,'')) <= 40);

drop policy if exists sugg_insert on suggestions;
create policy sugg_insert on suggestions for insert to anon, authenticated
  with check (length(message) between 3 and 2000
    and length(coalesce(name,'')) <= 120
    and (phone is null or phone ~ '^05[0-9]{8}$'));
