// app.js — cinefinder Web v2.0
// dark/light theme · genre chips · centered layout
'use strict';

const DEFAULT_TMDB_KEY = '62b19cef7535ae3eaf73a644c6356748';

/* ═══════════════════════════════ I18N ═══════════════════════════════ */
const LANGS = {
  ko: { label:'한국어', tmdb:'ko-KR' },
  en: { label:'English', tmdb:'en-US' },
  ja: { label:'日本語', tmdb:'ja-JP' },
  zh: { label:'中文',   tmdb:'zh-CN' },
  fr: { label:'Français', tmdb:'fr-FR' },
};
const I18N = {
  ko: {
    search_placeholder:'영화·드라마·감독·배우 검색', search_button:'검색',
    tab_all:'모두', tab_movie:'영화', tab_tv:'드라마',
    filters:'필터', country:'국가', year_range:'연도 범위', from:'From', to:'To',
    year_hint:'비워두면 전체 연도', genre_inc:'포함 장르', genre_exc:'제외 장르',
    genre_hint:'탭에 따라 영화/드라마 장르를 구분해서 적용합니다.',
    reset:'초기화', apply:'필터 적용',
    status_discovering:'탐색 중...', status_searching:'검색 중...', status_empty:'결과 없음',
    status_auth_fail:'API 인증 실패(401)', status_fetch_fail:'결과 수집 실패',
    offline_using_cache:'오프라인: 마지막 결과를 표시합니다.',
    toast_reset:'초기화 완료', toast_saved:'저장됨', toast_removed:'삭제됨',
    badge_movie:'영화', badge_tv:'드라마', poster_none:'포스터 없음', year_unknown:'연도 미상',
    modal_overview:'개요', modal_description:'설명', modal_trailer:'예고편', modal_cast:'출연', modal_crew:'제작',
    modal_providers:'시청 가능', modal_buy:'구매', modal_rent:'대여', modal_open_tmdb:'TMDB에서 보기',
    trailer_youtube:"YouTube에서 보기",
    runtime_min:"분",
    season_label:"시즌",
    list_label:"목록",
    favorite:"즐겨찾기",
    watch_later:"나중에 보기",
    selected:"선택됨",
    not_selected:"선택 안 됨",
    modal_add_fav:"즐겨찾기",
    modal_add_watch:"나중에 보기",
    no_results_hint:"조건을 줄이거나 필터를 초기화해보세요.",
    empty_reset_filters:"필터 초기화",
    empty_retry_all:"전체에서 다시 검색",
    empty_search_tmdb:"TMDB에서 검색",
    provider_region:"KR 기준",
    crew_more:"제작진 더보기",
    crew_less:"접기",
    genre_movie:"영화 장르",
    genre_tv:"드라마 장르",
    api_key:"TMDB API 키",
    api_key_hint:"공개 배포 시 개인 키 사용을 권장합니다. 비워두면 기본 키로 실행됩니다.",
    save_key:"키 저장",
    reset_key:"기본 키",
    toast_key_saved:"API 키 저장됨",
    toast_key_reset:"기본 API 키로 변경됨",
    cached_badge:"캐시 결과",
    min_rating:"최소 평점",
    sort_popularity:"인기순",
    sort_vote:"평점순",
    sort_date:"최신순",
    crew_director:"감독",
    crew_writing:"각본",
    crew_production:"제작",
    crew_music:"음악",
    crew_camera:"촬영",
    crew_art:"미술",
  },
  en: {
    search_placeholder:'Search movies, TV, directors, actors', search_button:'Search',
    tab_all:'All', tab_movie:'Movies', tab_tv:'TV',
    filters:'Filters', country:'Country', year_range:'Year range', from:'From', to:'To',
    year_hint:'Leave empty for all years', genre_inc:'Include genres', genre_exc:'Exclude genres',
    genre_hint:'Genres are applied separately for movies and TV.',
    reset:'Reset', apply:'Apply filters',
    status_discovering:'Discovering...', status_searching:'Searching...', status_empty:'No results',
    status_auth_fail:'API auth failed (401)', status_fetch_fail:'Failed to fetch',
    offline_using_cache:'Offline: showing cached results.',
    toast_reset:'Reset complete', toast_saved:'Saved', toast_removed:'Removed',
    badge_movie:'Movie', badge_tv:'TV', poster_none:'No poster', year_unknown:'Unknown year',
    modal_overview:'Overview', modal_description:'Description', modal_trailer:'Trailer', modal_cast:'Cast', modal_crew:'Crew',
    modal_providers:'Available On', modal_buy:'Buy', modal_rent:'Rent', modal_open_tmdb:'Open on TMDB',
    trailer_youtube:"Watch on YouTube",
    runtime_min:"min",
    season_label:"Season",
    list_label:"List",
    favorite:"Favorite",
    watch_later:"Watch later",
    selected:"Selected",
    not_selected:"Not selected",
    modal_add_fav:"Favorite",
    modal_add_watch:"Watch later",
    no_results_hint:"Try fewer conditions or reset filters.",
    empty_reset_filters:"Reset filters",
    empty_retry_all:"Search all",
    empty_search_tmdb:"Search on TMDB",
    provider_region:"KR region",
    crew_more:"Show more crew",
    crew_less:"Collapse",
    genre_movie:"Movie genres",
    genre_tv:"TV genres",
    api_key:"TMDB API Key",
    api_key_hint:"For public deployment, use your own key. Blank uses the default key.",
    save_key:"Save key",
    reset_key:"Default key",
    toast_key_saved:"API key saved",
    toast_key_reset:"Default API key restored",
    cached_badge:"Cached result",
    min_rating:"Min rating",
    sort_popularity:"Popular",
    sort_vote:"Top rated",
    sort_date:"Latest",
    crew_director:"Director",
    crew_writing:"Writing",
    crew_production:"Production",
    crew_music:"Music",
    crew_camera:"Camera",
    crew_art:"Art",
  },
  ja: {
    search_placeholder:'映画・ドラマ・監督・俳優を検索', search_button:'検索',
    tab_all:'すべて', tab_movie:'映画', tab_tv:'ドラマ',
    filters:'フィルター', country:'国', year_range:'年範囲', from:'から', to:'まで',
    year_hint:'空欄で全年', genre_inc:'含むジャンル', genre_exc:'除外ジャンル',
    genre_hint:'タブに応じて映画/ドラマのジャンルを分けて適用します。',
    reset:'リセット', apply:'適用',
    status_discovering:'探索中...', status_searching:'検索中...', status_empty:'結果なし',
    status_auth_fail:'API認証失敗(401)', status_fetch_fail:'結果取得失敗',
    offline_using_cache:'オフライン: キャッシュを表示します。',
    toast_reset:'リセット完了', toast_saved:'保存済み', toast_removed:'削除済み',
    badge_movie:'映画', badge_tv:'ドラマ', poster_none:'ポスターなし', year_unknown:'年不明',
    modal_overview:'概要', modal_description:'説明', modal_trailer:'予告編', modal_cast:'キャスト', modal_crew:'スタッフ',
    modal_providers:'視聴可能', modal_buy:'購入', modal_rent:'レンタル', modal_open_tmdb:'TMDBで開く',
    trailer_youtube:"YouTubeで見る",
    runtime_min:"分",
    season_label:"シーズン",
    list_label:"リスト",
    favorite:"お気に入り",
    watch_later:"あとで見る",
    selected:"選択済み",
    not_selected:"未選択",
    modal_add_fav:"お気に入り",
    modal_add_watch:"あとで見る",
    no_results_hint:"条件を減らすかフィルターをリセットしてください。",
    empty_reset_filters:"フィルターをリセット",
    empty_retry_all:"すべてで検索",
    empty_search_tmdb:"TMDBで検索",
    provider_region:"KR基準",
    crew_more:"スタッフをもっと見る",
    crew_less:"閉じる",
    genre_movie:"映画ジャンル",
    genre_tv:"ドラマジャンル",
    api_key:"TMDB APIキー",
    api_key_hint:"公開配布時は個人キーの利用を推奨します。空欄なら基本キーを使用します。",
    save_key:"保存",
    reset_key:"基本キー",
    toast_key_saved:"APIキー保存済み",
    toast_key_reset:"基本APIキーに変更済み",
    cached_badge:"キャッシュ結果",
    min_rating:"最低評価",
    sort_popularity:"人気順",
    sort_vote:"評価順",
    sort_date:"最新順",
    crew_director:"監督",
    crew_writing:"脚本",
    crew_production:"制作",
    crew_music:"音楽",
    crew_camera:"撮影",
    crew_art:"美術",
  },
  zh: {
    search_placeholder:'搜索电影·剧集·导演·演员', search_button:'搜索',
    tab_all:'全部', tab_movie:'电影', tab_tv:'剧集',
    filters:'筛选', country:'国家', year_range:'年份范围', from:'从', to:'到',
    year_hint:'留空显示所有年份', genre_inc:'包含类型', genre_exc:'排除类型',
    genre_hint:'类型会按电影/剧集分别应用。',
    reset:'重置', apply:'应用',
    status_discovering:'探索中...', status_searching:'搜索中...', status_empty:'无结果',
    status_auth_fail:'API认证失败(401)', status_fetch_fail:'获取结果失败',
    offline_using_cache:'离线: 显示上次结果。',
    toast_reset:'重置完成', toast_saved:'已保存', toast_removed:'已删除',
    badge_movie:'电影', badge_tv:'剧集', poster_none:'无海报', year_unknown:'年份未知',
    modal_overview:'概述', modal_description:'说明', modal_trailer:'预告片', modal_cast:'演员', modal_crew:'主创',
    modal_providers:'可观看', modal_buy:'购买', modal_rent:'租借', modal_open_tmdb:'在TMDB打开',
    trailer_youtube:"在 YouTube 观看",
    runtime_min:"分钟",
    season_label:"季",
    list_label:"列表",
    favorite:"收藏",
    watch_later:"稍后观看",
    selected:"已选择",
    not_selected:"未选择",
    modal_add_fav:"收藏",
    modal_add_watch:"稍后观看",
    no_results_hint:"请减少条件或重置筛选。",
    empty_reset_filters:"重置筛选",
    empty_retry_all:"搜索全部",
    empty_search_tmdb:"在 TMDB 搜索",
    provider_region:"KR 区域",
    crew_more:"查看更多主创",
    crew_less:"收起",
    genre_movie:"电影类型",
    genre_tv:"剧集类型",
    api_key:"TMDB API Key",
    api_key_hint:"公开部署建议使用个人 Key。留空则使用默认 Key。",
    save_key:"保存 Key",
    reset_key:"默认 Key",
    toast_key_saved:"API Key 已保存",
    toast_key_reset:"已恢复默认 API Key",
    cached_badge:"缓存结果",
    min_rating:"最低评分",
    sort_popularity:"人气",
    sort_vote:"评分",
    sort_date:"最新",
    crew_director:"导演",
    crew_writing:"编剧",
    crew_production:"制作",
    crew_music:"音乐",
    crew_camera:"摄影",
    crew_art:"美术",
  },
  fr: {
    search_placeholder:'Rechercher films, séries, réalisateurs, acteurs', search_button:'Chercher',
    tab_all:'Tout', tab_movie:'Films', tab_tv:'Séries',
    filters:'Filtres', country:'Pays', year_range:'Plage d\'années', from:'De', to:'À',
    year_hint:'Vide = toutes les années', genre_inc:'Genres inclus', genre_exc:'Genres exclus',
    genre_hint:'Les genres sont appliqués séparément aux films et séries.',
    reset:'Réinitialiser', apply:'Appliquer',
    status_discovering:'Exploration...', status_searching:'Recherche...', status_empty:'Aucun résultat',
    status_auth_fail:'Échec auth API (401)', status_fetch_fail:'Échec de récupération',
    offline_using_cache:'Hors ligne : affichage du cache.',
    toast_reset:'Réinitialisé', toast_saved:'Sauvegardé', toast_removed:'Supprimé',
    badge_movie:'Film', badge_tv:'Série', poster_none:'Pas d\'affiche', year_unknown:'Année inconnue',
    modal_overview:'Aperçu', modal_description:'Description', modal_trailer:'Bande-annonce', modal_cast:'Acteurs', modal_crew:'Équipe',
    modal_providers:'Disponible sur', modal_buy:'Acheter', modal_rent:'Louer', modal_open_tmdb:'Ouvrir sur TMDB',
    trailer_youtube:"Voir sur YouTube",
    runtime_min:"min",
    season_label:"Saison",
    list_label:"Liste",
    favorite:"Favori",
    watch_later:"À regarder",
    selected:"Sélectionné",
    not_selected:"Non sélectionné",
    modal_add_fav:"Favori",
    modal_add_watch:"À regarder",
    no_results_hint:"Réduisez les critères ou réinitialisez les filtres.",
    empty_reset_filters:"Réinitialiser",
    empty_retry_all:"Tout rechercher",
    empty_search_tmdb:"Rechercher sur TMDB",
    provider_region:"Région KR",
    crew_more:"Voir plus d’équipe",
    crew_less:"Réduire",
    genre_movie:"Genres film",
    genre_tv:"Genres série",
    api_key:"Clé API TMDB",
    api_key_hint:"Pour une mise en ligne publique, utilisez votre propre clé. Vide = clé par défaut.",
    save_key:"Enregistrer",
    reset_key:"Clé par défaut",
    toast_key_saved:"Clé API enregistrée",
    toast_key_reset:"Clé API par défaut restaurée",
    cached_badge:"Résultat cache",
    min_rating:"Note minimum",
    sort_popularity:"Popularité",
    sort_vote:"Mieux notés",
    sort_date:"Récent",
    crew_director:"Réalisation",
    crew_writing:"Écriture",
    crew_production:"Production",
    crew_music:"Musique",
    crew_camera:"Caméra",
    crew_art:"Art",
  },
};
const COUNTRY_NAMES = {
  ko: { '':'전체','KR':'대한민국','US':'미국','JP':'일본','CN':'중국','TW':'대만','HK':'홍콩','TH':'태국','GB':'영국','FR':'프랑스','DE':'독일','IN':'인도','ES':'스페인','IT':'이탈리아','BR':'브라질','MX':'멕시코','AU':'호주','CA':'캐나다','RU':'러시아','TR':'터키' },
  en: { '':'All','KR':'Korea','US':'United States','JP':'Japan','CN':'China','TW':'Taiwan','HK':'Hong Kong','TH':'Thailand','GB':'United Kingdom','FR':'France','DE':'Germany','IN':'India','ES':'Spain','IT':'Italy','BR':'Brazil','MX':'Mexico','AU':'Australia','CA':'Canada','RU':'Russia','TR':'Turkey' },
  ja: { '':'すべて','KR':'韓国','US':'アメリカ','JP':'日本','CN':'中国','TW':'台湾','HK':'香港','TH':'タイ','GB':'イギリス','FR':'フランス','DE':'ドイツ','IN':'インド','ES':'スペイン','IT':'イタリア','BR':'ブラジル','MX':'メキシコ','AU':'オーストラリア','CA':'カナダ','RU':'ロシア','TR':'トルコ' },
  zh: { '':'全部','KR':'韩国','US':'美国','JP':'日本','CN':'中国','TW':'台湾','HK':'香港','TH':'泰国','GB':'英国','FR':'法国','DE':'德国','IN':'印度','ES':'西班牙','IT':'意大利','BR':'巴西','MX':'墨西哥','AU':'澳大利亚','CA':'加拿大','RU':'俄罗斯','TR':'土耳其' },
  fr: { '':'Tous','KR':'Corée','US':'États-Unis','JP':'Japon','CN':'Chine','TW':'Taïwan','HK':'Hong Kong','TH':'Thaïlande','GB':'Royaume-Uni','FR':'France','DE':'Allemagne','IN':'Inde','ES':'Espagne','IT':'Italie','BR':'Brésil','MX':'Mexique','AU':'Australie','CA':'Canada','RU':'Russie','TR':'Turquie' },
};

