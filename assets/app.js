(function () {
  const CONFIG = {
    name: 'حيالة القصيم',
    tagline: 'شاليهات ومزرعة للإيجار في القصيم، مبيت أو بدون مبيت.',
    phone: '05XXXXXXXX', email: 'info@example.com', // عدّلها لاحقًا
    address: 'منطقة القصيم، المملكة العربية السعودية'
  };
  const src = document.currentScript ? document.currentScript.src : location.href;
  const root = new URL('../', src).href;
  const U = p => root + p;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const links = [['index.html','الرئيسية','home'],['index.html#units','الوحدات','grid'],['blog.html','المدونة','book'],['suggest.html','اقترح لنا','chat']];
  const phoneOk = /^05\d{8}$/.test(CONFIG.phone), emailOk = /@/.test(CONFIG.email) && !/example\.com$/.test(CONFIG.email);

  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2Z"/><path d="M8 7h8"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    bed: '<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10.5" r="1.8"/>',
    pool: '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    phone: '<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    wa: '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2Z"/>',
    left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>',
    up: '<path d="m18 15-6-6-6 6"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>', star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="m5 12 5 5 9-10"/>'
  };
  const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  const page = location.pathname.split('/').pop() || 'index.html';
  const isActive = h => h === page || (page === 'post.html' && h === 'blog.html') || (page === 'unit.html' && h === 'index.html#units');

  function inject() {
    const logo = U('assets/logo.png');
    document.body.insertAdjacentHTML('afterbegin',
      `<a class="skip" href="#main">تخطَّ إلى المحتوى</a>
      <div id="progress" aria-hidden="true"></div>
      <header class="site-header"><div class="container">
        <a class="brand" href="${U('index.html')}" aria-label="${esc(CONFIG.name)} - الرئيسية"><img src="${logo}" alt="" width="44" height="44"><span>${esc(CONFIG.name)}</span></a>
        <nav class="nav" id="nav" aria-label="القائمة الرئيسية">${links.map(([h,t]) => `<a href="${U(h)}"${isActive(h) ? ' class="active" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
        <div class="head-actions">
          <a class="btn btn-yellow btn-head" href="${U('index.html')}#units">${icon('grid')}<span>احجز الآن</span></a>
          <button class="icon-btn menu-btn" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav">${icon('menu')}</button>
        </div>
      </div></header>`);
    document.body.insertAdjacentHTML('beforeend',
      `<footer class="site-footer"><div class="container">
        <div class="footer-grid">
          <div class="footer-brand"><img src="${logo}" alt="" width="56" height="56"><p>${esc(CONFIG.tagline)}</p></div>
          <div><h3>روابط سريعة</h3><ul>${links.concat([['gallery.html','معرض الصور']]).map(([h,t]) => `<li><a href="${U(h)}">${t}</a></li>`).join('')}</ul></div>
          <div><h3>تواصل معنا</h3><ul>${phoneOk ? `<li><a href="tel:${esc(CONFIG.phone)}" dir="ltr">${esc(CONFIG.phone)}</a></li>` : ''}${emailOk ? `<li><a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li>` : ''}<li>${esc(CONFIG.address)}</li></ul></div>
        </div>
        <div class="copyright">© ${new Date().getFullYear()} ${esc(CONFIG.name)}</div>
      </div></footer>
      <nav class="tabbar" aria-label="تنقل سريع">${links.slice(0, 3).map(([h,t,ic]) => `<a href="${U(h)}"${isActive(h) ? ' class="active" aria-current="page"' : ''}>${icon(ic)}<span>${t}</span></a>`).join('')}
        <a href="${U('index.html')}#cta">${icon('phone')}<span>تواصل</span></a></nav>
      <button class="to-top icon-btn" aria-label="العودة للأعلى">${icon('up')}</button>`);

    const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
    const setMenu = open => {
      nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
      btn.innerHTML = icon(open ? 'x' : 'menu');
    };
    btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false); });

    const header = document.querySelector('.site-header'), top = document.querySelector('.to-top');
    let ticking = false;
    const onScroll = () => {
      const y = scrollY;
      header.classList.toggle('scrolled', y > 8);
      top.classList.toggle('show', y > 700);
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // شريط تقدّم علوي بدل اللودر الكامل
  let progT;
  function progress(start) {
    const bar = document.getElementById('progress');
    if (!bar) return;
    clearTimeout(progT);
    if (start) { bar.className = 'run'; return; }
    bar.className = 'done';
    progT = setTimeout(() => { bar.className = ''; }, 500);
  }
  const hideLoader = () => { progress(false); document.body.classList.add('loaded'); };

  // تلاشي الصور عند تحميلها
  document.addEventListener('load', e => { if (e.target.tagName === 'IMG') e.target.classList.add('in'); }, true);
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.closest('.card-img, .gal, .city-card')) e.target.classList.add('broken'); }, true);

  // تحميل مسبق للصفحات عند المرور فوق الروابط لتنقل فوري
  const prefetched = new Set();
  const prefetch = a => {
    if (!a || !a.href || a.target || prefetched.has(a.href)) return;
    const u = new URL(a.href);
    if (u.origin !== location.origin || u.pathname === location.pathname && u.search === location.search) return;
    prefetched.add(a.href);
    const l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
  };
  document.addEventListener('pointerover', e => prefetch(e.target.closest && e.target.closest('a[href]')), { passive: true });
  document.addEventListener('touchstart', e => prefetch(e.target.closest && e.target.closest('a[href]')), { passive: true });

  // ظهور تدريجي للعناصر عند التمرير
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -40px 0px' }) : null;
  const reveal = (scope = document) => scope.querySelectorAll('.reveal:not(.seen)').forEach(el => io ? io.observe(el) : el.classList.add('seen'));

  const fmt = n => Number(n || 0).toLocaleString('en-US');

  const H = window.H = {
    CONFIG, esc, url: U, hideLoader, icon, reveal, fmt, phoneOk,
    qs: n => new URLSearchParams(location.search).get(n),
    price: n => `<span class="price">${fmt(n)}<img src="${U('assets/riyal-symbol.png')}" alt="ريال سعودي" onerror="this.replaceWith(document.createTextNode(' ر.س'))"></span>`,
    waLink: (phone, text) => `https://wa.me/${String(phone).replace(/\D/g,'').replace(/^0/,'966')}?text=${encodeURIComponent(text || '')}`,
    unitCard: (u, i = 0) => {
      const img = (u.images || [])[0];
      const facts = [u.capacity && `${icon('users')}${esc(u.capacity)} أشخاص`, u.rooms && `${icon('bed')}${esc(u.rooms)} غرف`].filter(Boolean);
      const from = u.price_overnight_from || u.price_dayuse_from;
      return `<a class="card reveal${u.bookable ? '' : ' off'}" style="--d:${Math.min(i, 8) * 45}ms" href="${U('unit.html')}?u=${encodeURIComponent(u.slug)}">
      <div class="card-img${img ? '' : ' ph'}">${img ? `<img loading="lazy" decoding="async" src="${esc(img)}" alt="${esc(u.name)}">` : icon('home')}
        <div class="card-tags"><span class="badge badge-glass">${u.kind === 'farm' ? 'مزرعة' : 'شاليه'}</span>${u.bookable ? '' : '<span class="badge badge-off">غير متاح</span>'}</div></div>
      <div class="card-body"><h3>${esc(u.name)}</h3>
        ${facts.length ? `<div class="facts">${facts.map(f => `<span>${f}</span>`).join('')}</div>` : ''}
        <div class="card-foot">${from ? `<small>يبدأ من</small>${H.price(from)}` : '<small>اتصل لمعرفة السعر</small>'}</div></div></a>`;
    },
    photoCard: (ph, i = 0) => {
      const inner = ph
        ? `<div class="card-img"><img loading="lazy" decoding="async" src="${esc(ph.image)}" alt="${esc(ph.title || '')}"></div>${(ph.title || ph.subtitle) ? `<div class="card-body">${ph.title ? `<h3>${esc(ph.title)}</h3>` : ''}${ph.subtitle ? `<div class="card-sub">${esc(ph.subtitle)}</div>` : ''}</div>` : ''}`
        : `<div class="card-img ph">${icon('home')}</div><div class="card-body"><h3>صور المنتجع قريبًا</h3></div>`;
      const slug = ph && ph.units && ph.units.slug;
      return slug ? `<a class="card reveal" style="--d:${Math.min(i, 8) * 45}ms" href="${U('unit.html')}?u=${encodeURIComponent(slug)}">${inner}</a>` : `<div class="card reveal" style="--d:${Math.min(i, 8) * 45}ms">${inner}</div>`;
    },
    skeleton: (n = 8) => Array.from({ length: n }, () => `<div class="card sk-card" aria-hidden="true"><div class="card-img sk"></div><div class="card-body"><div class="sk sk-line w80"></div><div class="sk sk-line w50"></div><div class="sk sk-line w40 tall"></div></div></div>`).join(''),
    empty: (title, text = '', action = '') => `<div class="empty" style="grid-column:1/-1"><div class="empty-ic">${icon('search')}</div><strong>${title}</strong>${text ? `<p>${text}</p>` : ''}${action}</div>`,
    toast(msg, type = '') {
      let wrap = document.querySelector('.toasts');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; wrap.setAttribute('role', 'status'); wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
      const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; wrap.appendChild(t);
      setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 3000);
    },
    debounce: (fn, ms = 300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  };

  document.addEventListener('DOMContentLoaded', () => {
    inject();
    progress(true);
    document.querySelectorAll('img').forEach(img => { if (img.complete && img.naturalWidth) img.classList.add('in'); });
    if (!document.body.hasAttribute('data-hold')) window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 8000);
    reveal();
    new MutationObserver(() => reveal()).observe(document.getElementById('main') || document.body, { childList: true, subtree: true });
  });
})();
