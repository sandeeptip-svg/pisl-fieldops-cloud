/* PISL FieldOps v41.0 combined PWA + FCM service worker */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDBTMoRoIqaq7H374lHOrHSAhjequYBULg",
  authDomain: "pisl-fieldops-cloud-34513.firebaseapp.com",
  projectId: "pisl-fieldops-cloud-34513",
  storageBucket: "pisl-fieldops-cloud-34513.firebasestorage.app",
  messagingSenderId: "812639503479",
  appId: "1:812639503479:web:1f139987c72a1f5df7b272",
  measurementId: "G-651KC9HPPG"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const type = payload?.data?.type || payload?.notification?.tag || '';
    const allowed = ['new_ticket_assigned','ticket_assigned','ticket_reassigned','escalation','escalated','customer_approved_report','customer_approved','ticket_closed','closed'];
    if (type && !allowed.includes(type)) return;
    self.registration.showNotification(payload.notification?.title || payload.data?.title || 'PISL FieldOps', {
      body: payload.notification?.body || payload.data?.body || 'Important FieldOps update',
      icon: 'assets/logo.png',
      badge: 'assets/logo.png',
      tag: payload.data?.ticketId || payload.data?.ticketNo || type || 'pisl-fieldops',
      data: payload.data || {}
    });
  });
} catch (err) {
  console.warn('FCM service worker init failed', err);
}

const CACHE='pisl-fieldops-v410-connectivity-push-checklists';
const ASSETS=['./','index.html','css/main.css','js/app.js','js/firebase-config.js','manifest.json','assets/logo.png'];

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('index.html'))));
});
self.addEventListener('notificationclick', event=>{
  event.notification.close();
  const ticket = event.notification.data?.ticket || event.notification.data?.ticketNo || event.notification.data?.ticketId || '';
  const url = ticket ? `./?ticket=${encodeURIComponent(ticket)}` : './';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){ if('focus' in client){ client.focus(); client.postMessage({type:'open-ticket',ticket}); return; } }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
