// PISL FieldOps Firebase configuration
// Static GitHub Pages build uses Firebase Web SDK v8 CDN loaded in index.html.
// No npm build step is required for this package.
const firebaseConfig = {
  apiKey: "AIzaSyBSJdmxuLDMLv6Tv13vo7ho9t2v1v1yT38",
  authDomain: "pisl-field-ops.firebaseapp.com",
  projectId: "pisl-field-ops",
  storageBucket: "pisl-field-ops.firebasestorage.app",
  messagingSenderId: "244015324981",
  appId: "1:244015324981:web:e990586d3636c55cdaf67c",
  measurementId: "G-CZ2F9J65RB"
};

// FCM Web Push public VAPID key.
// This is NOT the same as apiKey. Generate it from:
// Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates.
// Configured for Minimal Notification Mode. This key is public and safe to include in the web build.
const FCM_PUBLIC_VAPID_KEY = "BIUTB8H_NWmHwSwzCA2C72CJDnEQnRdqWC5wDpk6LKblXGxmFT8gtuSJq_u1sqndr2e7159exQKv3o8rAjxUPJg";
