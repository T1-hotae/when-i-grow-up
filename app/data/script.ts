// 대본 v2 (2026.11.22, 꿈속에서 만나는 버전). 대사를 고칠 땐 이 파일만 고친다.

export type DreamId = 'scientist' | 'astronaut' | 'teacher' | 'doctor' | 'soccer' | 'celebrity' | 'president' | 'police' | 'gamer' | 'designer' | 'painter' | 'unknown'

export type Answer = { text: string, reply: string }

export type Me = 'son' | 'daughter' // 첫 화면에서 고른 성별. 단톡방 말투, 친구, 방, 새벽 알림 보낸 부모가 바뀐다

export type Dream = {
  label: string // 장면 1 추천 칩
  name: string // "내가 ___ 되고 싶었던 건"에 들어가는 말
  mind: string // 장면 3에서 밝혀지는 마음
  type: { name: string, desc: string, words: string } // 장면 5 결과
  keywords?: string[] // 장면 1에서 직접 쓴 꿈을 이 유형으로 알아듣는 말
}

export const landing = {
  title: '어른이 되면',
  lines: ['어젯밤 꿈에 열 살의 내가 나왔어요.', '"꿈꾸던 어른이 되었나요?"'],
  start: '시작하기',
  ask: '나는…',
  me: { daughter: '여자', son: '남자' } satisfies Record<Me, string>,
  note: '약 6분 걸려요. 소리를 켜 주세요.',
}

// 장면 0-1 노트북 화면의 단톡방. 화면을 탭할 때마다 한 줄씩 온다
export type Chat =
  | { who: string, text: string, at: string }
  | { me: true, typed: string, emoticon: string, at: string } // 입력창에 썼다가 다 지우고 이모티콘만 보낸다

export type Story = {
  who: string
  headline: string
  caption: string
  emoji: string
  image: string
  avatar: string
  layout: 'office' | 'travel' | 'travel-arrival' | 'anniversary' | 'regram' | 'wedding' | 'bodyprofile'
  repost?: { who: string, avatar: string, headline: string, caption: string }
}

