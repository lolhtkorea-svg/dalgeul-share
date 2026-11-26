// Published f1 links depend on these phrase IDs. Append new phrases or use a new format.
(function () {
  'use strict';
  const phrases = [
    "작게 시작하기 좋은 날",
    "생각하던 일을 현실에서 처음 시험해 보기 좋아요. 큰 약속을 먼저 잡으면 시작이 부담스러울 수 있으니, 부담 없이 바꿀 수 있는 단계에서 감을 잡아 보세요.",
    "미뤄 둔 일 하나에 타이머를 15분 맞추세요. 그 시간엔 자료 한 개 찾기처럼 바로 끝낼 수 있는 것부터 해 보세요.",
    "대화가 일을 풀어 주는 날",
    "머릿속으로 짐작해 온 일이 있다면, 말을 꺼냈을 때 의외로 쉽게 정리될 수 있어요. 여러 의견이 나오면 먼저 상대가 중요하게 여기는 지점 한 가지를 확인해 보세요.",
    "오늘 중요한 대화 한 번에서 “어떤 결과를 원해?”라고 묻고, 들은 답을 짧게 되짚어 보세요.",
    "밀린 일을 정리하기 좋은 날",
    "해야 할 일을 계속 떠올리느라 집중이 흐트러질 수 있어요. 이미 시작한 일 가운데 끝이 보이는 것부터 마무리하면 일정이 한결 가벼워져요.",
    "종이에 ‘오늘 마무리’와 ‘내일 이후’를 나눠 적고, 오늘 끝낼 항목을 한 가지 고르세요.",
    "나만의 기준을 세우는 날",
    "선택지를 늘리다 보면 작은 결정에도 시간이 들어요. 중요한 조건을 먼저 정하면 주변 의견을 들어도 내 생각을 정리하기 쉬워요.",
    "결정이 필요한 일 하나에 조건을 두 개 적으세요. 둘 다 맞는 첫 번째 선택지를 다시 살펴보세요.",
    "속도를 잠깐 낮추는 날",
    "일정 사이에 여유가 없으면 평소라면 가볍게 넘길 말도 크게 들릴 수 있어요. 하루 중 한 번만이라도 다음 일로 넘어가기 전에 생각을 정리할 시간을 남겨 보세요.",
    "다음 일정 전 10분을 비워 두세요. 무엇을 더 할지 대신, 어떤 일을 내일로 미뤄도 되는지 정해 보세요.",
    "작게 시작하기 좋은 한 주",
    "대화가 일을 풀어 주는 한 주",
    "밀린 일을 정리하기 좋은 한 주",
    "나만의 기준을 세우는 한 주",
    "속도를 잠깐 낮추는 한 주",
    "새 일을 여러 개 한꺼번에 시작하기",
    "준비가 안 된 상태에서 바로 약속하기",
    "답장 속도나 짧은 말투만 보고 상대 마음을 단정하기",
    "화가 난 상태에서 긴 메시지 보내기",
    "눈에 띄는 작은 일부터 처리하다 중요한 마감을 놓치기",
    "밀린 일을 전부 오늘 안에 끝내려 하기",
    "할인이나 마감 문구에 쫓겨 필요 없는 물건을 결제하기",
    "의견이 바뀔 때마다 계획을 다시 짜기",
    "피곤한 상태에서 중요한 대화나 결정을 서두르기",
    "빈 시간까지 약속으로 채우기",
    "기존 일정은 그대로 두고 새 계획만 늘리기",
    "불편한 부탁이나 서운함을 끝까지 말하지 않고 넘기기",
    "마감 확인을 주말까지 몰아두기",
    "예산이나 역할을 구체적으로 정하지 않은 채 공동 계획 확정하기",
    "회복 시간을 미루고 바쁜 일정을 연달아 잡기",
    "새 사람과 가볍게 가까워지기 쉬운 날이에요. 관계의 진도를 생각하기보다 대화를 시작할 계기를 만들어 보세요. 함께 해 본 적 없는 작은 활동 하나를 제안해 보세요. 가까운 곳을 잠깐 걷는 정도면 충분해요.",
    "마음을 짐작으로 읽기 어려운 날이에요. 궁금한 점을 부드럽게 질문하면 말투만 보고 오해할 일을 줄일 수 있어요. 서운했던 일이 있으면 “나는 그때 이렇게 느꼈어”라고 내 감정을 먼저 말해 보세요.",
    "마음속에 남은 관계를 정리하고 지금 원하는 관계를 생각해 보기 좋아요. 급하게 결론을 내릴 필요는 없어요. 미뤄 둔 약속 중 둘 다 원하는 것 하나를 골라 날짜를 정해 보세요.",
    "서로의 경계와 원하는 속도를 확인하기 좋은 날이에요. 약속을 잡을 때 상대가 제안할 여지도 남겨 보세요. 일정이나 연락 빈도에 기대가 다르다면, 각자 편한 방식부터 말해 보세요.",
    "답을 빨리 받고 싶은 마음이 들면 잠깐 시간을 두는 게 좋아요. 편안한 상태에서 건네는 한마디가 길게 설명하는 것보다 자연스러울 수 있어요. 각자 쉬는 시간도 약속의 일부로 생각해 보세요. 오늘 고마웠던 일 하나를 짧게 말해 주는 것도 좋아요."
  ];
  const ids = new Map(phrases.map((text, index) => [text, index]));
  const fields = ['headline','today','todayAdvice','todayCaution','week','weekSummary','weekAdvice','weekCaution'];
  const publicFields = new Set([...fields,'kind','summary','score','mascot','day','weekDates']);
  const original = window.DalgeulResultLink;
  const datesValid = (day, range, mascot) => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day)
    && typeof range === 'string' && range.length > 0 && range.length <= 35
    && typeof mascot === 'string' && /^(?:[1-9]|1[0-2])$/.test(mascot);
  function encode(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function webToken(result, appToken) {
    if (result.kind !== 'personal' || result.summary !== result.headline || (result.score ?? 0) !== 0
        || !datesValid(result.day, result.weekDates, result.mascot)
        || Object.keys(result).some(key => !publicFields.has(key))) return appToken;
    const references = fields.map(key => ids.get(result[key]));
    if (references.includes(undefined)) return appToken;
    return 'f1.' + encode([result.day, result.weekDates, result.mascot, ...references]);
  }
  function toAppToken(fragment) {
    if (!fragment.startsWith('f1.')) return original.toAppToken(fragment);
    const text = fragment.slice(3);
    if (!/^[A-Za-z0-9_-]{1,350}$/.test(text)) throw Error('Invalid fortune link');
    const bytes = Uint8Array.from(atob(text.replace(/-/g,'+').replace(/_/g,'/')), ch => ch.charCodeAt(0));
    const values = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    if (!Array.isArray(values) || values.length !== fields.length + 3) throw Error('Invalid fortune fields');
    const [day, weekDates, mascot, ...references] = values;
    if (!datesValid(day, weekDates, mascot)
        || references.some(id => !Number.isInteger(id) || id < 0 || id >= phrases.length)) throw Error('Invalid fortune reference');
    const result = {kind:'personal', day, weekDates, mascot, score:0};
    fields.forEach((key, index) => {result[key] = phrases[references[index]];});
    result.summary = result.headline;
    return encode(result);
  }
  window.DalgeulFortuneCard = Object.freeze({webToken, toAppToken});
})();
