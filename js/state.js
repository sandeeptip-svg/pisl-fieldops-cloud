import { writeShared, subscribeShared } from './firebase.js';
export const VERSION='v36.0 Stable Architecture';
const today = new Date().toISOString().slice(0,10);
export const roles=['Super Admin','Coordinator','Supervisor','Engineer','Viewer'];
export const jobTypes=['Service Call','PM Visit','AMC Visit','Survey','Installation','Commissioning','Project Work','Snag','Handover'];
export const systems=['CCTV','ACS','FAS','PAS','WLD','Fire Extinguishers','Networking','Rodent Repellent','LED Signage'];
export const statuses=['Created','Assigned','Accepted','Traveling','Checked-In','Working','Report Draft','Report Shared','Checked-Out','Awaiting Closure','Closed'];
export const defaultState={
  schema:36, version:VERSION, seq:3500, updatedAt:Date.now(),
  settings:{company:'Payaswini Integrated Solutions', tagline:'Integrated Service Management Platform', superAdmin:'sandeep'},
  users:[
    {id:'u-sandeep',username:'sandeep',password:'admin123',name:'Sandeep K',role:'Super Admin',email:'sandeep.k@payaswini.in',mobile:'9538164412',active:true,reportsTo:''},
    {id:'u-coord',username:'coordinator',password:'coord123',name:'Coordinator',role:'Coordinator',active:true,reportsTo:'u-sandeep'},
    {id:'u-super',username:'supervisor',password:'super123',name:'Supervisor',role:'Supervisor',active:true,reportsTo:'u-sandeep'},
    {id:'u-eng',username:'engineer',password:'eng123',name:'Engineer',role:'Engineer',active:true,reportsTo:'u-super'},
    {id:'u-viewer',username:'viewer',password:'view123',name:'Viewer',role:'Viewer',active:true,reportsTo:'u-sandeep'}
  ],
  customers:[{id:'c1',name:'Test Client',address:'Bangalore',contact:'FM Team',email:'',mobile:''}],
  sites:[{id:'s1',customerId:'c1',name:'Bangalore Mahadevapura',address:'Bengaluru'}],
  assets:[{id:'a1',customerId:'c1',siteId:'s1',system:'PAS',assetName:'PA Amplifier',make:'',model:'',qty:1,location:'Server Room',status:'Active'}],
  jobs:[], notifications:[], proposals:[], reports:[]
};
let state = structuredClone(defaultState); let currentUser=null; let currentView='dashboard'; let activeJobId=null; let saveTimer=null; let suppressRender=false;
export function getState(){return state} export function setState(s){state={...structuredClone(defaultState),...s}; if(!state.users?.length)state.users=structuredClone(defaultState.users)}
export function getUser(){return currentUser} export function setUser(u){currentUser=u} export function getView(){return currentView} export function setView(v){currentView=v} export function getActiveJobId(){return activeJobId} export function setActiveJobId(id){activeJobId=id}
export function uid(prefix='id'){return prefix+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}
export function now(){return new Date().toLocaleString('en-IN')} export function iso(){return new Date().toISOString()}
export function nextTicket(type='Service Call'){ const code= type.includes('PM')?'PM':type.includes('Survey')?'SUR':type.includes('Install')?'INS':type.includes('Commission')?'COM':'SRV'; state.seq=(state.seq||3500)+1; return `${code}-${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}-${state.seq}` }
export function notify(userIds,title,message,jobId=''){ const ids=[...new Set((Array.isArray(userIds)?userIds:[userIds]).filter(Boolean))]; ids.forEach(uid=>state.notifications.unshift({id:uidFn(),userId:uid,title,message,jobId,read:false,at:iso()})); }
function uidFn(){return 'n-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6)}
export function addLog(job,stage,detail=''){job.logs=job.logs||[]; job.logs.unshift({stage,detail,by:currentUser?.id||'',byName:currentUser?.name||'',at:iso(),displayAt:now()});}
export function saveCloud(){ state.updatedAt=Date.now(); clearTimeout(saveTimer); saveTimer=setTimeout(()=>writeShared(state).catch(e=>console.error('Cloud save failed',e)),350); }
export function saveNow(){ state.updatedAt=Date.now(); return writeShared(state).catch(e=>console.error(e)); }
export function subscribe(onChange){ return subscribeShared(data=>{ if(!data){ saveNow(); return; } if(data.updatedAt && data.updatedAt>=state.updatedAt){ setState(data); if(!suppressRender) onChange(); } }, e=>console.error('Firestore subscription failed',e)); }
export function pauseRender(flag){suppressRender=flag}
export function userById(id){return state.users.find(u=>u.id===id)} export function userByName(un){return state.users.find(u=>u.username?.toLowerCase()===un?.toLowerCase()&&u.active!==false)}
export function customerById(id){return state.customers.find(c=>c.id===id)} export function siteById(id){return state.sites.find(s=>s.id===id)}
export function isAssigned(job,user=currentUser){return job.assignedTo===user?.id || (job.supportUsers||[]).includes(user?.id)}