// 장면 0. 새벽 1시 40분
export const scene0 = {
  desk: {
    clock: '오전 1:33', // 노트북을 켰을 때. 시계는 새 메시지가 올 때마다 그 시각으로 간다
    // 메일은 낮에 와 있던 걸 밤에 다시 열어 본다. 위가 먼저 온 메일
    mails: [
      { from: '채용팀', title: '[채용 결과 안내] 지원해 주셔서 감사합니다', body: '아쉽게도 이번에는 함께하지 못하게 되었습니다…', at: '어제 오후 4:12' },
      { from: '인사팀', title: '[채용 결과 안내] 서류 전형 결과', body: '귀하의 역량은 충분하나…', at: '어제 오후 6:47' },
    ],
    room: '동기들',
    // 썼다 지우느라 늦게 보낸다 (me 줄)
    chat: {
      daughter: [
        { who: '민지', text: '얘들아 나 최종 합격했다ㅠㅠㅠ', at: '오전 1:34' },
        { who: '준호', text: '헐 대박 축하해!!!', at: '오전 1:34' },
        { who: '서연', text: '역시 될 줄 알았어 🥹', at: '오전 1:35' },
        { me: true, typed: '진짜 축하해 !!', emoticon: '/images/ui/emoticon.webp', at: '오전 1:37' },
        { who: '민지', text: '고마워ㅠㅠ 너도 곧이야!!', at: '오전 1:38' },
      ],
      son: [
        { who: '준호', text: '나 취뽀함 ㅅㄱ', at: '오전 1:34' },
        { who: '민수', text: '욜 ㅋㅋ 축하', at: '오전 1:34' },
        { who: '서연', text: '한턱쏴라', at: '오전 1:35' },
        { me: true, typed: 'ㅋㅋㅋㅋ축하해', emoticon: '/images/ui/emoticon.webp', at: '오전 1:37' },
        { who: '준호', text: 'ㄱㅅ 너도 곧이다', at: '오전 1:38' },
      ],
    } as Record<Me, Chat[]>, // satisfies로 두면 줄마다 me 여부로 좁혀지지 않는다
    thoughts: ['다들 어디론가 가고 있는데.', '나만 제자리인 것 같다.'],
    action: '노트북 덮기',
  },
  bed: {
    // 친구는 남녀를 섞되, 내가 고른 성별 쪽이 더 많다. 단톡방에서 합격한 친구가 첫 출근 스토리를 올린다
    stories: {
      daughter: [
        { who: 'minji_', headline: '첫 출근', caption: '잘 부탁드립니다', emoji: '🪪', image: '/images/stories/story-minji.webp', avatar: '/images/avatars/profile-default.svg', layout: 'office' },
        { who: 'travel.junho', headline: '퇴사 기념', caption: '바르셀로나', emoji: '✈️', image: '/images/stories/story-junho.webp', avatar: '/images/avatars/profile-dog.svg', layout: 'travel' },
        { who: 'seoyeon_', headline: '사랑해', caption: '300일 동안 고마워', emoji: '💐', image: '/images/stories/story-anniversary.webp', avatar: '/images/avatars/profile-character.svg', layout: 'anniversary' },
        { who: 'hyun_wedding', headline: '저희 결혼합니다', caption: '', emoji: '💍', image: '/images/stories/story-wedding.webp', avatar: '/images/avatars/profile-couple.svg', layout: 'wedding' },
        { who: 'gym_daeun', headline: '바디프로필', caption: '100일 성공!\n사진 후보 도착', emoji: '📸', image: '/images/stories/story-daeun.webp', avatar: '/images/avatars/profile-fitness.svg', layout: 'bodyprofile' },
      ],
      son: [
        { who: 'junho_', headline: '첫 출근', caption: '잘 부탁드립니다', emoji: '🪪', image: '/images/stories/story-office-son.webp', avatar: '/images/avatars/profile-default.svg', layout: 'office' },
        { who: 'travel.seoyeon', headline: '바르셀로나 왔다', caption: '', emoji: '✈️', image: '/images/stories/story-barcelona-son.webp', avatar: '/images/avatars/profile-dog.svg', layout: 'travel-arrival' },
        { who: 'minsu_', headline: '나도 사랑해', caption: '', emoji: '💐', image: '/images/stories/story-anniversary.webp', avatar: '/images/avatars/profile-character.svg', layout: 'regram', repost: { who: 'seoyeon_', avatar: '/images/avatars/profile-character.svg', headline: '사랑해', caption: '300일 동안 고마워' } },
        { who: 'hyun_wedding', headline: '저희 결혼합니다', caption: '', emoji: '💍', image: '/images/stories/story-wedding.webp', avatar: '/images/avatars/profile-couple.svg', layout: 'wedding' },
        { who: 'gym_daehyun', headline: '바디프로필', caption: '100일 성공!\n사진 후보 도착', emoji: '📸', image: '/images/stories/story-gym-son.webp', avatar: '/images/avatars/profile-fitness.svg', layout: 'bodyprofile' },
      ],
    } satisfies Record<Me, Story[]>,
    thoughts: ['다들 잘 지내네.', '나는 늦은 걸까.', '내가… 할 수 있을까?'],
    action: '폰 내려놓기',
  },
  ceiling: {
    line: '…오늘은 그만 자자.',
    action: '눈 감기',
  },
}

// 마지막 글자에 받침이 있나 (직접 쓴 꿈 뒤에 "이었지/였지"를 고른다)
const hasBatchim = (w: string) => {
  const c = w.charCodeAt(w.length - 1) - 0xAC00
  return c >= 0 && c <= 11171 && c % 28 > 0
}

// 장면 1. 꿈속, 검은 화면 (아이의 말은 흰 손글씨, 괄호는 내 속마음)
export const scene1 = {
  hello: '미래의 나야, 안녕?',
  who: '(어? 누구지?)',
  intro: ['나는 과거의 너야!', '혹시 너는 어떻게 지내니? 흠~'],
  howAreYou: [
    { text: '그럭저럭…', reply: '그럭저럭이 뭐야? 어른 말 같다.' },
    { text: '잘 모르겠어', reply: '나도 모를 때 많아.' },
    { text: '(대답이 안 나온다)', reply: '괜찮아, 천천히 해.' },
  ] satisfies Answer[],
  askDream: '혹시 내가 꾸던 꿈은 이루었니?',
  forgot: '(내 꿈이 뭐였더라…?)',
  input: { placeholder: '열 살 때 꿈을 적어 주세요', submit: '이거였어', max: 20 },
  confirm: (name: string) => `맞아! 내 꿈은 ${name}${hasBatchim(name) ? '이었지' : '였지'}.`,
  reply: '어? 내 목소리 들리는 거야? 대박. 진짜 어른 된 나야?',
}

