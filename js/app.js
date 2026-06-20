const VERSION = 'v37.1 Polished Enterprise Scale Architecture';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBSJdmxuLDMLv6Tv13vo7ho9t2v1v1yT38",
  authDomain: "pisl-field-ops.firebaseapp.com",
  projectId: "pisl-field-ops",
  storageBucket: "pisl-field-ops.firebasestorage.app",
  messagingSenderId: "244015324981",
  appId: "1:244015324981:web:e990586d3636c55cdaf67c"
};

const DEFAULT_USERS = [
  {id:'u1', username:'sandeep', password:'admin123', name:'Sandeep K', role:'Admin', squad:'Management'},
  {id:'u2', username:'partner', password:'partner123', name:'Business Partner', role:'Partner', squad:'Accounts & Logistics'},
  {id:'u3', username:'ramesh', password:'eng123', name:'Ramesh', role:'Engineer', squad:'Projects Squad'},
  {id:'u4', username:'nanda', password:'eng123', name:'Nandakumara M', role:'Engineer', squad:'Projects Squad'},
  {id:'u5', username:'service1', password:'eng123', name:'Service Eng 1', role:'Engineer', squad:'Service/AMC Squad'}
];

let state = {
  users: DEFAULT_USERS.slice(),
  jobs: [],
  proposals: [],
  clients: ['Swiggy', 'Tablespace', 'Clicktech', 'Tekion', 'PayPal', 'Godrej', 'BAHL'],
  sites: ['Terminal 1 Site', 'Whitefield Zone', 'Electronic City Facility', '16th Floor Corporate HQ']
};

let current = null;
let activeView = 'dashboard';
const LS = 'pisl_fieldops_enterprise_state';
let db = null, cloudReady = false;
let lastVisibleJobDoc = null;
const JOBS_PAGE_SIZE = 15;
window.currentJobFilters = { status: 'All', engineer: 'All' };

function normalizeState() {
  if (!state || typeof state !== 'object') state = {};
  if (!Array.isArray(state.users)) state.users = DEFAULT_USERS.slice();
  if (!Array.isArray(state.jobs)) state.jobs = [];
  if (!Array.isArray(state.proposals)) state.proposals = [];
  return state;
}

function load() {
  try {
    let s = JSON.parse(localStorage.getItem(LS));
    if (s) { state = Object.assign(state, s); normalizeState(); }
  } catch(e) { console.warn('Fallback local storage state loaded', e); }
}

function save() {
  normalizeState();
  localStorage.setItem(LS, JSON.stringify(state));
}

async function initFirebase() {
  if (typeof firebase === 'undefined') return false;
  try {
    if (!firebase.apps.length) firebase.initializeApp(DEFAULT_FIREBASE_CONFIG);
    if (firebase.auth && !firebase.auth().currentUser) {
      try { await firebase.auth().signInAnonymously(); } catch(authErr) { console.warn('Anonymous auth failed, continuing if rules allow public test access.', authErr); }
    }
    db = firebase.firestore();
    cloudReady = true;
    return true;
  } catch(e) {
    console.warn('Firebase initialization skipped. Running local mode.', e);
    cloudReady = false;
    return false;
  }
}

async function login() {
  load();
  const uVal = document.getElementById('u').value.trim().toLowerCase();
  const pVal = document.getElementById('p').value.trim();
  const user = state.users.find(x => x.username.toLowerCase() === uVal && x.password === pVal);
  
  if (!user) {
    document.getElementById('loginMsg').textContent = 'Invalid parameters.';
    return;
  }
  current = user;
  document.getElementById('login').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('who').textContent = current.name;
  document.getElementById('role').textContent = `${current.role} [${current.squad}]`;
  
  await initFirebase();
  buildNav();
  go('dashboard');
}

