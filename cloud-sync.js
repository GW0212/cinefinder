/* Cinefinder Google Sync v10: Firebase Auth + Firestore, optional configuration. */
(()=>{'use strict';
  const $=id=>document.getElementById(id);
  const KEYS={favs:'cinefinder_favs',watch:'cinefinder_watch',ratings:'cinefinder_ratings'};
  const LABEL={favs:'즐겨찾기',watch:'나중에 보기',ratings:'내 평점'};
  const cfg=window.CINEFINDER_FIREBASE_CONFIG||{};
  const configured=Boolean(cfg.apiKey&&cfg.authDomain&&cfg.projectId&&cfg.appId);
  let auth,db,user=null,ready=false,sub=[],loadingRemote=false,ignoreLocal=false,loginBusy=false,initPromise=null,noticeTimer=null;
  const timers=new Map(),dirty=new Set(),busy=new Set();
  const api={isApplyingRemote:false,onLocalSaved:(key,list)=>{
    if(!user||!ready||ignoreLocal)return;
    const name=Object.keys(KEYS).find(k=>KEYS[k]===key);
    if(name){dirty.add(name);status('변경 사항 저장 중…');schedule(name);}
  }};
  window.CineCloud=api;
  function status(message){const e=$('cloudStatus');if(e)e.textContent=message;}
  function notifyLoginError(err){
    const code=String(err?.code||'');
    // Closing the account chooser is not a failure.
    if(code==='auth/popup-closed-by-user'||code==='auth/cancelled-popup-request')return;
    let msg='Google 로그인에 실패했습니다. 다시 시도해 주세요.';
    if(code==='auth/api-key-not-valid'||code==='auth/invalid-api-key')msg='Firebase API 키가 유효하지 않습니다. 웹 앱 설정을 확인해 주세요.';
    else if(code==='auth/unauthorized-domain')msg='로그인 도메인이 승인되지 않았습니다. Firebase에서 gw0212.github.io를 추가해 주세요.';
    else if(code==='auth/popup-blocked')msg='로그인 팝업이 차단되었습니다. 브라우저 팝업 허용 설정을 확인해 주세요.';
    else if(code==='auth/network-request-failed')msg='네트워크 연결에 실패했습니다. 인터넷 연결을 확인해 주세요.';
    else if(code==='auth/operation-not-allowed')msg='Firebase에서 Google 로그인이 활성화되지 않았습니다.';
    else if(code==='auth/too-many-requests')msg='로그인 요청이 일시적으로 제한됐습니다. 잠시 후 다시 시도해 주세요.';
    else if(code==='auth/account-exists-with-different-credential')msg='같은 이메일에 다른 로그인 방식이 등록되어 있습니다.';
    else if(err?.message)msg=String(err.message);
    const el=$('cloudLoginNotice');if(!el)return;
    $('cloudLoginNoticeMessage').textContent=msg;
    el.classList.remove('hidden');el.setAttribute('aria-hidden','false');
    clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{el.classList.add('hidden');el.setAttribute('aria-hidden','true');},3000);
  }

  function showDialog(){ $('cloudDialog')?.classList.remove('hidden');document.body.style.overflow='hidden'; }
  function hideDialog(){ $('cloudDialog')?.classList.add('hidden');document.body.style.overflow=''; }
  function ui(){
    const button=$('cloudAccountBtn'),label=$('cloudAccountText');
    if(button)button.classList.toggle('signed-in',!!user);
    if(label)label.textContent=user?(user.displayName||'연결됨'):'Google 로그인';
    if($('cloudAccountIcon'))$('cloudAccountIcon').textContent=user?'✓':'G';
    $('cloudSignIn')?.classList.toggle('hidden',!!user||!configured);
    $('cloudSignOut')?.classList.toggle('hidden',!user);
    $('cloudSyncNow')?.classList.toggle('hidden',!user);
    const profile=$('cloudProfile');if(profile){profile.classList.toggle('hidden',!user);profile.textContent=user?`${user.displayName||'Google 계정'} · ${user.email||''}`:'';}
    if(!configured)status('Firebase 설정이 필요합니다. ZIP의 FIREBASE_SETUP_KO.md 안내에 따라 firebase-config.js를 설정해 주세요. 기존 로컬 목록은 그대로 유지됩니다.');
    else if(user)status(ready?'Google 동기화 완료 · 실시간 동기화 활성화':'클라우드 데이터 동기화 중…');
    else status('Google 로그인으로 즐겨찾기·나중에 보기·내 평점을 모든 기기에서 동기화하세요.');
  }
  async function loadSDK(){
    for(const url of ['https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js']){
      await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=()=>reject(Error('Firebase SDK 다운로드 실패'));document.head.appendChild(script);});
    }
  }
  function local(name){return (name==='favs'?FAV_MEM:name==='watch'?WATCH_MEM:RATINGS_MEM)||[];}
  function normalize(name,items){return name==='ratings'?normalizeRatingList(items):normalizeSavedList(items);}
  function merge(name,remote,localItems){
    if(name==='ratings')return normalizeRatingList([...(remote||[]),...(localItems||[])]);
    const map=new Map();for(const x of [...(remote||[]),...(localItems||[])])if(x?.k)map.set(x.k,x);
    return normalizeSavedList([...map.values()]);
  }
  async function apply(name,items){
    const next=normalize(name,items);const before=JSON.stringify(local(name));
    if(before===JSON.stringify(next))return;
    ignoreLocal=true;api.isApplyingRemote=true;
    try{
      const oldList=local(name).slice();
      const keyOf=x=>String(x?.k||(x?.type||x?.media_type||'')+'|'+(x?.id||x?.title||''));
      const existing=new Set(oldList.map(keyOf));
      const additions=next.filter(x=>!existing.has(keyOf(x)));
      const appendOnly=next.length===oldList.length+additions.length && oldList.every(x=>next.some(y=>keyOf(x)===keyOf(y)&&JSON.stringify(x)===JSON.stringify(y)));
      const ok=await persistListDual(KEYS[name],next);
      if(!ok)throw Error('로컬 저장소 기록 실패');
      if(name==='favs'){FAV_MEM=next;favDataRevision++;}
      if(name==='watch'){WATCH_MEM=next;watchDataRevision++;}
      if(name==='ratings'){RATINGS_MEM=next;ratingDataRevision++;if(!appendOnly)clearRatingViewCache();else if(typeof patchRatingViewCacheForList==='function')patchRatingViewCacheForList(next);}
      if(name==='ratings')updateRatingsCountBadge?.();
      const visibleName=PAGE_STATE?.lastMode==='ratings'?'ratings':PAGE_STATE?.lastMode==='saved-fav'?'favs':PAGE_STATE?.lastMode==='saved-watch'?'watch':null;
      if(visibleName===name){
        if(appendOnly && additions.length && !PAGE_STATE.query && LIBRARY_TYPE_FILTER==='all'){
          const cards=additions.map(x=>name==='ratings'?(typeof ratingItemToFastCard==='function'?ratingItemToFastCard(x,ratingCachedMaps(next)):null):({
            id:x.id,media_type:x.media_type,title:x.title,name:x.title,poster_path:x.poster_path,vote_average:x.vote_average||0,
            release_date:x.release_date||'',popularity:x.popularity||0,genre_ids:x.genre_ids||[]
          })).filter(Boolean);
          if(cards.length)renderCards(cards,true,{skipEnrich:true,skipRatingRefresh:true});
          if(name==='ratings')updateRatingsCountBadge?.(); else updateSavedCountBadge?.(name==='favs'?'fav':'watch',next);
        } else if(name==='ratings')await showRatings();
        else await showSaved(name==='favs'?'fav':'watch');
      }
    }finally{ignoreLocal=false;api.isApplyingRemote=false;}
  }
  function ref(name){return db.collection('cinefinder_users').doc(user.uid).collection('lists').doc(name);}
  function schedule(name){clearTimeout(timers.get(name));timers.set(name,setTimeout(()=>write(name),600));}
  async function write(name){
    if(!user||!ready||!dirty.has(name)||busy.has(name))return;
    busy.add(name);dirty.delete(name);const uid=user.uid;
    try{await ref(name).set({items:local(name),updatedAt:firebase.firestore.FieldValue.serverTimestamp(),schema:1});
      if(user?.uid===uid)status(dirty.size||busy.size>1?'변경 사항 저장 중…':'모든 변경 사항이 동기화되었습니다.');
    }catch(err){dirty.add(name);status(`동기화 실패 (${LABEL[name]}): ${err.message||err}. 로컬 데이터는 유지됩니다. 다시 시도해 주세요.`);}
    finally{busy.delete(name);if(dirty.has(name)&&user?.uid===uid&&navigator.onLine)schedule(name);}
  }
  async function stop(){ready=false;loadingRemote=false;sub.forEach(f=>{try{f();}catch{}});sub=[];timers.forEach(t=>clearTimeout(t));timers.clear();dirty.clear();busy.clear();}
  async function start(current){
    await stop();user=current;ui();if(!current)return;status('클라우드 데이터 동기화 중…');
    const uid=current.uid;loadingRemote=true;
    try{
      // First sign-in on a device: combine existing local records into account once.
      // Subsequent logins: cloud is authoritative, so deleted items aren't resurrected.
      const firstKey='cinefinder_cloud_initialized_'+uid;
      const first=!localStorage.getItem(firstKey);
      const docs=await Promise.all(Object.keys(KEYS).map(async name=>[name,await ref(name).get({source:'server'})]));
      if(user?.uid!==uid)return;
      for(const [name,snap] of docs){
        const server=snap.exists&&Array.isArray(snap.data()?.items)?snap.data().items:[];
        const combined=first?merge(name,server,local(name)):normalize(name,server);
        if(first && JSON.stringify(combined)!==JSON.stringify(normalize(name,server))) {
          await ref(name).set({items:combined,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),schema:1});
        }
        await apply(name,combined);
      }
      localStorage.setItem(firstKey,'1');ready=true;loadingRemote=false;
      for(const name of Object.keys(KEYS)){
        sub.push(ref(name).onSnapshot(snap=>{
          if(user?.uid!==uid||!ready||loadingRemote||snap.metadata.hasPendingWrites)return;
          // Do not clobber a local edit waiting for upload.
          if(dirty.has(name)||busy.has(name))return;
          const remote=snap.exists&&Array.isArray(snap.data()?.items)?snap.data().items:[];
          apply(name,remote).catch(e=>status('클라우드 목록 반영 실패: '+e.message));
        },err=>status('실시간 동기화 오류: '+err.message)));
      }
      status('Google 동기화 완료 · 실시간 동기화 활성화');
    }catch(e){loadingRemote=false;ready=false;status('클라우드 초기 동기화 실패: '+e.message+' · 로컬 목록은 유지됩니다. 다시 로그인하거나 지금 동기화하세요.');}
  }
  async function signIn(){
    if(loginBusy)return;
    if(!configured){notifyLoginError({message:'Firebase 설정이 필요합니다. firebase-config.js를 확인해 주세요.'});return;}
    // SDK is loaded at startup. Do not await an unrelated dialog, which can
    // forfeit the transient user activation needed by popup-based auth.
    if(!auth){notifyLoginError({message:'Google 로그인 기능을 준비하고 있습니다. 잠시 후 다시 눌러 주세요.'});return;}
    loginBusy=true;
    try{
      const provider=new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    }catch(e){
      // Browser policy may block popups. Keep the error visible, rather than
      // silently redirecting the current page and risking local UI state.
      notifyLoginError(e);
    }finally{loginBusy=false;}
  }
  function accountClick(){
    if(user){showDialog();return;}
    signIn();
  }
  async function init(){
    $('cloudAccountBtn')?.addEventListener('click',accountClick);
    $('cloudClose')?.addEventListener('click',hideDialog);
    $('cloudDialog')?.addEventListener('click',e=>{if(e.target===$('cloudDialog'))hideDialog();});
    $('cloudSignIn')?.addEventListener('click',signIn);
    $('cloudSignOut')?.addEventListener('click',async()=>{if(!auth)return;await auth.signOut();status('로그아웃했습니다. 현재 기기에 저장된 목록은 유지됩니다.');});
    $('cloudSyncNow')?.addEventListener('click',async()=>{if(!user)return;status('클라우드 데이터 동기화 중…');await start(user);});
    ui();if(!configured)return;
    try{
      await loadSDK();
      if(!cfg.apiKey || !/^AIza[0-9A-Za-z_-]{20,}$/.test(cfg.apiKey)) throw Error('Firebase API key 형식이 올바르지 않습니다. firebase-config.js를 확인해 주세요.');
      firebase.initializeApp(cfg);auth=firebase.auth();db=firebase.firestore();
      auth.getRedirectResult().catch(e=>notifyLoginError(e));
      auth.onAuthStateChanged(async next=>{
        // Existing local app initialization must finish before applying remote data.
        if(typeof FAV_MEM==='undefined'||FAV_MEM===null){await new Promise(resolve=>{let tries=0;const h=setInterval(()=>{if(FAV_MEM!==null||++tries>120){clearInterval(h);resolve();}},100);});}
        if(!next){await stop();user=null;ui();return;}
        if(user?.uid===next.uid&&ready)return;
        await start(next);ui();
      });
      window.addEventListener('online',()=>{for(const name of dirty)schedule(name);if(user&&ready&&!dirty.size)status('Google 동기화 완료 · 실시간 동기화 활성화');});
      window.addEventListener('offline',()=>{if(user)status('오프라인 상태 · 로컬에 저장 중');});
    }catch(e){status('Firebase 초기화 실패: '+e.message);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
