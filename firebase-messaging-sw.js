importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyBSJdmxuLDMLv6Tv13vo7ho9t2v1v1yT38",
  authDomain: "pisl-field-ops.firebaseapp.com",
  projectId: "pisl-field-ops",
  storageBucket: "pisl-field-ops.firebasestorage.app",
  messagingSenderId: "244015324981",
  appId: "1:244015324981:web:e990586d3636c55cdaf67c"
});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
  const title=payload.notification?.title||'PISL FieldOps';
  const options={body:payload.notification?.body||'New job update',icon:'logo.png',badge:'logo.png',data:payload.data?.url||'./index.html'};
  self.registration.showNotification(title,options);
});
