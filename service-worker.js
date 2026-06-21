const CACHE='pisl-fieldops-v39-1-fcm-core';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./css/main.css','./js/app.js','./js/firebase-config.js','./manifest.json','./logo.png','./firebase-messaging-sw.js'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data?.text()||'New update'}};const n=d.notification||d; e.waitUntil(self.registration.showNotification(n.title||'PISL FieldOps',{body:n.body||'New field update',icon:'logo.png',badge:'logo.png',vibrate:[180,80,180],data:n.click_action||d.url||'./index.html'}));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data||'./index.html'));});
