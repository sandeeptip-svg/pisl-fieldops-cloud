import { getState, getUser, saveCloud } from './state.js';
import { esc, shortDate } from './utils.js';
export function renderNotifications(){ const s=getState(), u=getUser(); const list=s.notifications.filter(n=>n.userId===u.id).sort((a,b)=>(b.at||'').localeCompare(a.at||''));
 return `<div class="card"><div class="toolbar"><h2>Notifications</h2><button class="btn secondary" id="markAllRead">Mark all read</button></div>${list.map(n=>`<div class="card" style="box-shadow:none;margin:8px 0;border-left:5px solid ${n.read?'#ccd8e5':'#0f4a8a'}"><b>${esc(n.title)}</b><br>${esc(n.message)}<br><span class="sub">${shortDate(n.at)}</span> ${n.jobId?`<button class="btn secondary" data-open-job="${n.jobId}">Open Job</button>`:''}</div>`).join('')||'No notifications.'}</div>`}
document.addEventListener('click',e=>{ if(e.target.id==='markAllRead'){ const u=getUser(); getState().notifications.forEach(n=>{if(n.userId===u.id)n.read=true}); saveCloud(); window.PISL.render(); }});
