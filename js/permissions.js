import { getUser, isAssigned } from './state.js';
export function role(){return getUser()?.role||'Guest'}
export function isAdmin(){return role()==='Super Admin'}
export function isCoordinator(){return role()==='Coordinator'}
export function isSupervisor(){return role()==='Supervisor'}
export function isEngineer(){return role()==='Engineer'}
export function isViewer(){return role()==='Viewer'}
export function canManageUsers(){return isAdmin()}
export function canManageMasters(){return isAdmin()||isCoordinator()}
export function canCreateJob(){return !isViewer()}
export function canAssignJob(job){return isAdmin()||isCoordinator()||isSupervisor() || (isEngineer() && job?.createdBy===getUser()?.id)}
export function canReassignJob(job){return isAdmin()||isCoordinator()||isSupervisor()}
export function canDeleteJob(job){ if(!job || job.status==='Closed') return false; const u=getUser(); if(isAdmin()||isCoordinator()||isSupervisor()) return true; return isEngineer() && job.createdBy===u.id && job.assignedTo===u.id; }
export function canCloseJob(job){ const u=getUser(); if(!job || job.status==='Closed') return false; if(isAdmin()||isCoordinator()||isSupervisor()) return true; return isEngineer() && job.type==='Service Call' && job.createdBy===u.id && job.assignedTo===u.id; }
export function canWorkJob(job){return !isViewer() && (isAdmin()||isCoordinator()||isSupervisor()||isAssigned(job,getUser())||job.createdBy===getUser()?.id)}
export function canViewJob(job){ const u=getUser(); if(isAdmin()||isCoordinator()||isSupervisor()) return true; if(isViewer()) return true; return isAssigned(job,u)||job.createdBy===u.id; }
