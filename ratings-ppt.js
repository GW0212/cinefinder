/* Cinefinder — browser-local rating catalogue PPTX export (no upload). */
(() => {
  const $x = s => document.querySelector(s);
  const isKo = () => (typeof CUR_LANG !== 'undefined' && CUR_LANG === 'ko');
  const L = (ko,en) => isKo()?ko:en;
  const buckets = Array.from({length:10},(_,i)=>({index:i,label:`${String(i).padStart(2,'0')}~${String(i+1).padStart(2,'0')}${L('점','')}`}));
  // An integer score N belongs to the range ending at N, except zero.
  const bucketOf = score => Math.max(0,Math.min(9,Math.ceil(Number(score))-1));
  const typeOf = x => (x.type === 'anime' ? 'anime' : x.type === 'drama' ? 'drama' : 'movie');
  const safe = s => String(s || '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const getList = () => (typeof normalizeRatingList === 'function' ? normalizeRatingList(getRatingsSync()) : getRatingsSync()).map(x=>({...x,rating:Number(x.rating)})).filter(x=>Number.isFinite(x.rating));
  // Export-level identity normalization only: never delete the user's stored ratings.
  // Explicit alias pairs, not fuzzy search, avoid merging unrelated films/TV seasons.
  const aliasIdentity={
    '해리포터4':'해리포터와불의잔', '해리포터1':'해리포터와마법사의돌',
    '해리포터2':'해리포터와비밀의방','해리포터3':'해리포터와아즈카반의죄수',
    '해리포터5':'해리포터와불사조기사단', '해리포터6':'해리포터와혼혈왕자', '해리포터7':'해리포터와죽음의성물1부','해리포터8':'해리포터와죽음의성물2부', '베놈1':'베놈', '맨인더다크1':'맨인더다크','모모노케히메':'원령공주',
    '범죄도시1':'범죄도시','베테랑1':'베테랑','조커1':'조커',
    '겨울왕국1':'겨울왕국','인사이드아웃1':'인사이드아웃','곰돌이푸피와꿀1':'곰돌이푸피와꿀','그것1':'그것','더플랫폼1':'더플랫폼',
    '더보이즈시즌1':'더보이즈시즌1','더보이즈시즌4':'더보이즈시즌4'
  };
  const exportIdentity=r=>{
    const canonical=String(r.title||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
    return `${typeOf(r)}::${aliasIdentity[canonical]||canonical}`;
  };
  function uniqueExportItems(list){
    const chosen=new Map();
    for(const item of list){
      const key=exportIdentity(item),prev=chosen.get(key);
      if(!prev||Number(item.rating)>Number(prev.rating))chosen.set(key,item);
    }
    return [...chosen.values()];
  }
  const ART_SOURCE_KEY='cinefinder_rating_original_poster_v1';
  const posterSnapshot=(()=>{try{return JSON.parse(localStorage.getItem(ART_SOURCE_KEY)||'{}')||{};}catch{return {};}})();
  const originalArtKey=r=>typeof ratingKey==='function'?ratingKey(r.type,r.id,r.title):`${r.type}-${r.id}`;
  const sourceArtPath=value=>{
    if(!value)return '';
    const src=String(value).trim();
    if(/^https:\/\//i.test(src) || /^data:image\/(?:png|jpeg|webp);base64,/i.test(src))return src;
    if(/^\/[a-z0-9_\-]+\.(jpe?g|png|webp)$/i.test(src))return src;
    return '';
  };

  let isExporting=false;
  const dialog = $x('#ratingPptDialog');
  if(!dialog) return;
  const typeNames={all:L('모두','All'),movie:L('영화','Movies'),drama:L('드라마','Drama'),anime:L('애니','Anime')};
  let activeType='all';
  let checked=new Set(buckets.map(x=>x.index));
  const close = ()=> { dialog.classList.add('hidden'); document.body.classList.remove('rating-ppt-open');};
  function filtered(){return uniqueExportItems(getList().filter(x=>(activeType==='all'||typeOf(x)===activeType)&&checked.has(bucketOf(x.rating))));}
  // One source of truth for counts, export items and progress.
  window.cinefinderPdfSelectedRatings=()=>filtered().map(x=>({...x}));
  function render(){
    const list=uniqueExportItems(getList());
    $x('#ratingPptTypes').innerHTML=Object.entries(typeNames).map(([k,label])=>`<button type="button" data-type="${k}" class="rating-ppt-type ${activeType===k?'active':''}" aria-pressed="${activeType===k}">${safe(label)}</button>`).join('');
    $x('#ratingPptRanges').innerHTML=buckets.map(b=>{
      const n=list.filter(x=>(activeType==='all'||typeOf(x)===activeType)&&bucketOf(x.rating)===b.index).length;
      return `<label class="rating-ppt-range ${checked.has(b.index)?'selected':''}"><input type="checkbox" data-bucket="${b.index}" ${checked.has(b.index)?'checked':''}><span>${b.label}</span><small>${n}${L('개','')}</small></label>`;
    }).join('');
    const n=filtered().length, raw=getList().filter(x=>(activeType==='all'||typeOf(x)===activeType)&&checked.has(bucketOf(x.rating))).length;
    $x('#ratingPptTotal').textContent=L(`${raw}개 평점 · 중복 제거 후 ${n}개 작품 · 최대 ${Math.ceil(n/20)}페이지`,`${raw} ratings · ${n} unique titles · up to ${Math.ceil(n/20)} pages`);
    $x('#ratingPptCreate').disabled=n===0||isExporting;
  }
  $x('#btnExportPpt')?.addEventListener('click',()=>{
    if(!getList().length){ if(typeof showToast==='function')showToast(L('저장된 내 평점이 없습니다.','No saved ratings.'));return; }
    if(!isExporting){activeType='all';checked=new Set(buckets.map(x=>x.index));}render(); dialog.classList.remove('hidden');document.body.classList.add('rating-ppt-open');
  });
  $x('#ratingPptTypes').addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(b){activeType=b.dataset.type;render();}});
  $x('#ratingPptRanges').addEventListener('change',e=>{const b=e.target.closest('[data-bucket]');if(b){const k=+b.dataset.bucket;b.checked?checked.add(k):checked.delete(k);render();}});
  $x('#ratingPptAll').addEventListener('click',()=>{checked=new Set(buckets.map(x=>x.index));render();});
  $x('#ratingPptNone').addEventListener('click',()=>{checked.clear();render();});
  $x('#ratingPptClose').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.classList.contains('hidden'))close();});
  const waitTick=()=>new Promise(r=>setTimeout(r,0));
  const floatStatus=document.createElement('button');
  floatStatus.type='button'; floatStatus.id='ratingPptFloating';floatStatus.hidden=true;
  floatStatus.setAttribute('aria-live','polite');
  floatStatus.addEventListener('click',()=>{dialog.classList.remove('hidden');document.body.classList.add('rating-ppt-open');});
  document.body.appendChild(floatStatus);
  const progressBox=$x('#ratingPptProgress');
  const progressBar=$x('#ratingPptProgressBar');
  const progressNumber=$x('#ratingPptPercent');
  function setProgress(p,message){
    const pct=Math.max(0,Math.min(100,Math.floor(p)));
    if(progressBar)progressBar.style.width=`${pct}%`;
    if(progressNumber)progressNumber.textContent=`${pct}%`;
    if(progressBox)progressBox.textContent=message||'';
    floatStatus.hidden=!isExporting;
    if(isExporting)floatStatus.textContent=`PDF ${pct}% · ${message||''}  ↗`;

  }
  // Download a poster without letting one failed thumbnail size poison later attempts.
  // PPT must use the artwork attached to the rating card, not title search.
  // A visible <img> only proves the browser decoded it; embedding requires readable bytes.
  const imageFailures=new Map();
  async function loadImage(url,timeout=11000){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),timeout);
    try{
      const res=await fetch(url,{mode:'cors',signal:ctrl.signal,cache:'default',credentials:'omit'});
      if(!res.ok){imageFailures.set(url,`HTTP ${res.status}`);return null;}
      const blob=await res.blob();
      if(blob.size<1000){imageFailures.set(url,'empty image');return null;}
      return blob;
    }catch(err){imageFailures.set(url,String(err?.message||err));return null;}
    finally{clearTimeout(timer);}
  }
  async function blobToJpeg(blob){
    let objectUrl='';
    try{
      objectUrl=URL.createObjectURL(blob);
      const img=await new Promise((resolve,reject)=>{
        const el=new Image(),timer=setTimeout(()=>reject(Error('decode timeout')),10000);
        el.onload=()=>{clearTimeout(timer);resolve(el)};
        el.onerror=()=>{clearTimeout(timer);reject(Error('image decode error'))};
        el.src=objectUrl;
      });
      if(!img.naturalWidth||!img.naturalHeight)return null;
      const cv=document.createElement('canvas');cv.width=250;cv.height=375;
      const ctx=cv.getContext('2d');
      ctx.fillStyle='#fff';ctx.fillRect(0,0,250,375);
      const scale=Math.min(250/img.naturalWidth,375/img.naturalHeight);
      ctx.drawImage(img,(250-img.naturalWidth*scale)/2,(375-img.naturalHeight*scale)/2,img.naturalWidth*scale,img.naturalHeight*scale);
      return cv.toDataURL('image/jpeg',.86);
    }catch{return null;}
    finally{if(objectUrl)URL.revokeObjectURL(objectUrl)}
  }
  async function posterByPath(path){
    if(!path)return null;
    const raw=String(path).trim();
    if(/^data:image\/(?:png|jpeg);base64,/i.test(raw))return raw;
    if(/^data:image\/webp;base64,/i.test(raw)){
      try { const b=await (await fetch(raw)).blob(); return await blobToJpeg(b); }catch{return null;}
    }
    // Keep the original source; only vary image *size*, never switch the movie/series.
    let urls=[];
    const tmdb=raw.match(/^https:\/\/image\.tmdb\.org\/t\/p\/[^/]+(\/.*)$/i);
    const base=tmdb?tmdb[1]:(/^\/[^/].*\.(?:jpe?g|png|webp)(?:\?.*)?$/i.test(raw)?raw:null);
    if(base){urls=['w342','w185','w500','original'].map(size=>`https://image.tmdb.org/t/p/${size}${base}`);}
    else if(/^https:\/\//i.test(raw))urls=[raw];
    else return null;
    for(const url of [...new Set(urls)]){
      const blob=await loadImage(url,16000);
      if(blob){const jpeg=await blobToJpeg(blob);if(jpeg)return jpeg;}
      // Fallback: cross-origin canvas is only valid when response grants CORS.
      try{
        const img=new Image();img.crossOrigin='anonymous';
        await new Promise((resolve,reject)=>{
          const timer=setTimeout(()=>reject(Error('image timeout')),8500);
          img.onload=()=>{clearTimeout(timer);resolve()};
          img.onerror=()=>{clearTimeout(timer);reject(Error('image error'))};img.src=url;
        });
        const cv=document.createElement('canvas');cv.width=250;cv.height=375;
        const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,250,375);
        const sc=Math.min(250/img.naturalWidth,375/img.naturalHeight);
        cx.drawImage(img,(250-img.naturalWidth*sc)/2,(375-img.naturalHeight*sc)/2,img.naturalWidth*sc,img.naturalHeight*sc);
        return cv.toDataURL('image/jpeg',.86);
      }catch(e){imageFailures.set(url,String(e?.message||e));}
    }
    return null;
  }
  // Match cover art by TMDB's canonical media ID, never by a guessed saved-list ID alone.
  const POSTER_FIX_KEY='cinefinder_ppt_verified_posters_v1';
  let fixedPosters={};
  try{fixedPosters=JSON.parse(localStorage.getItem(POSTER_FIX_KEY)||'{}')||{};}catch{}
  const posterKey=r=>`${typeOf(r)}::${String(r.id||'')}::${String(r.title||'').normalize('NFKC')}`;
  const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  const knownAlias={
    '베테랑1':'베테랑','조커1':'조커','범죄도시1':'범죄도시','겨울왕국1':'겨울왕국',
    '인사이드아웃1':'인사이드 아웃','캡틴아메리카3':'캡틴 아메리카 시빌 워',
    '모모노케히메':'원령공주','포비든킹덤':'포비든 킹덤',
    '슬로호시스':'Slow Horses','월리스와그로밋':'Wallace & Gromit',
    '사이버펑크엣지러너':'Cyberpunk Edgerunners',
    '바스터즈거친녀석들':'Inglourious Basterds',
    '해리포터4':'해리 포터와 불의 잔',
    '해리포터1':'Harry Potter and the Philosopher’s Stone',
    '해리포터2':'Harry Potter and the Chamber of Secrets',
    '해리포터3':'Harry Potter and the Prisoner of Azkaban',
    '해리포터5':'Harry Potter and the Order of the Phoenix',
    '해리포터6':'Harry Potter and the Half-Blood Prince',
    '해리포터7':'Harry Potter and the Deathly Hallows Part 1',
    '해리포터8':'Harry Potter and the Deathly Hallows Part 2',
    '더위쳐':'The Witcher','위쳐':'The Witcher',
    '그린북':'Green Book', '모모노케히메':'Princess Mononoke',
    '슬로호시스':'Slow Horses', '월리스와그로밋':'Wallace & Gromit',
    '베테랑1':'Veteran','조커1':'Joker',
    '나루토시리즈':'Naruto','나타중생1':'New Gods Nezha Reborn',
    '포비든킹덤':'The Forbidden Kingdom',
  };
  function queryVariants(t){
    const raw=String(t||'').trim();
    const base=raw.replace(/\s*(시즌|season|파트|part)\s*\d+.*$/i,'').replace(/\s*\d+\s*기.*$/,'').replace(/\s*시리즈$/,'').trim();
    const withoutNumber=base.replace(/\s+[1-9]$/,'').trim();
    const alias=knownAlias[norm(raw)]||knownAlias[norm(base)]||knownAlias[norm(withoutNumber)];
    const q=[raw,base,withoutNumber,alias,raw.replace(/[·•:：_-]/g,' ')];
    const narrow=norm(raw);
    if(narrow.includes('해리포터'))q.push('Harry Potter');
    if(narrow.includes('위쳐'))q.push('The Witcher');
    if(narrow.includes('슬로호시스'))q.push('Slow Horses');
    return [...new Set(q.filter(Boolean))];
  }
  function saveFixes(){try{localStorage.setItem(POSTER_FIX_KEY,JSON.stringify(fixedPosters));}catch{}}
  const apiBase='https://api.themoviedb.org/3';
  async function tmdbGet(path,lang='ko-KR'){
    if(typeof API_KEY==='undefined'||!API_KEY)return null;
    const sep=path.includes('?')?'&':'?';
    try{const ctrl=new AbortController(),tm=setTimeout(()=>ctrl.abort(),10000);
      try{const resp=await fetch(`${apiBase}${path}${sep}api_key=${encodeURIComponent(API_KEY)}&language=${lang}`,{signal:ctrl.signal});return resp.ok?await resp.json():null;}finally{clearTimeout(tm);}
    }catch{return null;}
  }
  function matchScore(r,c,query){
    const names=[c.title,c.name,c.original_title,c.original_name].filter(Boolean).map(norm);
    const target=norm(r.title), q=norm(query);
    let score=names.includes(target)?180:names.includes(q)?150:0;
    if(!score && names.some(n=>n.length>3&&(n.includes(target)||target.includes(n))))score=75;
    if(c.poster_path)score+=25;
    score+=Math.min(Number(c.vote_count)||0,1000)/200;
    return score;
  }
  const artworkSearchCache=new Map();
  const seasonNumber = r => {
    const match=String(r.title||'').match(/(?:시즌|season|제)\s*(\d{1,2})(?:\s*기)?/i);
    return match ? Number(match[1]) : null;
  };
  const posterResultsCache=new Map();
  async function imageOptions(mt,id,season){
    const key=`${mt}/${id}/${season??''}`;
    if(posterResultsCache.has(key))return posterResultsCache.get(key);
    const out=[];
    const add=p=>{if(p&&!out.includes(p))out.push(p);};
    // Season-specific art comes first, then language-independent series/movie posters.
    if(mt==='tv'&&season!==null){
      const detail=await tmdbGet(`/tv/${id}/season/${season}`,'en-US');
      add(detail?.poster_path);
      const si=await tmdbGet(`/tv/${id}/season/${season}/images?include_image_language=ko,en,null`,'en-US');
      (si?.posters||[]).sort((a,b)=>(b.vote_count||0)-(a.vote_count||0)).slice(0,3).forEach(x=>add(x.file_path));
    }
    for(const lang of ['ko-KR','en-US']){
      const detail=await tmdbGet(`/${mt}/${id}`,lang);
      add(detail?.poster_path);
    }
    const imgs=await tmdbGet(`/${mt}/${id}/images?include_image_language=ko,en,null`,'en-US');
    (imgs?.posters||[]).sort((a,b)=>(b.vote_count||0)-(a.vote_count||0)).slice(0,8).forEach(x=>add(x.file_path));
    posterResultsCache.set(key,out);
    return out;
  }
  async function identifyPoster(r){
    const k=posterKey(r), saved=fixedPosters[k];
    if(saved?.tmdbId && ['movie','tv'].includes(saved.mediaType))return {id:saved.tmdbId,mt:saved.mediaType};
    const types=typeOf(r)==='movie'?['movie']:typeOf(r)==='drama'?['tv']:['tv','movie'];
    const candidates=[];
    for(const query of queryVariants(r.title)){
      for(const mt of types){
        for(const lang of ['ko-KR','en-US']){
          const cacheKey=`${mt}/${lang}/${query}`;
          let results=artworkSearchCache.get(cacheKey);
          if(!results){const res=await tmdbGet(`/search/${mt}?query=${encodeURIComponent(query)}&include_adult=false&page=1`,lang);results=res?.results||[];artworkSearchCache.set(cacheKey,results);}
          for(const c of results.slice(0,12)){
            const score=matchScore(r,c,query);
            if(score>=95){candidates.push({id:c.id,mt,score,hasPoster:!!c.poster_path});}
          }
          if(candidates.some(c=>c.score>=200))break;
        }
      }
      if(candidates.some(c=>c.score>=200))break;
    }
    candidates.sort((a,b)=>b.score-a.score||Number(b.hasPoster)-Number(a.hasPoster));
    if(!candidates.length)return null;
    return {id:candidates[0].id,mt:candidates[0].mt};
  }
  async function verifiedPoster(r){
    const identified=await identifyPoster(r);
    if(!identified)return null;
    const k=posterKey(r);
    const options=await imageOptions(identified.mt,identified.id,seasonNumber(r));
    if(options.length){fixedPosters[k]={...fixedPosters[k],path:options[0],tmdbId:identified.id,mediaType:identified.mt};saveFixes();return options[0];}
    return null;
  }
  function manualPoster(r){return (fixedPosters[posterKey(r)]||{}).manual||'';}
  async function choosePoster(r, cached, resolved){
    const k=posterKey(r), manual=manualPoster(r);
    const tried=new Set();
    const attempt=async path=>{
      if(!path||tried.has(path))return null;
      tried.add(path);
      const data=await posterByPath(path);
      return data?{data,path}:null;
    };
    if(manual){const found=await attempt(manual);if(found)return found;}
    for(const path of [cached,fixedPosters[k]?.path]){
      const found=await attempt(path);if(found)return found;
    }
    const ident=resolved||await identifyPoster(r);
    if(ident){
      const season=seasonNumber(r);
      const paths=await imageOptions(ident.mt,ident.id,season);
      for(const path of paths){
        const found=await attempt(path);
        if(found){fixedPosters[k]={...fixedPosters[k],path,tmdbId:ident.id,mediaType:ident.mt};saveFixes();return found;}
      }
    }
    // Do not cache failures as success. Keep user-provided art and valid matches.
    return {data:null,path:null};
  }
  async function posterData(item){return posterByPath(item.poster_path);}
  function rgba(hex){return hex.replace('#','');}
  const centered = {align:'center',valign:'mid',margin:0,breakLine:false};
  async function generate(){
    if(isExporting)return;
    const exportType=activeType;
    const items=filtered().sort((a,b)=>bucketOf(b.rating)-bucketOf(a.rating)||b.rating-a.rating||String(a.title).localeCompare(String(b.title),'ko'));
    if(!items.length)return;
    if(typeof PptxGenJS==='undefined'){alert(L('PPT 라이브러리를 불러오지 못했습니다.','Could not load PPT library.'));return;}
    isExporting=true;render();setProgress(0,L('준비 중…','Preparing…'));
    const create=$x('#ratingPptCreate'),progress=$x('#ratingPptProgress');
    try{
      const pptx=new PptxGenJS();pptx.layout='LAYOUT_WIDE';pptx.author='Cinefinder';pptx.subject='Personal media ratings';pptx.title='Cinefinder · My Ratings';pptx.lang='ko-KR';
      pptx.theme={headFontFace:'Bebas Neue',bodyFontFace:'Malgun Gothic',lang:'ko-KR'};
      // Map the persistent user-rating entries to their cached TMDB poster paths.
      // Unlike the visible cards, rating storage itself does not contain posters.
      const maps = typeof ratingCachedMaps === 'function' ? ratingCachedMaps(getList()) : null;
      const posterPaths = new Map();
      const resolvedIds = new Map();
      // Resolve exactly as the "My Ratings" screen: its full cached items cover
      // all pages, unlike the 32/48 cards currently present in the DOM.
      const persistedArt=(()=>{try{return JSON.parse(localStorage.getItem(ART_SOURCE_KEY)||'{}')||{};}catch{return {};}})();
      for(const r of items){
        const k=originalArtKey(r);
        const siteCard=maps?.byRatingKey?.get(k);
        const direct=sourceArtPath(siteCard?.poster_path);
        const stored=sourceArtPath(persistedArt[k]||posterSnapshot[k]);
        const matched=(()=>{try{
          const mk=typeof ratingMatchCacheKey==='function'?ratingMatchCacheKey(r):null;
          return sourceArtPath(mk && typeof RATING_MATCH_STORE!=='undefined' ? RATING_MATCH_STORE[mk]?.data?.poster_path : '');
        }catch{return '';}})();
        if(direct||stored||matched)posterPaths.set(k,direct||stored||matched);
      }
      // The ratings view is the authoritative poster source. Its visible list has
      // often been de-duplicated or migrated from old non-TMDB user IDs. Build
      // secondary *exact* associations from the full view, without TMDB search.
      // Reject ambiguous matches: the same title may denote different works.
      const cleanPosterTitle = t => String(t || '').normalize('NFKC').toLowerCase()
        .replace(/[\s\p{P}\p{S}]/gu, '');
      const cachedList = maps?.cached?.items || [];
      const titlePosterMatches = new Map();
      const indexTitle = (t, media, path) => {
        const k = `${media}::${cleanPosterTitle(t)}`;
        if (!cleanPosterTitle(t) || !sourceArtPath(path)) return;
        const prior = titlePosterMatches.get(k);
        if (prior && prior !== path) titlePosterMatches.set(k, null); // ambiguous
        else if (!titlePosterMatches.has(k)) titlePosterMatches.set(k, path);
      };
      cachedList.forEach(c => {
        const media = c.user_rating_type || (c.media_type === 'tv' ? 'drama' : 'movie');
        indexTitle(c.user_rating_title || c.title, media, c.poster_path);
      });
      for (const r of items) {
        const k=originalArtKey(r);
        if (posterPaths.has(k)) continue;
        const found=titlePosterMatches.get(`${typeOf(r)}::${cleanPosterTitle(r.title)}`);
        if(found) posterPaths.set(k,sourceArtPath(found));
      }
      // Canonical TMDB IDs are useful only for numeric IDs, and only within
      // the correct media type. Never cast imported random IDs to TMDB IDs.
      const cachedByCanonical=new Map();
      cachedList.forEach(c => {
        if(c?.id!=null && c?.poster_path)
          cachedByCanonical.set(`${c.media_type}::${c.id}`, sourceArtPath(c.poster_path));
      });
      for(const r of items){
        const k=originalArtKey(r);
        if(posterPaths.has(k))continue;
        if(!/^\d+$/.test(String(r.id)))continue;
        const media=typeOf(r)==='movie'?'movie':typeOf(r)==='drama'?'tv':null;
        const found=media&&cachedByCanonical.get(`${media}::${r.id}`);
        if(found)posterPaths.set(k,found);
      }
      // The ratings screen resolves unmatched entries using findTmdbMatchForRating.
      // Reuse that exact resolver and its identity-preserving results rather than
      // guessing a different work or a different season in the PPT module.
      // The JSON export does not include posters, so unresolved entries must be
      // hydrated with the same lookup pipeline as the cards at runtime.
      const unresolvedMappings=items.filter(r=>!posterPaths.get(originalArtKey(r)));
      if(unresolvedMappings.length) setProgress(1,L(`내 평점과 동일한 표지 연결 확인 중 · ${unresolvedMappings.length}개`, `Resolving ${unresolvedMappings.length} poster associations using the ratings view`));
      if(unresolvedMappings.length && typeof findTmdbMatchForRating==='function'){
        let nextMapping=0, resolvedCount=0, checkedCount=0;
        await Promise.all(Array.from({length:Math.min(4,unresolvedMappings.length)},async()=>{
          while(nextMapping<unresolvedMappings.length){
            const r=unresolvedMappings[nextMapping++];
            try{
              const found=await findTmdbMatchForRating(r);
              const url=sourceArtPath(found?.poster_path);
              if(url){posterPaths.set(originalArtKey(r),url);resolvedCount++;}
            }catch(e){console.warn('[rating-ppt] matched poster unavailable',r.title,e);}
            if((++checkedCount)%12===0)await waitTick();
          }
        }));
      }
      // Visible cards win: use the same poster URL currently rendered on screen.
      document.querySelectorAll('#results .card[data-rating-id]').forEach(card=>{
        const cardId=String(card.getAttribute('data-rating-id')||'');
        const cardType=card.getAttribute('data-rating-type');
        const match=items.find(r=>String(r.id)===cardId&&typeOf(r)===cardType);
        if(!match)return;
        const img=card.querySelector('.thumb img');
        const path=sourceArtPath(card.getAttribute('data-poster'))||sourceArtPath(img?.currentSrc)||sourceArtPath(img?.src);
        if(path)posterPaths.set(originalArtKey(match),path);
      });
      // Decode poster images before slide generation. Never claim an unavailable image is present.
      const posterAssets=new Map(), unresolved=[], missingReasons=[];
      let processed=0;
      const concurrency=5; let cursor=0;
      await Promise.all(Array.from({length:Math.min(concurrency,items.length)},async()=>{
        while(cursor<items.length){
          const r=items[cursor++];
          const key=typeof ratingKey==='function'?ratingKey(r.type,r.id,r.title):`${r.type}-${r.id}`;
          try{
            // Never substitute another TMDB search result for a user's visible card poster.
            // Only use the site's existing associated artwork for this rating.
            const artOverride=sourceArtPath(manualPoster(r));
            const path=artOverride||posterPaths.get(key);
            let data=path?await posterByPath(path):null;
            // A download can fail transiently even when the browser displays
            // the poster. Recheck the *same* artwork after a short delay;
            // never switch to an unrelated title-search result.
            if(!data && path){
              await new Promise(resolve=>setTimeout(resolve,350));
              data=await posterByPath(path);
            }
            // Last chance: canonical cache record for this rating. If it is
            // different from the failed source, use that exact rating record.
            if(!data){
              const associated=maps?.byRatingKey?.get(key);
              const exact=sourceArtPath(associated?.poster_path);
              if(exact && exact!==path) data=await posterByPath(exact);
            }
            const result={data,path};
            if(result.data) posterAssets.set(key,result.data);
            else {unresolved.push(String(r.title||''));const reason=path?(Array.from(imageFailures.entries()).filter(([u])=>u.includes(String(path).split('/').pop())).map(([u,e])=>e).slice(-1)[0]||'image download/decoding/CORS failed'):'no poster associated with saved rating';missingReasons.push({title:String(r.title||''),type:r.type,id:r.id,source:path||'',reason});}
          }catch(e){unresolved.push(String(r.title||''));console.warn('[rating-ppt] poster',r.title,e);}
          processed++;
          setProgress(3+67*processed/items.length,L(`표지 확인 ${processed}/${items.length} · 누락 ${unresolved.length}개`,`Checking posters ${processed}/${items.length} · missing ${unresolved.length}`));
          if(processed%5===0) await waitTick();
        }
      }));
      // Persist a transparent review queue: do not silently claim a substitute is the real poster.
      try{sessionStorage.setItem('cinefinder_ppt_missing_art_v2',JSON.stringify(unresolved));sessionStorage.setItem('cinefinder_ppt_missing_reasons_v1',JSON.stringify(missingReasons));}catch{}
      // Missing artwork cannot cancel the file. Continue with a clearly
      // identified custom title card when external artwork is unavailable.
      if(unresolved.length){
        console.warn('[rating-ppt] unavailable poster art:',unresolved);
        setProgress(70,L(`표지 ${unresolved.length}개는 작품명 카드로 대체하여 저장합니다.`,`Using title cards for ${unresolved.length} missing posters.`));
      }
      const groups=buckets.slice().reverse().filter(b=>items.some(x=>bucketOf(x.rating)===b.index));
      let page=0;const totalPages=groups.reduce((n,b)=>n+Math.ceil(items.filter(x=>bucketOf(x.rating)===b.index).length/20),0);
      for(const b of groups){
        const groupItems=items.filter(x=>bucketOf(x.rating)===b.index);
        for(let start=0;start<groupItems.length;start+=20){
          const part=groupItems.slice(start,start+20);page++;
          const slide=pptx.addSlide();slide.background={color:'F6F7FB'};
          slide.addText('CINEFINDER', {x:.4,y:.17,w:2.7,h:.3,fontFace:'Bebas Neue',charSpacing:1.5,bold:false,fontSize:19,color:'182236',margin:0});
          slide.addText(`${L('내 평점','MY RATINGS')}  ·  ${b.label}`,{x:3,y:.18,w:7.3,h:.32,align:'center',fontFace:'Malgun Gothic',fontSize:17,bold:true,color:'202F4A',margin:0});
          slide.addText(`${String(page).padStart(2,'0')} / ${String(totalPages).padStart(2,'0')}`,{x:11.65,y:.23,w:1.23,h:.23,fontSize:9,color:'707D91',align:'right',margin:0});
          slide.addShape(pptx.ShapeType.line,{x:.38,y:.57,w:12.57,h:0,line:{color:'DCE1EA',width:1}});
          const gapX=.13,gapY=.10,left=.4,top=.72,cardW=(12.53-3*gapX)/4,cardH=1.18;
          for(let j=0;j<part.length;j++){
            const item=part[j],col=j%4,row=Math.floor(j/4),x=left+col*(cardW+gapX),y=top+row*(cardH+gapY);
            slide.addShape(pptx.ShapeType.roundRect,{x,y,w:cardW,h:cardH,rectRadius:.09,radius:.09,line:{color:'E1E5ED',width:.75},fill:{color:'FFFFFF'},shadow:{type:'outer',color:'D8DDE8',blur:1.4,distance:.6,angle:45,opacity:.18}});
            const imgX=x+.09,imgY=y+.09,imgW=.71,imgH=1.05;
            const key=typeof ratingKey==='function'?ratingKey(item.type,item.id,item.title):`${item.type}-${item.id}`;
            const poster=posterAssets.get(key)||null;
            if(poster){slide.addImage({data:poster,x:imgX,y:imgY,w:imgW,h:imgH});}
            else {
              slide.addShape(pptx.ShapeType.rect,{x:imgX,y:imgY,w:imgW,h:imgH,line:{color:'273950'},fill:{color:'192A41'}});
              slide.addShape(pptx.ShapeType.rect,{x:imgX+.05,y:imgY+.06,w:imgW-.10,h:.025,line:{color:'DD6049'},fill:{color:'DD6049'}});
              slide.addText(String(item.title||''),{x:imgX+.065,y:imgY+.19,w:imgW-.13,h:.55,fontFace:'Malgun Gothic',bold:true,fontSize:9.2,color:'FFFFFF',align:'center',valign:'mid',margin:0,fit:'shrink'});
              slide.addText('CINEFINDER',{x:imgX+.02,y:imgY+.91,w:imgW-.04,h:.10,fontFace:'Bebas Neue',fontSize:7.3,charSpacing:.7,color:'C6D3E3',align:'center',margin:0});
            }
            slide.addText(String(item.title||''),{x:x+.91,y:y+.15,w:cardW-1.01,h:.55,fontFace:'Malgun Gothic',bold:true,fontSize:12,color:'1F2937',margin:0,valign:'mid',breakLine:false,fit:'shrink'});
            slide.addText(`${L('내 평점','MY SCORE')}  ${Number(item.rating).toFixed(1)} / 10`,{x:x+.91,y:y+.79,w:cardW-1.02,h:.27,fontFace:'Malgun Gothic',fontSize:11.3,bold:true,color:'E24B39',margin:0,fit:'shrink'});
            if(j%4===3) await waitTick();
          }
          slide.addText(`${L('작품','Titles')} ${start+1}–${start+part.length} / ${groupItems.length}  •  ${new Date().toLocaleDateString('ko-KR')}`,{x:.4,y:7.24,w:12.4,h:.16,align:'right',fontSize:8.2,color:'8290A1',margin:0});
          setProgress(70+27*page/totalPages,L(`PPT 생성 중 · ${page}/${totalPages}페이지`, `Creating PPT · ${page}/${totalPages} slides`));
          await waitTick();
        }
      }
      setProgress(98,L('PPT 파일 압축 및 다운로드 준비 중…','Compressing and preparing download…'));
      const stamp=new Date();const date=`${stamp.getFullYear()}${String(stamp.getMonth()+1).padStart(2,'0')}${String(stamp.getDate()).padStart(2,'0')}`;
      await pptx.writeFile({fileName:`Cinefinder_Ratings_${exportType}_${date}.pptx`});
      setProgress(100,L(`완료 · ${items.length}개 작품 / ${totalPages}페이지`,`Done · ${items.length} titles / ${totalPages} slides`));
      if(typeof showToast==='function')showToast(L('PPT 파일 생성 완료','PPT created'));
    }catch(err){console.error('[rating-ppt]',err);setProgress(0,L('생성 실패: ','Export failed: ')+(err?.message||String(err)));}
    finally{isExporting=false;floatStatus.hidden=true;render();}
  }
  // Non-destructive manual artwork matching for difficult aliases/season labels.
  // Accept ONLY TMDB poster paths (/xxxx.jpg) or https URLs; entries never modify ratings.
  const review=document.createElement('section');review.id='pptPosterReview';
  review.style.cssText='margin:14px 20px;padding:12px;border:1px solid #d7dfe9;border-radius:12px;background:#fff;max-height:240px;overflow:auto;display:none';
  review.innerHTML='<strong>표지 직접 지정 / Poster repair</strong><p style="font-size:12px;color:#6b7280">자동 검색되지 않은 작품에 TMDB 이미지 경로(/...jpg) 또는 이미지 URL을 입력해 저장할 수 있습니다. 다음 PPT 생성에 적용됩니다.</p><div id="pptPosterReviewItems"></div>';
  const content=dialog.querySelector('.rating-ppt-panel')||dialog.firstElementChild;
  if(content)content.appendChild(review);
  const reviewButton=document.createElement('button');reviewButton.type='button';reviewButton.textContent='표지 누락 항목 확인 / 수정';
  reviewButton.className='rating-ppt-review-button';reviewButton.style.cssText='margin:8px 20px;padding:9px 12px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#334155;cursor:pointer;';
  if(content)content.appendChild(reviewButton);
  reviewButton.addEventListener('click',()=>{
    const missing=(()=>{try{return JSON.parse(sessionStorage.getItem('cinefinder_ppt_missing_art_v2')||'[]');}catch{return [];}})();
    review.style.display=review.style.display==='none'?'block':'none';
    review.querySelector('#pptPosterReviewItems').replaceChildren();
    if(!missing.length){const p=document.createElement('p');p.textContent='현재 작업에서 기록된 표지 누락 항목이 없습니다.';review.querySelector('#pptPosterReviewItems').appendChild(p);return;}
    for(const title of [...new Set(missing)]){
      const item=getList().find(r=>r.title===title);if(!item)continue;
      const row=document.createElement('div');row.style.cssText='display:flex;gap:6px;align-items:center;margin:6px 0;flex-wrap:wrap';
      const label=document.createElement('span');label.textContent=title;label.style.cssText='font-size:12px;flex:1;min-width:120px';
      const input=document.createElement('input');input.placeholder='TMDB /poster.jpg 또는 https://…';input.style.cssText='min-width:170px;flex:2;padding:6px;border:1px solid #cbd5e1;border-radius:6px';
      const btn=document.createElement('button');btn.textContent='확인·저장';btn.style.cssText='padding:6px 9px;border-radius:6px;background:#e34a3b;color:white';
      btn.addEventListener('click',async()=>{const v=input.value.trim();if(!/^\/[\w-]+\.(jpg|jpeg|png|webp)$/i.test(v)&&!/^https:\/\//i.test(v)){alert('TMDB /...jpg 경로 또는 https 이미지 URL을 입력하세요.');return;}
        btn.disabled=true;btn.textContent='검증 중';const data=await posterByPath(v);btn.disabled=false;
        if(!data){btn.textContent='이미지 접근 실패';return;}
        fixedPosters[posterKey(item)]={...(fixedPosters[posterKey(item)]||{}),manual:v,path:v};saveFixes();btn.textContent='저장 완료 ✓';
      });
      row.append(label,input,btn);review.querySelector('#pptPosterReviewItems').appendChild(row);
    }
  });
  $x('#ratingPptCreate').addEventListener('click',generate);
})();
