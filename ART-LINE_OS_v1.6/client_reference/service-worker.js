const CACHE='artline-os-v1-6';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./offline.html','./calculator.html','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png','./assets/favicon-32.png','./assets/blank_sample_1.jpg','./assets/blank_sample_2.jpg','./assets/ДОГОВОР_пример.doc','./assets/Спецификация_пример.docx','./assets/Шаблон_импорта_клиентов_ART-LINE_OS.xlsx','./assets/Шаблон_импорта_клиентов_ART-LINE_OS.csv','./assets/План_заказов_пример.xlsx','./assets/Счет_пример_1319.pdf','./assets/Шаблон_реестра_документов_ART-LINE_OS.csv'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(caches.match(event.request).then(resp=>resp||fetch(event.request).catch(()=>caches.match('./offline.html'))));
});
