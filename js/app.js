import { ensureAuth } from './firebase.js';
import { defaultState, getState, setState, getUser, setUser, setView, getView, subscribe, userByName, VERSION, saveNow, saveCloud, getActiveJobId, setActiveJobId } from './state.js';
import { esc, toast } from './utils.js';
import { canManageUsers, canManageMasters, canCreateJob, isAdmin } from './permissions.js';
import { renderDashboard } from './dashboard.js';
import { renderJobs, renderCreateJob, renderJobDetail } from './jobs.js';
import { renderNotifications } from './notifications.js';
import { renderUsers } from './users.js';
import { renderMasters } from './masters.js';
import { renderReports } from './reports.js';
import { renderProposals } from './proposals.js';
import { renderAbout } from './about.js';

const appEl=document.getElementById('app');
await ensureAuth();
subscribe(()=>render());
if('serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}

function login(username,password){
  const u=userByName(username?.trim());
  if(!u || u.password!==password){toast('Invalid login credentials');return;}
  setUser(u); setView('dashboard'); localStorage.setItem('pislUser',u.username); render(); toast('Welcome '+u.name);
}
function logout(){setUser(null); localStorage.removeItem('pislUser'); setView('dashboard'); render();}
function nav(v){setView(v); setActiveJobId(null); render(); setTimeout(()=>scrollTo({top:0,behavior:'smooth'}),0)}

function navButton(id,label,show=true){return show?`<button data-nav="${id}" class="${getView()===id?'active':''}">${label}</button>`:''}
function shell(content){
  const u=getUser();
  const unread=getState().notifications.filter(n=>n.userId===u.id&&!n.read).length;
  return `<div class="layout">
    <aside class="sidebar">
      <div class="brand"><img src="assets/logo.png" alt="PISL Logo"></div>
      <div class="who">${esc(u.name)}</div><div class="role">${esc(u.role)}</div>
      <div class="nav">
        ${navButton('dashboard','Dashboard')}
        ${navButton('createJob','Create Job',canCreateJob())}
        ${navButton('jobs','Jobs')}
        ${navButton('notifications',`Notifications ${unread?`<span class="pill red">${unread}</span>`:''}`)}
        ${navButton('reports','Reports')}
        ${navButton('masters','Customers / Sites / Assets',canManageMasters())}
        ${navButton('users','Users & Hierarchy',canManageUsers())}
        ${navButton('proposals','Proposal / Quotation',isAdmin())}
        ${navButton('about','About')}
      </div>
      <button class="btn secondary" id="logoutBtn">Logout</button>
    </aside>
    <main class="main">
      <div class="topbar"><div><h1>PISL FieldOps Enterprise</h1><div class="sub">${VERSION}</div></div><div><b>${esc(u.name)}</b><br><span class="sub">${esc(u.role)}</span></div></div>
      ${content}
    </main>
  </div>`;
}
function loginPage(){return `<div class="login-wrap"><div class="login-card">
  <img class="login-logo" src="assets/logo.png" alt="PISL Logo">
  <h1>PISL FieldOps Enterprise</h1>
  <p>Integrated Service Management Platform</p>
  <form id="loginForm">
    <div class="field"><label>Username</label><input name="username" autocomplete="username" required></div>
    <div class="field"><label>Password</label><input type="password" name="password" autocomplete="current-password" required></div>
    <button class="btn" style="width:100%">Login</button>
  </form>
  <p style="margin-top:20px;font-size:13px">© 2026 Payaswini Integrated Solutions</p>
</div></div>`}
export function render(){
  if(!getUser()){appEl.innerHTML=loginPage(); return;}
  const v=getView(); const activeJob=getActiveJobId(); let content='';
  if(activeJob) content=renderJobDetail(activeJob);
  else if(v==='dashboard') content=renderDashboard();
  else if(v==='jobs') content=renderJobs();
  else if(v==='createJob') content=renderCreateJob();
  else if(v==='notifications') content=renderNotifications();
  else if(v==='reports') content=renderReports();
  else if(v==='masters') content=renderMasters();
  else if(v==='users') content=renderUsers();
  else if(v==='proposals') content=renderProposals();
  else if(v==='about') content=renderAbout();
  appEl.innerHTML=shell(content);
}

document.addEventListener('submit',e=>{
  if(e.target.id==='loginForm'){e.preventDefault(); login(e.target.username.value,e.target.password.value);}
});
document.addEventListener('click',e=>{
  const navEl=e.target.closest('[data-nav]'); if(navEl){e.preventDefault(); nav(navEl.dataset.nav); return;}
  if(e.target.closest('#logoutBtn')) logout();
});
window.PISL={render,nav,saveCloud,saveNow,getState,setState,defaultState,toast};
const last=localStorage.getItem('pislUser'); if(last){const u=userByName(last); if(u){setUser(u);}}
render();
