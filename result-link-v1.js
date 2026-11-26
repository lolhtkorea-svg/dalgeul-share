/* This version is immutable: already delivered cards depend on its word order. */
(() => {
  'use strict';
  const words = '가까운 가까워지기 가벼워져요 가볍게 가운데 가지 가지를 각자 감을 감정을 건네는 걷는 것도 것보다 것부터 결과를 결론을 결정에도 결정을 결정이 결제하기 경계와 계기를 계속 계획 계획만 계획을 고르세요 고마웠던 골라 곳을 공동 관계를 관계의 구체적으로 궁금한 그대로 그때 급하게 기대가 기존 기준을 길게 꺼냈을 끝까지 끝내려 끝낼 끝이 나눠 나는 나만의 나오면 날이에요 날짜를 남겨 남은 낮추는 내릴 내일 내일로 넘기기 넘길 넘어가기 놓치기 눈에 느꼈어 늘리기 늘리다 다르다면 다시 다음 단계에서 단정하기 답을 답장 대신 대화 대화가 대화나 대화를 되는지 되짚어 두고 두는 두세요 들릴 들면 들어도 들어요 들은 때마다 떠올리느라 띄는 라고 마감 마감을 마무리 마무리하면 마음속에 마음을 마음이 만들어 말도 말을 말투만 말하지 말해 맞는 맞추세요 머릿속으로 먼저 메시지 몰아두기 무엇을 문구에 묻고 물건을 미루고 미뤄 미뤄도 밀린 바꿀 바뀔 바로 바쁜 받고 방식부터 번만이라도 번에서 번째 보고 보기 보내기 보면 보세요 보이는 부담 부담스러울 부드럽게 부탁이나 분을 불편한 비워 빈도에 빨리 사람과 사이에 살펴보세요 상대 상대가 상태에서 생각을 생각하기보다 생각하던 생각해 서두르기 서로의 서운함을 서운했던 선택지를 설명하는 세우는 속도나 속도를 쉬는 쉬운 쉬워요 쉽게 시간까지 시간도 시간엔 시간을 시간이 시작이 시작하기 시작한 시작할 시험해 싶은 안에 않고 않은 약속 약속으로 약속을 약속의 약속하기 어떤 어려운 없는 없어요 없으면 없이 여기는 여러 여유가 여지도 역할을 연달아 연락 예산이나 오늘 오해할 원하는 원해 의견을 의견이 의외로 이렇게 이미 이후 일로 일부로 일부터 일을 일이 일정 일정은 일정을 일정이 일정이나 읽기 있는 있다면 있어요 있으니 있으면 자료 자연스러울 작게 작은 잠깐 잡기 잡아 잡으면 잡을 적고 적으세요 전부 전에 점을 정도면 정리될 정리하고 정리하기 정리할 정하면 정하지 정해 제안할 제안해 조건을 종이에 좋아요 좋은 주는 주말까지 주변 준비가 줄일 중요하게 중요한 지금 지점 진도를 질문하면 짐작으로 짐작해 집중이 짜기 짧게 짧은 쫓겨 찾기처럼 채우기 처리하다 처음 충분해요 크게 타이머를 편안한 편한 평소라면 풀어 피곤한 필요 필요는 필요한 하기 하나를 하나에 하루 한결 한꺼번에 한마디가 할인이나 할지 함께 항목을 해야 현실에서 화가 확인을 확인하기 확인해 확정하기 활동 회복 흐트러질'.split(' ');
  const indexes = new Map(words.map((word, index) => [word, index]));
  const fields = ['kind','headline','summary','mascot','mascot2','score','animal1','animal2',
    'day','today','todayAdvice','todayCaution','week','weekDates','weekSummary','weekAdvice','weekCaution'];
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8', {fatal:true});
  function base64(bytes) {
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function pack(result) {
    const values = fields.map(key => result[key] ?? null);
    while (values.length && values[values.length-1] === null) values.pop();
    // JSON escapes literal control characters, so they can identify two-byte word references.
    const packed = JSON.stringify(values).replace(/[가-힣]+ ?/g, match => {
      const index = indexes.get(match.trimEnd());
      if (index === undefined) return match;
      const code = index * 2 + Number(match.endsWith(' '));
      return String.fromCharCode(1 + Math.floor(code / 95), 32 + code % 95);
    });
    return 'r1.' + base64(encoder.encode(packed));
  }
  function toAppToken(fragment) {
    if (!fragment.startsWith('r1.')) return fragment;
    const value = fragment.slice(3);
    if (!/^[A-Za-z0-9_-]{5,9000}$/.test(value)) throw Error('Invalid result');
    const binary = atob(value.replace(/-/g,'+').replace(/_/g,'/'));
    const packed = decoder.decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
    const json = packed.replace(/([\x01-\x1f])([\x20-\x7e])/g, (_, high, low) => {
      const code = (high.charCodeAt(0)-1)*95 + low.charCodeAt(0)-32;
      const word = words[Math.floor(code/2)];
      if (word === undefined) throw Error('Unknown word');
      return word + (code % 2 ? ' ' : '');
    });
    if (json.length > 6750) throw Error('Invalid result');
    const values = JSON.parse(json);
    if (!Array.isArray(values) || values.length < 3 || values.length > fields.length) throw Error('Invalid result');
    const result = {};
    values.forEach((v,i) => {
      if (v === null) return;
      if (fields[i] === 'score' ? !Number.isInteger(v) || v < 0 || v > 100 : typeof v !== 'string') throw Error('Invalid result');
      result[fields[i]] = v;
    });
    const bytes = encoder.encode(JSON.stringify(result));
    if (bytes.length > 6750) throw Error('Invalid result');
    return base64(bytes);
  }
  window.DalgeulResultLink = Object.freeze({pack, toAppToken});
})();