/* ═══════════════════════════════ localStorage ═══════════════════════════════ */
const storage = {
  get(keys) {
    const result = {};
    (Array.isArray(keys) ? keys : [keys]).forEach(k => {
      try { const r = localStorage.getItem(k); result[k] = r !== null ? JSON.parse(r) : undefined; } catch { result[k] = undefined; }
    });
    return Promise.resolve(result);
  },
  set(obj) {
    Object.entries(obj).forEach(([k,v]) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} });
    return Promise.resolve();
  },
  remove(key) {
    (Array.isArray(key) ? key : [key]).forEach(k => { try { localStorage.removeItem(k); } catch {} });
    return Promise.resolve();
  }
};

/* ═══════════════════════════════ UTILS ═══════════════════════════════ */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const t  = k => (I18N[CUR_LANG]?.[k]) || (I18N.en[k] || k);
const tmdbLang   = () => LANGS[CUR_LANG]?.tmdb || 'ko-KR';
const posterUrl  = (p, s='w342') => p ? `https://image.tmdb.org/t/p/${s}${p}` : '';
const getYear    = d => (d||'').slice(0,4) || '';
const setStatus  = m => { $('#status').textContent = m||''; };
const setStatusIfEmpty = msg => { if (!$('#results').children.length) $('#status').textContent = msg||''; else $('#status').textContent = ''; };
const showToast  = (m, ms=1800) => { const el=$('#toast'); el.textContent=m; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'), ms); };
const escapeHtml = s => (s||'').replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const todayISO   = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const toNumDate  = s => s ? Number(String(s).replace(/-/g,'')) : 0;
const lc         = s => (s||'').toLowerCase();

/* ═══════════════════════════════ TITLE FALLBACK ═══════════════════════════════
   TMDB에서 선택 언어 제목이 없을 때 원어 제목이 그대로 내려오는 경우가 있어,
   카드/상세창에서는 현재 언어 → 한국어 → 영어 → 원제 순서로 보기 쉬운 제목을 보강합니다. */
const TITLE_CACHE = new Map();
const POSTER_CACHE = new Map();
const TITLE_STORE_KEY = 'cinefinder_title_store_v3';
const POSTER_STORE_KEY = 'cinefinder_poster_store_v2';
const DETAIL_STORE_KEY = 'cinefinder_detail_filter_store_v1';
let TITLE_STORE = {};
let POSTER_STORE = {};
let DETAIL_STORE = {};
try { TITLE_STORE = JSON.parse(localStorage.getItem(TITLE_STORE_KEY) || '{}'); } catch { TITLE_STORE = {}; }
try { POSTER_STORE = JSON.parse(localStorage.getItem(POSTER_STORE_KEY) || '{}'); } catch { POSTER_STORE = {}; }
try { DETAIL_STORE = JSON.parse(localStorage.getItem(DETAIL_STORE_KEY) || '{}'); } catch { DETAIL_STORE = {}; }
function persistSmallCache(key,obj){ try { localStorage.setItem(key, JSON.stringify(obj)); } catch {} }
function rememberTitleCache(key,value){ if(value){ TITLE_STORE[key]=value; persistSmallCache(TITLE_STORE_KEY,TITLE_STORE); } }
function rememberPosterCache(key,value){ if(value){ POSTER_STORE[key]=value; persistSmallCache(POSTER_STORE_KEY,POSTER_STORE); } }
function rememberDetailCache(key,value){ if(value){ DETAIL_STORE[key]={when:Date.now(),data:value}; persistSmallCache(DETAIL_STORE_KEY,DETAIL_STORE); } }
const COMMON_TITLE_CHARS_RE = /^[\u0000-\u007F\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\s.,:;!?"'()\[\]{}\-–—_&+/·•★☆#@%°]+$/;
const JA_TITLE_CHARS_RE = /^[\u0000-\u007F\u3040-\u30FF\u3400-\u9FFF\s.,:;!?"'()\[\]{}\-–—_&+/·•★☆#@%°]+$/;
const ZH_TITLE_CHARS_RE = /^[\u0000-\u007F\u3400-\u9FFF\s.,:;!?"'()\[\]{}\-–—_&+/·•★☆#@%°]+$/;
function cleanTitle(v){ return String(v||'').replace(/\s+/g,' ').trim(); }
function itemTitle(it,type){ return cleanTitle(type==='movie'?(it.title||it.name||it.original_title||it.original_name||''):(it.name||it.title||it.original_name||it.original_title||'')); }
function translationTitle(entry,type){
  const data=entry?.data||{};
  return cleanTitle(type==='movie'?(data.title||data.name||''):(data.name||data.title||''));
}
function titleLooksReadable(title,lang=CUR_LANG){
  title=cleanTitle(title); if(!title)return false;
  if(lang==='ko') return /[\uAC00-\uD7A3]/.test(title);  // 한글 포함 필수
  if(lang==='ja') return /[\u3040-\u30FF]/.test(title);  // 히라가나/가타카나 포함 필수
  if(lang==='zh') return /[\u4E00-\u9FFF]/.test(title);  // 한자 포함 필수
  return COMMON_TITLE_CHARS_RE.test(title);
}
function getTranslationTitle(translations,type,lang,countries=[]){
  const rows=(translations?.translations||[]).filter(x=>x.iso_639_1===lang);
  if(!rows.length)return '';
  const preferred=countries.map(c=>rows.find(x=>x.iso_3166_1===c)).find(Boolean)||rows[0];
  return translationTitle(preferred,type);
}
async function resolveTmdbDisplayTitle(type,id,currentTitle=''){
  const current=cleanTitle(currentTitle);
  const langTag=tmdbLang();
  const cacheKey=`${langTag}:${type}:${id}`;
  if(TITLE_CACHE.has(cacheKey))return TITLE_CACHE.get(cacheKey)||current;
  if(TITLE_STORE[cacheKey]){ TITLE_CACHE.set(cacheKey,TITLE_STORE[cacheKey]); return TITLE_STORE[cacheKey]; }
  try{
    const translations=await fetchJson(`https://api.themoviedb.org/3/${type}/${id}/translations?api_key=${API_KEY}`);
    const [lang,country='']=langTag.split('-');
    const currentLangTitle=getTranslationTitle(translations,type,lang,country?[country]:[]);
    const enTitle=getTranslationTitle(translations,type,'en',['US','GB']);
    const koTitle=getTranslationTitle(translations,type,'ko',['KR']);

    // 언어별 우선순위:
    // ko: 한글 제목 최우선 → 영어 → 원제
    // ja: 일본어 제목 최우선 → 영어 → 원제
    // zh: 중국어 제목 최우선 → 영어 → 원제
    // en/fr: 영어 제목 최우선 → 원제
    const jaTitle = getTranslationTitle(translations,type,'ja',['JP']);
    const zhTitle = getTranslationTitle(translations,type,'zh',['CN','TW','HK']);
    const frTitle = getTranslationTitle(translations,type,'fr',['FR']);

    let langNativeTitle = '';
    if(lang==='ko') langNativeTitle = koTitle;
    else if(lang==='ja') langNativeTitle = jaTitle;
    else if(lang==='zh') langNativeTitle = zhTitle;
    else if(lang==='fr') langNativeTitle = frTitle;
    else langNativeTitle = currentLangTitle;

    // native 제목이 실제로 해당 언어 문자를 포함하는지 검증
    const nativeVerified = titleLooksReadable(langNativeTitle, lang) ? langNativeTitle : '';

    const candidates = [
      nativeVerified,       // 1순위: 해당 언어 검증된 제목
      currentLangTitle,     // 2순위: API가 돌려준 현재 언어 제목 (검증 없이)
      enTitle,              // 3순위: 영어 제목
      koTitle,              // 4순위: 한국어 제목 (비ko 언어 fallback)
      current               // 5순위: 원제
    ].map(cleanTitle).filter(Boolean);

    // 중복 제거
    const seen = new Set();
    const unique = candidates.filter(x => { if(seen.has(x)) return false; seen.add(x); return true; });

    const picked =
      unique.find(x=>titleLooksReadable(x, lang)) ||
      unique.find(x=>/[A-Za-z가-힣ぁ-ゟ゠-ヿ一-鿿]/.test(x)) ||
      current;

    TITLE_CACHE.set(cacheKey,picked);
    rememberTitleCache(cacheKey,picked);
    return picked||current;
  }catch{
    TITLE_CACHE.set(cacheKey,current);
    return current;
  }
}
function posterLangPriorityList(){
  const currentLang=(tmdbLang().split('-')[0]||'ko').toLowerCase();
  return Array.from(new Set([currentLang,'ko','en','null','']));
}
function pickBestPosterPath(images,currentPoster=''){
  const posters=(images?.posters||[]).filter(p=>p?.file_path);
  if(!posters.length)return currentPoster||'';
  const priorities=posterLangPriorityList();
  const scored=[...posters].sort((a,b)=>{
    const langA=(a.iso_639_1??'null').toLowerCase();
    const langB=(b.iso_639_1??'null').toLowerCase();
    const pa=priorities.includes(langA)?priorities.indexOf(langA):priorities.length+1;
    const pb=priorities.includes(langB)?priorities.indexOf(langB):priorities.length+1;
    if(pa!==pb)return pa-pb;
    if((b.vote_average||0)!==(a.vote_average||0))return (b.vote_average||0)-(a.vote_average||0);
    if((b.vote_count||0)!==(a.vote_count||0))return (b.vote_count||0)-(a.vote_count||0);
    return ((b.width||0)*(b.height||0))-((a.width||0)*(a.height||0));
  });
  return scored[0]?.file_path || currentPoster || '';
}
async function resolveTmdbPosterPath(type,id,currentPoster=''){
  const current=(currentPoster||'').trim();
  const cacheKey=`${tmdbLang()}:${type}:${id}:poster`;
  if(POSTER_CACHE.has(cacheKey))return POSTER_CACHE.get(cacheKey)||current;
  if(POSTER_STORE[cacheKey]){ POSTER_CACHE.set(cacheKey,POSTER_STORE[cacheKey]); return POSTER_STORE[cacheKey]; }
  try{
    const include=posterLangPriorityList().map(x=>x||'null').filter(Boolean).join(',');
    const images=await fetchJson(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${API_KEY}&include_image_language=${encodeURIComponent(include)}`);
    const picked=pickBestPosterPath(images,current);
    POSTER_CACHE.set(cacheKey,picked||current);
    rememberPosterCache(cacheKey,picked||current);
    return picked||current;
  }catch{
    POSTER_CACHE.set(cacheKey,current);
    return current;
  }
}
async function runLimited(items, limit, task){
  const list=[...items];
  const workers=Array.from({length:Math.min(limit,list.length)}, async()=>{
    while(list.length){
      const item=list.shift();
      try{ await task(item); }catch{}
    }
  });
  await Promise.all(workers);
}
function refreshCardTitles(cards){
  // 1) 캐시 히트는 동기에 가깝게 즉각 반영
  cards.forEach(card=>{
    const type=card.getAttribute('data-type');
    const id=card.getAttribute('data-id');
    if(!type||!id)return;
    const cacheKey=`${tmdbLang()}:${type}:${id}`;
    const cached=TITLE_CACHE.get(cacheKey)||TITLE_STORE[cacheKey];
    if(cached){
      const nameEl=card.querySelector('.name');
      if(nameEl&&nameEl.textContent!==cached){ nameEl.textContent=cached; nameEl.setAttribute('title',cached); card.setAttribute('data-title',cached); const img=card.querySelector('.thumb img'); if(img)img.setAttribute('alt',cached); }
    }
  });
  // 2) 캐시 미스는 병렬 API 호출 (동시 8개)
  runLimited(cards, 8, async card=>{
    if(!document.body.contains(card))return;
    const type=card.getAttribute('data-type');
    const id=card.getAttribute('data-id');
    const nameEl=card.querySelector('.name');
    if(!type||!id||!nameEl)return;
    const cacheKey=`${tmdbLang()}:${type}:${id}`;
    if(TITLE_CACHE.has(cacheKey))return; // 이미 처리됨
    const current=cleanTitle(nameEl.textContent);
    const title=await resolveTmdbDisplayTitle(type,id,current);
    if(!title||!document.body.contains(card))return;
    if(nameEl.textContent!==title){ nameEl.textContent=title; nameEl.setAttribute('title',title); card.setAttribute('data-title',title); const img=card.querySelector('.thumb img'); if(img)img.setAttribute('alt',title); }
    syncSavedTitle(type,id,title).catch(()=>{});
  });
}
// 즐겨찾기/나중에보기 저장 항목의 제목을 최신 해석된 제목으로 동기화
async function syncSavedTitle(type, id, title) {
  if (!title) return;
  for (const kind of ['fav', 'watch']) {
    const list = await getSaved(kind);
    const idx  = list.findIndex(x => x.id === Number(id) && x.media_type === type);
    if (idx >= 0 && list[idx].title !== title) {
      list[idx].title = title;
      await setSaved(kind, list);
    }
  }
}

function refreshCardPosters(cards){
  runLimited(cards, 3, async card=>{
    if(!document.body.contains(card))return;
    const type=card.getAttribute('data-type');
    const id=card.getAttribute('data-id');
    const thumb=card.querySelector('.thumb');
    if(!type||!id||!thumb)return;
    const currentPoster=card.getAttribute('data-poster')||'';
    const resolved=await resolveTmdbPosterPath(type,id,currentPoster);
    if(!resolved||!document.body.contains(card))return;
    if(resolved===currentPoster&&thumb.querySelector('img'))return;
    card.setAttribute('data-poster',resolved);
    let img=thumb.querySelector('img');
    const title=card.getAttribute('data-title')||card.querySelector('.name')?.textContent?.trim()||'';
    if(!img){
      thumb.innerHTML=`<img src="${posterUrl(resolved)}" alt="${escapeHtml(title)}" loading="lazy">`;
      return;
    }
    const nextSrc=posterUrl(resolved);
    if(img.getAttribute('src')!==nextSrc)img.setAttribute('src',nextSrc);
    if(title)img.setAttribute('alt',title);
  });
}


/* ═══════════════════════════════ FILTER STRENGTHENING ═══════════════════════════════ */
function activeFilterCount(){
  return MOVIE_INC.size + MOVIE_EXC.size + TV_INC.size + TV_EXC.size + (SELECTED_COUNTRY?1:0) + (YEAR_FROM?1:0) + (YEAR_TO?1:0) + (MIN_RATING>0?1:0);
}
function normalizeFilterInputs(){
  const normalizeYear=v=>{
    const n=parseInt(String(v||'').trim(),10);
    if(!Number.isFinite(n))return '';
    return String(Math.min(2100, Math.max(1900,n)));
  };
  YEAR_FROM=normalizeYear(YEAR_FROM);
  YEAR_TO=normalizeYear(YEAR_TO);
  if(YEAR_FROM&&YEAR_TO&&Number(YEAR_FROM)>Number(YEAR_TO)){
    const a=YEAR_FROM; YEAR_FROM=YEAR_TO; YEAR_TO=a;
  }
  $('#yearFrom').value=YEAR_FROM;
  $('#yearTo').value=YEAR_TO;
}
function removeGenreConflicts(){
  MOVIE_INC.forEach(id=>MOVIE_EXC.delete(id));
  TV_INC.forEach(id=>TV_EXC.delete(id));
}
function hasStrictFilterNeeds(list=[]){
  if(!activeFilterCount())return false;
  if(SELECTED_COUNTRY)return true;
  // 장르 필터가 있으면 detail 없이는 장르를 확정할 수 없는 아이템이 있을 수 있음
  if(MOVIE_INC.size||MOVIE_EXC.size||TV_INC.size||TV_EXC.size) return true;
  return list.some(it=>!Array.isArray(it.genre_ids));
}
function getItemDate(it,detail=null){ return it.release_date || it.first_air_date || detail?.release_date || detail?.first_air_date || ''; }
function getItemGenres(it,detail=null){
  if(Array.isArray(it.genre_ids)&&it.genre_ids.length)return it.genre_ids;
  if(Array.isArray(detail?.genres))return detail.genres.map(g=>g.id).filter(Boolean);
  return [];
}
function countryCodesFromItem(it,detail=null){
  const set=new Set();
  const push=v=>{ if(v&&typeof v==='string')set.add(v.toUpperCase()); };
  (Array.isArray(it.origin_country)?it.origin_country:[]).forEach(push);
  (Array.isArray(detail?.origin_country)?detail.origin_country:[]).forEach(push);
  (Array.isArray(detail?.production_countries)?detail.production_countries:[]).forEach(c=>push(c.iso_3166_1));
  (Array.isArray(detail?.production_companies)?detail.production_companies:[]).forEach(c=>push(c.origin_country));
  return set;
}
async function getFilterDetail(type,id){
  const key=`${type}:${id}:${tmdbLang()}`;
  const cached=DETAIL_STORE[key];
  if(cached?.data && Date.now()-(cached.when||0)<1000*60*60*24*7)return cached.data;
  const detail=await fetchJson(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=${tmdbLang()}`);
  rememberDetailCache(key,detail);
  return detail;
}
function itemMatchesFilters(it,detail=null){
  const type=it.media_type||(it.first_air_date?'tv':'movie');
  const ids=getItemGenres(it,detail);
  const inc=type==='movie'?MOVIE_INC:TV_INC;
  const exc=type==='movie'?MOVIE_EXC:TV_EXC;
  const otherInc=type==='movie'?TV_INC:MOVIE_INC;
  // "모두" 탭: 반대 타입에만 포함 장르가 있고 이 타입엔 없으면 제외
  if(CONTENT_TYPE==='all' && otherInc.size>0 && inc.size===0){
    // 반대 타입 장르만 선택된 상태이므로 이 타입 아이템은 보여주지 않음
    return false;
  }
  const hasAll=(arr,set)=>!set.size||[...set].every(id=>arr.includes(id));
  if(!hasAll(ids,inc))return false;
  if(exc.size&&ids.some(id=>exc.has(id)))return false;
  if(SELECTED_COUNTRY){
    const countries=countryCodesFromItem(it,detail);
    if(!countries.has(SELECTED_COUNTRY))return false;
  }
  if(YEAR_FROM||YEAR_TO){
    const y=+getYear(getItemDate(it,detail));
    if(!y)return false;
    if(YEAR_FROM&&y<+YEAR_FROM)return false;
    if(YEAR_TO&&y>+YEAR_TO)return false;
  }
  if(SORT_BY==='date.desc'){
    const ds=getItemDate(it,detail);
    if(!ds||toNumDate(ds)>toNumDate(todayISO()))return false;
  }
  if(MIN_RATING>0){
    const v=it.vote_average||0;
    if(v<MIN_RATING)return false;
  }
  return true;
}
function cheapItemPass(it){
  if(CONTENT_TYPE!=='all'){
    const type=it.media_type||(it.first_air_date?'tv':'movie');
    if(type!==CONTENT_TYPE)return false;
  }
  const type=it.media_type||(it.first_air_date?'tv':'movie');
  const otherInc=type==='movie'?TV_INC:MOVIE_INC;
  const inc=type==='movie'?MOVIE_INC:TV_INC;
  const exc=type==='movie'?MOVIE_EXC:TV_EXC;
  // "모두" 탭: 반대 타입에만 포함 장르가 있으면 이 타입 제외
  if(CONTENT_TYPE==='all' && otherInc.size>0 && inc.size===0) return false;
  const ids=Array.isArray(it.genre_ids)?it.genre_ids:null;
  if(ids&&ids.length){
    if(inc.size&&![...inc].every(id=>ids.includes(id)))return false;
    if(exc.size&&ids.some(id=>exc.has(id)))return false;
  }
  const ds=it.release_date||it.first_air_date||'';
  if(ds&&(YEAR_FROM||YEAR_TO)){
    const y=+getYear(ds);
    if(YEAR_FROM&&y&&y<+YEAR_FROM)return false;
    if(YEAR_TO&&y&&y>+YEAR_TO)return false;
  }
  if(ds&&SORT_BY==='date.desc'&&toNumDate(ds)>toNumDate(todayISO()))return false;
  if(SELECTED_COUNTRY&&Array.isArray(it.origin_country)&&it.origin_country.length&&!it.origin_country.includes(SELECTED_COUNTRY))return false;
  if(MIN_RATING>0&&(it.vote_average||0)<MIN_RATING)return false;
  return true;
}
async function applyClientFiltersStrict(list){
  const cheap=list.filter(cheapItemPass);
  if(!hasStrictFilterNeeds(cheap))return cheap.filter(it=>itemMatchesFilters(it,null));
  // 순서 보존: 인덱스 기반으로 결과를 수집한 뒤 원래 순서대로 반환
  const results=new Array(cheap.length).fill(null);
  await runLimited(cheap.map((it,i)=>({it,i})), 6, async ({it,i})=>{
    const type=it.media_type||(it.first_air_date?'tv':'movie');
    let detail=null;
    try{ detail=await getFilterDetail(type,it.id); }catch{}
    if(itemMatchesFilters(it,detail)){
      results[i]={...it, genre_ids:getItemGenres(it,detail), release_date:it.release_date||detail?.release_date||'', first_air_date:it.first_air_date||detail?.first_air_date||'', origin_country:it.origin_country||detail?.origin_country||[]};
    }
  });
  return results.filter(Boolean);
}
function applyFilterControlsState(){
  const count=activeFilterCount();
  const applyBtn=$('#applyBtn');
  if(applyBtn){
    applyBtn.classList.toggle('has-filter-count',!!count);
    applyBtn.setAttribute('data-count',count?String(count):'');
  }
  const badge=$('#filterBadge');
  if(badge){
    badge.textContent=count?String(count):'';
    badge.setAttribute('aria-label', count?`Active filters ${count}`:'');
  }
}

/* ═══════════════════════════════ STATE ═══════════════════════════════ */
let API_KEY=null, CUR_LANG='ko';
let CONTENT_TYPE='all';
let PAGE_STATE={ query:'', pageMovie:1, pageTV:1, pageSearch:1, lastMode:'discover', personActive:null, personMeta:null };
let GENRES={ movie:[], tv:[] };
let MOVIE_INC=new Set(), MOVIE_EXC=new Set(), TV_INC=new Set(), TV_EXC=new Set();
let SELECTED_COUNTRY='', YEAR_FROM='', YEAR_TO='', SORT_BY='popularity.desc', MIN_RATING=0;
let BUSY=false, IO=null, acTimer=null, acCtrl=null, acIndex=-1;
let ABORTS=new Set(), lastScrollLoad=0, RENDER_TOKEN=0, LAST_FOCUS=null;

const SK = { filters:'cineScopeFilters', favs:'cinefinder_favs', watch:'cinefinder_watch', cache:'cinefinder_cache', lang:'cinefinderLang', theme:'cinefinderTheme' };
const COUNTRY_CODES=['','KR','US','JP','CN','TW','HK','TH','GB','FR','DE','IN','ES','IT','BR','MX','AU','CA','RU','TR'];

const MOVIE_TO_TV_GENRE={ 28:[10759],12:[10759],16:[16],35:[35],80:[80],99:[99],18:[18],10751:[10751,10762],14:[10765],36:[],27:[],10402:[],9648:[9648],10749:[],878:[10765],10770:[],53:[],10752:[10768],37:[37] };
const mapMovieSetToTV = set => { const o=new Set(); for(const id of set)(MOVIE_TO_TV_GENRE[id]||[]).forEach(tv=>o.add(tv)); return o; };
const EXCLUDE_TV_GENRES_FOR_PERSON = new Set([10763,10764,10767]);
function isSelfLike(ch='') { return /(self|himself|herself|themselves|archive|guest|cameo)/i.test(ch||''); }
function filterPersonCredits(works, meta) {
  const dep=lc(meta?.known_for_department||'');
  const isActor=dep.includes('acting'), isDir=dep.includes('direct'), isWriter=dep.includes('writ'), isProd=dep.includes('production');
  return works.filter(w=>{
    const type=w.media_type||(w.first_air_date?'tv':'movie');
    if(type==='tv'&&(w.genre_ids||[]).some(id=>EXCLUDE_TV_GENRES_FOR_PERSON.has(id)))return false;
    if(isActor){ if((w.department&&w.department!=='Acting')&&!('character' in w))return false; if('character' in w&&isSelfLike(w.character))return false; return true; }
    if(isDir)   return(w.department==='Directing')||/director/i.test(w.job||'');
    if(isWriter)return(w.department==='Writing')||/(writer|screenplay|teleplay|story)/i.test(w.job||'');
    if(isProd)  return(w.department==='Production')||/(producer)/i.test(w.job||'');
    if('character' in w&&isSelfLike(w.character))return false;
    return true;
  });
}

/* ═══════════════════════════════ THEME ═══════════════════════════════ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme==='dark' ? '#0e1015' : '#ffffff');
}
function initTheme() {
  const saved = localStorage.getItem(SK.theme);
  const theme = saved || 'light'; // 기본값 라이트
  applyTheme(theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next    = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem(SK.theme, next);
}

/* ═══════════════════════════════ INIT ═══════════════════════════════ */
initTheme(); // 렌더 전 즉시 테마 적용 (깜빡임 방지)

document.addEventListener('DOMContentLoaded', async () => {
  const bag = await storage.get([SK.filters, SK.lang]);
  API_KEY = DEFAULT_TMDB_KEY;

  CUR_LANG = bag[SK.lang] || 'ko';
  $('#langSelect').value = CUR_LANG;

  applyI18n();
  renderCountryOptions();

  if (bag[SK.filters]) {
    const f = bag[SK.filters];
    CONTENT_TYPE     = f.type    || 'all';
    SELECTED_COUNTRY = f.country || '';
    YEAR_FROM = f.yearFrom || '';
    YEAR_TO   = f.yearTo   || '';
    MOVIE_INC = new Set(f.movieInc || f.genreIncludeIds || []);
    MOVIE_EXC = new Set(f.movieExc || f.genreExcludeIds || []);
    TV_INC = new Set(f.tvInc || []);
    TV_EXC = new Set(f.tvExc || []);
    if(f.sortBy){ SORT_BY=f.sortBy; const ss=$('#sortSelect'); if(ss) ss.value=SORT_BY; }
    if(f.minRating){ MIN_RATING=f.minRating; const rs=$('#ratingSelect'); if(rs) rs.value=String(MIN_RATING); }
    $('#yearFrom').value = YEAR_FROM;
    $('#yearTo').value   = YEAR_TO;
    setActiveTab(CONTENT_TYPE);
  }

  await Promise.all([loadGenres('movie'), loadGenres('tv')]);
  renderGenreChips();
  updateFilterBadge();

  const { [SK.cache]: cache } = await storage.get([SK.cache]);
  if (!navigator.onLine && cache?.items?.length) {
    renderCards(cache.items, false);
    setStatus(t('offline_using_cache'));
    restorePagingFromCache(cache);
  } else {
    await runDiscover(true);
  }

  bindEvents();
  initInfiniteScroll();
  setupModalScrollGuards();

  // Logo → home
  const homeBtn = $('#homeBtn');
  const goHome  = async () => {
    try { closeDrawer(); } catch {}
    try { const m=$('#modal'); if(!m.classList.contains('hidden')){ closeModal(); } } catch {}
    try { setSavedModeUI(null); } catch {}
    try { setActiveTab('all'); } catch {}
    try { resetPaging(); await runSearchOrDiscover(true); } catch {}
    try { window.scrollTo({top:0,behavior:'smooth'}); } catch { window.scrollTo(0,0); }
  };
  homeBtn.addEventListener('click', e=>{e.preventDefault();goHome();});
  homeBtn.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();goHome();} });

  // Search clear
  const clearBtn = $('#clearSearch');
  const searchInput = $('#searchInput');
  searchInput.addEventListener('input', ()=>{ clearBtn.classList.toggle('visible', searchInput.value.length>0); });
  clearBtn.addEventListener('click', ()=>{
    searchInput.value=''; PAGE_STATE.query='';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    resetPaging(); runSearchOrDiscover(true);
  });

  // Scroll-to-top
  const stBtn = $('#scrollTopBtn');
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', ()=>{
    stBtn.classList.toggle('visible', window.scrollY>400);
    siteHeader?.classList.toggle('scrolled', window.scrollY>10);
  }, {passive:true});
  stBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

  // yearTo placeholder를 현재 연도로
  const ytInput = $('#yearTo');
  if(ytInput && !ytInput.value) ytInput.setAttribute('placeholder', String(new Date().getFullYear()));
});

