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
    toast_save_failed:'저장 실패: 브라우저 저장 공간을 정리한 뒤 다시 시도해주세요.',
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
    toast_save_failed:'Save failed: clear browser storage and try again.',
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
    toast_save_failed:'保存に失敗しました。ブラウザの保存容量を整理して再試行してください。',
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
    toast_save_failed:'保存失败：请清理浏览器存储后重试。',
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
    toast_save_failed:'Échec de sauvegarde : libérez le stockage du navigateur puis réessayez.',
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
Object.assign(I18N.ko, {
  tab_anime:'애니', my_ratings:'내 평점', my_rating:'내 평점', anime:'애니', drama:'드라마', rating_score:'평점', rating_note:'메모',
  save_rating:'평점 저장', clear_rating:'평점 삭제', edit_rating:'평점 수정', rate_this:'평점 매기기',
  rating_placeholder:'0.0 ~ 10.0', note_placeholder:'메모 선택 입력', no_my_ratings:'저장된 내 평점이 없습니다',
  toast_rating_saved:'평점 저장됨', toast_rating_removed:'평점 삭제됨', toast_ratings_exported:'평점 내보내기 완료',
  toast_ratings_imported:'평점 가져오기 완료', toast_invalid_rating:'0~10 사이 숫자를 입력해주세요', toast_invalid_ratings_file:'올바른 평점 JSON 파일이 아닙니다',
  status_resolving_ratings:'내 평점의 TMDB 정보 확인 중...', status_ratings_filtered:'검색되지 않는 항목은 제외했습니다'
});
Object.assign(I18N.en, {
  tab_anime:'Anime', my_ratings:'My ratings', my_rating:'My rating', anime:'Anime', drama:'Drama', rating_score:'Rating', rating_note:'Note',
  save_rating:'Save rating', clear_rating:'Remove rating', edit_rating:'Edit rating', rate_this:'Rate this',
  rating_placeholder:'0.0 ~ 10.0', note_placeholder:'Optional note', no_my_ratings:'No ratings yet',
  toast_rating_saved:'Rating saved', toast_rating_removed:'Rating removed', toast_ratings_exported:'Ratings exported',
  toast_ratings_imported:'Ratings imported', toast_invalid_rating:'Enter a number from 0 to 10', toast_invalid_ratings_file:'Invalid ratings JSON file',
  status_resolving_ratings:'Resolving TMDB data for your ratings...', status_ratings_filtered:'Unavailable items were excluded'
});
Object.assign(I18N.ja, {
  tab_anime:'アニメ', my_ratings:'マイ評価', my_rating:'マイ評価', anime:'アニメ', drama:'ドラマ', rating_score:'評価', rating_note:'メモ',
  save_rating:'評価を保存', clear_rating:'評価を削除', edit_rating:'評価を編集', rate_this:'評価する',
  rating_placeholder:'0.0 ~ 10.0', note_placeholder:'メモ任意', no_my_ratings:'保存した評価はありません',
  toast_rating_saved:'評価を保存しました', toast_rating_removed:'評価を削除しました', toast_ratings_exported:'評価を書き出しました',
  toast_ratings_imported:'評価を読み込みました', toast_invalid_rating:'0〜10の数値を入力してください', toast_invalid_ratings_file:'正しい評価JSONではありません',
  status_resolving_ratings:'マイ評価のTMDB情報を確認中...', status_ratings_filtered:'検索できない項目は除外しました'
});
Object.assign(I18N.zh, {
  tab_anime:'动画', my_ratings:'我的评分', my_rating:'我的评分', anime:'动画', drama:'剧集', rating_score:'评分', rating_note:'备注',
  save_rating:'保存评分', clear_rating:'删除评分', edit_rating:'编辑评分', rate_this:'评分',
  rating_placeholder:'0.0 ~ 10.0', note_placeholder:'备注可选', no_my_ratings:'暂无保存的评分',
  toast_rating_saved:'评分已保存', toast_rating_removed:'评分已删除', toast_ratings_exported:'评分已导出',
  toast_ratings_imported:'评分已导入', toast_invalid_rating:'请输入 0 到 10 的数字', toast_invalid_ratings_file:'不是有效的评分 JSON 文件',
  status_resolving_ratings:'正在确认我的评分 TMDB 信息...', status_ratings_filtered:'未搜索到的项目已排除'
});
Object.assign(I18N.fr, {
  tab_anime:'Anime', my_ratings:'Mes notes', my_rating:'Ma note', anime:'Anime', drama:'Série', rating_score:'Note', rating_note:'Mémo',
  save_rating:'Enregistrer', clear_rating:'Supprimer', edit_rating:'Modifier la note', rate_this:'Noter',
  rating_placeholder:'0.0 ~ 10.0', note_placeholder:'Mémo facultatif', no_my_ratings:'Aucune note enregistrée',
  toast_rating_saved:'Note enregistrée', toast_rating_removed:'Note supprimée', toast_ratings_exported:'Notes exportées',
  toast_ratings_imported:'Notes importées', toast_invalid_rating:'Saisissez un nombre de 0 à 10', toast_invalid_ratings_file:'Fichier JSON de notes invalide',
  status_resolving_ratings:'Recherche des données TMDB pour vos notes...', status_ratings_filtered:'Les éléments introuvables ont été exclus'
});

