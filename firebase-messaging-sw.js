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
firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
  const type = payload?.data?.type || payload?.notification?.tag || '';
  const allowed = ['new_ticket_assigned','ticket_reassigned','escalation','customer_approved_report','ticket_closed'];
  if(type && !allowed.includes(type)) return;
  self.registration.showNotification(payload.notification?.title||'PISL FieldOps',{
    body:payload.notification?.body||'Important FieldOps update',
    icon:'assets/logo.png',
    badge:'assets/logo.png',
    data: payload.data || {}
  });
});
self.addEventListener('notificationclick', event=>{
  event.notification.close();
  const ticket = event.notification.data?.ticket || event.notification.data?.ticketNo || '';
  const url = ticket ? `./?ticket=${encodeURIComponent(ticket)}` : './';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list){ if('focus' in client){ client.focus(); client.postMessage({type:'open-ticket',ticket}); return; } }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