/* ═══════════════════════════════ I18N ═══════════════════════════════ */
function applyI18n() {
  const set = (id, prop, val) => { const el=$(id); if(el) el[prop]=val; };
  set('#searchInput',      'placeholder', t('search_placeholder'));
  set('#searchBtn',        'textContent', t('search_button'));
  set('#tabAll',           'textContent', t('tab_all'));
  set('#tabMovie',         'textContent', t('tab_movie'));
  set('#tabTV',            'textContent', t('tab_tv'));
  set('#i18nFilters',      'textContent', t('filters'));
  set('#i18nCountry',      'textContent', t('country'));
  set('#i18nYearRange',    'textContent', t('year_range'));
  set('#i18nYearHint',     'textContent', t('year_hint'));
  set('#i18nGenreInclude', 'textContent', t('genre_inc'));
  set('#i18nGenreExclude', 'textContent', t('genre_exc'));
  set('#i18nGenreHint',    'textContent', t('genre_hint'));
  set('#resetBtn span',    'textContent', t('reset'));
  set('#applyBtn span',    'textContent', t('apply'));
  set('#labelFrom',        'textContent', t('from'));
  set('#labelTo',          'textContent', t('to'));
  const drawerTitle = document.querySelector('.drawer-title-row span');
  if (drawerTitle) drawerTitle.textContent = t('filters');

  const favSpan=$('#btnFav span:last-child'); if(favSpan)favSpan.textContent=t('favorite');
  const watchSpan=$('#btnWatch span:last-child'); if(watchSpan)watchSpan.textContent=t('watch_later');
  const sortPop=$('#sortSelect option[value="popularity.desc"]'); if(sortPop)sortPop.textContent=t('sort_popularity');
  set('#i18nMinRating', 'textContent', t('min_rating'));
  // ratingSelect 옵션 텍스트 다국어화
  const ratingAll=$('#ratingSelect option[value="0"]');
  if(ratingAll) ratingAll.textContent=CUR_LANG==='ko'?'전체':CUR_LANG==='ja'?'すべて':CUR_LANG==='zh'?'全部':CUR_LANG==='fr'?'Tous':'All';
  const sortVote=$('#sortSelect option[value="vote_average.desc"]'); if(sortVote)sortVote.textContent=t('sort_vote');
  const sortDate=$('#sortSelect option[value="date.desc"]'); if(sortDate)sortDate.textContent=t('sort_date');
}
function renderCountryOptions() {
  const names = COUNTRY_NAMES[CUR_LANG] || COUNTRY_NAMES.en;
  $('#countrySelect').innerHTML = COUNTRY_CODES.map(c=>`<option value="${c}">${names[c]||c}</option>`).join('');
  if (SELECTED_COUNTRY) $('#countrySelect').value = SELECTED_COUNTRY;
}
function setActiveTab(name) {
  CONTENT_TYPE = name;
  $$('.type-tabs .tab').forEach(b=>{ const on=b.dataset.type===name; b.classList.toggle('active',on); b.setAttribute('aria-selected',on?'true':'false'); });
  try{ renderGenreChips(); }catch{}
}
function setSavedButtonState(btn, kind, active){
  if(!btn) return;
  btn.classList.toggle('active', !!active);
  const icon = btn.querySelector('.saved-btn-icon');
  if(icon){
    icon.textContent = kind==='fav' ? (active ? '♥' : '♡') : (active ? '✓' : '⏱');
  }
  const label = kind==='fav' ? t('favorite') : t('watch_later');
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  btn.setAttribute('title', `${label} ${active ? t('selected') : t('not_selected')}`);
}
function setSavedModeUI(mode) {
  setSavedButtonState($('#btnFav'), 'fav', mode==='fav');
  setSavedButtonState($('#btnWatch'), 'watch', mode==='watch');
  const toolbar = $('#savedToolbar');
  const label   = $('#savedToolbarLabel');
  if (toolbar) {
    if (mode) {
      toolbar.classList.remove('hidden');
      toolbar.dataset.mode = mode;
      if (label) label.textContent = mode === 'fav' ? t('favorite') + ' ' + t('list_label') : t('watch_later') + ' ' + t('list_label');
    } else {
      toolbar.classList.add('hidden');
      toolbar.dataset.mode = '';
    }
  }
}