// 꿈 하나 = 마음 하나 = 결과 유형 하나
// 1990년대 후반~2000년대 초반 초등학생(남녀 모두)이 실제로 많이 적던 꿈. 순서 = 선택지 순서
export const dreams: Record<DreamId, Dream> = {
  scientist: {
    label: '과학자',
    name: '과학자',
    mind: '궁금한 게 너무 많아서',
    type: { name: '돋보기형 어른', desc: '아직도 "왜?"라고 물어보는 사람', words: '궁금한 거 아직 많지? 그럼 아직 과학자야.' },
    keywords: ['과학', '발명', '연구', '박사', '로봇'],
  },
  astronaut: {
    label: '우주비행사',
    name: '우주비행사',
    mind: '아무도 안 가 본 데 가 보고 싶어서',
    type: { name: '종이비행기형 어른', desc: '떨어져도 다시 접어서 날리는 사람', words: '화성은 나중에 가도 돼. 아직 연료 있잖아.' },
    keywords: ['우주', '비행', '파일럿', '조종사'],
  },
  teacher: {
    label: '선생님',
    name: '선생님',
    mind: '누가 나 때문에 뭘 알게 되면 기분 좋아서',
    type: { name: '등대형 어른', desc: '내 길은 헷갈려도 남의 길은 잘 비춰 주는 사람', words: '너한테 물어보는 사람 많지? 그거 다 네 덕분이야.' },
    keywords: ['선생', '교사', '교수', '강사'],
  },
  doctor: {
    label: '의사',
    name: '의사',
    mind: '아픈 사람이 안 아팠으면 해서',
    type: { name: '우산형 어른', desc: '남이 비 맞을까 봐 먼저 챙기다 자기 어깨가 젖는 사람', words: '너도 가끔은 우산 씌워 달라고 해.' },
    keywords: ['의사', '간호', '약사', '병원'],
  },
  soccer: {
    label: '축구선수',
    name: '축구선수',
    mind: '친구들이랑 같이 뛰는 게 제일 좋아서',
    type: { name: '운동장형 어른', desc: '넘어져도 무릎 털고 다시 뛰는 사람', words: '아직 후반전이야. 추가 시간도 있어.' },
    keywords: ['축구', '야구', '농구', '운동', '선수', '체육'],
  },
  celebrity: {
    label: '연예인',
    name: '연예인',
    mind: '사람들이 나 보고 웃으면 좋아서',
    type: { name: '모닥불형 어른', desc: '옆에 있으면 사람들이 모여드는 사람', words: '무대 아니어도 돼. 네 옆이 제일 따뜻했어.' },
    keywords: ['연예인', '가수', '배우', '아이돌', '개그맨', '아나운서', '유튜버'],
  },
  president: {
    label: '대통령',
    name: '대통령',
    mind: '다 같이 잘 살았으면 해서',
    type: { name: '반장형 어른', desc: '아무도 안 나설 때 먼저 손 드는 사람', words: '대통령 아니어도 돼. 너 이미 누군가한테 든든하잖아.' },
    keywords: ['대통령', '정치', '국회의원'],
  },
  police: {
    label: '경찰',
    name: '경찰',
    mind: '약한 사람을 지켜 주고 싶어서',
    type: { name: '호루라기형 어른', desc: '불공평한 걸 보면 그냥 못 지나치는 사람', words: '그 마음 아직 있지? 다 보여.' },
    keywords: ['경찰', '소방', '군인', '판사', '검사', '변호사'],
  },
  gamer: {
    label: '프로게이머',
    name: '프로게이머',
    mind: '내가 제일 잘하는 걸로 이겨 보고 싶어서',
    type: { name: '이어하기형 어른', desc: '몇 번 져도 다시 시작 버튼을 누르는 사람', words: '게임 오버 아니야. 이어하기 누르면 돼.' },
    keywords: ['게이머', '게임', '프로그래머', '개발자'],
  },
  designer: {
    label: '디자이너',
    name: '디자이너',
    mind: '내가 만든 걸 누가 입고 좋아하면 신나서',
    type: { name: '조각보형 어른', desc: '흩어진 조각을 이어 붙여 쓸 만한 걸 만드는 사람', words: '지금 그 조각들도 언젠가 다 이어 붙여질 거야.' },
    keywords: ['디자이너', '패션', '건축', '만화가', '작가'],
  },
  painter: {
    label: '화가',
    name: '화가',
    mind: '내가 본 예쁜 걸 다른 사람한테도 보여 주고 싶어서',
    type: { name: '늦게 피는 꽃형 어른', desc: '고르는 데 오래 걸려도, 피면 색이 진한 사람', words: '늦게 피는 꽃이 제일 오래 간대. 선생님이 그랬어.' },
    keywords: ['화가', '미술', '그림', '피아노', '음악'],
  },
  unknown: {
    label: '기억이 안 나',
    name: '문방구 주인',
    mind: '그냥 재밌게 살고 싶어서',
    type: { name: '고양이형 어른', desc: '정해진 꿈이 없어도 오늘 햇볕을 잘 찾는 사람', words: '꿈 없어도 돼. 나도 매일 바뀌었잖아.' },
  },
}

