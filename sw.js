// Zet de viewer offline beschikbaar: eerst uit de cache, anders van het netwerk (en dan bewaren).
const CACHE = 'abn-pdf-viewer-v6';
const CORE = ['./', 'index.html', 'css/viewer.css', 'js/viewer.js', 'logo.png', 'lib/pdf-lib.min.js', 'lib/pdfjs/pdf.min.js', 'lib/pdfjs/pdf.worker.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(CORE.map((u) => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  const u = new URL(r.url);
  if (u.pathname.endsWith('manifest.webmanifest') || u.pathname.includes('/icons/')) { // altijd vers ophalen, zodat nieuwe pictogrammen doorkomen
    e.respondWith(fetch(r).catch(() => caches.match(r))); return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(r, copy)); } return res; })));
});
