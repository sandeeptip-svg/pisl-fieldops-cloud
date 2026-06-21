// PISL FieldOps Firebase configuration
// Static GitHub Pages build uses Firebase Web SDK v8 CDN loaded in index.html.
// No npm build step is required for this package.
window.firebaseConfig = {
  apiKey: "AIzaSyDBTMoRoIqaq7H374lHOrHSAhjequYBULg",
  authDomain: "pisl-fieldops-cloud-34513.firebaseapp.com",
  projectId: "pisl-fieldops-cloud-34513",
  storageBucket: "pisl-fieldops-cloud-34513.firebasestorage.app",
  messagingSenderId: "812639503479",
  appId: "1:812639503479:web:1f139987c72a1f5df7b272",
  measurementId: "G-651KC9HPPG"
};

// Keep this variable available for existing app code.
var firebaseConfig = window.firebaseConfig;

// FCM Web Push public VAPID key.
// Configured for Minimal Notification Mode. This key is public and safe to include in the web build.
window.FCM_PUBLIC_VAPID_KEY = "BGQHd22sX3OHwGq6dXikeWPdNfSzbHTz4vps1lSgZRGezwn1ph822Ex0KIG3V3IN9UzbGoU1yBPTd1uAQIptq5U";
var FCM_PUBLIC_VAPID_KEY = window.FCM_PUBLIC_VAPID_KEY;
