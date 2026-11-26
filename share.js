/* No recipient is selected and no message is sent automatically. */
(function () {
  'use strict';
  const config = window.DALGEUL_SHARE_CONFIG;
  const button = document.getElementById('prepare-share');
  const status = document.getElementById('status');
  const canvas = document.getElementById('share-preview');
  let info, token, imageUrl, busy = false;
  function normalize(source) {
    if (!source || !['personal','couple'].includes(source.kind)) throw Error('Invalid result');
    if (typeof source.headline !== 'string' || !source.headline.trim() || typeof source.summary !== 'string') throw Error('Invalid result');
    const result = {kind:source.kind};
    const caps = {headline:75,summary:130,mascot:3,mascot2:3,animal1:70,animal2:70,day:10,today:150,todayAdvice:115,todayCaution:100,week:72,weekDates:35,weekSummary:145,weekAdvice:115,weekCaution:100};
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
  function drawCard(data) {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0,0,900,1120);
    gradient.addColorStop(0,'#352146');gradient.addColorStop(1,'#1d1937');
    ctx.fillStyle=gradient;ctx.fillRect(0,0,900,1120);
    ctx.strokeStyle='#d9b97a';ctx.lineWidth=3;ctx.strokeRect(35,35,830,1050);
    ctx.fillStyle='#e6c68d';ctx.textAlign='center';ctx.font='700 30px sans-serif';ctx.fillText('달결',450,106);
    ctx.font='700 27px sans-serif';ctx.fillStyle='#e3d0ee';ctx.fillText(data.kind==='couple'?'두 사람의 연애·궁합운':'오늘과 이번 주의 운세',450,169);
    function wrap(text,x,y,width,font,color,maxLines,lineHeight) {
      ctx.textAlign='left';ctx.font=font;ctx.fillStyle=color;
      const lines=[];let line='';
      for(const char of Array.from(String(text||''))){
        if(char==='\n'||ctx.measureText(line+char).width>width){lines.push(line);line=char==='\n'?'':char;}else line+=char;
      }
      if(line)lines.push(line);
      lines.slice(0,maxLines).forEach((value,index)=>ctx.fillText(value+(index===maxLines-1&&lines.length>maxLines?'…':''),x,y+index*lineHeight));
      return y+Math.min(lines.length,maxLines)*lineHeight;
    }
    if(data.kind==='couple'){
      ctx.textAlign='center';ctx.fillStyle='#ffe8c0';ctx.font='800 152px sans-serif';ctx.fillText(data.score+'%',450,410);
      wrap(data.headline,96,525,708,'700 43px sans-serif','#fff0d4',2,60);
      wrap(data.summary,96,680,708,'400 33px sans-serif','#eee1f3',5,49);
    }else{
      wrap(data.headline,88,270,724,'700 46px sans-serif','#fff0d4',2,61);
      wrap('오늘의 흐름'+(data.day?' · '+data.day:''),88,425,724,'700 28px sans-serif','#e6c68d',1,42);
      wrap(data.today||data.summary,88,480,724,'400 32px sans-serif','#f4eaf7',3,47);
      ctx.strokeStyle='#74607b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(88,645);ctx.lineTo(812,645);ctx.stroke();
      wrap('이번 주 운세',88,704,724,'700 28px sans-serif','#e6c68d',1,42);
      wrap(data.week||'이번 주의 흐름도 함께 확인해 보세요.',88,759,724,'700 35px sans-serif','#fff0d4',2,49);
      wrap(data.weekSummary,88,869,724,'400 29px sans-serif','#eee1f3',2,44);
    }
    ctx.fillStyle='#f4dfb6';ctx.fillRect(82,991,736,58);ctx.fillStyle='#34243d';ctx.textAlign='center';ctx.font='700 27px sans-serif';ctx.fillText('카드를 눌러 전체 결과 보기',450,1030);
  }
  function sdk() {
    const ready=()=>typeof window.Kakao?.init==='function'&&typeof window.Kakao?.isInitialized==='function';
    if(ready())return Promise.resolve(window.Kakao);
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=config.sdkUrl;script.integrity=config.sdkIntegrity;script.crossOrigin='anonymous';
      script.onload=()=>{if(ready())resolve(window.Kakao);else{script.remove();reject(Error('SDK unavailable'));}};
      script.onerror=()=>{script.remove();reject(Error('SDK unavailable'));};document.head.append(script);
    });
  }
  function feed() {
    const url=config.resultBaseUrl+'#'+token;
    const link={mobileWebUrl:url,webUrl:url};
    return {objectType:'feed',content:{title:info.kind==='couple'?'달결 · 우리 궁합 '+info.score+'%':'달결 · 오늘과 이번 주 운세',description:info.headline,imageUrl,imageWidth:900,imageHeight:1120,link},buttons:[{title:'결과 보기',link}],installTalk:true};
  }
  button.addEventListener('click',async()=>{
    if(busy||!info)return;
    if(imageUrl){
      try{window.Kakao.Share.sendDefault(feed());status.textContent='카카오톡에서 받는 사람을 선택해 주세요. 선택 화면이 열리지 않으면 다시 눌러 주세요.';}
      catch(_){status.textContent='카카오톡을 열지 못했어요. 잠시 후 다시 시도해 주세요.';}
      return;
    }
    busy=true;button.disabled=true;status.textContent='카카오톡에서 볼 수 있도록 이미지를 준비하고 있어요…';
    try{
      if(!/^[a-f0-9]{32}$/i.test(config?.kakaoJavaScriptKey||''))throw Error('Unavailable');
      const kakao=await sdk();if(!kakao.isInitialized())kakao.init(config.kakaoJavaScriptKey);
      if(typeof kakao.Share?.uploadImage!=='function')throw Error('SDK unavailable');
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('Image unavailable')),'image/png'));
      const files=new DataTransfer();files.items.add(new File([blob],'dalgeul-result.png',{type:'image/png'}));
      const response=await kakao.Share.uploadImage({file:files.files});
      const uploaded=response?.infos?.original?.url||response?.original?.url;
      if(typeof uploaded!=='string'||!/^https:\/\//.test(uploaded))throw Error('Image unavailable');
      imageUrl=uploaded;button.textContent='카카오톡으로 보내기';status.textContent='카드가 준비됐어요. 아래 버튼을 누르고 카카오톡에서 받는 사람을 선택해 주세요.';
    }catch(error){
      button.textContent='공유 카드 다시 준비';
      let reason='카드를 준비하지 못했어요.';
      const detail=String(error?.msg || error?.message || '');
      if (/domain mismatched|unregistered domain/i.test(detail)) {
        reason='카카오가 이 공유 주소를 승인하지 않았어요.';
      } else if (detail==='SDK unavailable') {
        reason='카카오 공유 도구를 불러오지 못했어요.';
      } else if (Number.isInteger(error?.code)) {
        reason='카카오에서 이미지를 받지 못했어요 (오류 '+error.code+').';
      }
      status.textContent=reason+' 아래에서 결과 링크를 복사해 카카오톡으로 보내세요.';
    }
    finally{busy=false;button.disabled=false;}
  });
  try{
    info=decode(location.hash.slice(1));token=encode(info);drawCard(info);button.disabled=false;
    status.textContent='이미지를 확인한 뒤 공유 카드를 준비해 주세요.';
    const view=document.getElementById('view-result');view.href=config.resultBaseUrl+'#'+token;view.hidden=false;
    const copy=document.getElementById('copy-result');
    copy.hidden=false;
    copy.addEventListener('click',async()=>{
      try {
        await navigator.clipboard.writeText(view.href);
        status.textContent='결과 링크를 복사했어요. 카카오톡 대화에 붙여 넣어 주세요.';
      } catch (_) {
        status.textContent='아래 결과 미리보기를 길게 눌러 링크를 복사해 주세요.';
      }
    });
  }catch(_){
    const error=document.getElementById('error');error.textContent='공유할 결과를 불러오지 못했어요. 달결 앱에서 공유하기를 다시 눌러 주세요.';error.hidden=false;canvas.hidden=true;button.hidden=true;status.textContent='';
  }
})();
