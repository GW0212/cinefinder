/* v12.1 mobile dialog convenience. Preserve each dialog’s built-in close handlers. */
(()=>{
 const map=[['modal','modalClose'],['ratingPptDialog','ratingPptClose'],['cloudDialog','cloudClose'],['dataHelpDialog','dataHelpClose'],['dataSafetyDialog','dataSafetyClose']];
 function topDialog(){return map.find(([id])=>{const el=document.getElementById(id);return el&&!el.classList.contains('hidden')&&getComputedStyle(el).display!=='none';});}
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const top=topDialog();if(!top)return;const close=document.getElementById(top[1]);if(close){e.preventDefault();close.click();}});
 // Background tap on export panel: never close while generating a PDF.
 const ppt=document.getElementById('ratingPptDialog');
 ppt?.addEventListener('click',e=>{if(e.target!==ppt)return;const close=document.getElementById('ratingPptClose');if(close&&!close.disabled)close.click();});
})();
