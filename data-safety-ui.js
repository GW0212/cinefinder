(()=>{
'use strict';
const btn=document.getElementById('dataSafetyBtn'),dlg=document.getElementById('dataSafetyDialog'),close=document.getElementById('dataSafetyClose');
if(!btn||!dlg||!close)return;
let lastFocus=null,priorOverflow='';
function show(){lastFocus=document.activeElement;priorOverflow=document.body.style.overflow;dlg.classList.remove('hidden');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';close.focus();}
function hide(){if(dlg.classList.contains('hidden'))return;dlg.classList.add('hidden');btn.setAttribute('aria-expanded','false');document.body.style.overflow=priorOverflow;(lastFocus?.isConnected?lastFocus:btn).focus();}
btn.addEventListener('click',()=>dlg.classList.contains('hidden')?show():hide());
close.addEventListener('click',hide);dlg.addEventListener('click',e=>{if(e.target===dlg)hide();});
document.addEventListener('keydown',e=>{if(dlg.classList.contains('hidden'))return;if(e.key==='Escape'){e.preventDefault();hide();}else if(e.key==='Tab'){const focusable=[...dlg.querySelectorAll('button:not([disabled]),input:not([disabled]):not([hidden])')].filter(el=>el.offsetParent!==null);const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
})();
