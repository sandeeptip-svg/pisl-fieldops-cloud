import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

export const firebaseConfig = {
  apiKey: 'AIzaSyBSJdmxuLDMLv6Tv13vo7ho9t2v1v1yT38',
  authDomain: 'pisl-field-ops.firebaseapp.com',
  projectId: 'pisl-field-ops',
  storageBucket: 'pisl-field-ops.firebasestorage.app',
  messagingSenderId: '244015324981',
  appId: '1:244015324981:web:e990586d3636c55cdaf67c',
  measurementId: 'G-CZ2F9J65RB'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const sharedRef = doc(db, 'pislFieldOps', 'sharedState');

export async function ensureAuth(){
  if(auth.currentUser) return auth.currentUser;
  await signInAnonymously(auth);
  return new Promise(resolve=>onAuthStateChanged(auth,u=>u&&resolve(u)));
}

export async function readShared(){
  await ensureAuth();
  const snap = await getDoc(sharedRef);
  return snap.exists() ? snap.data() : null;
}

export async function writeShared(data){
  await ensureAuth();
  await setDoc(sharedRef, JSON.parse(JSON.stringify(data)), { merge:false });
}

export function subscribeShared(cb, err){
  ensureAuth().then(()=>onSnapshot(sharedRef, s=>cb(s.exists()?s.data():null), err));
}