// 장면 2. 어른 방 구경: 내가 고른 물건을 아이가 보고 묻는다. 하나 보여 줄 때마다 방이 밝아진다. 3개부터 그만할 수 있다
export const scene2 = {
  intro: ['근데 방이 왜 이렇게 어두워?', '불 좀 켜 봐. 어른 방 구경할래!'],
  pick: '뭐부터 보여 줄까?',
  things: [
    {
      emoji: '☕', name: '식은 커피', ask: '이 까만 물은 뭐야? 냄새가 써.',
      answers: [
        { text: '어른들이 마시는 커피', reply: '어른들은 쓴 거 왜 마셔? 벌 받는 거야?' },
        { text: '잠 깨는 물', reply: '잠을 왜 깨? 잠은 좋은 건데.' },
        { text: '초코우유야', reply: '거짓말. 아까 한 입 먹고 인상 썼잖아.' },
      ] satisfies Answer[],
    },
    {
      emoji: '👔', name: '문에 걸린 정장', ask: '이 옷은 왜 이렇게 딱딱해? 결혼식 가?',
      answers: [
        { text: '면접 볼 때 입는 옷', reply: '면접이 뭐야? 교무실 불려 가는 거야?' },
        { text: '어른으로 변신하는 옷', reply: '오, 이거 입으면 어른 모드 되는 거구나.' },
        { text: '아무것도 아니야', reply: '근데 왜 문에 잘 보이게 걸어 놨어?' },
      ] satisfies Answer[],
    },
    {
      emoji: '💊', name: '영양제 통', ask: '사탕 통이다! 하나 먹어도 돼?',
      answers: [
        { text: '사탕 아니고 영양제야', reply: '어른은 사탕 대신 이거 먹어? 슬프다.' },
        { text: '어른 되면 먹어', reply: '어른 되면 이거 먹어야 돼? 나 그냥 안 클래.' },
        { text: '안 돼, 내 거야', reply: '치사해. 나는 친구들한테 다 나눠 줬는데.' },
      ] satisfies Answer[],
    },
    {
      emoji: '📄', name: '뽑아 둔 이력서', ask: '여기 내 이름 있다! 상장이야?',
      answers: [
        { text: '나를 소개하는 종이', reply: '근데 좋아하는 거 칸이 없네? 나 떡볶이 좋아하는데.' },
        { text: '시험지 같은 거', reply: '몇 점 받았어? 동그라미 많이 받았어?' },
        { text: '응, 상장이야', reply: '근데 왜 도장이 없어? 상장엔 도장 찍어야지.' },
      ] satisfies Answer[],
    },
  ],
  // 마지막 물건은 성별마다 다르다
  hobby: {
    son: {
      emoji: '🎮', name: '먼지 쌓인 게임기', ask: '우와, 게임기다! 근데 왜 먼지가 있어?',
      answers: [
        { text: '요즘 할 시간이 없어', reply: '그럼 내가 대신 깨 놓을게. 세이브 해 둘게.' },
        { text: '혼자 하니까 재미없어', reply: '그럼 나랑 하자! 나 진짜 잘해.' },
        { text: '이제 안 좋아해', reply: '거짓말. 아직 안 버렸잖아.' },
      ] satisfies Answer[],
    },
    daughter: {
      emoji: '📷', name: '먼지 쌓인 필름카메라', ask: '우와, 카메라다! 근데 왜 먼지가 있어?',
      answers: [
        { text: '요즘 찍을 시간이 없어', reply: '그럼 내가 대신 찍어 줄게. 너 웃는 거.' },
        { text: '혼자 찍으니까 재미없어', reply: '그럼 나 찍어 줘! 나 브이 진짜 잘해.' },
        { text: '이제 안 좋아해', reply: '거짓말. 아직 안 버렸잖아.' },
      ] satisfies Answer[],
    },
  },
  enough: '이제 그만 보여 줄래',
  done: ['이제 좀 보인다.', '근데 어른 방 생각보다 좁다?'],
}

