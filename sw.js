// সার্ভিস ওয়ার্কার: সবসময় আগে নেট থেকে আনে (তাই পেজ আপডেট দিলে সাথে সাথে নতুন আসে)।
// নেট না থাকলে শুধু আগে দেখা পেজ/ছবি দেখায়। Apps Script-এর ডেটা কখনো ক্যাশ হয় না।
const CACHE = 'school-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;          // API, CDN, ফন্ট — সরাসরি নেটে
  e.respondWith(
    fetch(r).then(function (res) {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(r).then(function (hit) {
        return hit || new Response('<meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>ইন্টারনেট নেই</h2><p>সংযোগ ফিরলে আবার চেষ্টা করুন।</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 });
      });
    })
  );
});