/* Filter badge indicator */
function updateFilterBadge() {
  const count = activeFilterCount();
  const active = count > 0;
  const btn    = $('#menuBtn');
  const badge  = $('#filterBadge');
  btn?.classList.toggle('has-filters', !!active);
  badge?.classList.toggle('hidden', !active);
  applyFilterControlsState();
  renderActiveFilterBar();
}

/* ── 적용된 필터 태그 바 ── */
function renderActiveFilterBar() {
  const bar = $('#activeFilterBar');
  if (!bar) return;

  const chips = [];
  const names = COUNTRY_NAMES[CUR_LANG] || COUNTRY_NAMES.en;

  // 국가 (country)
  if (SELECTED_COUNTRY) {
    chips.push({ label: names[SELECTED_COUNTRY] || SELECTED_COUNTRY, kind: 'country',
      action: () => { SELECTED_COUNTRY = ''; saveAndReload(); } });
  }

  // 연도 (year) — 언어별 표현
  const yearSuffix = CUR_LANG==='ko'?'년':CUR_LANG==='ja'?'年':CUR_LANG==='zh'?'年':'';
  if (YEAR_FROM && YEAR_TO)
    chips.push({ label: `${YEAR_FROM}${yearSuffix}–${YEAR_TO}${yearSuffix}`, kind: 'year',
      action: () => { YEAR_FROM = ''; YEAR_TO = ''; saveAndReload(); } });
  else if (YEAR_FROM)
    chips.push({ label: `${YEAR_FROM}${yearSuffix}~`, kind: 'year',
      action: () => { YEAR_FROM = ''; saveAndReload(); } });
  else if (YEAR_TO)
    chips.push({ label: `~${YEAR_TO}${yearSuffix}`, kind: 'year',
      action: () => { YEAR_TO = ''; saveAndReload(); } });

  // 최소 평점 (rating)
  if (MIN_RATING > 0) {
    chips.push({ label: `★ ${MIN_RATING}+`, kind: 'rating',
      action: () => { MIN_RATING = 0; saveAndReload(); } });
  }

  // 포함 장르 — 영화 (movie-inc)
  MOVIE_INC.forEach(id => {
    const g = GENRES.movie.find(x => x.id === id);
    if (g) chips.push({ label: g.name, kind: 'movie-inc',
      action: () => { MOVIE_INC.delete(id); saveAndReload(); } });
  });

  // 포함 장르 — 드라마 (tv-inc)
  TV_INC.forEach(id => {
    const g = GENRES.tv.find(x => x.id === id);
    if (g) chips.push({ label: g.name, kind: 'tv-inc',
      action: () => { TV_INC.delete(id); saveAndReload(); } });
  });

  // 제외 장르 — 영화 (movie-exc)
  MOVIE_EXC.forEach(id => {
    const g = GENRES.movie.find(x => x.id === id);
    if (g) chips.push({ label: g.name, kind: 'movie-exc',
      action: () => { MOVIE_EXC.delete(id); saveAndReload(); } });
  });

  // 제외 장르 — 드라마 (tv-exc)
  TV_EXC.forEach(id => {
    const g = GENRES.tv.find(x => x.id === id);
    if (g) chips.push({ label: g.name, kind: 'tv-exc',
      action: () => { TV_EXC.delete(id); saveAndReload(); } });
  });

  if (!chips.length) {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }

  bar.classList.remove('hidden');
  bar.innerHTML = chips.map((c, i) =>
    `<button class="afc-chip afc-${c.kind}" data-idx="${i}" type="button" title="${escapeHtml(c.label)}">
      <span class="afc-dot"></span>
      <span class="afc-label">${escapeHtml(c.label)}</span>
      <svg class="afc-x" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>`
  ).join('');

  bar.querySelectorAll('.afc-chip').forEach(btn => {
    btn.addEventListener('click', () => chips[+btn.dataset.idx].action());
  });
}

async function saveAndReload() {
  // 드로어 UI 동기화
  const rs = $('#ratingSelect'); if (rs) rs.value = String(MIN_RATING);
  const cs = $('#countrySelect'); if (cs) cs.value = SELECTED_COUNTRY;
  const yf = $('#yearFrom'); if (yf) yf.value = YEAR_FROM;
  const yt = $('#yearTo'); if (yt) yt.value = YEAR_TO;
  renderGenreChips();
  await storage.set({[SK.filters]:{type:CONTENT_TYPE,country:SELECTED_COUNTRY,yearFrom:YEAR_FROM,yearTo:YEAR_TO,movieInc:[...MOVIE_INC],movieExc:[...MOVIE_EXC],tvInc:[...TV_INC],tvExc:[...TV_EXC],sortBy:SORT_BY,minRating:MIN_RATING}});
  updateFilterBadge();
  resetPaging();
  PAGE_STATE.lastMode = PAGE_STATE.query ? 'search' : 'discover';
  await runSearchOrDiscover(true);
}

