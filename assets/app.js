(function () {
  const CONFIG = {
    name: 'حيالة القصيم',
    tagline: 'منصة الشاليهات والاستراحات في منطقة القصيم. حجز سهل ومميز.',
    phone: '05XXXXXXXX', email: 'info@example.com', // عدّلها لاحقًا
    address: 'منطقة القصيم، المملكة العربية السعودية'
  };
  const src = document.currentScript ? document.currentScript.src : location.href;
  const root = new URL('../', src).href; // جذر الموقع
  const U = p => root + p;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const links = [['index.html','الرئيسية'],['blog.html','المدونة'],['suggest.html','اقترح لنا']];

  function inject() {
    const logo = U('assets/logo.png');
    document.body.insertAdjacentHTML('afterbegin',
      `<div id="loader"><img src="${logo}" alt="${esc(CONFIG.name)}"><div class="spinner"></div><p>جاري التحميل...</p></div>
      <header class="site-header"><div class="container">
        <a class="brand" href="${U('index.html')}"><img src="${logo}" alt="${esc(CONFIG.name)}"></a>
        <button class="menu-btn" aria-label="القائمة" aria-expanded="false">☰</button>
        <nav class="nav">${links.map(([h,t]) => `<a href="${U(h)}" data-p="${h}">${t}</a>`).join('')}
          <a class="btn btn-yellow" href="${U('subscription.html')}">اشترك معنا</a></nav>
      </div></header>`);
    document.body.insertAdjacentHTML('beforeend',
      `<footer class="site-footer"><div class="container">
        <div class="footer-grid">
          <div class="footer-brand"><img src="${logo}" alt=""><p>${esc(CONFIG.tagline)}</p></div>
          <div><h3>روابط سريعة</h3><ul>${links.concat([['subscription.html','اشترك معنا']]).map(([h,t]) => `<li><a href="${U(h)}">${t}</a></li>`).join('')}</ul></div>
          <div><h3>تواصل معنا</h3><ul><li><a href="tel:${esc(CONFIG.phone)}" dir="ltr">${esc(CONFIG.phone)}</a></li><li><a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a></li><li>${esc(CONFIG.address)}</li></ul></div>
        </div>
        <div class="copyright">© ${new Date().getFullYear()} ${esc(CONFIG.name)}</div>
      </div></footer>`);
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a[data-p]').forEach(a => a.classList.toggle('active', a.dataset.p === page || (page === 'post.html' && a.dataset.p === 'blog.html')));
    const btn = document.querySelector('.menu-btn'), nav = document.querySelector('.nav');
    btn.addEventListener('click', () => btn.setAttribute('aria-expanded', nav.classList.toggle('open')));
  }

  function hideLoader() {
    const l = document.getElementById('loader');
    if (!l) return;
    l.classList.add('hide'); document.body.classList.add('loaded');
    setTimeout(() => l.remove(), 400);
  }

  // مساعدات مشتركة
  const H = window.H = {
    CONFIG, esc, url: U, hideLoader,
    qs: n => new URLSearchParams(location.search).get(n),
    price: n => `<span class="price">${Number(n).toLocaleString('en-US')}<img src="${U('assets/riyal-symbol.png')}" alt="ريال سعودي" onerror="this.replaceWith(document.createTextNode(' ر.س'))"></span>`,
    waLink: (phone, text) => `https://wa.me/${String(phone).replace(/\D/g,'').replace(/^0/,'966')}?text=${encodeURIComponent(text || '')}`,
    card: p => `<a class="card" href="${U('property.html')}?id=${encodeURIComponent(p.id)}">
      <div class="card-img"><img loading="lazy" src="${esc((p.images || [])[0] || '')}" alt="${esc(p.name)}">${p.featured ? '<span class="badge">مميز</span>' : ''}</div>
      <div class="card-body"><h3>${esc(p.name)}</h3><div class="card-district">${esc(p.district)}</div>${H.price(p.price)}</div></a>`,
    toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3000); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    inject();
    // الصفحة اللي بتجلب بيانات تحط <body data-hold> وتنادي H.hideLoader() بعد التحميل
    if (!document.body.hasAttribute('data-hold')) window.addEventListener('load', () => setTimeout(hideLoader, 300));
    setTimeout(hideLoader, 8000); // أمان
  });
})();