export type DiaryPaper = { date: string, weather: string, image?: string }

// 장면 3. 밀린 그림일기 숙제 → 창밖. 일이 일어날 때마다 아이의 부탁이나 내 버튼이 먼저 온다. 한 번에 4줄을 넘기지 않는다
export const scene3 = {
  q1: {
    question: '어른 되면 숙제 없지? 맨날 놀지?',
    answers: [
      { text: '숙제가 더 많아', reply: '헐. 어른도 숙제 있어? 누가 내 줘?' },
      { text: '노는 법을 까먹었어', reply: '내가 알려 줄게. 근데 숙제 다 해야 놀 수 있대.' },
      { text: '응, 맨날 놀아', reply: '거짓말. 눈 밑이 까매.' },
    ] satisfies Answer[],
    homework: ['그럼 내 숙제 좀 도와줘.', '방학 숙제 그림일기 밀렸거든. 저 서랍에 있어.'],
    action: '서랍 열기',
  },
  // 일기 1쪽: 열 살 때 쓴 꿈 (맞춤법은 일부러 틀린다)
  dreamPage: {
    paper: { date: '4월 7일 토요일', weather: '맑음' },
    text: (name: string, mind: string) => `나는 커서 ${name}${hasBatchim(name) ? '이' : '가'} 될꺼다. 왜냐하면 ${mind}. 끝.`,
    react: ['앗 그거 내 일기장이잖아! 보지 마!!', '…근데 맞아. 그래서 되고 싶었어.'],
  },
  still: '그건 아직 하고 있어?',
  // 일기 2쪽: 부끄러운 날. diary[i]는 memories.answers[i]를 일기 말투로 쓴 것
  shamePage: {
    paper: { date: '6월 12일 수요일', weather: '흐림', image: '/images/drawings/drawing-blanket.webp' },
    react: '아 이 장은 넘겨!!',
    diary: ['게임에 져서 울었다', '좋아하는 애가 다 들켰다', '혼자 삐져서 하루 종일 말 안 했다'],
    text: (s: string) => `오늘 ${s}. 너무 창피해서 이불을 찼다.`,
  },
  // 일기 마지막 쪽: 오늘. 아이가 대신 써 주고 도장을 찍는다
  todayPage: {
    paper: (t: Date) => ({ date: `${t.getMonth() + 1}월 ${t.getDate()}일 ${'일월화수목금토'[t.getDay()]}요일`, weather: '밤' }),
    react: '마지막 장은 비었네. 오늘 거 같이 쓰자.',
    text: (proud: string) => `오늘 어른 된 나는 ${proud}. 그거 쉬운 거 아니다.`,
  },
  stamp: ['어른은 칭찬 스티커 안 줘? 그럼 내가 도장 찍어 줄게.', '이거 선생님이 진짜 잘했을 때만 찍어 주는 거야.'],
  // 창밖: 아이가 부르고 내가 다가간다
  window: {
    ask: ['근데 너 아까 \'나만 늦은 것 같다\'고 했지?', '창밖 좀 봐.'],
    action: '창밖 보기',
    // window-city.webp(1920×1080)의 불 켜진 창 [left, top, width, height] %. 켜지는 순서
    // shortcut: 눈으로 잡은 좌표, 그림을 바꾸면 다시 맞춘다
    spots: [
      [34.5, 93, 10, 5.2], [10.8, 54, 4.9, 7.2], [69.4, 92.5, 4.6, 7.2], [32, 68.8, 2.3, 3.1],
      [1.2, 53, 2.4, 8.2], [79.6, 74.6, 4.5, 5.6], [34.5, 47.5, 1.8, 2.6], [62.7, 50.3, 3.6, 1.7],
      [26.1, 71.6, 1.7, 4], [90.5, 60.9, 3.1, 4.9], [32, 52.4, 1.5, 2.2], [46.5, 66, 1.5, 2.3],
      [10.8, 73.4, 4.9, 7.2], [64.7, 56.3, 1.5, 2], [96.5, 72.9, 2.3, 4.9], [34.7, 52.4, 1.6, 2.2],
      [72.6, 57.9, 2.8, 1.9], [33.9, 85.9, 3.5, 4], [97.4, 47.5, 1.5, 2.2], [34.7, 57.2, 1.6, 2.2],
      [82.2, 51.2, 1.2, 1.7], [24.1, 80.8, 1.1, 4],
    ] as [number, number, number, number][],
  },
  q2: {
    question: '그래서… 꿈은 이뤘어?',
    answers: [
      { text: '아니, 아직', reply: '아직이구나.' },
      { text: '다른 길로 왔어', reply: '다른 길? 거기도 재밌어?' },
      { text: '잘 모르겠어', reply: '모르겠구나. 나도 맨날 몰라.' },
    ] satisfies Answer[],
  },
  // 창밖 불이 켜지는 동안
  windows: ['저기 봐. 불 켜진 데 엄청 많다.', '저 사람들도 다 너처럼 안 자고 있는 거야?', '그럼 너 혼자 늦은 거 아니네.'],
  // 위로 A: 빛과 그림자 (창밖 불빛을 보며)
  comfortLight: ['괜찮아! 나라면 뭐든지 할 수 있어!', '원래 빛이 밝을수록 그림자가 더 큰 법이야.', '너는 엄청 빛날 거라서 그래. 가장 빛나는 별이 될 거야!'],
  // 일기 2쪽 부끄러운 기억: 무엇을 골라도 같은 말로 받는다
  memories: {
    ask: '근데 있잖아, 혹시 너만의 부끄러웠던 일 있어?',
    answers: ['작은 게임에 져서 울었던 일', '좋아하는 사람이 들켰던 일', '혼자 삐져서 말 안 했던 일'],
    custom: { label: '직접 쓰기', placeholder: '나만 보고 지워져요', submit: '이거', max: 30 }, // 쓴 말은 어디에도 저장하지 않는다
    outro: [
      ['아 그거! 나도 알아.', '그때는 진짜 이불킥하면서 지우고 싶었는데,', '지금은 기억도 잘 안 나지?'],
      ['아, 지금 좀 다시 기억났으려나? ㅎㅎ', '오늘 일도 나중엔 그렇게 될 거야.'],
    ],
  },
  q3: {
    question: '요즘 잘한 거 하나만 말해 줘.',
    answers: ['서류를 또 냈다', '아침에 일어났다', '친구 얘기를 들어 줬다', '새로운 걸 하나 배웠다', '밥을 챙겨 먹었다', '그냥 버텼다'],
    reply: ['그거 쉬운 거 아니야. 나 알아.', '나는 받아쓰기 하나 틀려도 하루 종일 울었거든.'],
  },
  // 위로 B: 정직하게 오는 길 (도장을 찍은 뒤)
  comfortHonest: [
    ['어둠이 길어져도 괜찮아. 우린 결국 이루게 될 거야.', '너는 남 속이지 않고 정직하게 오느라 시간이 좀 걸리는 것뿐이야.'],
    ['걱정 마. 정직한 만큼 더 단단하게 자랄 거야.', '지금 이 순간을 꼭 견뎌 내길 바라!'],
  ],
}

