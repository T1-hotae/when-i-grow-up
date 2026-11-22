// 확정 대본 v1 (2026.11.22). 대사를 고칠 땐 이 파일만 고친다.

export type DreamId = 'astronaut' | 'teacher' | 'doctor' | 'celebrity' | 'painter' | 'unknown'

export type Answer = { text: string, reply: string }

export type Dream = {
  label: string // 장면 1 선택지
  name: string // "내가 ___ 되고 싶었던 건"에 들어가는 말
  letter: string // 번진 편지 칸에 채워지는 문장
  mind: string // 장면 3에서 밝혀지는 마음
  type: { name: string, desc: string, words: string } // 장면 5 결과
}

export const landing = {
  title: '어른이 되면',
  lines: ['열 살의 내가 편지를 보냈어요.', '"꿈꾸던 어른이 되었나요?"'],
  start: '편지 받으러 가기',
  note: '약 5분 걸려요. 소리를 켜 주세요.',
}

// 장면 0. 새벽 2시
export const scene0 = {
  notifications: [
    '[채용 결과 안내] 지원해 주셔서 감사합니다. 아쉽게도…',
    '[채용 결과 안내] 귀하의 역량은 충분하나…',
    '엄마: 밥은 먹었니',
  ],
  line: '오늘은 여기까지 하자.',
  action: '노트북 덮기',
}

// 장면 1. 날아온 편지
export const scene1 = {
  actions: { open: '창문 열기', unfold: '펼치기' },
  letter: {
    before: ['어른이 된 나에게', '안녕? 나는 열 살 너야.', '선생님이 미래의 나한테 편지 쓰래서 쓴다.'],
    // 이 사이에 dreams[id].letter
    after: '어른 되면 이거 꼭 돼 있어라. 약속!',
  },
  blurred: '글씨가 번졌다. 그때 꿈이 뭐였더라?',
  reply: '어? 이거 진짜 읽고 있어? 대박. 어른 된 나야?',
}

// 꿈 하나 = 마음 하나 = 결과 유형 하나
export const dreams: Record<DreamId, Dream> = {
  astronaut: {
    label: '우주비행사',
    name: '우주비행사',
    letter: '내 꿈은 우주비행사다. 화성 가서 깃발 꽂을 거다.',
    mind: '아무도 안 가 본 데 가 보고 싶어서',
    type: { name: '종이비행기형 어른', desc: '떨어져도 다시 접어서 날리는 사람', words: '화성은 나중에 가도 돼. 아직 연료 있잖아.' },
  },
  teacher: {
    label: '선생님',
    name: '선생님',
    letter: '내 꿈은 선생님이다. 숙제 없는 선생님.',
    mind: '누가 나 때문에 뭘 알게 되면 기분 좋아서',
    type: { name: '등대형 어른', desc: '내 길은 헷갈려도 남의 길은 잘 비춰 주는 사람', words: '너한테 물어보는 사람 많지? 그거 다 네 덕분이야.' },
  },
  doctor: {
    label: '의사',
    name: '의사',
    letter: '내 꿈은 의사다. 주사 안 아프게 놓는 의사.',
    mind: '아픈 사람이 안 아팠으면 해서',
    type: { name: '우산형 어른', desc: '남이 비 맞을까 봐 먼저 챙기다 자기 어깨가 젖는 사람', words: '너도 가끔은 우산 씌워 달라고 해.' },
  },
  celebrity: {
    label: '연예인',
    name: '연예인',
    letter: '내 꿈은 연예인이다. 사인 연습 벌써 했다.',
    mind: '사람들이 나 보고 웃으면 좋아서',
    type: { name: '모닥불형 어른', desc: '옆에 있으면 사람들이 모여드는 사람', words: '무대 아니어도 돼. 네 옆이 제일 따뜻했어.' },
  },
  painter: {
    label: '화가',
    name: '화가',
    letter: '내 꿈은 화가다. 미술 시간이 제일 좋다.',
    mind: '내가 본 예쁜 걸 다른 사람한테도 보여 주고 싶어서',
    type: { name: '늦게 피는 꽃형 어른', desc: '고르는 데 오래 걸려도, 피면 색이 진한 사람', words: '늦게 피는 꽃이 제일 오래 간대. 선생님이 그랬어.' },
  },
  unknown: {
    label: '기억이 안 나',
    name: '치킨집 사장',
    letter: '내 꿈은 (오늘은) 치킨집 사장이다. 어제는 경찰이었다.',
    mind: '그냥 재밌게 살고 싶어서',
    type: { name: '고양이형 어른', desc: '정해진 꿈이 없어도 오늘 햇볕을 잘 찾는 사람', words: '꿈 없어도 돼. 나도 매일 바뀌었잖아.' },
  },
}

