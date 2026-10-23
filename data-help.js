(()=>{
'use strict';
const btn=document.getElementById('dataHelpBtn'), dlg=document.getElementById('dataHelpDialog'), close=document.getElementById('dataHelpClose'), ok=document.getElementById('dataHelpConfirm');
if(!btn||!dlg||!close||!ok)return;
const translations={
 ko:['데이터 보관 안내','내 데이터 보관 안내','즐겨찾기, 나중에 보기, 내 평점은 현재 브라우저에 저장됩니다.','데이터가 삭제될 수 있습니다','브라우저 데이터 삭제, 브라우저 프로필 변경, 기기 초기화 시 저장한 데이터가 사라질 수 있으며 자동 복구가 보장되지 않습니다.','<strong>안전하게 보관하려면</strong> 즐겨찾기 / 나중에 보기 / 내 평점 목록에서 <b>내보내기</b> 버튼을 눌러 JSON 파일을 다운로드하고, 다른 기기나 클라우드에도 백업해 두세요. 필요할 때 <b>가져오기</b>로 복원할 수 있습니다.','확인'],
 en:['Data storage help','Keep your data safe','Favorites, Watch Later, and My Ratings are saved in this browser.','Your data can be deleted','Clearing browser data, switching browser profiles, or resetting your device may permanently erase your saved lists. Recovery is not guaranteed.','<strong>To keep your data safe,</strong> open Favorites, Watch Later, and My Ratings and use <b>Export</b> to download JSON backups. Store them on another device or in cloud storage. Use <b>Import</b> to restore them.','Got it'],
 ja:['データ保存のご案内','データ保存のご案内','お気に入り・後で見る・マイ評価は、このブラウザに保存されています。','データが消える場合があります','ブラウザデータの削除、プロファイルの変更、端末の初期化によりデータが失われる場合があります。復元は保証されません。','<strong>データを守るために</strong>各リストの<b>エクスポート</b>からJSONファイルをダウンロードし、別の端末やクラウドにも保存してください。<b>インポート</b>で復元できます。','確認'],
 zh:['数据保存说明','保护您的数据','收藏、稍后观看和我的评分保存在当前浏览器中。','数据可能会丢失','清除浏览器数据、更换浏览器用户配置或重置设备，可能导致数据丢失，且无法保证恢复。','<strong>为安全保存数据，</strong>请在对应列表点击<b>导出</b>，下载 JSON 文件，并保存到其他设备或云端。您可以通过<b>导入</b>恢复数据。','知道了'],
 fr:['Aide sur les données','Conservation des données','Favoris, À regarder plus tard et Mes notes sont enregistrés dans ce navigateur.','Vos données peuvent être effacées','Effacer les données du navigateur, changer de profil ou réinitialiser l’appareil peut supprimer vos données. Leur récupération n’est pas garantie.','<strong>Pour protéger vos données,</strong> utilisez <b>Exporter</b> dans chaque liste pour télécharger des fichiers JSON, puis conservez-les sur un autre appareil ou dans le cloud. Utilisez <b>Importer</b> pour les restaurer.','Compris']
};
function translate(){const language=document.getElementById('langSelect')?.value||'ko';const t=translations[language]||translations.ko;btn.setAttribute('aria-label',t[0]);btn.title=t[0];['dataHelpTitle','dataHelpDesc','dataHelpWarningTitle','dataHelpWarningBody','dataHelpActionText','dataHelpConfirm'].forEach((id,i)=>{const el=document.getElementById(id);if(i===4)el.innerHTML=t[i+1];else el.textContent=t[i+1];});}
let previousFocus;
function show(){translate();previousFocus=document.activeElement;dlg.classList.remove('hidden');btn.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';close.focus();}
function hide(){if(dlg.classList.contains('hidden'))return;dlg.classList.add('hidden');btn.setAttribute('aria-expanded','false');document.body.style.overflow='';(previousFocus&&previousFocus.isConnected?previousFocus:btn).focus();}
btn.addEventListener('click',show);close.addEventListener('click',hide);ok.addEventListener('click',hide);dlg.addEventListener('click',e=>{if(e.target===dlg)hide();});
document.addEventListener('keydown',e=>{if(dlg.classList.contains('hidden'))return;if(e.key==='Escape'){e.preventDefault();hide();}else if(e.key==='Tab'){const first=close,last=ok;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.getElementById('langSelect')?.addEventListener('change',translate);translate();
})();
