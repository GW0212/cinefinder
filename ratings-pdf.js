/* Cinefinder PDF direct download. Never substitute a different title's poster. */
(()=>{
'use strict';
const btn=document.getElementById('ratingPdfCreate');if(!btn)return;
let running=false;
let lastLog=null;
const trace=(r,step,result,extra={})=>{if(lastLog)lastLog.events.push({time:new Date().toISOString(),id:String(r?.id||''),type:r?.type||'',title:r?.title||'',step,result,...extra})};
const bucket=r=>Math.max(0,Math.min(9,Math.ceil(Number(r.rating))-1));
const downloadBlob=(blob,name)=>{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)};
function downloadLog(){if(!lastLog)return;downloadBlob(new Blob([JSON.stringify(lastLog,null,2)],{type:'application/json'}),'Cinefinder_PDF_Diagnostic_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json')}
const logBtn=document.createElement('button');logBtn.type='button';logBtn.textContent='진단 LOG 다운로드';logBtn.id='cinefinderPdfDiagnostic';logBtn.style.cssText='margin:8px 0 0 8px;padding:9px 13px;border:1px solid #bac7d8;border-radius:9px;background:#f8fbff;color:#23476d;font-weight:700;cursor:pointer';logBtn.addEventListener('click',downloadLog);const host=document.getElementById('ratingPdfCreate')?.parentElement;if(host)host.appendChild(logBtn);logBtn.disabled=true;
const ART='cinefinder_rating_original_poster_v1';
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
const kind=r=>r.type==='anime'?'anime':r.type==='drama'?'drama':'movie';
const aliases={'해리포터4':'해리포터와불의잔','해리포터1':'해리포터와마법사의돌','해리포터2':'해리포터와비밀의방','해리포터3':'해리포터와아즈카반의죄수','해리포터5':'해리포터와불사조기사단','해리포터6':'해리포터와혼혈왕자','해리포터7':'해리포터와죽음의성물1부','해리포터8':'해리포터와죽음의성물2부','베놈1':'베놈','겨울왕국1':'겨울왕국','범죄도시1':'범죄도시','베테랑1':'베테랑','조커1':'조커','인사이드아웃1':'인사이드아웃'};
const key=r=>kind(r)+'::'+(aliases[norm(r.title)]||norm(r.title));
const wait=()=>new Promise(r=>setTimeout(r,0));

// Explicit recovery hints for legacy user-generated IDs (not trusted as poster URLs).
// Search by translated titles as well and verify before use.
const LEGACY_POSTER_HINTS = {"겨울 왕국 1":{"media":"movie","id":109445,"english":"Frozen"},"모모노케 히메":{"media":"movie","id":128,"english":"Princess Mononoke"},"그린북":{"media":"movie","id":490132,"english":"Green Book"},"바스터즈 : 거친녀석들":{"media":"movie","id":16869,"english":"Inglourious Basterds"},"인사이드 아웃 1":{"media":"movie","id":150540,"english":"Inside Out"},"범죄 도시 1":{"media":"movie","id":479718,"english":"The Outlaws"},"나타중생 1":{"media":"movie","id":663558,"english":"New Gods: Nezha Reborn"},"귀멸의 칼날 : 환락의 거리편":{"media":"tv","id":85937,"english":"Demon Slayer Kimetsu no Yaiba"},"베테랑 1":{"media":"movie","id":346650,"english":"Veteran"},"월리스와 그로밋: 거대 토끼의 저주":{"media":"movie","id":533,"english":"Wallace & Gromit The Curse of the Were Rabbit"},"사이버 펑크 : 엣지 러너":{"media":"tv","id":105214,"english":"Cyberpunk Edgerunners"},"포비든킹덤":{"media":"movie","id":1729,"english":"The Forbidden Kingdom"},"체인소맨 극장판 : 레제편":{"media":"movie","id":1228246,"english":"Chainsaw Man Reze Arc"},"해리포터 1":{"media":"movie","id":671,"english":"Harry Potter and the Philosopher Stone"},"해리포터 5":{"media":"movie","id":675,"english":"Harry Potter and the Order of the Phoenix"},"선덕 여왕":{"media":"tv","id":14186,"english":"Queen Seondeok"},"아메리칸 쉐프":{"media":"movie","id":212778,"english":"Chef"},"앤더스 게임":{"media":"movie","id":80274,"english":"Enders Game"},"더 발라드 오브 리처드 주얼":{"media":"movie","id":292011,"english":"Richard Jewell"},"전생했더니 슬라임이었던 건에 대하여 2기 1부":{"media":"tv","id":82684,"english":"That Time I Got Reincarnated as a Slime"},"전생했더니 슬라임이었던 건에 대하여 2기 2부":{"media":"tv","id":82684,"english":"That Time I Got Reincarnated as a Slime"},"베놈 1":{"media":"movie","id":335983,"english":"Venom"},"택시 운전사":{"media":"movie","id":437068,"english":"A Taxi Driver"},"해리포터 3":{"media":"movie","id":673,"english":"Harry Potter and the Prisoner of Azkaban"},"더 위쳐 시즌 1":{"media":"tv","id":71912,"english":"The Witcher"},"나타중생 2":{"media":"movie","id":980477,"english":"Ne Zha 2"},"더 위쳐 시즌 2":{"media":"tv","id":71912,"english":"The Witcher"},"더 플랫폼 1":{"media":"movie","id":619264,"english":"The Platform"},"해리포터 7":{"media":"movie","id":12444,"english":"Harry Potter and the Deathly Hallows Part 1"},"암수 살인":{"media":"movie","id":539154,"english":"Dark Figure of Crime"},"해리포터 8":{"media":"movie","id":12445,"english":"Harry Potter and the Deathly Hallows Part 2"},"해리포터 6":{"media":"movie","id":767,"english":"Harry Potter and the Half Blood Prince"},"샤크: 더 스톰":{"media":"tv","id":0,"english":"Shark The Storm"},"조선 미녀 삼총사":{"media":"movie","id":256960,"english":"The Huntresses"},"라스트 갓 파더":{"media":"movie","id":0,"english":"The Last Godfather"},"곰돌이 푸 : 피와 꿀 1":{"media":"movie","id":980078,"english":"Winnie the Pooh Blood and Honey"}};
const POSTER_API_BASE='https://api.themoviedb.org/3';
const POSTER_EXPECTED_ID_LOOKUP = new Map();
function keyTitle(t){return norm(t).replace(/^(the|a)/,'')}
function recoveryHint(item){return LEGACY_POSTER_HINTS[item.title]||null}
function fetchWithDeadline(url,ms=10000){const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),ms);return fetch(url,{signal:ctrl.signal}).finally(()=>clearTimeout(timer))}
async function tmdbPosterRecovery(item){
 const hint=recoveryHint(item);
 const apiKey=(typeof API_KEY!=='undefined'&&API_KEY)||(typeof DEFAULT_TMDB_KEY!=='undefined'&&DEFAULT_TMDB_KEY)||'';
 if(!apiKey){trace(item,'apiRecovery','noKey');return []}
 const query=(route,params)=>{const p=new URLSearchParams({api_key:apiKey,...params});return POSTER_API_BASE+route+'?'+p};
 const candidates=[];const tried=new Set();
 async function detail(media,id){if(!id)return null;const k=media+'/'+id;if(tried.has(k))return null;tried.add(k);
  try{const res=await fetchWithDeadline(query('/'+media+'/'+id,{language:'ko-KR'}));if(!res.ok){trace(item,'apiDetail','http'+res.status,{media,id});return null}const d=await res.json();return d?.poster_path?{media,id,title:d.title||d.name||'',original:d.original_title||d.original_name||'',path:d.poster_path}:null}
  catch(e){trace(item,'apiDetail','networkError',{media,id,message:String(e)})}return null}
 if(hint?.id){const hit=await detail(hint.media,hint.id);if(hit){
   const expected=keyTitle(hint.english),real=[hit.title,hit.original].map(keyTitle);
   const credible=real.some(x=>x && expected && (x===expected || (x.length>7&&expected.includes(x)) || (expected.length>7&&x.includes(expected))));
   if(credible){candidates.push(hit);trace(item,'verifiedLegacyId','found',{media:hit.media,id:hit.id,posterPath:hit.path})}
   else trace(item,'verifiedLegacyId','titleMismatch',{media:hit.media,id:hit.id,actual:hit.title,expected:hint.english});
  }}
 if(/^\d+$/.test(String(item.id))){const hit=await detail(media(item),item.id);if(hit)candidates.push(hit)}
 const queries=[hint?.english, item.title, item.title.replace(/\s*[12]\s*$/,'')].filter(Boolean);
 for(const q of [...new Set(queries)]){
  if(candidates.length)break;
  for(const mt of [...new Set([hint?.media,media(item), 'movie','tv'].filter(Boolean))]){
   try{const res=await fetchWithDeadline(query('/search/'+mt,{language:'en-US',query:q,include_adult:'false'}));
    if(!res.ok){trace(item,'apiSearch','http'+res.status,{query:q,media:mt});continue}
    const data=await res.json();const results=(data.results||[]).filter(x=>x.poster_path);
    let matching=results.filter(x=>keyTitle(x.title||x.name)===keyTitle(q) || keyTitle(x.original_title||x.original_name)===keyTitle(q));
    if(!matching.length && hint?.english && q===hint.english)matching=results.filter(x=>keyTitle(x.title||x.name).includes(keyTitle(q)) || keyTitle(q).includes(keyTitle(x.title||x.name)));
    for(const found of matching.slice(0,2)){const d=await detail(mt,found.id);if(d)candidates.push(d)}
    if(candidates.length)break;
   }catch(e){trace(item,'apiSearch','networkError',{query:q,media:mt,message:String(e)})}
  }
 }
 return [...new Map(candidates.map(x=>[x.path,x])).values()].map(x=>x.path);
}