// 장면 2. 걱정 구기기
export const scene2 = {
  intro: ['근데 방이 왜 이렇게 어두워?', '그 둥둥 떠 있는 종이들은 뭐야?'],
  worries: ['또 떨어졌다', '통장 잔고', '친구 결혼 소식', '나만 늦은 것 같다', '자소서 1번 문항', '부모님 얼굴', '내일 뭐 하지'],
  custom: '직접 쓰기', // 쓴 걱정은 어디에도 저장하지 않고 바로 구긴다
  hint: '탭해서 구기고, 휴지통에 던져 보세요.',
  cheers: ['골인!', '오, 잘 던진다', '그거 엄청 무거워 보였는데'],
  miss: '빗나가도 괜찮아. 한 번 더!',
  done: ['이제 좀 보인다.', '근데 어른 방 생각보다 좁다?'],
}

// 장면 3. 열 살의 질문 (답할 때마다 벽에 어린 시절 그림 한 장)
export const scene3 = {
  q1: {
    question: '어른 되면 숙제 없지? 맨날 놀지?',
    answers: [
      { text: '숙제가 더 많아', reply: '헐. 어른도 숙제 있어? 누가 내 줘?' },
      { text: '노는 법을 까먹었어', reply: '그럼 내가 알려 줄게. 일단 이불 속에 들어가.' },
      { text: '응, 맨날 놀아', reply: '거짓말. 눈 밑이 까매.' },
    ] satisfies Answer[],
  },
  q2: {
    question: '그래서… 꿈은 이뤘어?',
    answers: [
      { text: '아니, 아직', reply: '아직이구나.' },
      { text: '다른 길로 왔어', reply: '다른 길? 거기도 재밌어?' },
      { text: '잘 모르겠어', reply: '모르겠구나. 나도 맨날 몰라.' },
    ] satisfies Answer[],
  },
  // 대본의 중심: q2에 어떻게 답해도 이어진다
  core: (d: Dream) => ['근데 있잖아.', `내가 ${d.name} 되고 싶었던 건, ${d.mind}였어.`, '그건 아직 하고 있어?'],
  q3: {
    question: '요즘 잘한 거 하나만 말해 줘.',
    answers: ['서류를 또 냈다', '아침에 일어났다', '친구 얘기를 들어 줬다', '새로운 걸 하나 배웠다', '밥을 챙겨 먹었다', '그냥 버텼다'],
    reply: ['그거 쉬운 거 아니야. 나 알아.', '나는 받아쓰기 하나 틀려도 하루 종일 울었거든.'],
  },
}

// 장면 4. 답장
export const scene4 = {
  intro: ['이제 네 차례야. 나한테 답장 써 줘.', '내일 학교 가기 전에 읽을게.'],
  replies: [
    '어른도 생각보다 잘 몰라. 그래도 괜찮아.',
    '꿈은 좀 바뀌었는데, 네 마음은 그대로야.',
    '아직 가는 중이야. 조금만 기다려 줘.',
    '네가 있어서 여기까지 왔어. 고마워.',
    '치킨은 생각보다 자주 못 먹어. 미안.',
  ],
  freeLine: { max: 30, placeholder: '한 줄 더 쓸 수도 있어요 (나만 봐요)' },
  action: '별로 접어서 보내기',
  sentCount: (n: number) => `지금까지 ${n}명이 열 살의 자신에게 답장을 보냈어요.`, // 2단계: 서버가 생기면 보여 준다
  farewell: ['답장 고마워. 나 이제 자러 간다.', '너도 얼른 자. 벌써 두 시 넘었어.'],
}

// 장면 5. 결과 카드 (유형은 dreams[id].type)
export const scene5 = {
  worryCount: (n: number) => `오늘 버린 걱정 ${n}개`,
  proudLabel: '요즘 잘한 일',
  buttons: { kakao: '카카오톡으로 보내기', save: '이미지 저장', others: '다른 유형 구경하기' },
  helpline: '많이 힘들 땐 혼자 버티지 말아요. 자살예방 상담전화 109',
}
