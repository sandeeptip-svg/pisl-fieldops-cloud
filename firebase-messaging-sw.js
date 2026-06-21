importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
const firebaseConfig = {
  apiKey: "AIzaSyBSJdmxuLDMLv6Tv13vo7ho9t2v1v1yT38",
  authDomain: "pisl-field-ops.firebaseapp.com",
  projectId: "pisl-field-ops",
  storageBucket: "pisl-field-ops.firebasestorage.app",
  messagingSenderId: "244015324981",
  appId: "1:244015324981:web:e990586d3636c55cdaf67c"
};
firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{self.registration.showNotification(payload.notification?.title||'PISL FieldOps',{body:payload.notification?.body||'New FieldOps update',icon:'assets/logo.png'});});
