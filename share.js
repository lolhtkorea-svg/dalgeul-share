/* No recipient is selected and no message is sent automatically. */
(function () {
  'use strict';
  const config = window.DALGEUL_SHARE_CONFIG;
  const button = document.getElementById('prepare-share');
  const status = document.getElementById('status');

  let info;
  function normalize(source) {
    if (!source || !['personal','couple'].includes(source.kind)) throw Error('Invalid result');
    if (typeof source.headline !== 'string' || !source.headline.trim() || typeof source.summary !== 'string') throw Error('Invalid result');
    const result = {kind:source.kind};
    const caps = {headline:75,summary:130,mascot:3,mascot2:3,animal1:70,animal2:70,day:10,today:150,todayAdvice:115,todayCaution:100,week:72,weekDates:35,weekSummary:145,weekAdvice:150,weekCaution:100};
    for (const [key, max] of Object.entries(caps)) if (typeof source[key] === 'string') result[key] = source[key].slice(0,max);
    if (source.kind === 'couple') {
      if (!Number.isFinite(source.score) || source.score < 0 || source.score > 100) throw Error('Invalid score');
      result.score = Math.round(source.score);
    }
    return result;
  }
  function encode(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    return btoa(Array.from(bytes,byte=>String.fromCharCode(byte)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode(value) {
    if (!/^[A-Za-z0-9_-]{10,9000}$/.test(value)) throw Error('Invalid token');
    const binary = atob(value.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4-value.length%4)%4));
    return normalize(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0)))));
  }
  async function loadSdk() {
    if (!window.Kakao?.Share) {
      await new Promise((resolve,reject) => {
        const script=document.createElement('script');
        script.src=config.sdkUrl; script.integrity=config.sdkIntegrity; script.crossOrigin='anonymous';
        script.onload=resolve; script.onerror=() => { script.remove(); reject(Error('SDK unavailable')); };
        document.head.append(script);
      });
    }
    if (!window.Kakao.isInitialized()) window.Kakao.init(config.kakaoJavaScriptKey);
  }
  try {
    info=decode(location.hash.slice(1));
    const short=window.DalgeulResultLink.pack(info);
    const full=config.resultBaseUrl+'#'+encode(info);
    const url=config.resultBaseUrl+'#'+short;
    const title=info.kind==='couple'?'달결 · 우리 궁합 '+info.score+'%':'달결 · 오늘과 이번 주 운세';
    const description=Array.from(info.kind==='couple'?info.summary:info.headline).slice(0,64).join('');
    document.getElementById('card-title').textContent=title;
    document.getElementById('excerpt').textContent=description;
    const preview=document.getElementById('view-result');
    preview.href=full; preview.hidden=false;
    const copy=document.getElementById('copy-result');
    copy.hidden=false;
    copy.onclick=async()=>{
      try { await navigator.clipboard.writeText(full); status.textContent='결과 링크를 복사했어요.'; }
      catch { status.textContent='결과 미리보기를 길게 눌러 링크를 복사해 주세요.'; }
    };
    const template={objectType:'feed',content:{title,description,imageUrl:config.resultBaseUrl+'preview.png',
      imageWidth:512,imageHeight:512,link:{webUrl:url,mobileWebUrl:url}},buttonTitle:'달결에서 보기',installTalk:true};
    async function ready() {
      button.disabled=true;
      try {
        await loadSdk();
        button.textContent='카카오톡 친구 선택';
        status.textContent='카카오톡에서 받을 친구나 대화방을 선택하세요.';
        button.onclick=()=>{
          try { window.Kakao.Share.sendDefault(template); }
          catch { status.textContent='카카오톡을 열 수 없어요. 아래에서 결과 링크를 복사할 수 있어요.'; }
        };
      } catch {
        status.textContent='카카오톡 연결을 불러오지 못했어요.';
        button.textContent='카카오톡 연결 다시 시도'; button.onclick=ready;
      } finally { button.disabled=false; }
    }
    if (short.length<=1100) ready();
    else { button.hidden=true; status.textContent='이 결과는 링크로 공유할 수 있어요. 아래에서 결과 링크를 복사하세요.'; }
  } catch {
    const error=document.getElementById('error');
    error.textContent='공유할 결과를 확인하지 못했어요. 달결에서 공유하기를 다시 눌러 주세요.';
    error.hidden=false;button.hidden=true;
  }
})();
