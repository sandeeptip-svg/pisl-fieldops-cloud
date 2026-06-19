import { getState, getUser } from './state.js';
import { canViewJob } from './permissions.js';
import { esc } from './utils.js';
export function renderDashboard(){
 const s=getState(), u=getUser(); const jobs=s.jobs.filter(canViewJob); const unread=s.notifications.filter(n=>n.userId===u.id&&!n.read).length;
 const open=jobs.filter(j=>j.status!=='Closed').length, pending=jobs.filter(j=>['Report Draft','Working','Checked-In'].includes(j.status)).length, co=jobs.filter(j=>j.status==='Report Shared').length;
 const rows=jobs.slice(0,8).map(j=>`<tr><td><b>${esc(j.ticket)}</b></td><td>${esc(j.customerName)}<br><span class="sub">${esc(j.siteName)}</span></td><td>${esc(j.type)}<br><span class="pill">${esc(j.priority)}</span></td><td>${(j.systems||[]).map(x=>`<span class="pill blue">${esc(x)}</span>`).join('')}</td><td><span class="pill green">${esc(j.status)}</span></td><td>${esc(j.assignedName||'-')}</td><td><button class="btn secondary" data-open-job="${j.id}">Open</button></td></tr>`).join('')||`<tr><td colspan="7">No jobs found.</td></tr>`;
 return `<div class="cards"><div class="card"><div>My / Team Open Jobs</div><div class="metric">${open}</div></div><div class="card"><div>Pending Report</div><div class="metric">${pending}</div></div><div class="card"><div>Pending Check-Out</div><div class="metric">${co}</div></div><div class="card"><div>Unread Notifications</div><div class="metric">${unread}</div></div></div>
 <div class="card"><h2>Workflow Rules</h2><div class="workflow">${['Assigned','Accepted','Traveling','Checked-In','Working','Report Draft','Report Shared','Checked-Out','Awaiting Closure','Closed'].map(x=>`<span>${x}</span>`).join('')}</div></div>
 <div class="card"><h2>Recent Jobs</h2><table class="table"><thead><tr><th>Ticket</th><th>Client/Site</th><th>Type</th><th>Systems</th><th>Status</th><th>Assigned</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
