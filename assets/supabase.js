// يحمّل بعد مكتبة supabase-js من CDN في كل صفحة:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// ممنوع service_role هنا. استبدل القيم التالية بالـ publishable/anon key فقط.
(function () {
  const SUPABASE_URL = 'https://onktlkgabkjlxnhumoez.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ua3Rsa2dhYmtqbHhuaHVtb2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTcwNzksImV4cCI6MjEwNjk3MzA3OX0.U6Oat7v2V5iuy7Ohg0eNFWZU3Gp2FdtWdfikm0-STc8'; // anon عام (محمي بـ RLS) — ممنوع service_role
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // التواريخ المحجوزة القادمة من نظام الإدارة (تواريخ فقط، بدون بيانات عملاء). المفتاح هنا anon عام لمشروع الإدارة.
  window.AVAIL = {
    url: 'https://zwuvcblrrrriuylajvba.supabase.co/functions/v1/public-availability',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3dXZjYmxycnJyaXV5bGFqdmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NzE1MDQsImV4cCI6MjEwMTM0NzUwNH0.t0fN9bfGcvIx5HZIouQxdp0N6UpgUylmhFLkMMuwsms'
  };
})();
