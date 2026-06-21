const CACHE='pisl-fieldops-v39-0-advanced';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./css/main.css','./js/app.js','./js/firebase-config.js','./manifest.json','./logo.png'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{const d=e.data?e.data.json():{title:'PISL FieldOps',body:'New update'};e.waitUntil(self.registration.showNotification(d.title||'PISL FieldOps',{body:d.body||'New update',icon:'logo.png',vibrate:[180,80,180],data:d.url||'./index.html'}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data||'./index.html'));});