function logout() {
  current = null;
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function buildNav() {
  let navItems = [['dashboard', 'Dashboard'], ['jobs', 'Jobs']];
  if (['Admin','Coordinator','Supervisor','Engineer'].includes(current.role)) {
    navItems.push(['create', 'Create Job']);
  }
  if (['Admin','Partner','Coordinator'].includes(current.role)) {
    navItems.push(['proposal', 'Proposal / Quotation']);
  }
  if (current.role === 'Admin') {
    navItems.push(['settings', 'Settings']);
  }
  const navBox = document.getElementById('nav');
  navBox.innerHTML = navItems.map(i => `<button type="button" class="${activeView===i[0]?'active':''}" onclick="go('${i[0]}')">${i[1]}</button>`).join('');
}

function toggleMenu() {
  document.getElementById('side').classList.toggle('open');
  document.getElementById('drawerBackdrop').classList.toggle('show');
}

function go(v) {
  activeView = v;
  const titles = {dashboard:'Dashboard', jobs:'Jobs', create:'Create Job', proposal:'Proposal / Quotation', settings:'Settings'};
  const sub = {dashboard:'Live field operations overview', jobs:'View, update and close operational tickets', create:'Create and assign field jobs', proposal:'Create and manage proposals', settings:'Administration and database tools'};
  if (document.getElementById('pageTitle')) document.getElementById('pageTitle').textContent = titles[v] || 'PISL FieldOps';
  if (document.getElementById('pageSubtitle')) document.getElementById('pageSubtitle').textContent = sub[v] || ''; 
  buildNav();
  document.getElementById('side').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('show');
  
  if (v === 'jobs') {
    fetchJobsPage(true);
  } else {
    render();
  }
}

async function fetchJobsPage(isFirstLoad = true) {
  if (!db || !cloudReady) { render(); return; }
  
  try {
    let query = db.collection('jobs').orderBy('createdAt', 'desc');
    
    if (current.role === 'Engineer') {
      query = query.where('assignedTo', '==', current.name);
    } else {
      if (window.currentJobFilters.status !== 'All') {
        query = query.where('status', '==', window.currentJobFilters.status);
      }
      if (window.currentJobFilters.engineer !== 'All') {
        query = query.where('assignedTo', '==', window.currentJobFilters.engineer);
      }
    }
    
    if (isFirstLoad) {
      lastVisibleJobDoc = null;
      state.jobs = [];
    } else if (lastVisibleJobDoc) {
      query = query.startAfter(lastVisibleJobDoc);
    }
    
    query = query.limit(JOBS_PAGE_SIZE);
    const snapshot = await query.get();
    
    if (!snapshot.empty) {
      lastVisibleJobDoc = snapshot.docs[snapshot.docs.length - 1];
      snapshot.forEach(doc => {
        let data = doc.data();
        data.firestoreId = doc.id;
        state.jobs.push(data);
      });
    }
    save();
    render();
    appendPaginationControls(snapshot.docs.length === JOBS_PAGE_SIZE);
  } catch (err) {
    console.error("Scale Query Execution Failed:", err);
    render();
  }
}

function appendPaginationControls(hasNextPage) {
  const tableContainer = document.querySelector('.tablewrap');
  if (!tableContainer) return;
  
  const oldControls = document.getElementById('paginationUI');
  if (oldControls) oldControls.remove();
  
  const uiDiv = document.createElement('div');
  uiDiv.id = 'paginationUI';
  uiDiv.style.margin = '14px 0';
  uiDiv.style.display = 'flex';
  uiDiv.style.justifyContent = 'space-between';
  
  uiDiv.innerHTML = `
    <button class="btn secondary" onclick="fetchJobsPage(true)" style="width:auto;">🔄 Refresh</button>
    ${hasNextPage ? `<button class="btn ok" onclick="fetchJobsPage(false)" style="width:auto;">Load Next ${JOBS_PAGE_SIZE} Tickets ➡️</button>` : '<span class="pill ok">All records loaded</span>'}
  `;
  tableContainer.after(uiDiv);
}

function render() {
  const container = document.getElementById('view');
  if (activeView === 'dashboard') renderDashboard(container);
  else if (activeView === 'jobs') renderJobs(container);
  else if (activeView === 'create') renderCreate(container);
  else if (activeView === 'proposal') renderProposal(container);
  else if (activeView === 'settings') renderSettings(container);
}

function renderDashboard(el) {
  let openJobs = state.jobs.filter(j => j.status !== 'Closed').length;
  let pipeline = state.proposals.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  el.innerHTML = `
    <div class="grid">
      <div class="card stat" onclick="go('jobs')">
        <span class="muted">Loaded Active Tickets</span>
        <h2>${openJobs} Open</h2>
      </div>
      <div class="card stat" onclick="go('proposal')">
        <span class="muted">Accounts Funnel</span>
        <h2>₹ ${pipeline.toLocaleString('en-IN')}</h2>
      </div>
      <div class="card stat">
        <span class="muted">Operational Efficiency</span>
        <h2>99.4%</h2>
      </div>
      <div class="card stat">
        <span class="muted">Active Staff Sync</span>
        <h2>15-20 Active</h2>
      </div>
    </div>
  `;
}

function getSystemChecklist(type) {
  if (type.includes('Notifier') || type.includes('Fire')) {
    return ["Verify EOL resistor loop structural loads.", "Measure ground isolation voltage values.", "Validate SLC line data continuous loop signals."];
  }
  if (type.includes('Win-PAK') || type.includes('Access')) {
    return ["Test RS-485 control bus node signaling loops.", "Verify clean secondary biometric battery supply rails.", "Map enclosure tamper switch responses."];
  }
  return ["Perform loop continuity wire checks.", "Verify stable operating supply voltage metrics.", "Confirm logic terminal addressing parameters."];
}

function renderJobs(el) {
  let html = `
    <div class="card">
      <h3>Active Task & Field Commission Registry</h3>
      <div class="tablewrap">
        <table>
          <thead>
            <tr><th>Ticket ID</th><th>Customer Account</th><th>Framework</th><th>Assigned To</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
  `;
  if (state.jobs.length === 0) {
    html += `<tr><td colspan="6" style="text-align:center;" class="muted">No current sync parameters loaded.</td></tr>`;
  } else {
    state.jobs.forEach((j, index) => {
      html += `
        <tr>
          <td><strong>${j.id}</strong></td>
          <td>${j.client}<br><span class="muted">${j.site}</span></td>
          <td><span class="pill warn">${j.systemType}</span></td>
          <td>${j.assignedTo}</td>
          <td><span class="pill ${j.status==='Closed'?'ok':'warn'}">${j.status}</span></td>
          <td><button class="btn secondary" onclick="viewJobTicket(${index})">Open Form</button></td>
        </tr>
      `;
    });
  }
  html += `</tbody></table></div></div><div id="ticketDetailArea"></div>`;
  el.innerHTML = html;
}

function viewJobTicket(idx) {
  const j = state.jobs[idx];
  const list = getSystemChecklist(j.systemType);
  let checkHtml = `<div class="checklist-box"><h4>Mandatory Verification Checklist</h4>`;
  
  list.forEach((item, cIdx) => {
    let checked = (j.checklist && j.checklist[cIdx]) ? "checked" : "";
    checkHtml += `
      <div class="checklist-item">
        <input type="checkbox" id="chk_${cIdx}" ${checked} onchange="toggleCheckItem(${idx}, ${cIdx})">
        <label for="chk_${cIdx}">${item}</label>
      </div>
    `;
  });
  checkHtml += `</div>`;

  document.getElementById('ticketDetailArea').innerHTML = `
    <div class="card">
      <h3>Execution Core Layout: ${j.id}</h3>
      ${checkHtml}
      <div class="field">
        <label>Engineering Observations / Comments Log</label>
        <textarea id="ticketLogs">${j.logs || ''}</textarea>
      </div>
      <div class="actions">
        <button class="btn ok" onclick="updateTicketState(${idx}, 'In Progress')">Set In Progress</button>
        <button class="btn bad" onclick="updateTicketState(${idx}, 'Closed')">Handover & Close Ticket</button>
      </div>
    </div>
  `;
}

function toggleCheckItem(jobIdx, checkIdx) {
  if(!state.jobs[jobIdx].checklist) state.jobs[jobIdx].checklist = {};
  state.jobs[jobIdx].checklist[checkIdx] = document.getElementById(`chk_${checkIdx}`).checked;
  saveLocalAndCloudJob(state.jobs[jobIdx]);
}

function updateTicketState(idx, targetStatus) {
  const j = state.jobs[idx];
  const list = getSystemChecklist(j.systemType);
  
  if (targetStatus === 'Closed') {
    for (let i = 0; i < list.length; i++) {
      if (!j.checklist || !j.checklist[i]) {
        alert(`Verification Failure: "${list[i]}" check must be marked complete before system handover.`);
        return;
      }
    }
  }
  state.jobs[idx].status = targetStatus;
  state.jobs[idx].logs = document.getElementById('ticketLogs').value;
  saveLocalAndCloudJob(state.jobs[idx]);
  go('jobs');
}

function saveLocalAndCloudJob(job) {
  save();
  if (db && cloudReady && job.firestoreId) {
    db.collection('jobs').doc(job.firestoreId).update(job).catch(e => console.warn("Cloud save deferred: ", e));
  }
}

function renderCreate(el) {
  let userOptions = state.users.filter(u => u.role === 'Engineer')
    .map(u => `<option value="${u.name}">${u.name}</option>`).join('');

  el.innerHTML = `
    <div class="card">
      <h3>Dispatch New System Ticket</h3>
      <div class="field">
        <label>Account Target</label>
        <select id="c_client">${state.clients.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>Facility Site Layout</label>
        <select id="c_site">${state.sites.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
      </div>
      <div class="field">
        <label>System Platform Target</label>
        <select id="c_system">
          <option value="Notifier Fire Alarm System">Notifier Fire Alarm Loop Integration</option>
          <option value="Honeywell Win-PAK Access Control">Honeywell Win-PAK Controller Matrix</option>
        </select>
      </div>
      <div class="field">
        <label>Primary Field Engineer Assignment</label>
        <select id="c_assigned">${userOptions}</select>
      </div>
      <button class="btn" style="width:100%;" onclick="submitTicketForm()">Publish Ticket to Cloud</button>
    </div>
  `;
}

function submitTicketForm() {
  let newJob = {
    id: 'TKT-' + Math.floor(Math.random() * 90000 + 10000),
    client: document.getElementById('c_client').value,
    site: document.getElementById('c_site').value,
    systemType: document.getElementById('c_system').value,
    assignedTo: document.getElementById('c_assigned').value,
    status: 'Assigned', logs: '', checklist: {},
    createdAt: new Date().toISOString()
  };

  if (db && cloudReady) {
    db.collection('jobs').add(newJob).then(() => { go('jobs'); });
  } else {
    state.jobs.push(newJob);
    save();
    go('jobs');
  }
}

function renderProposal(el) {
  let html = `
    <div class="card">
      <h3>Proposals & Estimates Ledger</h3>
      <div class="tablewrap"><table>
          <thead><tr><th>Ref</th><th>Account</th><th>Value</th><th>Status</th></tr></thead>
          <tbody>`;
  state.proposals.forEach(p => {
    html += `<tr><td><b>${p.ref}</b></td><td>${p.client}</td><td>₹ ${p.amount}</td><td>${p.status}</td></tr>`;
  });
  html += `</tbody></table></div></div>`;
  el.innerHTML = html;
}

window.onload = function() { load(); };

function renderSettings(el) {
  if (!current || current.role !== 'Admin') {
    el.innerHTML = `<div class="card"><h3>Access restricted</h3><p class="muted">Only Admin can access settings.</p></div>`;
    return;
  }
  el.innerHTML = `
    <div class="card">
      <h3>Administration</h3>
      <div class="grid two">
        <div>
          <h4>Users</h4>
          <div class="tablewrap"><table><thead><tr><th>Name</th><th>Role</th><th>Username</th></tr></thead><tbody>
            ${state.users.map(u=>`<tr><td>${u.name}</td><td>${u.role}</td><td>${u.username}</td></tr>`).join('')}
          </tbody></table></div>
        </div>
        <div>
          <h4>Database Maintenance</h4>
          <button class="btn secondary" onclick="backupJson()">Backup JSON</button>
          <button class="btn warn" onclick="cleanClosedJobs()">Clean Closed Jobs</button>
          <button class="btn bad" onclick="purgeOperationalData()">Purge Jobs & Proposals</button>
          <p class="muted">Always take backup before purge. Users/customers/sites are retained unless manually edited.</p>
        </div>
      </div>
    </div>
  `;
}

function backupJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pisl-fieldops-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function cleanClosedJobs() {
  if (!confirm('Backup recommended. Delete all locally loaded closed jobs?')) return;
  const closed = state.jobs.filter(j=>j.status==='Closed');
  state.jobs = state.jobs.filter(j=>j.status!=='Closed');
  save();
  if (db && cloudReady) {
    for (const j of closed) {
      if (j.firestoreId) await db.collection('jobs').doc(j.firestoreId).delete().catch(console.warn);
    }
  }
  go('settings');
}

async function purgeOperationalData() {
  if (!confirm('This will clear jobs and proposals from this app state. Continue?')) return;
  state.jobs = [];
  state.proposals = [];
  save();
  alert('Local operational data cleared. For full cloud purge, use Firestore console or collection delete tools.');
  go('settings');
}

function registerPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Service worker registration failed', e));
  }
}
registerPWA();
