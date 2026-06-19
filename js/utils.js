export function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
export function money(n){return '₹ '+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2,minimumFractionDigits:2})}
export function toast(msg){const t=document.getElementById('toast'); const d=document.createElement('div'); d.className='toast'; d.textContent=msg; t.appendChild(d); setTimeout(()=>d.remove(),2600)}
export function getFormData(form){return Object.fromEntries(new FormData(form).entries())}
export function download(filename, content, type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
export function printHtml(html){const w=open('','_blank');w.document.write(`<html><head><title>Report</title><link rel="stylesheet" href="css/main.css"></head><body>${html}<script>setTimeout(()=>print(),300)<\/script></body></html>`);w.document.close()}
export function csv(rows){return rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\n')}
export function shortDate(iso){try{return new Date(iso).toLocaleString('en-IN')}catch{return ''}}
