/* প্রতিটি পেজের <head>-এ শুধু এই এক লাইন:  <script src="pwa.js"></script> */
(function () {
  var p = location.pathname.split('/').pop() || 'index.html';
  var scanner = /^(scan|face|idscan)\.html$/.test(p);
  var site = /^(index\.html|parent\.html)$/.test(p);   // পাবলিক সাইট ও অভিভাবক পেজ = তৃতীয় অ্যাপ
  function add(tag, attrs) { var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); document.head.appendChild(e); }
  add('link', { rel: 'manifest', href: site ? 'manifest-site.webmanifest' : (scanner ? 'manifest-scan.webmanifest' : 'manifest-office.webmanifest') });
  add('link', { rel: 'apple-touch-icon', href: site ? 'icon-site-180.png' : 'icon-180.png' });
  add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
  add('meta', { name: 'apple-mobile-web-app-title', content: site ? 'ফয়যানে মদীনা' : (scanner ? 'হাজিরা' : 'স্কুল অফিস') });
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
})();