const POSTER_RECOVERY='cinefinder_pdf_recovered_posters_v3';
const recovered=(()=>{try{return JSON.parse(localStorage.getItem(POSTER_RECOVERY)||'{}')}catch{return {}}})();
const persistRecovery=()=>{try{localStorage.setItem(POSTER_RECOVERY,JSON.stringify(recovered))}catch{}};
const media=r=>kind(r)==='movie'?'movie':'tv';
const posterURL=p=>{
 if(!p)return '';p=String(p).trim();
 if(/^data:image\/(?:jpeg|png|webp);base64,/i.test(p))return p;
 if(/^https:\/\//i.test(p))return p;
 if(/^\/[a-z0-9_-]+\.(?:jpg|jpeg|png|webp)$/i.test(p))return 'https://image.tmdb.org/t/p/w500'+p;
 return '';
};
const sourceKey=r=>typeof ratingKey==='function'?ratingKey(r.type,r.id,r.title):`${r.type}-${r.id}`;
function status(percent,msg){
 let p=Math.max(0,Math.min(100,Math.round(percent)));
 const bar=document.getElementById('ratingPptProgressBar'),label=document.getElementById('ratingPptPercent'),note=document.getElementById('ratingPptProgress');
 if(bar)bar.style.width=p+'%';if(label)label.textContent=p+'%';if(note)note.textContent=msg;
 let badge=document.getElementById('cinefinderPdfStatus');if(!badge){badge=document.createElement('button');badge.id='cinefinderPdfStatus';badge.type='button';badge.style.cssText='position:fixed;bottom:22px;left:18px;z-index:99999;padding:10px 16px;background:#17314b;color:white;border-radius:12px;border:0;box-shadow:0 5px 20px #0004;font-weight:700;cursor:pointer';badge.onclick=()=>{document.getElementById('ratingPptDialog')?.classList.remove('hidden');document.body.classList.add('rating-ppt-open')};document.body.appendChild(badge)}
 badge.textContent='PDF '+p+'% · '+msg;badge.hidden=!running;
}
function chosenItems(){
 // Exactly the same filtered, deduplicated collection as the PDF dialog count.
 if(typeof window.cinefinderPdfSelectedRatings==='function')return window.cinefinderPdfSelectedRatings();
 const list=typeof normalizeRatingList==='function'?normalizeRatingList(getRatingsSync()):getRatingsSync();
 const selected=document.querySelector('#ratingPptTypes .active')?.dataset.type||'all';
 const ranges=new Set([...document.querySelectorAll('#ratingPptRanges input[data-bucket]:checked')].map(x=>+x.dataset.bucket));
 return list.filter(r=>Number.isFinite(+r.rating)&&(selected==='all'||kind(r)===selected)&&ranges.has(Math.max(0,Math.min(9,Math.ceil(+r.rating)-1))));
}
const safeJSON=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{return {}}};
function sources(items){
 const store=safeJSON(ART),matches=typeof ratingCachedMaps==='function'?ratingCachedMaps(items):null;
 const cache=matches?.cached?.items||[];
 const full=typeof getCachedRatingView==='function'?getCachedRatingView(getRatingsSync()):null;
 const allCached=[...cache,...(full?.items||[])];
 const byExact=new Map(),byId=new Map();
 for(const c of allCached){
  const m=c.user_rating_type||(c.media_type==='tv'?'drama':'movie');
  const n=norm(c.user_rating_title||c.title||c.name);
  const path=c.poster_path;if(!path)continue;
  const k=m+'::'+n;
  if(!byExact.has(k))byExact.set(k,path);else if(byExact.get(k)!==path)byExact.set(k,null);
  if(c.id!=null && c.media_type)byId.set(c.media_type+'::'+c.id,path);
 }
 return items.map(r=>{
  const rk=sourceKey(r),linked=matches?.byRatingKey?.get(rk);
  let paths=[linked?.poster_path,store[rk],recovered[key(r)]];
  try{const mk=typeof ratingMatchCacheKey==='function'?ratingMatchCacheKey(r):null;if(mk&&typeof RATING_MATCH_STORE!=='undefined')paths.push(RATING_MATCH_STORE[mk]?.data?.poster_path)}catch{}
  paths.push(byExact.get(kind(r)+'::'+norm(r.title)));
  if(/^\d+$/.test(String(r.id)))paths.push(byId.get(media(r)+'::'+r.id));
  return [...new Set(paths.map(posterURL).filter(Boolean))];
 });
}
function variants(url){
 if(!url)return [];
 const m=url.match(/^https:\/\/image\.tmdb\.org\/t\/p\/(?:w\d+|original)(\/.+)$/);
 const direct=m?[url,'https://image.tmdb.org/t/p/w342'+m[1],'https://image.tmdb.org/t/p/original'+m[1]]:[url];
 const out=[...new Set(direct)];
 // Optional public image proxy fallback uses the SAME asset URL; never searches or substitutes titles.
 if(/^https:\/\/image\.tmdb\.org\//.test(url)){
  out.push('https://wsrv.nl/?url='+encodeURIComponent(url)+'&w=300&output=jpg');
  out.push('https://images.weserv.nl/?url='+encodeURIComponent(url)+'&w=300&output=jpg');
 }
 return [...new Set(out)];
}
async function imageElement(url,timeout=2700,record=()=>{}){
 return new Promise(resolve=>{
  const img=new Image();img.crossOrigin='anonymous';let done=false;
  const timer=setTimeout(()=>finish(null,'timeout'),timeout);
  function finish(x,result){if(done)return;done=true;clearTimeout(timer);img.onload=img.onerror=null;record(url,result);resolve(x)}
  img.onload=()=>finish(img.naturalWidth?img:null,img.naturalWidth?'loaded':'zeroSize');img.onerror=()=>finish(null,'imageError');img.src=url;
 });
}
async function grab(srcs,item){
 const attempts=[...new Set(srcs.flatMap(variants))];
 for(const u of attempts){
  const img=await imageElement(u,2700,(url,result)=>trace(item,'imageRequest',result,{url}));if(!img)continue;
  try{const c=document.createElement('canvas');c.width=180;c.height=270;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,180,270);
   const scale=Math.min(180/img.naturalWidth,270/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   ctx.drawImage(img,(180-w)/2,(270-h)/2,w,h);
   const data=c.toDataURL('image/jpeg',0.86);if(data.length>1000){trace(item,'canvas','ok',{url:u,bytes:data.length});return c}
   trace(item,'canvas','empty',{url:u});
  }catch(err){trace(item,'canvas','failed',{url:u,error:String(err?.name||'')+': '+String(err?.message||err)})}
 }
 return null;
}
function pageCanvas(items,imgs,start,page,allPages,groupLabel){
 const c=document.createElement('canvas');c.width=1488;c.height=1052;const g=c.getContext('2d');
 g.fillStyle='#f6f7fb';g.fillRect(0,0,c.width,c.height);
 g.textBaseline='middle';g.textAlign='left';g.fillStyle='#15243b';g.font='bold 33px sans-serif';g.fillText('CINEFINDER',40,39);
 g.font='bold 26px sans-serif';g.fillText('내 평점  ·  '+groupLabel,480,39);
 g.font='18px sans-serif';g.fillStyle='#69788a';g.fillText((page+1)+' / '+allPages,1350,39);
 g.strokeStyle='#d8deea';g.beginPath();g.moveTo(40,74);g.lineTo(1448,74);g.stroke();
 const cw=342,ch=178,gx=13,gy=9,y0=95;
 for(let i=0;i<20;i++){
  const n=i;if(n>=items.length)break;const r=items[n],x=40+(i%4)*(cw+gx),y=y0+Math.floor(i/4)*(ch+gy);
  g.fillStyle='#fff';g.fillRect(x,y,cw,ch);g.strokeStyle='#d5dce8';g.strokeRect(x,y,cw,ch);
  if(imgs[n])g.drawImage(imgs[n],x+9,y+9,106,160);else {g.fillStyle='#e4e9f1';g.fillRect(x+9,y+9,106,160);g.fillStyle='#445b77';g.font='bold 14px sans-serif';g.fillText('포스터 오류',x+16,y+80)}
  g.save();g.beginPath();g.rect(x+123,y+15,cw-132,108);g.clip();g.font='bold 17px sans-serif';g.fillStyle='#243148';
  let title=String(r.title||'');let lines=[];while(title.length&&lines.length<4){let cut=title.length;while(cut>1&&g.measureText(title.slice(0,cut)).width>cw-143)cut--;lines.push(title.slice(0,cut));title=title.slice(cut)}
  lines.forEach((l,j)=>g.fillText(l,x+123,y+34+j*23));g.restore();
  g.font='bold 17px sans-serif';g.fillStyle='#dc4a35';g.fillText('내 평점 '+Number(r.rating).toFixed(1)+' / 10',x+123,y+147);
 }
 g.font='15px sans-serif';g.fillStyle='#708196';g.fillText('작품 '+(start+1)+'–'+(start+items.length)+' / '+window.__cinefinderPdfItemCount,1190,1021);
 return c;
}
function dataBytes(dataURI){const s=atob(dataURI.split(',')[1]),b=new Uint8Array(s.length);for(let i=0;i<s.length;i++)b[i]=s.charCodeAt(i);return b}
async function pdfFile(pages,groups,items){
 // Portable PDF 1.4: raster artwork plus selectable embedded Unicode text.
 const encoder=new TextEncoder(),chunks=[],refs=[],objects=[];
 const [fontResponse,mappingResponse]=await Promise.all([fetch('vendor/NanumGothic.ttf'),fetch('vendor/nanum-cmap.json')]);
 if(!fontResponse.ok||!mappingResponse.ok)throw new Error('PDF 한글 텍스트 폰트 로딩 실패');
 const fontBytes=new Uint8Array(await fontResponse.arrayBuffer()),glyphMap=await mappingResponse.json();
 const cidMap=new Uint8Array(131072);for(const [uni,gid] of Object.entries(glyphMap)){const n=+uni;cidMap[n*2]=(gid>>>8)&255;cidMap[n*2+1]=gid&255}
 const fontFile=add({dict:`<< /Length ${fontBytes.length} /Length1 ${fontBytes.length} >>`,data:fontBytes});
 const cidToGid=add({dict:`<< /Length ${cidMap.length} >>`,data:cidMap});
 const fontDescriptor=add(`<< /Type /FontDescriptor /FontName /NanumGothic /Flags 4 /FontBBox [-1024 -1024 2048 2048] /ItalicAngle 0 /Ascent 1000 /Descent -250 /CapHeight 750 /StemV 90 /FontFile2 ${fontFile} 0 R >>`);
 const descendant=add(`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /NanumGothic /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${fontDescriptor} 0 R /DW 1000 /CIDToGIDMap ${cidToGid} 0 R >>`);
 const allChars=new Set('CINEFINDER 내 평점');items.forEach(r=>[...String(r.title)+'내 평점'+Number(r.rating).toFixed(1)].forEach(c=>allChars.add(c)));
 let cmap=`/CIDInit /ProcSet findresource begin 12 dict begin begincmap /CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def /CMapName /CinefinderUnicode def /CMapType 2 def 1 begincodespacerange <0000> <FFFF> endcodespacerange `;
 const codes=[...allChars].map(c=>c.charCodeAt(0)).filter(x=>x>0&&x<65536);
 for(let i=0;i<codes.length;i+=100){let chunk=codes.slice(i,i+100);cmap+=`${chunk.length} beginbfchar `+chunk.map(x=>`<${x.toString(16).padStart(4,'0')}> <${x.toString(16).padStart(4,'0')}>`).join(' ')+' endbfchar ';}
 cmap+='endcmap CMapName currentdict /CMap defineresource pop end end';
 const cmapBytes=encoder.encode(cmap),toUnicode=add({dict:`<< /Length ${cmapBytes.length} >>`,data:cmapBytes});
 const textFont=add(`<< /Type /Font /Subtype /Type0 /BaseFont /NanumGothic /Encoding /Identity-H /DescendantFonts [${descendant} 0 R] /ToUnicode ${toUnicode} 0 R >>`);
 const hex=s=>[...String(s)].map(c=>c.charCodeAt(0).toString(16).padStart(4,'0')).join('');

 function add(obj){objects.push(obj);return objects.length}
 const catalog=add(null),pagesRef=add(null),pageRefs=[];
 for(let pg=0;pg<pages.length;pg++){const jpeg=pages[pg];
  const img=add({dict:`<< /Type /XObject /Subtype /Image /Width 1488 /Height 1052 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`,data:jpeg});
  // The artwork stays pixel-identical; invisible, Unicode-mapped text improves selection/copy/search.
  let overlay='q 841.89 0 0 595.28 0 0 cm /Im0 Do Q\n';
  const ids=groups[pg].ids;
  for(let j=0;j<ids.length;j++){
    const r=items[ids[j]],x=40+(j%4)*355+123,y=95+Math.floor(j/4)*187;
    let t=String(r.title||''),lines=[];
    while(t.length&&lines.length<4){const cut=Math.min(18,t.length);lines.push(t.slice(0,cut));t=t.slice(cut)}
    for(let k=0;k<lines.length;k++){const xx=x*841.89/1488,yy=(1052-(y+34+k*23))*595.28/1052;overlay+=`BT /F1 9 Tf 3 Tr 1 0 0 1 ${xx.toFixed(2)} ${yy.toFixed(2)} Tm <${hex(lines[k])}> Tj ET\n`}
    const txt='내 평점 '+Number(r.rating).toFixed(1)+' / 10';overlay+=`BT /F1 9 Tf 3 Tr 1 0 0 1 ${(x*841.89/1488).toFixed(2)} ${((1052-(y+147))*595.28/1052).toFixed(2)} Tm <${hex(txt)}> Tj ET\n`;
  }
  const stream=encoder.encode(overlay);
  const contents=add({dict:`<< /Length ${stream.length} >>`,data:stream});
  pageRefs.push(add(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 841.89 595.28] /Resources << /XObject << /Im0 ${img} 0 R >> /Font << /F1 ${textFont} 0 R >> >> /Contents ${contents} 0 R >>`));
 }
 objects[catalog-1]=`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;
 objects[pagesRef-1]=`<< /Type /Pages /Kids [${pageRefs.map(x=>x+' 0 R').join(' ')}] /Count ${pageRefs.length} >>`;
 let at=0;const push=b=>{chunks.push(b);at+=b.length};const ascii=s=>encoder.encode(s);
 push(ascii('%PDF-1.4\n%\x80\x80\x80\x80\n'));
 const offset=[0];objects.forEach((o,i)=>{
 offset.push(at);push(ascii(`${i+1} 0 obj\n`));
 if(typeof o==='string')push(ascii(o+'\nendobj\n'));else{push(ascii(o.dict+'\nstream\n'));push(o.data);push(ascii('\nendstream\nendobj\n'))}
 });
 const xref=at;push(ascii(`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`));offset.slice(1).forEach(x=>push(ascii(String(x).padStart(10,'0')+' 00000 n \n')));push(ascii(`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`));
 return new Blob(chunks,{type:'application/pdf'});
}
async function exportPDF(){
 if(running)return;running=true;btn.disabled=true;const original=btn.textContent;btn.textContent='PDF 생성 중…';
 try{
 const items=chosenItems().sort((a,b)=>bucket(b)-bucket(a)||Number(b.rating)-Number(a.rating)||String(a.title).localeCompare(String(b.title),'ko'));if(!items.length)throw new Error('저장할 작품이 없습니다.');
 lastLog={format:'Cinefinder PDF diagnostic v3',createdAt:new Date().toISOString(),appLocation:location.origin+location.pathname,userAgent:navigator.userAgent,selectedCount:items.length,settings:{concurrency:14,perUrlTimeoutMs:2700},summary:{},events:[]};logBtn.disabled=false;
 window.__cinefinderPdfItemCount=items.length;const candidates=sources(items),imgs=new Array(items.length);let missing=[];
 // Limit concurrency so one failing external image cannot delay all 1,000+ titles.
 let cursor=0,processed=0;
 const imgPromiseCache=new Map();
 async function resolveOne(i){
  const item=items[i];let src=candidates[i];
  trace(item,'candidates',src.length?'found':'none',{urls:src});
  // Lookup an authoritative TMDB poster for missing/broken source URLs.
  // Prefer the verified title match over a guessed URL or a stale synthetic ID.
  let im=null;
  if(src.length){const sk=src.join('|');if(!imgPromiseCache.has(sk))imgPromiseCache.set(sk,grab(src,item));im=await imgPromiseCache.get(sk)}
  if(!im && typeof findTmdbMatchForRating==='function'){
   try{
    const hit=await findTmdbMatchForRating(item);
    if(hit?.poster_path){const canonical=posterURL(hit.poster_path);trace(item,'tmdbVerifiedRecovery','found',{tmdbId:hit.id,mediaType:hit.media_type,posterPath:hit.poster_path});
     if(canonical&&!src.includes(canonical)){
      const sk=canonical;if(!imgPromiseCache.has(sk))imgPromiseCache.set(sk,grab([canonical],item));
      im=await imgPromiseCache.get(sk);
     }
     if(im){src=[canonical];recovered[key(item)]=hit.poster_path;persistRecovery()}
    }else trace(item,'tmdbVerifiedRecovery','noResult');
   }catch(e){trace(item,'tmdbVerifiedRecovery','failed',{error:String(e)})}
  }
  if(!im && /^\d+$/.test(String(item.id||'')) && typeof API_KEY!=='undefined' && API_KEY){
   try{const mt=media(item),res=await fetch(`https://api.themoviedb.org/3/${mt}/${item.id}?api_key=${encodeURIComponent(API_KEY)}&language=ko-KR`);trace(item,'tmdbDetail',res.ok?'ok':'httpError',{httpStatus:res.status});if(res.ok){const data=await res.json();if(data?.poster_path){const u=posterURL(data.poster_path);im=await grab([u],item);if(im){src=[u];recovered[key(item)]=data.poster_path;persistRecovery()}}}}
   catch(e){trace(item,'tmdbDetail','failed',{error:String(e)})}
  }
  if(!im){
   const resolvedPaths=await tmdbPosterRecovery(item);
   trace(item,'directVerifiedRecovery',resolvedPaths.length?'found':'notFound',{paths:resolvedPaths});
   for(const path of resolvedPaths){const u=posterURL(path);if(!u)continue;
    const k='resolved:'+u;if(!imgPromiseCache.has(k))imgPromiseCache.set(k,grab([u],item));
    im=await imgPromiseCache.get(k);if(im){src=[u];recovered[key(item)]=path;persistRecovery();break}
   }
  }
  imgs[i]=im;
  if(!im){let reason=src.length?'이미지 다운로드/CORS/변환 실패':'원본 포스터 URL 미확보';missing.push({title:item.title,id:item.id,type:item.type,reason,source:src[0]||''});trace(item,'poster','failed',{reason,urls:src})}
  else trace(item,'poster','ok',{source:src[0]||''});
  processed++;
  if(processed%10===0||processed===items.length){status(5+processed/items.length*75,`포스터 ${processed}/${items.length} · 확인 실패 ${missing.length}`);await wait()}
 }
 async function worker(){while(cursor<items.length){const i=cursor++;await resolveOne(i)}}
 await Promise.all(Array.from({length:14},worker));
 // Never silently label a PDF with missing real posters as verified. Still provide output.
 if(missing.length){console.warn('Cinefinder PDF missing poster names',missing);window.__cinefinderLastPosterErrors=missing.slice();}
 const sheets=[];const groups=[];
 for(let b=9;b>=0;b--){const indices=items.map((r,i)=>bucket(r)===b?i:-1).filter(i=>i>=0);if(indices.length)for(let q=0;q<indices.length;q+=20)groups.push({ids:indices.slice(q,q+20),label:`${String(b).padStart(2,'0')}~${String(b+1).padStart(2,'0')}점`})}
 for(let j=0;j<groups.length;j++){const group=groups[j],sub=group.ids.map(i=>items[i]),images=group.ids.map(i=>imgs[i]);const c=pageCanvas(sub,images,group.ids[0],j,groups.length,group.label);sheets.push(dataBytes(c.toDataURL('image/jpeg',0.85)));status(80+20*(j+1)/groups.length,`PDF ${j+1}/${groups.length}페이지 작성 중`);if(j%3===0)await wait()}
 
 const file=await pdfFile(sheets,groups,items);downloadBlob(file,'Cinefinder_Ratings_'+new Date().toISOString().slice(0,10)+'.pdf');
 status(100,`PDF 다운로드 시작 · ${sheets.length}페이지 · 포스터 확인 실패 ${missing.length}개`);if(missing.length)alert(`포스터 ${missing.length}개를 복구하지 못했습니다. 자동 저장된 진단 로그에서 개별 원인을 확인할 수 있습니다.`);
 lastLog.summary={selected:items.length,pdfPages:sheets.length,success:items.length-missing.length,failed:missing.length,failures:missing,pdfSizeBytes:file.size,sorting:'score bucket descending, then rating descending',result:'pdf_download_started'};downloadLog();
 }catch(err){if(lastLog){lastLog.summary={...(lastLog.summary||{}),result:'exception',error:String(err?.stack||err)};downloadLog()}console.error('[Cinefinder PDF export]',err);alert('PDF 생성 실패: '+(err?.message||err));status(0,'PDF 생성 실패 · 콘솔 확인')}
 finally{running=false;btn.disabled=false;btn.textContent=original;setTimeout(()=>{const s=document.getElementById('cinefinderPdfStatus');if(s)s.hidden=true},8000)}
}
btn.addEventListener('click',exportPDF);
})();