/* ═══════════════════════════════ localStorage ═══════════════════════════════ */
function isQuotaError(err) {
  return !!err && (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.code === 22 ||
    err.code === 1014
  );
}
function clearVolatileStorageForSave() {
  // 즐겨찾기/나중에 보기 저장 실패의 주 원인은 결과/제목/포스터 캐시가 localStorage 용량을 차지하는 케이스입니다.
  // 사용자 저장 목록은 보존하고, 다시 받아올 수 있는 캐시만 정리합니다.
  ['cinefinder_cache', 'cinefinder_title_store_v3', 'cinefinder_poster_store_v2', 'cinefinder_detail_filter_store_v1', 'cinefinder_rating_match_store_v1'].forEach(k => {
    try { localStorage.removeItem(k); } catch {}
  });
  try { TITLE_CACHE.clear(); } catch {}
  try { POSTER_CACHE.clear(); } catch {}
  try { TITLE_STORE = {}; } catch {}
  try { POSTER_STORE = {}; } catch {}
  try { DETAIL_STORE = {}; } catch {}
}
function safeSetJsonItem(key, value) {
  const json = JSON.stringify(value);
  try {
    localStorage.setItem(key, json);
    return true;
  } catch (err) {
    if (isQuotaError(err)) {
      clearVolatileStorageForSave();
      try {
        localStorage.setItem(key, json);
        return true;
      } catch {}
    }
    return false;
  }
}
const storage = {
  get(keys) {
    const result = {};
    (Array.isArray(keys) ? keys : [keys]).forEach(k => {
      try { const r = localStorage.getItem(k); result[k] = r !== null ? JSON.parse(r) : undefined; } catch { result[k] = undefined; }
    });
    return Promise.resolve(result);
  },
  set(obj) {
    let ok = true;
    Object.entries(obj).forEach(([k,v]) => { if (!safeSetJsonItem(k, v)) ok = false; });
    return Promise.resolve(ok);
  },
  remove(key) {
    (Array.isArray(key) ? key : [key]).forEach(k => { try { localStorage.removeItem(k); } catch {} });
    return Promise.resolve(true);
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

/* ═══════════════════════════════ MOBILE PERF / TRAFFIC ═══════════════════════════════
   모바일에서는 카드 1개마다 추가로 발생하던 번역/포스터 보정 API 호출을 제한하고,
   이미지 사이즈·무한스크롤·자동완성 요청을 줄여 체감 렉과 데이터 사용량을 낮춥니다. */
const IS_MOBILE = (() => {
  try { return window.matchMedia('(max-width: 720px), (pointer: coarse)').matches; }
  catch { return Math.min(window.innerWidth || 9999, window.screen?.width || 9999) <= 720; }
})();
const IS_LOW_POWER = IS_MOBILE || ((navigator.hardwareConcurrency || 8) <= 4);
const mobilePageLimit = () => {
  if(!IS_MOBILE) return Infinity;
  if(PAGE_STATE?.lastMode === 'ratings') return Infinity;
  return CONTENT_TYPE === 'all' ? 18 : 16;
};
const limitPageItemsForDevice = list => (IS_MOBILE ? (list || []).slice(0, mobilePageLimit()) : (list || []));
const cardPosterUrl = p => posterUrl(p, IS_MOBILE ? 'w185' : 'w342');
const detailPosterUrl = p => posterUrl(p, IS_MOBILE ? 'w342' : 'w500');
const tinyPosterUrl = (p, fallback='w185') => posterUrl(p, IS_MOBILE ? 'w92' : fallback);
function isMobileOptimizationActive(){ return IS_MOBILE; }

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
function trimCacheObject(obj, limit, preferRecent=false) {
  const entries = Object.entries(obj || {});
  if (entries.length <= limit) return obj || {};
  const kept = preferRecent
    ? entries.sort((a,b)=>(a[1]?.when||0)-(b[1]?.when||0)).slice(-limit)
    : entries.slice(-limit);
  return Object.fromEntries(kept);
}
function persistSmallCache(key,obj){
  // 캐시는 실패해도 서비스 핵심 기능이 아니므로, 저장 목록을 밀어내지 않도록 작게 유지합니다.
  const limit = key === DETAIL_STORE_KEY ? 120 : 350;
  const compact = trimCacheObject(obj, limit, key === DETAIL_STORE_KEY);
  try { localStorage.setItem(key, JSON.stringify(compact)); }
  catch { try { localStorage.removeItem(key); } catch {} }
  return compact;
}
function rememberTitleCache(key,value){ if(value){ TITLE_STORE[key]=value; TITLE_STORE=persistSmallCache(TITLE_STORE_KEY,TITLE_STORE); } }
function rememberPosterCache(key,value){ if(value){ POSTER_STORE[key]=value; POSTER_STORE=persistSmallCache(POSTER_STORE_KEY,POSTER_STORE); } }
function rememberDetailCache(key,value){ if(value){ DETAIL_STORE[key]={when:Date.now(),data:value}; DETAIL_STORE=persistSmallCache(DETAIL_STORE_KEY,DETAIL_STORE); } }
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
  if(lang==='ko') return /[\uAC00-\uD7A3]/.test(title);         // 한글 필수
  if(lang==='ja') return /[\u3040-\u30FF]/.test(title);         // 가나 필수
  if(lang==='zh') return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(title); // 한자 필수
  // en/fr 등 라틴 계열: ASCII+라틴 문자여야 하고, 한글/한자/가나가 없어야 함
  if(/[\uAC00-\uD7A3\u3040-\u30FF\u4E00-\u9FFF]/.test(title)) return false;
  return /[A-Za-z]/.test(title); // 최소 영문자 1개 포함
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
      currentLangTitle,     // 2순위: API가 돌려준 현재 언어 제목
      enTitle,              // 3순위: 영어 제목
      // 4순위: ko 언어일 때만 koTitle 추가 (다른 언어에선 한국어 제목 사용 안 함)
      lang==='ko' ? koTitle : '',
      current               // 최후: 원제
    ].map(cleanTitle).filter(Boolean);

    // 중복 제거
    const seen = new Set();
    const unique = candidates.filter(x => { if(seen.has(x)) return false; seen.add(x); return true; });

    const picked =
      unique.find(x=>titleLooksReadable(x, lang)) ||
      unique.find(x=>/[A-Za-z]/.test(x)) ||   // 최소 영문자가 있는 것
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
  // 모바일 최적화: 카드별 translations API 호출을 중단합니다. TMDB 기본 language 응답과 캐시만 사용합니다.
  if(IS_MOBILE) return;
  // 2) 캐시 미스는 병렬 API 호출 (저전력 환경에서는 동시성 축소)
  runLimited(cards, IS_LOW_POWER ? 2 : 4, async card=>{
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
  // 모바일 최적화: 카드별 images API 호출을 중단해 트래픽과 렌더링 부하를 줄입니다.
  if(IS_MOBILE) return;
  runLimited(cards, IS_LOW_POWER ? 1 : 2, async card=>{
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
      thumb.innerHTML=`<img src="${cardPosterUrl(resolved)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low">`;
      return;
    }
    const nextSrc=cardPosterUrl(resolved);
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
  if(CONTENT_TYPE === 'anime' && list.some(it=>!Array.isArray(it.genre_ids))) return true;
  return list.some(it=>!Array.isArray(it.genre_ids));
}
function getItemDate(it,detail=null){ return it.release_date || it.first_air_date || detail?.release_date || detail?.first_air_date || ''; }
function getItemGenres(it,detail=null){
  if(Array.isArray(it.genre_ids)&&it.genre_ids.length)return it.genre_ids;
  if(Array.isArray(detail?.genres))return detail.genres.map(g=>g.id).filter(Boolean);
  return [];
}
const ANIME_GENRE_ID = 16;
function itemIsAnimeLike(it, detail=null){
  const ids = getItemGenres(it, detail);
  if(ids.includes(ANIME_GENRE_ID)) return true;
  const text = `${it?.title||''} ${it?.name||''} ${it?.original_title||''} ${it?.original_name||''}`.toLowerCase();
  return /anime|animation|アニメ|애니/.test(text);
}
function itemMatchesContentType(it, detail=null){
  const type = it.media_type || (it.first_air_date ? 'tv' : 'movie');
  if(CONTENT_TYPE === 'all') return true;
  if(CONTENT_TYPE === 'anime') return itemIsAnimeLike(it, detail);
  return type === CONTENT_TYPE;
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
  if(!itemMatchesContentType(it, detail)) return false;
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
  const type=it.media_type||(it.first_air_date?'tv':'movie');
  if(CONTENT_TYPE !== 'all' && CONTENT_TYPE !== 'anime' && type !== CONTENT_TYPE) return false;
  if(CONTENT_TYPE === 'anime'){
    const ids = Array.isArray(it.genre_ids) ? it.genre_ids : null;
    if(ids && ids.length && !ids.includes(ANIME_GENRE_ID)) return false;
  }
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
  const cheap=(IS_MOBILE ? list.filter(cheapItemPass).slice(0, 24) : list.filter(cheapItemPass));
  if(!hasStrictFilterNeeds(cheap))return cheap.filter(it=>itemMatchesFilters(it,null));
  // 순서 보존: 인덱스 기반으로 결과를 수집한 뒤 원래 순서대로 반환
  const results=new Array(cheap.length).fill(null);
  await runLimited(cheap.map((it,i)=>({it,i})), IS_MOBILE ? 2 : 5, async ({it,i})=>{
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

const SK = { filters:'cineScopeFilters', favs:'cinefinder_favs', watch:'cinefinder_watch', ratings:'cinefinder_ratings', ratingViewCache:'cinefinder_rating_view_cache_v1', cache:'cinefinder_cache', lang:'cinefinderLang', theme:'cinefinderTheme' };
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
  clearBtn.addEventListener('click', async ()=>{
    searchInput.value=''; PAGE_STATE.query='';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    resetPaging();
    if(PAGE_STATE.lastMode === 'ratings'){ await showRatings(); return; }
    if(String(PAGE_STATE.lastMode).startsWith('saved-')){ await showSaved(String(PAGE_STATE.lastMode).split('-')[1] || 'fav'); return; }
    await runSearchOrDiscover(true);
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
  set('#tabAnime',        'textContent', t('tab_anime'));
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
  const ratingsSpan=$('#btnRatings span:last-child'); if(ratingsSpan)ratingsSpan.textContent=t('my_ratings');
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
    icon.textContent = kind==='fav' ? (active ? '♥' : '♡') : kind==='ratings' ? (active ? '★' : '☆') : (active ? '✓' : '⏱');
  }
  const label = kind==='fav' ? t('favorite') : kind==='ratings' ? t('my_ratings') : t('watch_later');
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  btn.setAttribute('title', `${label} ${active ? t('selected') : t('not_selected')}`);
}
function isLibraryMode(){ return String(PAGE_STATE.lastMode).startsWith('saved-') || PAGE_STATE.lastMode === 'ratings'; }
function setSavedModeUI(mode) {
  setSavedButtonState($('#btnFav'), 'fav', mode==='fav');
  setSavedButtonState($('#btnWatch'), 'watch', mode==='watch');
  setSavedButtonState($('#btnRatings'), 'ratings', mode==='ratings');
  const toolbar = $('#savedToolbar');
  const label   = $('#savedToolbarLabel');
  if (toolbar) {
    if (mode) {
      toolbar.classList.remove('hidden');
      toolbar.dataset.mode = mode;
      if (label) {
        label.textContent = mode === 'fav'
          ? t('favorite') + ' ' + t('list_label')
          : mode === 'watch'
            ? t('watch_later') + ' ' + t('list_label')
            : t('my_ratings');
      }
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
async function executeSearchFromInput(){
  PAGE_STATE.query = ($('#searchInput').value || '').trim();
  PAGE_STATE.personActive = null;
  PAGE_STATE.personMeta = null;
  resetPaging();
  const currentMode = PAGE_STATE.lastMode;
  if(currentMode === 'ratings'){
    setSavedModeUI('ratings');
    await showRatings();
    return;
  }
  if(String(currentMode).startsWith('saved-')){
    const kind = String(currentMode).split('-')[1] || 'fav';
    setSavedModeUI(kind);
    await showSaved(kind);
    return;
  }
  setSavedModeUI(null);
  await runSearchOrDiscover(true);
}
function itemSearchText(item){
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  return [
    item.title, item.name, item.original_title, item.original_name,
    item.user_rating_title, item.user_rating_note, item.note,
    getYear(item.release_date || item.first_air_date || ''),
    type === 'tv' ? t('drama') : t('badge_movie')
  ].filter(Boolean).join(' ').toLowerCase();
}
function itemPassesCurrentQuery(item){
  const q = (PAGE_STATE.query || '').trim().toLowerCase();
  if(!q) return true;
  const normalizedQ = q.replace(/\s+/g, ' ');
  const text = itemSearchText(item);
  const compactText = text.replace(/\s+/g, '');
  const compactQ = normalizedQ.replace(/\s+/g, '');
  return text.includes(normalizedQ) || (!!compactQ && compactText.includes(compactQ));
}
function filterByCurrentQuery(items){
  return (items || []).filter(itemPassesCurrentQuery);
}
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
      const nextType = btn.dataset.type;
      // 영화/드라마/모두 탭은 항상 기존 탐색/검색 화면으로 복귀합니다.
      // 내 평점/즐겨찾기 화면 안에서 탭을 누르면 저장 목록을 필터링하지 않고, 이전처럼 TMDB 목록을 다시 불러옵니다.
      if(CONTENT_TYPE===nextType && !isLibraryMode())return;
      setActiveTab(nextType); renderGenreChips();
      setSavedModeUI(null);
      PAGE_STATE.lastMode = PAGE_STATE.query ? 'search' : 'discover';
      resetPaging();
      await runSearchOrDiscover(true);
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
  $('#btnRatings').addEventListener('click', async()=>{
    if(PAGE_STATE.lastMode==='ratings'){setSavedModeUI(null);resetPaging();await runSearchOrDiscover(true);return;}
    // 내 평점은 로컬 저장 데이터를 즉시 그려서 클릭 시 로딩/대기 화면이 보이지 않도록 처리합니다.
    CONTENT_TYPE = 'all';
    $$('.type-tabs .tab').forEach(b=>{ const on=b.dataset.type==='all'; b.classList.toggle('active',on); b.setAttribute('aria-selected',on?'true':'false'); });
    showRatingsInstant();
    setTimeout(()=>{ try{ renderGenreChips(); }catch{} }, 0);
  });

  $('#searchForm').addEventListener('submit', async e=>{
    e.preventDefault();
    await executeSearchFromInput();
    closeSuggest();
  });
  $('#sortSelect').addEventListener('change', async e=>{
    SORT_BY=e.target.value;
    if(PAGE_STATE.lastMode==='ratings'){await showRatings();return;}
    if(String(PAGE_STATE.lastMode).startsWith('saved-')){await showSaved(String(PAGE_STATE.lastMode).split('-')[1]||'fav');return;}
    resetPaging(); await runSearchOrDiscover(true);
  });
  $('#langSelect').addEventListener('change', async()=>{
    CUR_LANG=$('#langSelect').value||'ko';
    await storage.set({[SK.lang]:CUR_LANG});
    // 언어 관련 모든 캐시 초기화
    TITLE_CACHE.clear();  TITLE_STORE={};  try{localStorage.removeItem(TITLE_STORE_KEY);}catch{}
    POSTER_CACHE.clear(); POSTER_STORE={}; try{localStorage.removeItem(POSTER_STORE_KEY);}catch{}
    DETAIL_STORE={};      try{localStorage.removeItem(DETAIL_STORE_KEY);}catch{}
    await storage.remove(SK.cache); // 앱 내부 결과 캐시도 제거
    FETCH_MEMORY_CACHE.clear(); FETCH_INFLIGHT.clear();
    PAGE_STATE.personActive=null;
    PAGE_STATE.personMeta=null;
    applyI18n(); renderCountryOptions();
    await Promise.all([loadGenres('movie'),loadGenres('tv')]);
    renderGenreChips(); updateFilterBadge(); setSavedModeUI(null); resetPaging(); await runSearchOrDiscover(true);
  });

  // ── 내보내기 / 가져오기 ──
  $('#btnExport')?.addEventListener('click', () => {
    const kind = $('#savedToolbar')?.dataset.mode || 'fav';
    if(kind === 'ratings') exportRatings(); else exportSaved(kind);
  });
  $('#btnImport')?.addEventListener('click', () => $('#importFileInput')?.click());
  $('#importFileInput')?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (file) {
      const kind = $('#savedToolbar')?.dataset.mode || 'fav';
      if(kind === 'ratings') importRatings(file); else importSaved(file, kind);
    }
    e.target.value = '';
  });
  $('#btnClearList')?.addEventListener('click', () => {
    const kind = $('#savedToolbar')?.dataset.mode || 'fav';
    if(kind === 'ratings') clearRatingsList(); else clearSavedList(kind);
  });

  initAutocomplete();
  window.addEventListener('online',  ()=>$('#offlineBar').classList.add('hidden'));
  window.addEventListener('offline', ()=>{ $('#offlineBar').textContent=t('offline_using_cache'); $('#offlineBar').classList.remove('hidden'); });
  window.addEventListener('scroll', ()=>{
    if(isLibraryMode())return;
    const now=Date.now();
    const throttle = IS_MOBILE ? 1200 : 700;
    const threshold = IS_MOBILE ? 360 : 800;
    if(now-lastScrollLoad<throttle||BUSY)return;
    if(window.innerHeight+window.scrollY>=document.body.offsetHeight-threshold){ lastScrollLoad=now; BUSY=true; runSearchOrDiscover(false).finally(()=>BUSY=false); }
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
    clearTimeout(acTimer); const q=input.value.trim(); if(!q || (IS_MOBILE && q.length < 2)){closeSuggest();return;}
    acTimer=setTimeout(async()=>{
      acCtrl?.abort(); acCtrl=new AbortController();
      try{
        const j=await fetchJson(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=${tmdbLang()}&query=${encodeURIComponent(q)}&page=1`,{signal:acCtrl.signal});
        renderSuggest((j.results||[]).filter(r=>['movie','tv','person'].includes(r.media_type)).slice(0, IS_MOBILE ? 5 : 8));
      }catch{}
    }, IS_MOBILE ? 420 : 220);
  });
  input.addEventListener('keydown', e=>{
    const items=$$('#suggestBox .sitem'); if(!items.length)return;
    if(e.key==='ArrowDown'){acIndex=(acIndex+1)%items.length;updateActive(items);e.preventDefault();}
    else if(e.key==='ArrowUp'){acIndex=(acIndex-1+items.length)%items.length;updateActive(items);e.preventDefault();}
    else if(e.key==='Enter'){if(acIndex>=0){input.value=items[acIndex].dataset.label;executeSearchFromInput();closeSuggest();e.preventDefault();}}
    else if(e.key==='Escape'){closeSuggest();}
  });
  document.addEventListener('click', e=>{if(!box.contains(e.target)&&e.target!==input)closeSuggest();});
  function renderSuggest(list){
    if(!list || !list.length){ closeSuggest(); return; }
    box.innerHTML=list.map(r=>{const label=r.media_type==='person'?(r.name||''):(r.title||r.name||'');return`<div class="sitem" role="option" data-label="${escapeHtml(label)}">${escapeHtml(label)}</div>`;}).join('');
    box.classList.remove('hidden'); acIndex=-1;
    $$('#suggestBox .sitem').forEach(el=>el.addEventListener('click',async()=>{input.value=el.dataset.label;await executeSearchFromInput();closeSuggest();}));
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
    const j=await fetchJson(`https://api.themoviedb.org/3/genre/${kind}/list?api_key=${API_KEY}&language=${tmdbLang()}&_lang=${CUR_LANG}`);
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
    if(isLibraryMode())return;
    if(entries.some(e=>e.isIntersecting)){if(BUSY)return;BUSY=true;try{await runSearchOrDiscover(false);}finally{BUSY=false;}}
  },{root:null,rootMargin: IS_MOBILE ? '360px' : '800px',threshold:0});
  IO.observe($('#sentinel'));
}

/* ═══════════════════════════════ DATA ═══════════════════════════════ */
function abortActiveRequests(){
  ABORTS.forEach(ctrl=>{try{ctrl.abort();}catch{}});
  ABORTS.clear();
  try{ FETCH_INFLIGHT.clear(); }catch{}
}
function beginFreshRun(clear){
  if(clear){ abortActiveRequests(); RENDER_TOKEN++; }
  return RENDER_TOKEN;
}
function isStale(token){ return token!==RENDER_TOKEN; }
async function runSearchOrDiscover(clear){
  if(isLibraryMode()){
    if(!clear)return;
    setSavedModeUI(null);
    PAGE_STATE.lastMode=PAGE_STATE.query?'search':'discover';
  }
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
  if((CONTENT_TYPE==='all'&&!skipMovie)||CONTENT_TYPE==='movie'||CONTENT_TYPE==='anime') tasks.push(fetchJson(`https://api.themoviedb.org/3/discover/movie?${buildDiscoverParams('movie',PAGE_STATE.pageMovie)}`));
  if((CONTENT_TYPE==='all'&&!skipTV)||CONTENT_TYPE==='tv'||CONTENT_TYPE==='anime')       tasks.push(fetchJson(`https://api.themoviedb.org/3/discover/tv?${buildDiscoverParams('tv',PAGE_STATE.pageTV)}`));
  try{
    let merged=mergeResults(await Promise.all(tasks));
    if(isStale(token))return;
    if(CONTENT_TYPE!=='all' && CONTENT_TYPE!=='anime')merged=merged.filter(x=>x.media_type===CONTENT_TYPE);
    merged=limitPageItemsForDevice(clientSort(await applyClientFiltersStrict(merged)));
    clearSkeletons(); renderCards(merged,!clear); setStatusIfEmpty(t('status_empty'));
    if(CONTENT_TYPE==='all'||CONTENT_TYPE==='anime'){PAGE_STATE.pageMovie++;PAGE_STATE.pageTV++;}
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
    const multi=await fetchJson(`https://api.themoviedb.org/3/search/multi?${p}&_lang=${CUR_LANG}`);
    if(isStale(token))return;
    const person=(multi.results||[]).find(r=>r.media_type==='person');
    if(person){ PAGE_STATE.personActive=person.id; PAGE_STATE.personMeta={id:person.id,known_for_department:person.known_for_department||''}; clearSkeletons(); await renderPersonFilmography(PAGE_STATE.personMeta,clear); return; }
    let items=(multi.results||[]).filter(r=>r.media_type==='movie'||r.media_type==='tv');
    if(CONTENT_TYPE!=='all' && CONTENT_TYPE!=='anime')items=items.filter(r=>r.media_type===CONTENT_TYPE);
    let merged=Array.from(new Map(items.map(it=>{const type=it.media_type||(it.first_air_date?'tv':'movie');return[`${type}-${it.id}`,{...it,media_type:type}];})).values());
    merged=limitPageItemsForDevice(clientSort(await applyClientFiltersStrict(merged)));
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
  if(CONTENT_TYPE!=='all' && CONTENT_TYPE!=='anime')works=works.filter(w=>(w.media_type||(w.first_air_date?'tv':'movie'))===CONTENT_TYPE);
  const map=new Map();
  for(const w of works){const type=w.media_type||(w.first_air_date?'tv':'movie');const key=`${type}-${w.id}`;if(!map.has(key))map.set(key,{...w,media_type:type});}
  let merged=limitPageItemsForDevice(clientSort(await applyClientFiltersStrict(Array.from(map.values()))));
  renderCards(merged,!clear); setStatusIfEmpty(t('status_empty'));
  await saveCache({mode:'search',items:merged,state:snapshotState()});
}

function buildDiscoverParams(type,page){
  const p=new URLSearchParams();
  p.set('api_key',API_KEY); p.set('language',tmdbLang()); p.set('_lang',CUR_LANG); // 언어변경 캐시 bust
  p.set('sort_by',SORT_BY==='date.desc'?(type==='movie'?'primary_release_date.desc':'first_air_date.desc'):SORT_BY);
  p.set('include_adult','false'); p.set('page',String(page||1));
  const inc = type==='movie' ? MOVIE_INC : TV_INC;
  const exc = type==='movie' ? MOVIE_EXC : TV_EXC;
  const genreFilter = new Set(inc);
  if(CONTENT_TYPE === 'anime') genreFilter.add(ANIME_GENRE_ID);
  if(genreFilter.size)p.set('with_genres',[...genreFilter].join(','));
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
function showSkeletons(n=(IS_MOBILE ? 6 : 12)){
  $('#results').insertAdjacentHTML('beforeend',Array(n).fill(`<div class="skeleton"><div class="skeleton-thumb"></div><div class="skeleton-meta"><div class="skeleton-line short"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>`).join(''));
}
function clearSkeletons(){ $$('.skeleton').forEach(el=>el.remove()); }

/* ═══════════════════════════════ SAVED ═══════════════════════════════ */
function savedKey(kind){ return kind==='fav' ? SK.favs : SK.watch; }
function normalizeSavedItem(item){
  if(!item) return null;
  const id = Number(item.id);
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  if(!Number.isFinite(id) || !['movie','tv'].includes(mediaType)) return null;
  const title = cleanTitle(item.title || item.name || item.original_title || item.original_name || '');
  return {
    k: `${mediaType}-${id}`,
    id,
    media_type: mediaType,
    title,
    poster_path: item.poster_path || '',
    vote_average: Number(item.vote_average || 0),
    release_date: item.release_date || item.first_air_date || '',
    popularity: Number(item.popularity || 0)
  };
}
function normalizeSavedList(list){
  const map = new Map();
  (Array.isArray(list) ? list : []).forEach(x=>{
    const item = normalizeSavedItem(x);
    if(item) map.set(item.k, {...item, title: cleanTitle(x.title || x.name || item.title)});
  });
  return Array.from(map.values());
}
async function getSaved(kind){
  const key = savedKey(kind);
  const obj = await storage.get([key]);
  return normalizeSavedList(obj[key]);
}
async function setSaved(kind,list){
  const key = savedKey(kind);
  const normalized = normalizeSavedList(list);
  const ok = await storage.set({[key]: normalized});
  if(!ok) return false;
  const check = await storage.get([key]);
  const saved = normalizeSavedList(check[key]);
  return saved.length === normalized.length && normalized.every((x,i)=>saved[i]?.k === x.k);
}
function updateSavedButtons(kind, list){
  const set = new Set(normalizeSavedList(list).map(x=>x.k));
  $$('#results .card').forEach(card=>{
    const key = card.getAttribute('data-key');
    setActionButtonVisual(card.querySelector(kind==='fav'?'.fav-btn':'.watch-btn'), kind, set.has(key));
  });
}
async function toggleSaved(kind,item){
  const current = await getSaved(kind);
  const savedItem = normalizeSavedItem(item);
  if(!savedItem){ showToast(t('toast_save_failed'), 2600); return current; }
  const idx = current.findIndex(x=>x.k===savedItem.k);
  const next = current.slice();
  const willRemove = idx >= 0;
  if(willRemove) next.splice(idx,1);
  else next.push(savedItem);

  const ok = await setSaved(kind,next);
  if(!ok){ showToast(t('toast_save_failed'), 2800); return current; }

  showToast(willRemove ? t('toast_removed') : t('toast_saved'));
  if(PAGE_STATE.lastMode===`saved-${kind}`) await showSaved(kind);
  return await getSaved(kind);
}


/* ═══════════════════════════════ USER RATINGS ═══════════════════════════════ */
const RATING_TYPES = new Set(['movie','drama','anime']);
const ratingTitleKey = title => cleanTitle(title || '').toLowerCase().replace(/\s+/g, ' ').trim();
const contentTypeToRatingType = mediaType => mediaType === 'tv' ? 'drama' : (mediaType === 'anime' ? 'anime' : 'movie');
const ratingTypeToMediaType = type => type === 'drama' ? 'tv' : (type === 'movie' ? 'movie' : 'anime');
function normalizeRatingType(type){
  const raw = String(type || '').toLowerCase().trim();
  if(raw === 'tv' || raw === 'drama' || raw === 'series') return 'drama';
  if(raw === 'anime' || raw === 'animation') return 'anime';
  return 'movie';
}
function ratingKey(type, id, title=''){
  const rt = normalizeRatingType(type);
  const sid = String(id ?? '').trim();
  return `${rt}-${sid || ratingTitleKey(title)}`;
}
function ratingLabel(type){
  const rt = normalizeRatingType(type);
  if(rt === 'anime') return t('anime');
  if(rt === 'drama') return t('drama');
  return t('badge_movie');
}
function normalizeRatingItem(item){
  if(!item || typeof item !== 'object') return null;
  const type = normalizeRatingType(item.type || item.media_type);
  const title = cleanTitle(item.title || item.name || item.original_title || item.original_name || '');
  const idRaw = item.id ?? item.k ?? '';
  const id = String(idRaw).trim() || ratingTitleKey(title);
  const rating = Math.round(Number(item.rating) * 10) / 10;
  if(!title || !RATING_TYPES.has(type) || !Number.isFinite(rating) || rating < 0 || rating > 10) return null;
  return {
    k: ratingKey(type, id, title),
    id,
    type,
    title,
    rating,
    note: String(item.note || '').trim()
  };
}
function normalizeRatingList(list){
  const map = new Map();
  (Array.isArray(list) ? list : []).forEach(x => {
    const item = normalizeRatingItem(x);
    if(!item) return;
    const titleKey = `${item.type}::${ratingTitleKey(item.title)}`;
    const duplicateKey = Array.from(map.entries()).find(([, v]) => `${v.type}::${ratingTitleKey(v.title)}` === titleKey)?.[0];
    map.set(duplicateKey || item.k, item);
  });
  return Array.from(map.values());
}
function getRatingsSync(){
  try{
    const raw = localStorage.getItem(SK.ratings);
    return normalizeRatingList(raw ? JSON.parse(raw) : []);
  }catch{
    return [];
  }
}
async function getRatings(){
  return getRatingsSync();
}
async function setRatings(list){
  const normalized = normalizeRatingList(list);
  clearRatingViewCache();
  const ok = await storage.set({[SK.ratings]: normalized});
  if(!ok) return false;
  const check = await storage.get([SK.ratings]);
  return normalizeRatingList(check[SK.ratings]).length === normalized.length;
}
function findRatingIndex(list, source){
  const src = normalizeRatingItem(source);
  if(!src) return -1;
  let idx = list.findIndex(x => x.k === src.k || (x.id && src.id && String(x.id) === String(src.id) && x.type === src.type));
  if(idx >= 0) return idx;
  const titleKey = ratingTitleKey(src.title);
  return list.findIndex(x => x.type === src.type && ratingTitleKey(x.title) === titleKey);
}
function findRating(list, source){
  const idx = findRatingIndex(list, source);
  return idx >= 0 ? list[idx] : null;
}
async function upsertRating(source){
  const item = normalizeRatingItem(source);
  if(!item){ showToast(t('toast_invalid_rating'), 2400); return null; }
  const list = await getRatings();
  const idx = findRatingIndex(list, item);
  const next = list.slice();
  if(idx >= 0){
    const prev = next[idx];
    next[idx] = {...prev, title:item.title || prev.title, rating:item.rating, note:item.note};
  } else {
    next.push(item);
  }
  if(!await setRatings(next)){ showToast(t('toast_save_failed'), 2800); return null; }
  showToast(t('toast_rating_saved'));
  await refreshRatingBadges();
  if(PAGE_STATE.lastMode === 'ratings') await showRatings();
  return item;
}
async function removeRating(source){
  const list = await getRatings();
  const idx = findRatingIndex(list, source);
  if(idx < 0){ showToast(t('toast_rating_removed')); return; }
  const next = list.slice();
  next.splice(idx, 1);
  if(!await setRatings(next)){ showToast(t('toast_save_failed'), 2800); return; }
  showToast(t('toast_rating_removed'));
  await refreshRatingBadges();
  if(PAGE_STATE.lastMode === 'ratings') await showRatings();
}
function ratingSourceFromCard(card){
  const mediaType = card.getAttribute('data-type') || 'movie';
  const title = card.getAttribute('data-rating-title') || card.getAttribute('data-title') || card.querySelector('.name')?.textContent?.trim() || '';
  return {
    id: card.getAttribute('data-rating-id') || card.getAttribute('data-id') || ratingTitleKey(title),
    type: normalizeRatingType(card.getAttribute('data-rating-type') || contentTypeToRatingType(mediaType)),
    title,
    rating: Number(card.getAttribute('data-user-rating') || card.getAttribute('data-vote') || 0),
    note: card.getAttribute('data-user-note') || ''
  };
}

function actionHeartSvg(active=false){
  return `<svg class="action-icon action-icon-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
}
function actionClockSvg(active=false){
  return `<svg class="action-icon action-icon-clock" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.25"/><polyline points="12 6.9 12 12 15.7 14.2"/></svg>`;
}
function actionStarSvg(active=false){
  return `<svg class="action-icon action-icon-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2.7 14.85 8.48 21.23 9.41 16.62 13.9 17.71 20.23 12 17.22 6.29 20.23 7.38 13.9 2.77 9.41 9.15 8.48 12 2.7"/></svg>`;
}

function setRateButtonVisual(btn, rating){
  if(!btn) return;
  const active = Number.isFinite(Number(rating)) && Number(rating) > 0;
  btn.classList.toggle('active', active);
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  btn.setAttribute('title', active ? `${t('my_rating')} ${Number(rating).toFixed(1)}` : t('rate_this'));
  btn.setAttribute('aria-label', active ? `${t('my_rating')} ${Number(rating).toFixed(1)}` : t('rate_this'));
  btn.innerHTML = `<span class="btn-glyph">${actionStarSvg(active)}</span>`;
}
function ratingViewMapForList(list){
  const cached = getCachedRatingView(list);
  const map = new Map();
  (cached?.items || []).forEach(item => {
    if(item && item.media_type && item.id != null){
      map.set(`${item.media_type}-${item.id}`, item);
    }
  });
  return map;
}
function ratingFromResolvedItem(item){
  if(!item || !Number.isFinite(Number(item.user_rating_value))) return null;
  return {
    id: String(item.user_rating_id || item.id || ''),
    type: normalizeRatingType(item.user_rating_type || contentTypeToRatingType(item.media_type)),
    title: cleanTitle(item.user_rating_title || item.title || item.name || ''),
    rating: Number(item.user_rating_value),
    note: String(item.user_rating_note || '').trim()
  };
}
async function refreshRatingBadges(){
  const list = getRatingsSync();
  const resolvedMap = ratingViewMapForList(list);
  $$('#results .card').forEach(card => {
    const source = ratingSourceFromCard(card);
    const resolvedSaved = ratingFromResolvedItem(resolvedMap.get(`${card.getAttribute('data-type')}-${card.getAttribute('data-id')}`));
    const saved = findRating(list, source) || resolvedSaved;
    const holder = card.querySelector('.user-rating-inline');
    const scoreEl = card.querySelector('.card-user-rating');
    if(saved){
      card.setAttribute('data-user-rating', String(saved.rating));
      card.setAttribute('data-user-note', saved.note || '');
      card.setAttribute('data-rating-id', String(saved.id || ''));
      card.setAttribute('data-rating-title', saved.title || card.getAttribute('data-title') || '');
      card.setAttribute('data-rating-type', normalizeRatingType(saved.type));
      if(scoreEl){
        scoreEl.textContent = `★ ${Number(saved.rating).toFixed(1)}`;
        scoreEl.setAttribute('title', `${t('my_rating')} ${Number(saved.rating).toFixed(1)}`);
        scoreEl.setAttribute('aria-label', `${t('my_rating')} ${Number(saved.rating).toFixed(1)}`);
        scoreEl.classList.remove('hidden');
      }
      if(holder){
        holder.textContent = saved.note || '';
        holder.classList.toggle('hidden', !saved.note);
      }
      setRateButtonVisual(card.querySelector('.rate-btn'), saved.rating);
    } else {
      const mediaType = card.getAttribute('data-type') || 'movie';
      card.removeAttribute('data-user-rating');
      card.removeAttribute('data-user-note');
      card.setAttribute('data-rating-id', '');
      card.setAttribute('data-rating-title', card.getAttribute('data-title') || card.querySelector('.name')?.textContent?.trim() || '');
      card.setAttribute('data-rating-type', normalizeRatingType(contentTypeToRatingType(mediaType)));
      if(scoreEl){
        scoreEl.textContent = '';
        scoreEl.removeAttribute('title');
        scoreEl.removeAttribute('aria-label');
        scoreEl.classList.add('hidden');
      }
      if(holder){ holder.textContent = ''; holder.classList.add('hidden'); }
      setRateButtonVisual(card.querySelector('.rate-btn'), null);
    }
  });
}
function getRatingInputValue(){
  const input = $('#ratingEditorScore') || $('#detailUserRating');
  const raw = String(input?.value ?? '').trim();
  if(raw === '') return null;
  const value = Math.round(Number(raw) * 10) / 10;
  if(!Number.isFinite(value) || value < 0 || value > 10) return null;
  return value;
}
async function openRatingEditor(source, sourceEl=null){
  LAST_FOCUS = sourceEl || document.activeElement;
  stopModalMedia();
  const list = await getRatings();
  const saved = findRating(list, source);
  const base = normalizeRatingItem({...source, rating: saved?.rating ?? source.rating ?? 0, note: saved?.note ?? source.note ?? ''});
  if(!base){ showToast(t('toast_invalid_rating')); return; }
  $('#modalBody').innerHTML = `<div class="rating-editor-wrap">
    <div class="rating-editor-head">
      <span class="badge ${base.type === 'drama' ? 'badge-tv' : base.type === 'anime' ? 'badge-anime' : ''}">${escapeHtml(ratingLabel(base.type))}</span>
      <h3 id="modalTitle">${escapeHtml(base.title)}</h3>
    </div>
    <div class="rating-editor-panel">
      <label>${t('rating_score')}</label>
      <input id="ratingEditorScore" class="rating-input" type="number" inputmode="decimal" autocomplete="off" enterkeyhint="done" min="0" max="10" step="0.1" value="${saved ? Number(saved.rating).toFixed(1) : ''}" placeholder="${t('rating_placeholder')}" />
      <label>${t('rating_note')}</label>
      <textarea id="ratingEditorNote" class="rating-note-input" rows="4" autocomplete="off" enterkeyhint="done" placeholder="${t('note_placeholder')}">${escapeHtml(saved?.note || base.note || '')}</textarea>
      <div class="rating-editor-actions">
        <button id="ratingEditorSave" class="modal-save-btn modal-rating-save" type="button">★ ${t('save_rating')}</button>
        <button id="ratingEditorClear" class="modal-save-btn modal-rating-clear" type="button">× ${t('clear_rating')}</button>
      </div>
    </div>
  </div>`;
  $('#ratingEditorSave')?.addEventListener('click', async () => {
    const rating = getRatingInputValue();
    if(rating === null){ showToast(t('toast_invalid_rating')); return; }
    const note = $('#ratingEditorNote')?.value || '';
    await upsertRating({...base, rating, note});
    closeModal();
  });
  $('#ratingEditorClear')?.addEventListener('click', async () => {
    await removeRating(base);
    closeModal();
  });
  $('#modal').classList.remove('hidden');
  document.body.classList.add('lock-scroll');
  // iOS Safari에서 입력창 자동 포커스가 화면 확대를 유발할 수 있어 수동 입력만 허용합니다.
}
const RATING_MATCH_STORE_KEY = 'cinefinder_rating_match_store_v3';
try { localStorage.removeItem('cinefinder_rating_match_store_v1'); } catch {}
try { localStorage.removeItem('cinefinder_rating_match_store_v2'); } catch {}
let RATING_MATCH_STORE = {};
try { RATING_MATCH_STORE = JSON.parse(localStorage.getItem(RATING_MATCH_STORE_KEY) || '{}'); } catch { RATING_MATCH_STORE = {}; }
function persistRatingMatchStore(){
  try{
    const entries = Object.entries(RATING_MATCH_STORE || {})
      .sort((a,b)=>(b[1]?.when||0)-(a[1]?.when||0))
      .slice(0, 900);
    RATING_MATCH_STORE = Object.fromEntries(entries);
    localStorage.setItem(RATING_MATCH_STORE_KEY, JSON.stringify(RATING_MATCH_STORE));
  }catch{}
}
function ratingMatchCacheKey(item){
  return `${normalizeRatingType(item.type)}::${ratingTitleKey(item.title)}`;
}
function simplifyRatingSearchTitle(title){
  let v = cleanTitle(title)
    .replace(/[\[\(（【].*?[\]\)）】]/g, ' ')
    .replace(/[:：]\s*(파트|part|시즌|season)\s*\d+.*$/i, ' ')
    .replace(/\s+(시즌|season)\s*\d+.*$/i, ' ')
    .replace(/\s+\d+\s*기\s*(part\s*\d+)?\s*$/i, ' ')
    .replace(/\s+part\s*\d+\s*$/i, ' ')
    .replace(/\s+시리즈\s*$/i, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return v || cleanTitle(title);
}
function uniqueRatingQueries(item){
  const raw = cleanTitle(item.title || '');
  const simplified = simplifyRatingSearchTitle(raw);
  const noPunct = raw.replace(/[·•:：\-–—_]/g, ' ').replace(/\s+/g,' ').trim();
  const list = [raw, simplified, noPunct, simplifyRatingSearchTitle(noPunct)].filter(Boolean);
  return Array.from(new Set(list));
}
function mediaTypesForRatingItem(item){
  const rt = normalizeRatingType(item.type);
  if(rt === 'movie') return ['movie'];
  if(rt === 'drama') return ['tv'];
  return ['tv', 'movie'];
}
function baseComparableTitle(v){
  return simplifyRatingSearchTitle(v).toLowerCase().replace(/[^0-9a-z\uac00-\ud7a3\u3040-\u30ff\u3400-\u9fff]+/gi, '');
}
function scoreRatingCandidate(item, candidate, mediaType, query){
  const wantType = normalizeRatingType(item.type);
  const candidateTitle = itemTitle(candidate, mediaType);
  const wantBase = baseComparableTitle(item.title);
  const queryBase = baseComparableTitle(query);
  const candBase = baseComparableTitle(candidateTitle || candidate.original_title || candidate.original_name || '');
  if(!candBase) return -999;
  let score = 0;
  if(candBase === wantBase) score += 120;
  else if(candBase === queryBase) score += 105;
  else if(wantBase && (candBase.includes(wantBase) || wantBase.includes(candBase))) score += 70;
  else if(queryBase && (candBase.includes(queryBase) || queryBase.includes(candBase))) score += 50;
  if(wantType === 'movie' && mediaType === 'movie') score += 30;
  if(wantType === 'drama' && mediaType === 'tv') score += 30;
  if(wantType === 'anime'){
    if(mediaType === 'tv') score += 20;
    if((candidate.genre_ids || []).includes(16)) score += 45;
    if(['ja','ko'].includes(candidate.original_language)) score += 10;
  }
  if(candidate.poster_path) score += 15;
  if(candidate.overview) score += 8;
  score += Math.min(Number(candidate.vote_count || 0), 500) / 100;
  score += Math.min(Number(candidate.popularity || 0), 80) / 10;
  return score;
}
async function findTmdbMatchForRating(item){
  const cacheKey = ratingMatchCacheKey(item);
  const cached = RATING_MATCH_STORE[cacheKey];
  if(cached && Date.now() - (cached.when || 0) < 1000 * 60 * 60 * 24 * 30){
    return cached.miss ? null : cached.data;
  }

  const numericId = /^\d+$/.test(String(item.id || '').trim()) ? String(item.id).trim() : '';
  const directTypes = normalizeRatingType(item.type) === 'movie' ? ['movie'] : normalizeRatingType(item.type) === 'drama' ? ['tv'] : [];
  if(numericId && directTypes.length){
    for(const mediaType of directTypes){
      try{
        const detail = await fetchJson(`https://api.themoviedb.org/3/${mediaType}/${numericId}?api_key=${API_KEY}&language=${tmdbLang()}`);
        const title = cleanTitle(item.title) || itemTitle(detail, mediaType);
        const resolved = {
          id: detail.id, media_type: mediaType, title, name: title,
          poster_path: detail.poster_path || '', vote_average: Number(detail.vote_average || 0),
          vote_count: Number(detail.vote_count || 0), overview: detail.overview || '',
          release_date: detail.release_date || detail.first_air_date || '', first_air_date: detail.first_air_date || '',
          popularity: Number(detail.popularity || 0),
          genre_ids: Array.isArray(detail.genres) ? detail.genres.map(g => g.id).filter(Boolean) : [],
          user_rating_id: item.id, user_rating_title: item.title, user_rating_type: item.type,
          user_rating_value: item.rating, user_rating_note: item.note || ''
        };
        RATING_MATCH_STORE[cacheKey] = { when: Date.now(), data: resolved };
        persistRatingMatchStore();
        return resolved;
      }catch{}
    }
  }

  const queries = uniqueRatingQueries(item);
  const mediaTypes = mediaTypesForRatingItem(item);
  const candidates = [];
  for(const query of queries){
    for(const mediaType of mediaTypes){
      try{
        const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&language=${tmdbLang()}&query=${encodeURIComponent(query)}&include_adult=false&page=1`;
        const data = await fetchJson(url);
        (data.results || []).slice(0, 8).forEach(result => {
          const score = scoreRatingCandidate(item, result, mediaType, query);
          if(score >= 35) candidates.push({mediaType, result, score});
        });
      }catch{}
      if(candidates.some(x => x.score >= 105)) break;
    }
    if(candidates.some(x => x.score >= 105)) break;
  }
  if(!candidates.length){
    RATING_MATCH_STORE[cacheKey] = { when: Date.now(), miss: true };
    persistRatingMatchStore();
    return null;
  }
  candidates.sort((a,b) => b.score - a.score);
  const picked = candidates[0];
  try{
    const detail = await fetchJson(`https://api.themoviedb.org/3/${picked.mediaType}/${picked.result.id}?api_key=${API_KEY}&language=${tmdbLang()}`);
    const title = cleanTitle(item.title) || itemTitle(detail, picked.mediaType) || itemTitle(picked.result, picked.mediaType);
    const poster_path = detail.poster_path || picked.result.poster_path || '';
    // TMDB에 실제 상세 데이터가 확인되지 않으면 내 평점 목록에서는 제외합니다.
    const resolved = {
      id: detail.id || picked.result.id,
      media_type: picked.mediaType,
      title,
      name: title,
      poster_path,
      vote_average: Number(detail.vote_average || picked.result.vote_average || 0),
      vote_count: Number(detail.vote_count || picked.result.vote_count || 0),
      overview: detail.overview || picked.result.overview || '',
      release_date: detail.release_date || detail.first_air_date || picked.result.release_date || picked.result.first_air_date || '',
      first_air_date: detail.first_air_date || picked.result.first_air_date || '',
      popularity: Number(detail.popularity || picked.result.popularity || 0),
      genre_ids: Array.isArray(picked.result.genre_ids) ? picked.result.genre_ids : (Array.isArray(detail.genres) ? detail.genres.map(g => g.id).filter(Boolean) : []),
      user_rating_id: item.id,
      user_rating_title: item.title,
      user_rating_type: item.type,
      user_rating_value: item.rating,
      user_rating_note: item.note || ''
    };
    RATING_MATCH_STORE[cacheKey] = { when: Date.now(), data: resolved };
    persistRatingMatchStore();
    return resolved;
  }catch{
    RATING_MATCH_STORE[cacheKey] = { when: Date.now(), miss: true };
    persistRatingMatchStore();
    return null;
  }
}
async function resolveRatingListToTmdb(list, onProgress){
  const source = normalizeRatingList(list);
  const resolved = [];
  let done = 0;
  await runLimited(source, IS_MOBILE ? 2 : 5, async item => {
    const match = await findTmdbMatchForRating(item);
    done += 1;
    if(match) resolved.push(match);
    if(typeof onProgress === 'function') onProgress(done, source.length, resolved.length);
  });
  const byKey = new Map();
  resolved.forEach(it => {
    // 동일 TMDB 작품으로 매칭된 항목은 한 번만 표시합니다.
    // 예: 시즌별로 저장한 평점이 동일한 TV 시리즈로 매칭되면 카드 중복 노출 방지.
    const key = `${it.media_type}-${it.id}`;
    const prev = byKey.get(key);
    if(!prev || Number(it.user_rating_value || 0) > Number(prev.user_rating_value || 0)){
      byKey.set(key, it);
    }
  });
  const unique = Array.from(byKey.values());
  unique._ratingStats = {
    total: source.length,
    matched: resolved.length,
    shown: unique.length,
    missing: Math.max(0, source.length - resolved.length),
    duplicate: Math.max(0, resolved.length - unique.length)
  };
  return unique;
}
function renderRatingFallbackEmpty(){
  $('#results').innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><p>${t('no_my_ratings')}</p><small>${t('status_ratings_filtered')}</small></div>`;
}

function ratingListSignature(list){
  return normalizeRatingList(list)
    .map(x => `${x.type}|${x.id}|${ratingTitleKey(x.title)}|${Number(x.rating).toFixed(1)}|${x.note||''}`)
    .sort()
    .join('||');
}
function getCachedRatingView(list){
  try{
    const cache = JSON.parse(localStorage.getItem(SK.ratingViewCache) || '{}');
    const sig = ratingListSignature(list);
    if(cache && cache.sig === sig && Array.isArray(cache.items)){
      return { items: cache.items, stats: cache.stats || null };
    }
  }catch{}
  return null;
}
function setCachedRatingView(list, items, stats){
  try{
    const payload = { sig: ratingListSignature(list), when: Date.now(), stats: stats || null, items: items || [] };
    safeSetJsonItem(SK.ratingViewCache, payload);
  }catch{}
}
function clearRatingViewCache(){
  try{ localStorage.removeItem(SK.ratingViewCache); }catch{}
}
let PENDING_RATING_IMPORT_STATS_TOAST = false;
function ratingStatusFromStats(shown, total, stats){
  const statusParts = [];
  if(stats?.missing > 0) statusParts.push(`검색 제외 ${stats.missing}개`);
  if(stats?.duplicate > 0) statusParts.push(`중복 정리 ${stats.duplicate}개`);
  return statusParts.length ? `표시 ${shown}개 / ${statusParts.join(' / ')}` : '';
}

let RATING_BACKGROUND_RESOLVE_TOKEN = 0;
function ratingCachedMaps(list){
  const cached = getCachedRatingView(list);
  const byRatingKey = new Map();
  const byTmdbKey = new Map();
  (cached?.items || []).forEach(item => {
    if(!item) return;
    if(item.media_type && item.id != null) byTmdbKey.set(`${item.media_type}-${item.id}`, item);
    const sourceKey = ratingKey(item.user_rating_type || contentTypeToRatingType(item.media_type), item.user_rating_id || item.id, item.user_rating_title || item.title || item.name || '');
    byRatingKey.set(sourceKey, item);
  });
  return { cached, byRatingKey, byTmdbKey };
}
function ratingItemToFastCard(item, maps=null){
  const normalized = normalizeRatingItem(item);
  if(!normalized) return null;
  const mediaType = ratingTypeToMediaType(normalized.type);
  const ratingId = String(normalized.id || '').trim();
  const tmdbKey = `${mediaType}-${ratingId}`;
  const resolved = maps?.byRatingKey?.get(normalized.k) || maps?.byTmdbKey?.get(tmdbKey) || null;
  const resolvedMediaType = resolved?.media_type || mediaType;
  const resolvedId = resolved?.id ?? ratingId;
  const title = cleanTitle(normalized.title || resolved?.user_rating_title || resolved?.title || resolved?.name || '');
  return {
    id: resolvedId,
    media_type: resolvedMediaType,
    title,
    name: title,
    original_title: title,
    original_name: title,
    poster_path: resolved?.poster_path || '',
    vote_average: Number(resolved?.vote_average || 0),
    vote_count: Number(resolved?.vote_count || 0),
    overview: resolved?.overview || '',
    release_date: resolved?.release_date || resolved?.first_air_date || '',
    first_air_date: resolved?.first_air_date || resolved?.release_date || '',
    popularity: Number(resolved?.popularity || 0),
    genre_ids: Array.isArray(resolved?.genre_ids) ? resolved.genre_ids : [],
    user_rating_id: normalized.id,
    user_rating_title: normalized.title,
    user_rating_type: normalized.type,
    user_rating_value: normalized.rating,
    user_rating_note: normalized.note || ''
  };
}
function renderRatingsInstant(list, maps=null){
  const fastItems = list.map(item => ratingItemToFastCard(item, maps)).filter(Boolean);
  const visible = filterByCurrentQuery(clientSort(fastItems));
  if(!visible.length){
    PAGE_STATE.query ? renderEmptyState() : renderRatingFallbackEmpty();
    setStatus('');
    return 0;
  }
  renderCards(visible, false, { skipEnrich: true, skipRatingRefresh: true });
  setStatus('');
  return visible.length;
}
function scheduleRatingBackgroundResolve(list){
  const source = normalizeRatingList(list);
  if(!source.length) return;
  const token = ++RATING_BACKGROUND_RESOLVE_TOKEN;
  const sig = ratingListSignature(source);
  const start = async () => {
    try{
      if(token !== RATING_BACKGROUND_RESOLVE_TOKEN || PAGE_STATE.lastMode !== 'ratings') return;
      const resolved = await resolveRatingListToTmdb(source);
      if(token !== RATING_BACKGROUND_RESOLVE_TOKEN || PAGE_STATE.lastMode !== 'ratings') return;
      if(ratingListSignature(await getRatings()) !== sig) return;
      const stats = resolved._ratingStats || { missing: Math.max(0, source.length - resolved.length), duplicate: 0, shown: resolved.length };
      const sortedResolved = clientSort(resolved || []);
      setCachedRatingView(source, sortedResolved, stats);
      if(sortedResolved.length){
        const visibleResolved = filterByCurrentQuery(sortedResolved);
        if(visibleResolved.length) renderCards(visibleResolved, false, { skipEnrich: true, skipRatingRefresh: true });
      }
      setStatus('');
    }catch{
      setStatus('');
    }
  };
  if('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 80);
}
function showRatingsInstant(){
  abortActiveRequests();
  RENDER_TOKEN++;
  RATING_BACKGROUND_RESOLVE_TOKEN++;
  PAGE_STATE.lastMode = 'ratings';
  setSavedModeUI('ratings');
  clearSkeletons();
  setStatus('');

  let list = getRatingsSync();
  list.sort((a,b) => a.title.localeCompare(b.title, 'ko'));
  if(!list.length){ renderRatingFallbackEmpty(); setStatus(''); return; }

  const maybeToastImportStats = (shown, stats) => {
    if(!PENDING_RATING_IMPORT_STATS_TOAST) return;
    PENDING_RATING_IMPORT_STATS_TOAST = false;
    const msg = ratingStatusFromStats(shown, list.length, stats);
    showToast(msg ? `${t('toast_ratings_imported')} · ${msg}` : `${t('toast_ratings_imported')} · 표시 ${shown}개`, 3600);
  };

  const maps = ratingCachedMaps(list);
  if(maps.cached?.items?.length){
    const cachedItems = clientSort(filterByCurrentQuery(maps.cached.items || []));
    if(cachedItems.length){
      renderCards(cachedItems, false, { skipEnrich: true, skipRatingRefresh: true });
      setStatus('');
      maybeToastImportStats((maps.cached.items || []).length, maps.cached.stats);
      return;
    }
    if(PAGE_STATE.query){
      renderEmptyState();
      setStatus('');
      maybeToastImportStats((maps.cached.items || []).length, maps.cached.stats);
      return;
    }
  }

  const shown = renderRatingsInstant(list, maps);
  maybeToastImportStats(shown, null);
  scheduleRatingBackgroundResolve(list);
}
async function showRatings(){
  showRatingsInstant();
}
async function exportRatings(){
  const list = await getRatings();
  if(!list.length){ showToast(t('no_my_ratings')); return; }
  const payload = list.map(x => ({ id: x.id, type: x.type, title: x.title, rating: Number(x.rating), note: x.note || '' }));
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:T]/g,'-').slice(0,19);
  a.href = url;
  a.download = `ratings-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  showToast(`${t('toast_ratings_exported')} · ${list.length}개`, 2200);
}
async function importRatings(file){
  try{
    // 새 JSON을 불러올 때는 이전 매칭 실패 캐시를 초기화해 누락된 항목을 다시 검색합니다.
    RATING_MATCH_STORE = {};
    clearRatingViewCache();
    try { localStorage.removeItem(RATING_MATCH_STORE_KEY); } catch {}
    const text = await file.text();
    const data = JSON.parse(text);
    const incomingRaw = Array.isArray(data) ? data : (Array.isArray(data?.ratings) ? data.ratings : []);
    const incoming = normalizeRatingList(incomingRaw);
    if(!incoming.length){ showToast(t('toast_invalid_ratings_file'), 2600); return; }
    const current = await getRatings();
    const next = current.slice();
    incoming.forEach(item => {
      const idx = findRatingIndex(next, item);
      if(idx >= 0) next[idx] = {...next[idx], ...item};
      else next.push(item);
    });
    if(!await setRatings(next)){ showToast(t('toast_save_failed'), 2800); return; }
    PENDING_RATING_IMPORT_STATS_TOAST = true;
    await refreshRatingBadges();
    if(PAGE_STATE.lastMode === 'ratings') await showRatings();
    else showToast(`${t('toast_ratings_imported')} · ${incoming.length}개`, 2600);
  }catch(e){
    showToast(t('toast_invalid_ratings_file'), 2600);
  }
}
async function clearRatingsList(){
  const list = await getRatings();
  if(!list.length){ showToast(t('no_my_ratings')); return; }
  if(!confirm(`${t('my_ratings')} ${list.length}개를 모두 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`)) return;
  clearRatingViewCache();
  if(!await setRatings([])){ showToast(t('toast_save_failed'), 2800); return; }
  showToast(t('toast_rating_removed'), 2200);
  await refreshRatingBadges();
  if(PAGE_STATE.lastMode === 'ratings') await showRatings();
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
  // 즐겨찾기: 하트 / 나중에보기: 시계 또는 체크
  const glyph = kind==='fav'
    ? actionHeartSvg(active)
    : actionClockSvg(active);
  btn.innerHTML = `<span class="btn-glyph">${glyph}</span>`;
}
function renderCards(items,append,options={}){
  if(!items.length&&!append){
    renderEmptyState();
    return;
  }
  const html=items.map(it=>{
    const type=it.media_type||(it.first_air_date?'tv':'movie');
    // API 응답 title이 현재 언어와 맞지 않으면 original_title로 초기 표시 (refreshCardTitles가 곧 덮어씀)
    const rawTitle=itemTitle(it,type);
    const title=(titleLooksReadable(rawTitle,CUR_LANG)||!rawTitle)
      ? rawTitle
      : (cleanTitle(type==='movie'?(it.original_title||it.title||''):(it.original_name||it.name||''))||rawTitle);
    const year=getYear(it.release_date||it.first_air_date);
    const img=cardPosterUrl(it.poster_path);
    const ratingVal=(it.vote_average||0);
    const rating=ratingVal.toFixed(1);
    const ratingCls=ratingVal>=7.5?'rating rating-high':ratingVal>=6?'rating rating-mid':'rating rating-low';
    const key=`${type}-${it.id}`;
    const userRatingType=normalizeRatingType(it.user_rating_type || (CONTENT_TYPE === 'anime' ? 'anime' : contentTypeToRatingType(type)));
    const ratingTitle=cleanTitle(it.user_rating_title || title);
    const ratingId=String(it.user_rating_id || '').trim();
    const userRatingValue=Number(it.user_rating_value);
    const hasUserRating=Number.isFinite(userRatingValue) && userRatingValue > 0;
    const userRatingNote=String(it.user_rating_note || '').trim();
    const badgeCls=userRatingType==='anime'?'badge badge-anime':type==='tv'?'badge badge-tv':'badge';
    const badgeLabel=userRatingType==='anime'?t('anime'):(type==='movie'?t('badge_movie'):t('badge_tv'));
    return`<div class="card" data-type="${type}" data-id="${it.id}" data-key="${key}" data-title="${escapeHtml(title)}" data-rating-id="${escapeHtml(ratingId)}" data-rating-title="${escapeHtml(ratingTitle)}" data-rating-type="${escapeHtml(userRatingType)}" data-user-rating="${hasUserRating?userRatingValue.toFixed(1):''}" data-user-note="${escapeHtml(userRatingNote)}" data-poster="${escapeHtml(it.poster_path||'')}" data-date="${escapeHtml(it.release_date||it.first_air_date||'')}" data-vote="${it.vote_average||0}">
      <div class="thumb">${img?`<img src="${img}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" fetchpriority="low">`:`<div class="thumb-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>${t('poster_none')}</span></div>`}<div class="thumb-top-info"><div class="thumb-badge-action"><span class="${badgeCls}">${escapeHtml(badgeLabel)}</span><div class="card-actions"><button class="action-btn fav-btn" type="button" aria-pressed="false" aria-label="${t('favorite')} ${t('not_selected')}" title="${t('favorite')} ${t('not_selected')}"><span class="btn-glyph">${actionHeartSvg(false)}</span></button><button class="action-btn watch-btn" type="button" aria-pressed="false" aria-label="${t('watch_later')} ${t('not_selected')}" title="${t('watch_later')} ${t('not_selected')}"><span class="btn-glyph">${actionClockSvg(false)}</span></button><button class="action-btn rate-btn${hasUserRating?' active':''}" type="button" aria-pressed="${hasUserRating?'true':'false'}" aria-label="${hasUserRating?`${t('my_rating')} ${userRatingValue.toFixed(1)}`:t('rate_this')}" title="${hasUserRating?`${t('my_rating')} ${userRatingValue.toFixed(1)}`:t('rate_this')}"><span class="btn-glyph">${actionStarSvg(hasUserRating)}</span></button></div></div><span class="card-user-rating user-rating-score${hasUserRating?'':' hidden'}"${hasUserRating?` title="${t('my_rating')} ${userRatingValue.toFixed(1)}" aria-label="${t('my_rating')} ${userRatingValue.toFixed(1)}"`:''}>${hasUserRating?`★ ${userRatingValue.toFixed(1)}`:''}</span></div></div>
      <div class="meta">
        <div class="name" title="${escapeHtml(title)}">${escapeHtml(title)||'&nbsp;'}</div>
        <div class="sub">${year||t('year_unknown')}</div>
        <div class="user-rating-inline${userRatingNote?'':' hidden'}">${escapeHtml(userRatingNote)}</div>
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
    const fb=card.querySelector('.fav-btn'),wb=card.querySelector('.watch-btn'),rb=card.querySelector('.rate-btn');
    card.addEventListener('click',e=>{if(e.target.closest('.action-btn'))return;openDetail(type,id,card);});
    fb.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();const s=pickStub(card);const l=await toggleSaved('fav',s);updateSavedButtons('fav',l);});
    wb.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();const s=pickStub(card);const l=await toggleSaved('watch',s);updateSavedButtons('watch',l);});
    rb?.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();await openRatingEditor(ratingSourceFromCard(card),card);});
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
  if(!options.skipEnrich){
    refreshCardTitles(renderedCards);
    refreshCardPosters(renderedCards);
  }
  if(!options.skipRatingRefresh) refreshRatingBadges();
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
  if(!await setSaved(kind, [])){ showToast(t('toast_save_failed'), 2800); return; }
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

    if(!await setSaved(kind, merged)){ showToast(t('toast_save_failed'), 2800); return; }
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
  PAGE_STATE.lastMode=`saved-${kind}`;
  $('#results').innerHTML='';
  setStatus('');
  setSavedModeUI(kind);

  const list = await getSaved(kind);
  if(!list.length){ renderEmptyState(); return; }

  // 탭 필터만 적용 (장르/국가 필터 미적용)
  let items = list.slice();
  if(CONTENT_TYPE!=='all' && CONTENT_TYPE!=='anime') items = items.filter(x=>x.media_type===CONTENT_TYPE);
  items = filterByCurrentQuery(items);
  if(!items.length){ renderEmptyState(); return; }

  // 정렬
  items.sort((a,b)=>{
    if(SORT_BY==='vote_average.desc') return (b.vote_average||0)-(a.vote_average||0);
    if(SORT_BY==='date.desc'){ const da=a.release_date||'',db=b.release_date||''; return db>da?1:db<da?-1:0; }
    return (b.popularity||0)-(a.popularity||0);
  });

  // 즉시 렌더링 (제목/포스터는 refreshCardTitles/Posters가 비동기 보완)
  renderCards(items.map(x=>({
    id: x.id, media_type: x.media_type,
    title: x.title, name: x.title,
    poster_path: x.poster_path,
    vote_average: x.vote_average||0,
    release_date: x.release_date||'',
    popularity: x.popularity||0
  })), false);
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
    const title = IS_MOBILE ? rawTitle : await resolveTmdbDisplayTitle(type,id,rawTitle);
    const resolvedPosterPath = IS_MOBILE ? (data.poster_path || '') : await resolveTmdbPosterPath(type,id,data.poster_path||'');
    const poster=detailPosterUrl(resolvedPosterPath);
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
    const [favList,watchList,userRatings]=await Promise.all([getSaved('fav'),getSaved('watch'),getRatings()]);
    const key=`${type}-${id}`;
    const ratingType = contentTypeToRatingType(type);
    const ratingLookupType = normalizeRatingType(sourceEl?.getAttribute?.('data-rating-type') || ratingType);
    const ratingLookupTitle = sourceEl?.getAttribute?.('data-rating-title') || title;
    const ratingLookupId = sourceEl?.getAttribute?.('data-rating-id') || String(id);
    const existingUserRating = findRating(userRatings, {id:ratingLookupId, type:ratingLookupType, title:ratingLookupTitle, rating:0, note:''});
    const sectionBlock=(label, body, extra='') => body ? `<div class="section detail-section ${extra}"><strong>${label}</strong><div>${body}</div></div>` : '';
    const safeYoutubeKey=/^[A-Za-z0-9_-]{6,}$/.test(trailer?.key||'') ? trailer.key : '';
    const trailerBlock=safeYoutubeKey?sectionBlock(t('modal_trailer'), `<div class="yt-preview"><img src="https://i.ytimg.com/vi/${safeYoutubeKey}/mqdefault.jpg" alt="Trailer" loading="lazy" decoding="async" fetchpriority="low"/><button class="yt-link" data-url="https://www.youtube.com/watch?v=${safeYoutubeKey}">▶ ${t('trailer_youtube')}</button></div>`, 'media-section'):'';
    const overviewBlock=sectionBlock(t('modal_overview'), `<div class="detail-chip-row">${detailChips.map(x=>`<span class="detail-chip">${escapeHtml(String(x))}</span>`).join('')}</div>`, 'summary-section');
    const descriptionBlock=data.overview?sectionBlock(t('modal_description'), `<p class="detail-text">${escapeHtml(data.overview)}</p>`, 'description-section'):'';
    const userRatingBlock = sectionBlock(t('my_rating'), `<div class="detail-rating-form">
      <input id="detailUserRating" class="rating-input" type="number" inputmode="decimal" autocomplete="off" enterkeyhint="done" min="0" max="10" step="0.1" value="${existingUserRating ? Number(existingUserRating.rating).toFixed(1) : ''}" placeholder="${t('rating_placeholder')}" />
      <input id="detailUserNote" class="rating-note-line" type="text" autocomplete="off" enterkeyhint="done" value="${escapeHtml(existingUserRating?.note || '')}" placeholder="${t('note_placeholder')}" />
      <button id="detailSaveRating" class="modal-save-btn modal-rating-save" type="button">★ ${t('save_rating')}</button>
      <button id="detailClearRating" class="modal-save-btn modal-rating-clear" type="button">× ${t('clear_rating')}</button>
    </div>`, 'user-rating-section');
    const renderCastMembers = members => members.map(c => {
      const name = c.name || c.original_name || '';
      const character = c.character || '';
      const profile = tinyPosterUrl(c.profile_path, 'w185');
      const initials = (name || '?').trim().slice(0, 1).toUpperCase();
      return `<article class="cast-card">
        <div class="cast-photo">${profile ? `<img src="${profile}" alt="${escapeHtml(name)}" loading="lazy" decoding="async" fetchpriority="low">` : ''}<span>${escapeHtml(initials)}</span></div>
        <div class="cast-info">
          <span class="cast-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
          ${character ? `<span class="cast-role" title="${escapeHtml(character)}">${escapeHtml(character)}</span>` : ''}
        </div>
      </article>`;
    }).join('');
    const castBlock=cast.length?sectionBlock(t('modal_cast'), `<div class="cast-grid">${renderCastMembers(cast)}</div>`, 'people-section cast-section'):'';
    $('#modalBody').innerHTML=`<div class="modal-header">
      <div class="modal-poster">${poster?`<img src="${poster}" alt="${escapeHtml(title)}" loading="eager" decoding="async">`:''}</div>
      <div class="modal-body">
        <h3 id="modalTitle">${escapeHtml(title)}${year?` (${year})`:''}</h3>
        <div class="modal-save-actions">
          <button class="modal-save-btn modal-fav-btn" data-kind="fav" aria-pressed="${favList.some(x=>x.k===key)?'true':'false'}">${favList.some(x=>x.k===key)?'♥':'♡'} ${t('modal_add_fav')}</button>
          <button class="modal-save-btn modal-watch-btn" data-kind="watch" aria-pressed="${watchList.some(x=>x.k===key)?'true':'false'}">${watchList.some(x=>x.k===key)?'✓':'⏱'} ${t('modal_add_watch')}</button>
        </div>
        ${overviewBlock}
        ${userRatingBlock}
        ${descriptionBlock}
        ${trailerBlock}
        ${castBlock}
        ${prov?renderProviders(prov):''}
        <div class="section detail-section tmdb-row"><button class="yt-link tmdb-link" data-url="https://www.themoviedb.org/${type}/${id}?language=${tmdbLang()}">${t('modal_open_tmdb')}</button></div>
      </div>
    </div>`;
    $$('#modalBody [data-url]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.open(btn.getAttribute('data-url'),'_blank','noopener,noreferrer');}));
    $$('#modalBody .modal-save-btn[data-kind]').forEach(btn=>btn.addEventListener('click',async e=>{
      e.preventDefault(); e.stopPropagation();
      const kind=btn.dataset.kind;
      const list=await toggleSaved(kind,itemStub);
      const active=list.some(x=>x.k===key);
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.textContent=`${kind==='fav'?(active?'♥':'♡'):(active?'✓':'⏱')} ${kind==='fav'?t('modal_add_fav'):t('modal_add_watch')}`;
      updateSavedButtons(kind, list);
    }));
    $('#detailSaveRating')?.addEventListener('click', async e=>{
      e.preventDefault(); e.stopPropagation();
      const rating = getRatingInputValue();
      if(rating === null){ showToast(t('toast_invalid_rating')); return; }
      await upsertRating({id:ratingLookupId, type:ratingLookupType, title:ratingLookupTitle, rating, note:$('#detailUserNote')?.value || ''});
    });
    $('#detailClearRating')?.addEventListener('click', async e=>{
      e.preventDefault(); e.stopPropagation();
      await removeRating({id:ratingLookupId, type:ratingLookupType, title:ratingLookupTitle, rating:0, note:''});
      const ri=$('#detailUserRating'), rn=$('#detailUserNote'); if(ri)ri.value=''; if(rn)rn.value='';
    });
    const modalContent=document.querySelector('.modal-content');
    if(modalContent) modalContent.scrollTop=0;
    $('#modal').classList.remove('hidden');
    document.body.classList.add('lock-scroll');
    requestAnimationFrame(()=>{
      const mc=document.querySelector('.modal-content');
      if(mc) mc.scrollTo({top:0,left:0,behavior:'instant'});
    });
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
  const providerBlock=(label,items=[])=>items.length?`<div class="section detail-section provider-section"><strong>${label} <small>${t('provider_region')}</small></strong><div class="providers">${items.map(x=>`<span class="provider">${x.logo_path?`<img src="${posterUrl(x.logo_path, IS_MOBILE ? 'w45' : 'w45')}" alt="${escapeHtml(x.provider_name)}" loading="lazy" decoding="async" fetchpriority="low">`:''}<span>${escapeHtml(x.provider_name)}</span></span>`).join('')}</div></div>`:'';
  return [
    providerBlock(t('modal_providers'),p.flatrate||[]),
    providerBlock(t('modal_buy'),p.buy||[]),
    providerBlock(t('modal_rent'),p.rent||[])
  ].join('');
}
function closeModal(){
  try{ document.activeElement?.blur?.(); }catch{}
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
function compactCacheItem(it){
  const type = it?.media_type || (it?.first_air_date ? 'tv' : 'movie');
  return {
    id: it?.id,
    media_type: type,
    title: it?.title || it?.name || '',
    name: it?.name || it?.title || '',
    original_title: it?.original_title || '',
    original_name: it?.original_name || '',
    poster_path: it?.poster_path || '',
    vote_average: Number(it?.vote_average || 0),
    vote_count: Number(it?.vote_count || 0),
    popularity: Number(it?.popularity || 0),
    release_date: it?.release_date || '',
    first_air_date: it?.first_air_date || '',
    genre_ids: Array.isArray(it?.genre_ids) ? it.genre_ids.slice(0, 12) : [],
    origin_country: Array.isArray(it?.origin_country) ? it.origin_country.slice(0, 4) : [],
    user_rating_id: it?.user_rating_id || '',
    user_rating_title: it?.user_rating_title || '',
    user_rating_type: it?.user_rating_type || '',
    user_rating_value: it?.user_rating_value,
    user_rating_note: it?.user_rating_note || ''
  };
}
async function saveCache(payload){
  const {[SK.cache]:bag={}}=await storage.get([SK.cache]);
  const compactPayload = {...payload, items: (payload.items || []).map(compactCacheItem)};
  bag[cacheKeyForState()]={when:Date.now(),...compactPayload};
  const keepCount = IS_MOBILE ? 5 : 10;
  const entries=Object.entries(bag).sort((a,b)=>(b[1].when||0)-(a[1].when||0)).slice(0,keepCount);
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
const FETCH_MEMORY_CACHE = new Map();
const FETCH_INFLIGHT = new Map();
const FETCH_CACHE_TTL = IS_MOBILE ? 1000 * 60 * 10 : 1000 * 60 * 3;
function canMemoryCache(url, opts={}){
  const method = String(opts.method || 'GET').toUpperCase();
  return method === 'GET' && !opts.signal && typeof url === 'string' && url.includes('api.themoviedb.org/3/');
}
function pruneFetchMemoryCache(){
  const max = IS_MOBILE ? 80 : 140;
  if(FETCH_MEMORY_CACHE.size <= max) return;
  const entries = [...FETCH_MEMORY_CACHE.entries()].sort((a,b)=>(a[1].when||0)-(b[1].when||0));
  entries.slice(0, Math.ceil(max * 0.25)).forEach(([k])=>FETCH_MEMORY_CACHE.delete(k));
}
async function fetchJson(url,opts={}){
  const cacheable = canMemoryCache(url, opts);
  const now = Date.now();
  if(cacheable){
    const hit = FETCH_MEMORY_CACHE.get(url);
    if(hit && now - (hit.when || 0) < FETCH_CACHE_TTL) return hit.data;
    if(FETCH_INFLIGHT.has(url)) return FETCH_INFLIGHT.get(url);
  }

  const fetchOpts={cache:'default',...opts};
  const ctrl=fetchOpts.signal?null:new AbortController();
  if(!fetchOpts.signal){fetchOpts.signal=ctrl.signal;ABORTS.add(ctrl);}
  const requestPromise = (async()=>{
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
  })();

  if(cacheable){
    FETCH_INFLIGHT.set(url, requestPromise);
    try{
      const data = await requestPromise;
      FETCH_MEMORY_CACHE.set(url, {when:Date.now(), data});
      pruneFetchMemoryCache();
      return data;
    } finally {
      FETCH_INFLIGHT.delete(url);
    }
  }
  return requestPromise;
}