// 장면 4. 답장
export const scene4 = {
  intro: ['이제 네 차례야. 나한테 답장 써 줘.', '깨면 까먹을 테니까, 꼭.'],
  replies: [
    '어른도 생각보다 잘 몰라. 그래도 괜찮아.',
    '꿈은 좀 바뀌었는데, 네 마음은 그대로야.',
    '아직 가는 중이야. 조금만 기다려 줘.',
    '네가 있어서 여기까지 왔어. 고마워.',
    '어른 돼도 피망은 아직 싫어. 미안.',
  ],
  freeLine: { max: 30, placeholder: '한 줄 더 쓸 수도 있어요 (나만 봐요)' },
  action: '별로 접어서 보내기',
  sentCount: (n: number) => `지금까지 ${n}명이 열 살의 자신에게 답장을 보냈어요.`, // 2단계: 서버가 생기면 보여 준다
  farewell: (who: string) => [`답장 고마워. 나 이제 일어나야 돼. ${who}가 깨워.`, '너도 일어나. 아침이야.'], // who: 엄마/아빠
}

// 깨어남
export const wake = { alarm: '오전 8:00' }

// 새벽 1:40 알림을 보내는 부모: 아들이면 엄마, 딸이면 아빠
// 숨은 길: 알림이 떠 있는 동안 누르면 하소연(vent)을 보내고, 아침엔 밤새 온 답장(hidden)이 와 있다
type Talk = { text: string, at: string }
export type Parent = { who: string, night: Talk, replies: string[], vent: Talk[], hidden: { msgs: Talk[], replies: string[] } }
export const family: Record<Me, Parent> = {
  son: {
    who: '엄마',
    night: { text: '밥은 먹었니', at: '오전 1:40' }, // 아침 폰에서도 같은 날 새벽이라 '어제'가 아니다
    replies: ['아 죄송해요 지금 봤어요', '맛있게 먹었어요 '],
    vent: [
      { text: '엄마', at: '오전 1:41' },
      { text: '저 또 떨어졌어요', at: '오전 1:41' },
      { text: '친구는 붙었대요', at: '오전 1:42' },
      { text: '저만 제자리인 거 같아요', at: '오전 1:43' },
      { text: '아니에요 늦었는데 주무세요', at: '오전 1:44' },
    ],
    hidden: {
      msgs: [
        { text: '아직 안 잤어?', at: '오전 1:52' },
        { text: '떨어진 건 그 회사가 손해야', at: '오전 1:53' },
        { text: '밥 잘 챙겨 먹고 푹 자', at: '오전 1:53' },
        { text: '우리 아덜 힘내!!💪', at: '오전 6:10' },
        { text: '엄마는 우리 아들 믿어^^', at: '오전 6:10' },
      ],
      replies: ['ㅋㅋ 아덜이 뭐예요', '고마워요 엄마 밥 먹고 다시 해볼게요'],
    },
  },
  daughter: {
    who: '아빠',
    night: { text: '밥은 먹었냐', at: '오전 1:40' },
    replies: ['아 죄송해요 지금 봤어요', '맛있게 먹었어요 '],
    vent: [
      { text: '아빠', at: '오전 1:41' },
      { text: '저 또 떨어졌어요ㅠ', at: '오전 1:41' },
      { text: '친구는 붙었대요', at: '오전 1:42' },
      { text: '저만 제자리인 거 같아요', at: '오전 1:43' },
      { text: '아니에요 늦었는데 주무세요!', at: '오전 1:44' },
    ],
    hidden: {
      msgs: [
        { text: '아직 안 자냐', at: '오전 1:55' },
        { text: '떨어진 건 그 회사가 손해다', at: '오전 1:56' },
        { text: '밥 잘 챙겨 먹고 푹 자라', at: '오전 1:56' },
        { text: '우리 딸 힘내!!👍👍', at: '오전 6:02' },
        { text: '아빠는 우리 딸 믿는다^^', at: '오전 6:02' },
      ],
      replies: ['아빠 이모티콘 뭐예요ㅋㅋ', '고마워요 아빠 밥 먹고 다시 해볼게요!'],
    },
  },
}

// 장면 5. 결과 카드 (유형은 dreams[id].type)
export const scene5 = {
  thingCount: (n: number) => `열 살의 나에게 보여 준 물건 ${n}개`,
  proudLabel: '요즘 잘한 일',
  buttons: { kakao: '카카오톡으로 보내기', save: '이미지 저장', others: '다른 유형 구경하기' },
  helpline: '많이 힘들 땐 혼자 버티지 말아요. 자살예방 상담전화 109',
}