/* ═══════════════════════════════ DRAWER ═══════════════════════════════ */
function openDrawer() {
  const d=$('#drawer'), o=$('#drawerOverlay');
  d.classList.add('open'); d.removeAttribute('inert'); d.setAttribute('aria-hidden','false');
  o.classList.add('active'); document.body.classList.add('lock-scroll');
  (d.querySelector('select,input,button')||{}).focus?.();
}
function closeDrawer() {
  const d=$('#drawer'), o=$('#drawerOverlay');
  if(d.contains(document.activeElement)) $('#menuBtn').focus();
  d.setAttribute('aria-hidden','true'); d.setAttribute('inert',''); d.classList.remove('open');
  o.classList.remove('active'); document.body.classList.remove('lock-scroll');
}

/* ═══════════════════════════════ EVENTS ═══════════════════════════════ */
function bindEvents() {
  $('#menuBtn').addEventListener('click', openDrawer);
  $('#closeDrawer').addEventListener('click', closeDrawer);
  $('#drawerOverlay').addEventListener('click', closeDrawer);
  $('#themeToggle').addEventListener('click', toggleTheme);


  $('#applyBtn').addEventListener('click', async()=>{ await onApplyFilters(); setSavedModeUI(null); });
  $('#resetBtn').addEventListener('click', async()=>{ await onResetFilters(); setSavedModeUI(null); });
  ['countrySelect','yearFrom','yearTo','ratingSelect'].forEach(id=>$('#'+id)?.addEventListener('input',applyPendingFilterCount));
  ['countrySelect','yearFrom','yearTo','ratingSelect'].forEach(id=>$('#'+id)?.addEventListener('change',applyPendingFilterCount));

  $$('.type-tabs .tab').forEach(btn=>{
    btn.addEventListener('click', async()=>{
      if(CONTENT_TYPE===btn.dataset.type&&!String(PAGE_STATE.lastMode).startsWith('saved-'))return;
      setActiveTab(btn.dataset.type); renderGenreChips(); setSavedModeUI(null); resetPaging(); await runSearchOrDiscover(true);
    });
  });

  $('#btnFav').addEventListener('click', async()=>{
    if(PAGE_STATE.lastMode==='saved-fav'){setSavedModeUI(null);resetPaging();await runSearchOrDiscover(true);return;}
    setSavedModeUI('fav'); await showSaved('fav');
  });
  $('#btnWatch').addEventListener('click', async()=>{
    if(PAGE_STATE.lastMode==='saved-watch'){setSavedModeUI(null);resetPaging();await runSearchOrDiscover(true);return;}
    setSavedModeUI('watch'); await showSaved('watch');
  });

  $('#searchForm').addEventListener('submit', async e=>{
    e.preventDefault();
    PAGE_STATE.query=($('#searchInput').value||'').trim();
    PAGE_STATE.personActive=null; PAGE_STATE.personMeta=null;
    setSavedModeUI(null); resetPaging(); await runSearchOrDiscover(true); closeSuggest();
  });
  $('#sortSelect').addEventListener('change', async e=>{
    SORT_BY=e.target.value;
    if(String(PAGE_STATE.lastMode).startsWith('saved-')){await showSaved(String(PAGE_STATE.lastMode).split('-')[1]||'fav');return;}
    resetPaging(); await runSearchOrDiscover(true);
  });
  $('#langSelect').addEventListener('change', async()=>{
    CUR_LANG=$('#langSelect').value||'ko';
    await storage.set({[SK.lang]:CUR_LANG});
    TITLE_CACHE.clear(); TITLE_STORE={}; try{localStorage.removeItem(TITLE_STORE_KEY);}catch{}
    POSTER_CACHE.clear();
    PAGE_STATE.personActive=null;
    PAGE_STATE.personMeta=null;
    applyI18n(); renderCountryOptions();
    await Promise.all([loadGenres('movie'),loadGenres('tv')]);
    renderGenreChips(); updateFilterBadge(); setSavedModeUI(null); resetPaging(); await runSearchOrDiscover(true);
  });

  // ── 내보내기 / 가져오기 ──
  $('#btnExport')?.addEventListener('click', () => {
    const kind = $('#savedToolbar')?.dataset.mode || 'fav';
    exportSaved(kind);
  });
  $('#btnImport')?.addEventListener('click', () => $('#importFileInput')?.click());
  $('#importFileInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) {
      const kind = $('#savedToolbar')?.dataset.mode || 'fav';
      importSaved(file, kind);
    }
    e.target.value = '';
  });
  $('#btnClearList')?.addEventListener('click', () => {
    const kind = $('#savedToolbar')?.dataset.mode || 'fav';
    clearSavedList(kind);
  });

  initAutocomplete();
  window.addEventListener('online',  ()=>$('#offlineBar').classList.add('hidden'));
  window.addEventListener('offline', ()=>{ $('#offlineBar').textContent=t('offline_using_cache'); $('#offlineBar').classList.remove('hidden'); });
  window.addEventListener('scroll', ()=>{
    if(String(PAGE_STATE.lastMode).startsWith('saved-'))return;
    const now=Date.now(); if(now-lastScrollLoad<700||BUSY)return;
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight-800){ lastScrollLoad=now; BUSY=true; runSearchOrDiscover(false).finally(()=>BUSY=false); }
  },{passive:true});
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){
      const m=$('#modal'); if(!m.classList.contains('hidden')){closeModal();}
      if($('#drawer').classList.contains('open'))closeDrawer();
    }
  });
}

