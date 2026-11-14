/* প্রতিটি পেজের <head>-এ শুধু এই এক লাইন:  <script src="pwa.js"></script> */
(function () {
  var p = location.pathname.split('/').pop() || 'index.html';
  var scanner = /^(scan|face|idscan)\.html$/.test(p);
  var site = /^(index\.html|parent\.html)$/.test(p);   // পাবলিক সাইট ও অভিভাবক পেজ = তৃতীয় অ্যাপ
  var color = site ? '#f58a07' : '#0b6b4f';
  var appName = site ? 'ফয়যানে মদীনা' : (scanner ? 'হাজিরা স্ক্যান' : 'স্কুল অফিস');
  function add(tag, attrs) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); document.head.appendChild(e); return e; }
  add('link', { rel: 'manifest', href: site ? 'manifest-site.webmanifest' : (scanner ? 'manifest-scan.webmanifest' : 'manifest-office.webmanifest') });
  add('link', { rel: 'apple-touch-icon', href: site ? 'icon-site-180.png' : 'icon-180.png' });
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'apple-mobile-web-app-title', content: appName });
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });

  /* ---------- 📲 অ্যাপ ইনস্টল বাটন ---------- */
  var installed = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (installed) return;                                  // অ্যাপ থেকেই খোলা — বাটন লাগবে না
  var ua = navigator.userAgent, ios = /iPhone|iPad|iPod/i.test(ua);
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () { var b = document.getElementById('pwaBtn'); if (b) b.remove(); });

  function ui() {
    var st = document.createElement('style');
    st.textContent = '#pwaBtn{position:fixed;right:14px;bottom:16px;z-index:9998;width:48px;height:48px;border-radius:50%;border:0;background:' + color + ';color:#fff;font-size:22px;box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer;display:flex;align-items:center;justify-content:center}' +
      '#pwaBox{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center}' +
      '#pwaBox div{background:#fff;color:#1f2937;width:100%;max-width:480px;border-radius:16px 16px 0 0;padding:18px 18px 22px;font-family:"Hind Siliguri",system-ui,sans-serif;font-size:15px;line-height:1.7}' +
      '#pwaBox b{font-size:17px}#pwaBox button{margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:' + color + ';color:#fff;font-size:15px;font-family:inherit}' +
      '#pwaBox button.l{background:#e5e7eb;color:#111827}@media print{#pwaBtn,#pwaBox{display:none!important}}';
    document.head.appendChild(st);
    var b = document.createElement('button');
    b.id = 'pwaBtn'; b.type = 'button'; b.title = 'অ্যাপ ইনস্টল করুন'; b.setAttribute('aria-label', 'অ্যাপ ইনস্টল করুন'); b.textContent = '📲';
    b.onclick = click; document.body.appendChild(b);
  }
  function close() { var x = document.getElementById('pwaBox'); if (x) x.remove(); }
  function sheet(html) {
    close();
    var o = document.createElement('div'); o.id = 'pwaBox';
    o.innerHTML = '<div>' + html + '<button class="l" type="button">বন্ধ করুন</button></div>';
    o.onclick = function (e) { if (e.target === o || e.target.tagName === 'BUTTON') close(); };
    document.body.appendChild(o);
  }
  function click() {
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; }).catch(function () {});
      return;
    }
    if (ios) sheet('<b>' + appName + ' — অ্যাপ ইনস্টল</b><br>১. Safari-র নিচের <b>শেয়ার</b> বাটন (⬆️) চাপুন<br>২. নিচে নেমে <b>"Add to Home Screen"</b> চাপুন<br>৩. ওপরে <b>"Add"</b> চাপুন<br><small>(Safari ছাড়া অন্য ব্রাউজারে এটা আসে না)</small>');
    else sheet('<b>' + appName + ' — অ্যাপ ইনস্টল</b><br>ব্রাউজারের ওপরের <b>⋮ মেনু</b> খুলে <b>"Install app"</b> বা <b>"Add to Home screen"</b> চাপুন।<br><small>বাটন না এলে Chrome-এ পেজটা খুলুন।</small>');
  }
  if (document.body) ui(); else document.addEventListener('DOMContentLoaded', ui);
})();