/* ═══════════════════════════════ AUTOCOMPLETE ═══════════════════════════════ */
function initAutocomplete() {
  const input=$('#searchInput'), box=$('#suggestBox');
  input.addEventListener('input', ()=>{
    clearTimeout(acTimer); const q=input.value.trim(); if(!q){closeSuggest();return;}
    acTimer=setTimeout(async()=>{
      acCtrl?.abort(); acCtrl=new AbortController();
      try{
        const j=await fetchJson(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${tmdbLang()}&query=${encodeURIComponent(q)}&page=1`,{signal:acCtrl.signal});
        renderSuggest((j.results||[]).filter(r=>['movie','tv','person'].includes(r.media_type)).slice(0,8));
      }catch{}
    },220);
  });
  input.addEventListener('keydown', e=>{
    const items=$$('#suggestBox .sitem'); if(!items.length)return;
    if(e.key==='ArrowDown'){acIndex=(acIndex+1)%items.length;updateActive(items);e.preventDefault();}
    else if(e.key==='ArrowUp'){acIndex=(acIndex-1+items.length)%items.length;updateActive(items);e.preventDefault();}
    else if(e.key==='Enter'){if(acIndex>=0){input.value=items[acIndex].dataset.label;PAGE_STATE.query=input.value;PAGE_STATE.personActive=null;PAGE_STATE.personMeta=null;runSearch(true);closeSuggest();e.preventDefault();}}
    else if(e.key==='Escape'){closeSuggest();}
  });
  document.addEventListener('click', e=>{if(!box.contains(e.target)&&e.target!==input)closeSuggest();});
  function renderSuggest(list){
    box.innerHTML=list.map(r=>{const label=r.media_type==='person'?(r.name||''):(r.title||r.name||'');return`<div class="sitem" role="option" data-label="${escapeHtml(label)}">${escapeHtml(label)}</div>`;}).join('');
    box.classList.remove('hidden'); acIndex=-1;
    $$('#suggestBox .sitem').forEach(el=>el.addEventListener('click',()=>{input.value=el.dataset.label;PAGE_STATE.query=input.value;PAGE_STATE.personActive=null;PAGE_STATE.personMeta=null;runSearch(true);closeSuggest();}));
  }
  function updateActive(items){items.forEach((el,i)=>el.setAttribute('aria-selected',i===acIndex?'true':'false'));}
  function closeSuggest(){box.classList.add('hidden');box.innerHTML='';acIndex=-1;}
  window.closeSuggest=closeSuggest;
}

/* ═══════════════════════════════ FILTERS ═══════════════════════════════ */

function pendingFilterCountFromDrawer(){
  const countSelected=root=>root?root.querySelectorAll('.genre-chip.selected').length:0;
  const country=$('#countrySelect')?.value||'';
  const yf=($('#yearFrom')?.value||'').trim();
  const yt=($('#yearTo')?.value||'').trim();
  const rating=parseFloat($('#ratingSelect')?.value||'0')||0;
  return countSelected($('#genreIncludeList')) + countSelected($('#genreExcludeList')) + (country?1:0) + (yf?1:0) + (yt?1:0) + (rating>0?1:0);
}
function applyPendingFilterCount(){
  const count=pendingFilterCountFromDrawer();
  const applyBtn=$('#applyBtn');
  if(applyBtn){
    applyBtn.classList.toggle('has-filter-count',!!count);
    applyBtn.setAttribute('data-count',count?String(count):'');
  }
}

function clearFiltersInMemory(){
  SELECTED_COUNTRY='';YEAR_FROM='';YEAR_TO='';MIN_RATING=0;
  MOVIE_INC.clear();MOVIE_EXC.clear();TV_INC.clear();TV_EXC.clear();
  $('#countrySelect').value='';$('#yearFrom').value='';$('#yearTo').value='';
  const rs=$('#ratingSelect'); if(rs) rs.value='0';
  renderGenreChips();
}
async function onApplyFilters(){
  const readSelected=(root,kind)=>new Set(Array.from(root.querySelectorAll(`.genre-chip.selected[data-kind="${kind}"]`)).map(c=>parseInt(c.dataset.id,10)));
  const incRoot=$('#genreIncludeList'), excRoot=$('#genreExcludeList');
  MOVIE_INC = readSelected(incRoot,'movie');
  MOVIE_EXC = readSelected(excRoot,'movie');
  TV_INC    = readSelected(incRoot,'tv');
  TV_EXC    = readSelected(excRoot,'tv');
  SELECTED_COUNTRY=$('#countrySelect').value||'';
  YEAR_FROM=($('#yearFrom').value||'').trim();
  YEAR_TO  =($('#yearTo').value||'').trim();
  MIN_RATING=parseFloat($('#ratingSelect')?.value||'0')||0;
  normalizeFilterInputs();
  removeGenreConflicts();
  renderGenreChips();
  await storage.set({[SK.filters]:{type:CONTENT_TYPE,country:SELECTED_COUNTRY,yearFrom:YEAR_FROM,yearTo:YEAR_TO,movieInc:[...MOVIE_INC],movieExc:[...MOVIE_EXC],tvInc:[...TV_INC],tvExc:[...TV_EXC],sortBy:SORT_BY,minRating:MIN_RATING}});
  updateFilterBadge();
  closeDrawer(); resetPaging(); PAGE_STATE.lastMode=PAGE_STATE.query?'search':'discover'; await runSearchOrDiscover(true);
}
async function onResetFilters(){
  clearFiltersInMemory(); await storage.remove(SK.filters);
  updateFilterBadge();
  closeDrawer(); resetPaging(); PAGE_STATE.lastMode='discover'; await runDiscover(true); showToast(t('toast_reset'));
}

/* ── TV 장르 다국어 직접 매핑 (TMDB 미번역 보완) ── */
const TV_GENRE_NAMES = {
  ko: {
    10759:'액션 & 어드벤처', 16:'애니메이션', 35:'코미디', 80:'범죄',
    99:'다큐멘터리', 18:'드라마', 10751:'가족', 10762:'어린이',
    9648:'미스터리', 10763:'뉴스', 10764:'리얼리티', 10765:'SF & 판타지',
    10766:'연속극', 10767:'토크', 10768:'전쟁 & 정치', 37:'서부극'
  },
  en: {
    10759:'Action & Adventure', 16:'Animation', 35:'Comedy', 80:'Crime',
    99:'Documentary', 18:'Drama', 10751:'Family', 10762:'Kids',
    9648:'Mystery', 10763:'News', 10764:'Reality', 10765:'Sci-Fi & Fantasy',
    10766:'Soap', 10767:'Talk', 10768:'War & Politics', 37:'Western'
  },
  ja: {
    10759:'アクション & アドベンチャー', 16:'アニメ', 35:'コメディ', 80:'犯罪',
    99:'ドキュメンタリー', 18:'ドラマ', 10751:'ファミリー', 10762:'キッズ',
    9648:'ミステリー', 10763:'ニュース', 10764:'リアリティ', 10765:'SF & ファンタジー',
    10766:'ソープ', 10767:'トーク', 10768:'戦争 & 政治', 37:'西部劇'
  },
  zh: {
    10759:'动作冒险', 16:'动画', 35:'喜剧', 80:'犯罪',
    99:'纪录片', 18:'剧情', 10751:'家庭', 10762:'儿童',
    9648:'悬疑', 10763:'新闻', 10764:'真人秀', 10765:'科幻奇幻',
    10766:'肥皂剧', 10767:'脱口秀', 10768:'战争政治', 37:'西部片'
  },
  fr: {
    10759:'Action & Aventure', 16:'Animation', 35:'Comédie', 80:'Crime',
    99:'Documentaire', 18:'Drame', 10751:'Famille', 10762:'Enfants',
    9648:'Mystère', 10763:'Actualités', 10764:'Téléréalité', 10765:'SF & Fantastique',
    10766:'Soap', 10767:'Talk-show', 10768:'Guerre & Politique', 37:'Western'
  },
};
function getTvGenreName(id, lang) {
  return (TV_GENRE_NAMES[lang] || TV_GENRE_NAMES.en)[id] || null;
}

async function loadGenres(kind){
  try{
    const j=await fetchJson(`https://api.themoviedb.org/3/genre/${kind}/list?api_key=${API_KEY}&language=${tmdbLang()}`);
    const raw=j.genres||[];
    if(kind==='tv'){
      // TMDB가 번역 안 한 TV 장르를 로컬 테이블로 보완
      GENRES[kind]=raw.map(g=>{
        const localName=getTvGenreName(g.id, CUR_LANG);
        return localName ? {...g, name:localName} : g;
      });
    } else {
      GENRES[kind]=raw;
    }
  }catch{ GENRES[kind]=[]; }
}

/* Genre chips (UI) */
function renderGenreChips(){
  const incEl=$('#genreIncludeList'), excEl=$('#genreExcludeList');
  if(!incEl||!excEl)return;
  incEl.innerHTML=''; excEl.innerHTML='';
  incEl.className='genre-chip-grid'; excEl.className='genre-chip-grid exclude';

  const groups=[];
  if(CONTENT_TYPE==='movie')groups.push(['movie', t('genre_movie'), GENRES.movie, MOVIE_INC, MOVIE_EXC]);
  else if(CONTENT_TYPE==='tv')groups.push(['tv', t('genre_tv'), GENRES.tv, TV_INC, TV_EXC]);
  else{
    groups.push(['movie', t('genre_movie'), GENRES.movie, MOVIE_INC, MOVIE_EXC]);
    groups.push(['tv', t('genre_tv'), GENRES.tv, TV_INC, TV_EXC]);
  }

  const addChip=(row,kind,g,set)=>{
    const chip=document.createElement('span');
    chip.className='genre-chip'+(set.has(g.id)?' selected':'');
    chip.dataset.id=g.id;
    chip.dataset.kind=kind;
    chip.textContent=g.name;
    chip.addEventListener('click',()=>{chip.classList.toggle('selected');applyPendingFilterCount();});
    row.appendChild(chip);
  };

  const makeGroup=(kind,label,list,set)=>{
    const group=document.createElement('div');
    group.className=`genre-group genre-group-${kind}`;

    const title=document.createElement('div');
    title.className='genre-group-title';
    title.innerHTML=`<span class="genre-group-dot"></span><span>${escapeHtml(label)}</span>`;

    const row=document.createElement('div');
    row.className='genre-chip-row';
    (list||[]).forEach(g=>addChip(row,kind,g,set));

    group.appendChild(title);
    group.appendChild(row);
    return group;
  };

  groups.forEach(([kind,label,list,incSet,excSet])=>{
    incEl.appendChild(makeGroup(kind,label,list,incSet));
    excEl.appendChild(makeGroup(kind,label,list,excSet));
  });
  applyFilterControlsState();
}

/* ═══════════════════════════════ PAGING ═══════════════════════════════ */
function resetPaging(){ PAGE_STATE.pageMovie=1; PAGE_STATE.pageTV=1; PAGE_STATE.pageSearch=1; }
function initInfiniteScroll(){
  if(IO)IO.disconnect();
  IO=new IntersectionObserver(async entries=>{
    if(String(PAGE_STATE.lastMode).startsWith('saved-'))return;
    if(entries.some(e=>e.isIntersecting)){if(BUSY)return;BUSY=true;try{await runSearchOrDiscover(false);}finally{BUSY=false;}}
  },{root:null,rootMargin:'800px',threshold:0});
  IO.observe($('#sentinel'));
}

/* ═══════════════════════════════ DATA ═══════════════════════════════ */
function abortActiveRequests(){
  ABORTS.forEach(ctrl=>{try{ctrl.abort();}catch{}});
  ABORTS.clear();
}
function beginFreshRun(clear){
  if(clear){ abortActiveRequests(); RENDER_TOKEN++; }
  return RENDER_TOKEN;
}
function isStale(token){ return token!==RENDER_TOKEN; }
async function runSearchOrDiscover(clear){
  if(String(PAGE_STATE.lastMode).startsWith('saved-')){ if(!clear)return; PAGE_STATE.lastMode=PAGE_STATE.query?'search':'discover'; }
  if(PAGE_STATE.query){PAGE_STATE.lastMode='search';await runSearch(clear);}
  else{PAGE_STATE.lastMode='discover';await runDiscover(clear);}
}

async function runDiscover(clear){
  const token=beginFreshRun(clear);
  if(clear){$('#results').innerHTML='';showSkeletons();setStatus(t('status_discovering'));}
  const tasks=[];
  // "모두" 탭: 반대 타입에만 포함 장르가 있으면 해당 API 요청 스킵
  const skipMovie = CONTENT_TYPE==='all' && TV_INC.size>0 && MOVIE_INC.size===0;
  const skipTV    = CONTENT_TYPE==='all' && MOVIE_INC.size>0 && TV_INC.size===0;
  if((CONTENT_TYPE==='all'&&!skipMovie)||CONTENT_TYPE==='movie') tasks.push(fetchJson(`https://api.themoviedb.org/3/discover/movie?${buildDiscoverParams('movie',PAGE_STATE.pageMovie)}`));
  if((CONTENT_TYPE==='all'&&!skipTV)||CONTENT_TYPE==='tv')       tasks.push(fetchJson(`https://api.themoviedb.org/3/discover/tv?${buildDiscoverParams('tv',PAGE_STATE.pageTV)}`));
  try{
    let merged=mergeResults(await Promise.all(tasks));
    if(isStale(token))return;
    if(CONTENT_TYPE!=='all')merged=merged.filter(x=>x.media_type===CONTENT_TYPE);
    merged=clientSort(await applyClientFiltersStrict(merged));
    clearSkeletons(); renderCards(merged,!clear); setStatusIfEmpty(t('status_empty'));
    if(CONTENT_TYPE==='all'){PAGE_STATE.pageMovie++;PAGE_STATE.pageTV++;}
    else if(CONTENT_TYPE==='movie')PAGE_STATE.pageMovie++;
    else PAGE_STATE.pageTV++;
    await saveCache({mode:'discover',items:merged,state:snapshotState()});
  }catch(e){
    if(String(e).includes('AbortError'))return;
    if(isStale(token))return;
    clearSkeletons();setStatusIfEmpty(String(e).includes('401')?t('status_auth_fail'):t('status_fetch_fail'));await maybeShowCache();
  }
}

async function runSearch(clear){
  const token=beginFreshRun(clear);
  if(!clear&&PAGE_STATE.personActive){setStatusIfEmpty('');return;}
  if(clear){$('#results').innerHTML='';showSkeletons();setStatus(t('status_searching'));}
  if(PAGE_STATE.personActive){clearSkeletons();await renderPersonFilmography(PAGE_STATE.personMeta||{id:PAGE_STATE.personActive},clear);return;}
  const p=new URLSearchParams({api_key:API_KEY,language:tmdbLang(),include_adult:'false',query:PAGE_STATE.query,page:String(PAGE_STATE.pageSearch||1)});
  try{
    const multi=await fetchJson(`https://api.themoviedb.org/3/search/multi?${p}`);
    if(isStale(token))return;
    const person=(multi.results||[]).find(r=>r.media_type==='person');
    if(person){ PAGE_STATE.personActive=person.id; PAGE_STATE.personMeta={id:person.id,known_for_department:person.known_for_department||''}; clearSkeletons(); await renderPersonFilmography(PAGE_STATE.personMeta,clear); return; }
    let items=(multi.results||[]).filter(r=>r.media_type==='movie'||r.media_type==='tv');
    if(CONTENT_TYPE!=='all')items=items.filter(r=>r.media_type===CONTENT_TYPE);
    let merged=Array.from(new Map(items.map(it=>{const type=it.media_type||(it.first_air_date?'tv':'movie');return[`${type}-${it.id}`,{...it,media_type:type}];})).values());
    merged=clientSort(await applyClientFiltersStrict(merged));
    clearSkeletons(); renderCards(merged,!clear); setStatusIfEmpty(t('status_empty'));
    if((multi.page||1)<(multi.total_pages||1))PAGE_STATE.pageSearch++;
    await saveCache({mode:'search',items:merged,state:snapshotState()});
  }catch(e){
    if(String(e).includes('AbortError'))return;
    if(isStale(token))return;
    clearSkeletons();setStatusIfEmpty(String(e).includes('401')?t('status_auth_fail'):t('status_fetch_fail'));await maybeShowCache();
  }
}

async function renderPersonFilmography(meta, clear){
  const pid=typeof meta==='object'?meta.id:meta;
  let fullMeta=typeof meta==='object'?meta:null;
  try{ if(!fullMeta){const d=await fetchJson(`https://api.themoviedb.org/3/person/${pid}?api_key=${API_KEY}&language=${tmdbLang()}`);fullMeta={id:pid,known_for_department:d.known_for_department||''};PAGE_STATE.personMeta=fullMeta;} }catch{}
  let pc=null;
  try{pc=await fetchJson(`https://api.themoviedb.org/3/person/${pid}/combined_credits?api_key=${API_KEY}&language=${tmdbLang()}`);}catch{}
  let works=pc?[...(pc.cast||[]),...(pc.crew||[])].filter(x=>x.media_type==='movie'||x.media_type==='tv'):[];
  works=filterPersonCredits(works,fullMeta);
  if(CONTENT_TYPE!=='all')works=works.filter(w=>(w.media_type||(w.first_air_date?'tv':'movie'))===CONTENT_TYPE);
  const map=new Map();
  for(const w of works){const type=w.media_type||(w.first_air_date?'tv':'movie');const key=`${type}-${w.id}`;if(!map.has(key))map.set(key,{...w,media_type:type});}
  let merged=clientSort(await applyClientFiltersStrict(Array.from(map.values())));
  renderCards(merged,!clear); setStatusIfEmpty(t('status_empty'));
  await saveCache({mode:'search',items:merged,state:snapshotState()});
}

function buildDiscoverParams(type,page){
  const p=new URLSearchParams();
  p.set('api_key',API_KEY); p.set('language',tmdbLang());
  p.set('sort_by',SORT_BY==='date.desc'?(type==='movie'?'primary_release_date.desc':'first_air_date.desc'):SORT_BY);
  p.set('include_adult','false'); p.set('page',String(page||1));
  const inc = type==='movie' ? MOVIE_INC : TV_INC;
  const exc = type==='movie' ? MOVIE_EXC : TV_EXC;
  if(inc.size)p.set('with_genres',[...inc].join(','));
  if(exc.size)p.set('without_genres',[...exc].join(','));
  if(SELECTED_COUNTRY)p.set('with_origin_country',SELECTED_COUNTRY);
  if(MIN_RATING>0){ p.set('vote_average.gte',String(MIN_RATING)); p.set('vote_count.gte','50'); }
  else{ p.set('vote_count.gte','10'); } // 투표수 최소 기준: 데이터 없는 작품 제외
  if(SORT_BY==='date.desc'){const today=todayISO();if(type==='movie')p.set('primary_release_date.lte',today);else p.set('first_air_date.lte',today);}
  if(YEAR_FROM||YEAR_TO){if(type==='movie'){if(YEAR_FROM)p.set('primary_release_date.gte',`${YEAR_FROM}-01-01`);if(YEAR_TO)p.set('primary_release_date.lte',`${YEAR_TO}-12-31`);}else{if(YEAR_FROM)p.set('first_air_date.gte',`${YEAR_FROM}-01-01`);if(YEAR_TO)p.set('first_air_date.lte',`${YEAR_TO}-12-31`);}}
  return p.toString();
}
function clientSort(list){
  if(SORT_BY==='vote_average.desc'){
    // 평점순: 투표 수 10개 미만은 후순위
    return[...list].sort((a,b)=>{
      const aValid=(a.vote_count||0)>=10, bValid=(b.vote_count||0)>=10;
      if(aValid!==bValid)return aValid?-1:1;
      return (b.vote_average||0)-(a.vote_average||0);
    });
  }
  if(SORT_BY==='date.desc')return[...list].sort((a,b)=>{const da=a.release_date||a.first_air_date||'',db=b.release_date||b.first_air_date||'';return db>da?1:db<da?-1:0;});
  // 인기순: popularity × log(vote_count+1) 가중치 적용
  // 투표수가 너무 적은 작품이 단순 popularity로 상위 노출되는 것을 보정
  const score=it=>{
    const pop=it.popularity||0;
    const vc=it.vote_count||0;
    const weight=Math.log10(Math.max(vc,1)+1); // 투표 없으면 weight≈0.3, 1000개면 ≈3
    return pop*weight;
  };
  return[...list].sort((a,b)=>{
    const diff=score(b)-score(a);
    if(Math.abs(diff)>0.01)return diff;
    return (a._apiRank??9999)-(b._apiRank??9999);
  });
}
function mergeResults(arr){
  // 각 API 결과에 전역 순위 인덱스 부여 (movie/tv 인터리빙)
  const lists=arr.map(r=>(r&&r.results)||[]);
  const pool=[];
  const maxLen=Math.max(...lists.map(l=>l.length),0);
  for(let i=0;i<maxLen;i++){
    for(const l of lists){
      if(i<l.length) pool.push({...l[i],_apiRank:pool.length});
    }
  }
  const map=new Map();
  for(const it of pool){const type=it.media_type||(it.first_air_date?'tv':'movie');const key=`${type}-${it.id}`;if(!map.has(key))map.set(key,{...it,media_type:type});}
  return Array.from(map.values());
}

/* ═══════════════════════════════ SKELETONS ═══════════════════════════════ */
function showSkeletons(n=12){
  $('#results').insertAdjacentHTML('beforeend',Array(n).fill(`<div class="skeleton"><div class="skeleton-thumb"></div><div class="skeleton-meta"><div class="skeleton-line short"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>`).join(''));
}
function clearSkeletons(){ $$('.skeleton').forEach(el=>el.remove()); }

/* ═══════════════════════════════ SAVED ═══════════════════════════════ */
async function getSaved(kind){ const key=kind==='fav'?SK.favs:SK.watch; const obj=await storage.get([key]); return obj[key]||[]; }
async function setSaved(kind,list){ await storage.set({[kind==='fav'?SK.favs:SK.watch]:list}); }
async function toggleSaved(kind,item){
  const list=await getSaved(kind), k=`${item.media_type}-${item.id}`, idx=list.findIndex(x=>x.k===k);
  if(idx>=0){list.splice(idx,1);await setSaved(kind,list);showToast(t('toast_removed'));}
  else{list.push({k,id:item.id,media_type:item.media_type,title:cleanTitle(item.title||item.name||''),poster_path:item.poster_path||'',vote_average:item.vote_average||0,release_date:item.release_date||item.first_air_date||'',popularity:item.popularity||0});await setSaved(kind,list);showToast(t('toast_saved'));}
  if(PAGE_STATE.lastMode===`saved-${kind}`)await showSaved(kind);
  return await getSaved(kind);
}

/* ═══════════════════════════════ CARDS ═══════════════════════════════ */
function renderEmptyState(){
  $('#results').innerHTML=`<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>${t('status_empty')}</p><small>${t('no_results_hint')}</small><div class="empty-actions"><button id="emptyResetFilters" type="button">${t('empty_reset_filters')}</button><button id="emptyRetryAll" type="button">${t('empty_retry_all')}</button>${PAGE_STATE.query?`<button id="emptySearchTmdb" type="button">${t('empty_search_tmdb')}</button>`:''}</div></div>`;
  $('#emptyResetFilters')?.addEventListener('click',()=>onResetFilters());
  $('#emptyRetryAll')?.addEventListener('click',async()=>{setActiveTab('all');PAGE_STATE.personActive=null;resetPaging();await runSearchOrDiscover(true);});
  $('#emptySearchTmdb')?.addEventListener('click',()=>{const q=encodeURIComponent(PAGE_STATE.query||''); if(q)window.open(`https://www.themoviedb.org/search?query=${q}`,'_blank','noopener,noreferrer');});
}
function setActionButtonVisual(btn,kind,active){
  if(!btn)return;
  btn.classList.toggle('active',!!active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  const label = kind==='fav' ? t('favorite') : t('watch_later');
  btn.setAttribute('aria-label', `${label} ${active ? t('selected') : t('not_selected')}`);
  btn.setAttribute('title', `${label} ${active ? t('selected') : t('not_selected')}`);
  btn.innerHTML = `<span class="btn-glyph">${kind==='fav' ? (active ? '♥' : '♡') : (active ? '✓' : '⏱')}</span>`;
}
function renderCards(items,append){
  if(!items.length&&!append){
    renderEmptyState();
    return;
  }
  const html=items.map(it=>{
    const type=it.media_type||(it.first_air_date?'tv':'movie');
    const title=itemTitle(it,type);
    const year=getYear(it.release_date||it.first_air_date);
    const img=posterUrl(it.poster_path);
    const ratingVal=(it.vote_average||0);
    const rating=ratingVal.toFixed(1);
    const ratingCls=ratingVal>=7.5?'rating rating-high':ratingVal>=6?'rating rating-mid':'rating rating-low';
    const key=`${type}-${it.id}`;
    const badgeCls=type==='tv'?'badge badge-tv':'badge';
    return`<div class="card" data-type="${type}" data-id="${it.id}" data-key="${key}" data-title="${escapeHtml(title)}" data-poster="${escapeHtml(it.poster_path||'')}" data-date="${escapeHtml(it.release_date||it.first_air_date||'')}" data-vote="${it.vote_average||0}">
      <div class="thumb">${img?`<img src="${img}" alt="${escapeHtml(title)}" loading="lazy">`:`<div class="thumb-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>${t('poster_none')}</span></div>`}</div>
      <div class="card-actions">
        <button class="action-btn fav-btn" type="button" aria-pressed="false" aria-label="${t('favorite')} ${t('not_selected')}" title="${t('favorite')} ${t('not_selected')}"><span class="btn-glyph">♡</span></button>
        <button class="action-btn watch-btn" type="button" aria-pressed="false" aria-label="${t('watch_later')} ${t('not_selected')}" title="${t('watch_later')} ${t('not_selected')}"><span class="btn-glyph">⏱</span></button>
      </div>
      <div class="meta">
        <div class="title-line"><span class="${badgeCls}">${type==='movie'?t('badge_movie'):t('badge_tv')}</span><span class="${ratingCls}">★ ${rating}</span></div>
        <div class="name" title="${escapeHtml(title)}">${escapeHtml(title)||'&nbsp;'}</div>
        <div class="sub">${year||t('year_unknown')}</div>
      </div>
    </div>`;
  }).join('');
  if(append){
    const appendHtml=html.replace(/class="card"/g,'class="card newly-added"');
    $('#results').insertAdjacentHTML('beforeend',appendHtml);
    // 애니메이션 후 클래스 제거
    setTimeout(()=>$$('#results .card.newly-added').forEach(c=>c.classList.remove('newly-added')),500);
  }else $('#results').innerHTML=html;

  $$('#results .card:not([data-bound="true"])').forEach(card=>{
    card.dataset.bound='true';
    const type=card.getAttribute('data-type'),id=card.getAttribute('data-id');
    const fb=card.querySelector('.fav-btn'),wb=card.querySelector('.watch-btn');
    card.addEventListener('click',e=>{if(e.target.closest('.action-btn'))return;openDetail(type,id,card);});
    fb.addEventListener('click',async e=>{e.stopPropagation();const s=pickStub(card);const l=await toggleSaved('fav',s);reflectUI(card,l,'fav');});
    wb.addEventListener('click',async e=>{e.stopPropagation();const s=pickStub(card);const l=await toggleSaved('watch',s);reflectUI(card,l,'watch');});
  });
  Promise.all([getSaved('fav'),getSaved('watch')]).then(([fl,wl])=>{
    const fs=new Set(fl.map(x=>x.k)),ws=new Set(wl.map(x=>x.k));
    $$('#results .card').forEach(c=>{
      const k=c.getAttribute('data-key');
      setActionButtonVisual(c.querySelector('.fav-btn'),'fav',fs.has(k));
      setActionButtonVisual(c.querySelector('.watch-btn'),'watch',ws.has(k));
    });
  });
  const renderedCards = $$('#results .card');
  refreshCardTitles(renderedCards);
  refreshCardPosters(renderedCards);
}
function pickStub(card){ return{id:Number(card.getAttribute('data-id')),media_type:card.getAttribute('data-type'),title:card.querySelector('.name').textContent.trim(),poster_path:card.getAttribute('data-poster')||'',vote_average:parseFloat(card.getAttribute('data-vote')||'0'),release_date:card.getAttribute('data-date')||''}; }
function reflectUI(card,list,kind){
  const set=new Set(list.map(x=>x.k));
  setActionButtonVisual(card.querySelector(kind==='fav'?'.fav-btn':'.watch-btn'), kind, set.has(card.getAttribute('data-key')));
}

/* ═══════════════════════════════ EXPORT / IMPORT ═══════════════════════════════ */
async function clearSavedList(kind) {
  const kindName = kind === 'fav' ? '즐겨찾기' : '나중에 보기';
  const list = await getSaved(kind);
  if (!list.length) {
    showToast(`${kindName} 목록이 이미 비어 있습니다`);
    return;
  }
  // 확인 다이얼로그
  if (!confirm(`${kindName} ${list.length}개를 모두 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`)) return;
  await setSaved(kind, []);
  showToast(`${kindName} 목록을 초기화했습니다`, 2200);
  // 현재 화면 갱신
  if (PAGE_STATE.lastMode === `saved-${kind}`) {
    await showSaved(kind);
  }
}

async function exportSaved(kind) {
  const list = await getSaved(kind);
  if (!list.length) {
    showToast('저장된 항목이 없습니다');
    return;
  }
  const kindKey  = kind === 'fav' ? 'favorites' : 'watchlist';
  const kindName = kind === 'fav' ? '즐겨찾기' : '나중에보기';
  const payload  = {
    version: 1,
    kind,
    exported_at: new Date().toISOString(),
    [kindKey]: list,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `cinefinder_${kindName}_${date}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  showToast(`내보내기 완료 · ${kindName} ${list.length}개`, 2000);
}

async function importSaved(file, kind) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    const kindKey  = kind === 'fav' ? 'favorites' : 'watchlist';
    const kindName = kind === 'fav' ? '즐겨찾기' : '나중에 보기';

    // 유효성 검사: kind에 맞는 키가 있어야 함
    if (typeof data !== 'object' || !Array.isArray(data[kindKey])) {
      // 반대 kind 파일인지 확인해서 안내
      const otherKey  = kind === 'fav' ? 'watchlist' : 'favorites';
      const otherName = kind === 'fav' ? '나중에 보기' : '즐겨찾기';
      if (Array.isArray(data[otherKey])) {
        showToast(`이 파일은 ${otherName} 목록입니다`, 2600);
      } else {
        showToast('올바른 cinefinder 파일이 아닙니다', 2400);
      }
      return;
    }

    const incoming = data[kindKey];
    const cur      = await getSaved(kind);

    // 기존 데이터와 병합 (중복 key 제거)
    const map = new Map(cur.map(x => [x.k, x]));
    incoming.forEach(x => { if (x.k && !map.has(x.k)) map.set(x.k, x); });
    const merged = Array.from(map.values());
    const added  = merged.length - cur.length;

    await setSaved(kind, merged);
    showToast(`가져오기 완료 · ${kindName} +${added}개`, 2400);

    // 현재 화면 갱신
    if (PAGE_STATE.lastMode === `saved-${kind}`) {
      await showSaved(kind);
    }
  } catch (e) {
    showToast('파일을 읽을 수 없습니다', 2400);
  }
}

async function showSaved(kind){
  PAGE_STATE.lastMode=`saved-${kind}`; $('#results').innerHTML='';
  const list=await getSaved(kind);
  if(!list.length){setStatus(t('status_empty'));setSavedModeUI(kind);renderEmptyState();return;}
  const fixed=await Promise.all(list.map(async x=>{
    try{x.title=await resolveTmdbDisplayTitle(x.media_type,x.id,x.title||'');}catch{}
    if(!x.poster_path||x.vote_average==null||!x.release_date){
      try{
        const d=await fetchJson(`https://api.themoviedb.org/3/${x.media_type}/${x.id}?api_key=${API_KEY}&language=${tmdbLang()}`);
        x.poster_path=d.poster_path||'';
        x.release_date=d.release_date||d.first_air_date||'';
        x.vote_average=d.vote_average||0;
        x.popularity=d.popularity||x.popularity||0;
        x.title=await resolveTmdbDisplayTitle(x.media_type,x.id,itemTitle(d,x.media_type)||x.title||'');
      }catch{}
    }return x;
  }));
  await setSaved(kind,fixed);
  let items=fixed.slice();
  if(PAGE_STATE.query){ if(PAGE_STATE.personActive){const ks=await personKeySet();items=ks?items.filter(x=>ks.has(`${x.media_type}-${x.id}`)):[];}else{const q=lc(PAGE_STATE.query);items=items.filter(x=>lc(x.title).includes(q));} }
  if(CONTENT_TYPE!=='all')items=items.filter(x=>x.media_type===CONTENT_TYPE);
  items=await applyClientFiltersStrict(items);
  if(!items.length){setStatus(t('status_empty'));setSavedModeUI(kind);renderEmptyState();return;}
  items=clientSort(items);
  setSavedModeUI(kind);
  renderCards(items.map(x=>({id:x.id,media_type:x.media_type,title:x.title,name:x.title,poster_path:x.poster_path,vote_average:x.vote_average,release_date:x.release_date,popularity:x.popularity||0})),false);
  setStatus('');
}
async function personKeySet(){
  const meta=PAGE_STATE.personMeta||(PAGE_STATE.personActive?{id:PAGE_STATE.personActive}:null); if(!meta)return null;
  const pid=meta.id; let fm=meta;
  if(!fm.known_for_department){try{const d=await fetchJson(`https://api.themoviedb.org/3/person/${pid}?api_key=${API_KEY}&language=${tmdbLang()}`);fm={id:pid,known_for_department:d.known_for_department||''};PAGE_STATE.personMeta=fm;}catch{}}
  let pc=null;try{pc=await fetchJson(`https://api.themoviedb.org/3/person/${pid}/combined_credits?api_key=${API_KEY}&language=${tmdbLang()}`);}catch{}
  if(!pc)return null;
  return new Set(filterPersonCredits([...(pc.cast||[]),...(pc.crew||[])].filter(x=>x.media_type==='movie'||x.media_type==='tv'),fm).map(w=>{const t=w.media_type||(w.first_air_date?'tv':'movie');return`${t}-${w.id}`;}));
}

/* ═══════════════════════════════ MODAL ═══════════════════════════════ */
function stopModalMedia(){
  const mb=$('#modalBody'); if(!mb)return;
  mb.querySelectorAll('iframe,video,audio').forEach(el=>{try{if(el.tagName==='IFRAME')el.setAttribute('src','');else{el.pause?.();el.currentTime=0;}}catch{}el.remove();});
  mb.innerHTML='';
}
async function openDetail(type,id,sourceEl=null){
  LAST_FOCUS=sourceEl||document.activeElement;
  stopModalMedia();
  try{
    const data=await fetchJson(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=${tmdbLang()}&append_to_response=videos,credits,watch/providers`);
    const rawTitle=itemTitle(data,type);
    const title=await resolveTmdbDisplayTitle(type,id,rawTitle);
    const resolvedPosterPath = await resolveTmdbPosterPath(type,id,data.poster_path||'');
    const poster=posterUrl(resolvedPosterPath,'w500');
    const year=getYear(data.release_date||data.first_air_date);
    const trailer=(data.videos?.results||[]).find(v=>v.site==='YouTube'&&(v.type==='Trailer'||v.type==='Teaser'));
    const cast=(data.credits?.cast||[]).slice(0,12);
    const crew=(data.credits?.crew||[]);
    const prov=(data['watch/providers']?.results||{})[SELECTED_COUNTRY||'KR']||null;
    const genres=(data.genres||[]).map(g=>g.name).filter(Boolean);
    const releaseDate=data.release_date||data.first_air_date||'';
    const detailChips=[
      `★ ${(data.vote_average||0).toFixed(1)}`,
      (data.original_language||'').toUpperCase(),
      data.runtime?`${data.runtime}${t('runtime_min')}`:'',
      data.number_of_seasons?`${t('season_label')} ${data.number_of_seasons}`:'',
      releaseDate,
      ...genres
    ].filter(Boolean);
    const itemStub={id:Number(id),media_type:type,title,poster_path:resolvedPosterPath||'',vote_average:data.vote_average||0,release_date:data.release_date||data.first_air_date||'',popularity:data.popularity||0};
    const [favList,watchList]=await Promise.all([getSaved('fav'),getSaved('watch')]);
    const key=`${type}-${id}`;
    const sectionBlock=(label, body, extra='') => body ? `<div class="section detail-section ${extra}"><strong>${label}</strong><div>${body}</div></div>` : '';
    const safeYoutubeKey=/^[A-Za-z0-9_-]{6,}$/.test(trailer?.key||'') ? trailer.key : '';
    const trailerBlock=safeYoutubeKey?sectionBlock(t('modal_trailer'), `<div class="yt-preview"><img src="https://i.ytimg.com/vi/${safeYoutubeKey}/hqdefault.jpg" alt="Trailer" loading="lazy"/><button class="yt-link" data-url="https://www.youtube.com/watch?v=${safeYoutubeKey}">▶ ${t('trailer_youtube')}</button></div>`, 'media-section'):'';
    const overviewBlock=sectionBlock(t('modal_overview'), `<div class="detail-chip-row">${detailChips.map(x=>`<span class="detail-chip">${escapeHtml(String(x))}</span>`).join('')}</div>`, 'summary-section');
    const descriptionBlock=data.overview?sectionBlock(t('modal_description'), `<p class="detail-text">${escapeHtml(data.overview)}</p>`, 'description-section'):'';
    const renderCastMembers = members => members.map(c => {
      const name = c.name || c.original_name || '';
      const character = c.character || '';
      const profile = posterUrl(c.profile_path, 'w185');
      const initials = (name || '?').trim().slice(0, 1).toUpperCase();
      return `<article class="cast-card">
        <div class="cast-photo">${profile ? `<img src="${profile}" alt="${escapeHtml(name)}" loading="lazy">` : ''}<span>${escapeHtml(initials)}</span></div>
        <div class="cast-info">
          <span class="cast-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
          ${character ? `<span class="cast-role" title="${escapeHtml(character)}">${escapeHtml(character)}</span>` : ''}
        </div>
      </article>`;
    }).join('');
    const castBlock=cast.length?sectionBlock(t('modal_cast'), `<div class="cast-grid">${renderCastMembers(cast)}</div>`, 'people-section cast-section'):'';
    $('#modalBody').innerHTML=`<div class="modal-header">
      <div class="modal-poster">${poster?`<img src="${poster}" alt="${escapeHtml(title)}">`:''}</div>
      <div class="modal-body">
        <h3 id="modalTitle">${escapeHtml(title)}${year?` (${year})`:''}</h3>
        <div class="modal-save-actions">
          <button class="modal-save-btn modal-fav-btn" data-kind="fav" aria-pressed="${favList.some(x=>x.k===key)?'true':'false'}">${favList.some(x=>x.k===key)?'♥':'♡'} ${t('modal_add_fav')}</button>
          <button class="modal-save-btn modal-watch-btn" data-kind="watch" aria-pressed="${watchList.some(x=>x.k===key)?'true':'false'}">${watchList.some(x=>x.k===key)?'✓':'⏱'} ${t('modal_add_watch')}</button>
        </div>
        ${overviewBlock}
        ${descriptionBlock}
        ${trailerBlock}
        ${castBlock}
        ${prov?renderProviders(prov):''}
        <div class="section detail-section tmdb-row"><button class="yt-link tmdb-link" data-url="https://www.themoviedb.org/${type}/${id}?language=${tmdbLang()}">${t('modal_open_tmdb')}</button></div>
      </div>
    </div>`;
    $$('#modalBody [data-url]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.open(btn.getAttribute('data-url'),'_blank','noopener,noreferrer');}));
    $$('#modalBody .modal-save-btn').forEach(btn=>btn.addEventListener('click',async e=>{
      e.preventDefault(); e.stopPropagation();
      const kind=btn.dataset.kind;
      const list=await toggleSaved(kind,itemStub);
      const active=list.some(x=>x.k===key);
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.textContent=`${kind==='fav'?(active?'♥':'♡'):(active?'✓':'⏱')} ${kind==='fav'?t('modal_add_fav'):t('modal_add_watch')}`;
      $$('#results .card').forEach(card=>{ if(card.getAttribute('data-key')===key)reflectUI(card,list,kind); });
    }));
    document.querySelector('.modal-content').scrollTop=0;
    $('#modal').classList.remove('hidden');
    document.body.classList.add('lock-scroll');
    $('#modalClose').focus();
  }catch(e){showToast(t('status_fetch_fail'));}
}
function groupCrew(crew){
  const buckets=[
    [t('crew_director'), c=>/director/i.test(c.job||'')],
    [t('crew_writing'), c=>/(writer|screenplay|story|teleplay)/i.test(c.job||'')],
    [t('crew_production'), c=>/(producer)/i.test(c.job||'')],
    [t('crew_music'), c=>/(music|composer|sound)/i.test(c.job||'')],
    [t('crew_camera'), c=>/(camera|cinematography|director of photography)/i.test(c.job||'')],
    [t('crew_art'), c=>/(art|design|costume|makeup)/i.test(c.job||'')]
  ];
  const used=new Set(), rows=[];
  buckets.forEach(([label,fn])=>{
    const names=[];
    crew.forEach((c,i)=>{ if(!used.has(i)&&fn(c)&&c.name){used.add(i); names.push(`${escapeHtml(c.name)} <em>${escapeHtml(c.job||'')}</em>`);} });
    if(names.length)rows.push(`<div class="crew-row"><strong>${escapeHtml(label)}</strong><span>${names.slice(0,8).join(' · ')}</span></div>`);
  });
  if(!rows.length)return '';
  const hidden=rows.slice(3).join('');
  return `<div class="crew-wrap"><div class="crew-basic">${rows.slice(0,3).join('')}</div>${hidden?`<div class="crew-extra">${hidden}</div><button type="button" class="crew-more-btn">${t('crew_more')}</button>`:''}</div>`;
}
function renderProviders(p){
  const providerBlock=(label,items=[])=>items.length?`<div class="section detail-section provider-section"><strong>${label} <small>${t('provider_region')}</small></strong><div class="providers">${items.map(x=>`<span class="provider">${x.logo_path?`<img src="${posterUrl(x.logo_path,'w45')}" alt="${escapeHtml(x.provider_name)}" loading="lazy">`:''}<span>${escapeHtml(x.provider_name)}</span></span>`).join('')}</div></div>`:'';
  return [
    providerBlock(t('modal_providers'),p.flatrate||[]),
    providerBlock(t('modal_buy'),p.buy||[]),
    providerBlock(t('modal_rent'),p.rent||[])
  ].join('');
}
function closeModal(){
  stopModalMedia();
  $('#modal').classList.add('hidden');
  document.body.classList.remove('lock-scroll');
  try{ LAST_FOCUS?.focus?.(); }catch{}
  LAST_FOCUS=null;
}
document.addEventListener('click',e=>{
  if(e.target.id==='modal'||e.target.id==='modalClose'||e.target.closest('#modalClose'))closeModal();
});
function setupModalScrollGuards(){
  const overlay=$('#modal'); if(!overlay)return;
  const stop=e=>{if(!e.target.closest('.modal-content')){e.preventDefault();e.stopPropagation();}};
  overlay.addEventListener('wheel',stop,{passive:false});
  overlay.addEventListener('touchmove',stop,{passive:false});
}

/* ═══════════════════════════════ CACHE ═══════════════════════════════ */
function cacheKeyForState(){
  return [CUR_LANG,CONTENT_TYPE,SORT_BY,SELECTED_COUNTRY,YEAR_FROM,YEAR_TO,String(MIN_RATING),PAGE_STATE.query||'',PAGE_STATE.personActive||'', [...MOVIE_INC].join('-'),[...MOVIE_EXC].join('-'),[...TV_INC].join('-'),[...TV_EXC].join('-')].join('|');
}
async function saveCache(payload){
  const {[SK.cache]:bag={}}=await storage.get([SK.cache]);
  bag[cacheKeyForState()]={when:Date.now(),...payload};
  const entries=Object.entries(bag).sort((a,b)=>(b[1].when||0)-(a[1].when||0)).slice(0,10);
  await storage.set({[SK.cache]:Object.fromEntries(entries)});
}
function snapshotState(){return{CONTENT_TYPE,SELECTED_COUNTRY,YEAR_FROM,YEAR_TO,MIN_RATING,MOVIE_INC:[...MOVIE_INC],MOVIE_EXC:[...MOVIE_EXC],TV_INC:[...TV_INC],TV_EXC:[...TV_EXC],SORT_BY,CUR_LANG,query:PAGE_STATE.query,personActive:PAGE_STATE.personActive,personMeta:PAGE_STATE.personMeta};}
async function maybeShowCache(){
  const{[SK.cache]:bag}=await storage.get([SK.cache]);
  const cache=bag?.[cacheKeyForState()];
  if(cache?.items?.length){renderCards(cache.items,false);setStatus(`${t('offline_using_cache')} · ${t('cached_badge')}`);restorePagingFromCache(cache);}
}
function restorePagingFromCache(cache){
  if(cache?.state?.MOVIE_INC)MOVIE_INC=new Set(cache.state.MOVIE_INC||[]);
  if(cache?.state?.MOVIE_EXC)MOVIE_EXC=new Set(cache.state.MOVIE_EXC||[]);
  if(cache?.state?.TV_INC)TV_INC=new Set(cache.state.TV_INC||[]);
  if(cache?.state?.TV_EXC)TV_EXC=new Set(cache.state.TV_EXC||[]);
  if(cache?.state?.query){PAGE_STATE.pageSearch=2;PAGE_STATE.lastMode='search';PAGE_STATE.personActive=cache.state.personActive??null;PAGE_STATE.personMeta=cache.state.personMeta??null;}
  else{PAGE_STATE.pageMovie=2;PAGE_STATE.pageTV=2;PAGE_STATE.lastMode='discover';}
}

/* ═══════════════════════════════ FETCH ═══════════════════════════════ */
async function fetchJson(url,opts={}){
  const fetchOpts={cache:'no-store',...opts}; // iOS Safari 캐시 방지
  const ctrl=fetchOpts.signal?null:new AbortController();
  if(!fetchOpts.signal){fetchOpts.signal=ctrl.signal;ABORTS.add(ctrl);}
  let attempt=0;
  while(true){
    try{
      const r=await fetch(url,fetchOpts);
      if(!r.ok)throw new Error('HTTP '+r.status);
      const j=await r.json();
      if(ctrl)ABORTS.delete(ctrl);
      return j;
    }
    catch(e){
      const m=String(e);
      if(m.includes('AbortError')){if(ctrl)ABORTS.delete(ctrl);throw e;}
      if(m.includes('HTTP 429')&&attempt<2){await new Promise(res=>setTimeout(res,500*Math.pow(2,attempt)));attempt++;continue;}
      if(ctrl)ABORTS.delete(ctrl);
      throw e;
    }
  }
}
