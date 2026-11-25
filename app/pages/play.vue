<script setup lang="ts">
import { dreams, family, landing, scene0, scene1, scene2, scene3, scene4, scene5, wake, type DiaryPaper, type DreamId, type Me, type Story } from '~/data/script'
import type { View } from '~/components/Room.vue'
import type { Msg } from '~/components/Messenger.vue'

// 첫 화면에서 고른 성별 (?me=son|daughter). 없으면 딸
const me: Me = useRoute().query.me === 'son' ? 'son' : 'daughter'
const parent = family[me]
const stories: Story[] = scene0.bed.stories[me]
const things = [...scene2.things, scene2.hobby[me]]
let hidden = false // 숨은 길: 새벽 알림을 눌러 하소연했나

type Mode = 'none' | 'desk' | 'stories' | 'talk' | 'diary' | 'city' | 'sky' | 'wake' | 'result'
type Line = { text: string, me?: boolean } // me: 내 말 (속마음·고른 대답). 화면 아래 자막으로
type Input = { placeholder: string, submit: string, max: number, chips?: string[], label: string }
const ids = Object.keys(dreams) as DreamId[]

const room = reactive({
  me,
  view: 'room' as View,
  laptopClosed: false,
  phoneOn: false,
  starsGlow: 0,
  myStar: false,
  brightness: 0,
  drawer: false,
  morning: false,
})
const desk = reactive({ me, title: '', mails: 0, msgs: [] as Msg[], typing: '', popup: false, picker: '', picked: false })
let onPopup = (_: boolean) => {} // 새벽 알림: true = 누름, false = 닫음
const diary = reactive({ page: 0, paper: {} as DiaryPaper, text: '', stamp: false }) // 그림일기: 일기 글은 저장하거나 보내지 않는다
const city = reactive({ lit: 0, focus: false })
const phone = reactive({ msgs: [] as Msg[], typing: '' })
const ui = reactive({
  mode: 'none' as Mode,
  lines: [] as Line[],
  story: 0,
  eyes: 1, // 0~1, 눈을 뜬 정도 (0 = 감음)
  eyeMove: '0ms', // 이번 눈꺼풀 움직임: 길이와 빠르기 곡선 (CSS transition)
  dark: false, // 꿈속 검은 화면
  tapHint: false,
  more: false, // 꿈속 대화: →를 띄우고 탭을 기다리는 중
  mine: '', // 내가 고른 편지
  writing: false,
  free: '', // 한 줄 더 쓴 글: 어디에도 저장하거나 보내지 않는다
  input: null as Input | null,
  typed: '', // 직접 쓴 꿈 / 부끄러운 일: 저장하거나 보내지 않는다
  prompt: '',
  choices: [] as string[],
  thing: '', // 장면 2: 지금 보여 주는 물건 그림 경로
  objectChoices: [] as string[], // 장면 2: 선택지 순서에 맞춘 물건 그림
  nextLabel: '', // 아무 데나 탭해도 되는 행동(노트북 덮기 등)의 글자. 비면 '다음'
})
const result = reactive({ dream: 'unknown' as DreamId, things: 0, proud: '' })
const sent = { q1: -1, q2: -1, proud: -1, reply: -1 } // 서버로 보낼 고른 답 번호
let dreamName = '' // 일기에 쓸 꿈 이름 (직접 쓴 말일 수 있다)
let forgot = false // 꿈이 기억 안 난다고 했나
const toast = ref('')
const s3 = scene3

// 세이브 포인트: 버튼이 뜨는 순간 그때까지의 대답을 저장하고, 새로고침하면 그 버튼 화면으로 돌아온다.
// sessionStorage라서 탭을 닫으면 지워진다. 필요한 대답이 하나라도 없거나 이상하면 지우고 처음부터.
const SAVES = ['sleep', 'drawer', 'window'] as const // 눈 감기, 서랍 열기, 창밖 보기
type At = typeof SAVES[number]
type Save = { v: 1, at: At, me: Me, hidden: boolean, dream: DreamId, name: string, forgot: boolean, things: number, q1: number, q2: number, proud: number }
const SAVE_KEY = 'when-i-grow-up:save'
function saveAt(at: At) {
  const s: Save = { v: 1, at, me, hidden, dream: result.dream, name: dreamName, forgot, things: result.things, q1: sent.q1, q2: sent.q2, proud: sent.proud }
  try { sessionStorage.setItem(SAVE_KEY, JSON.stringify(s)) } catch {}
}
function clearSave() {
  try { sessionStorage.removeItem(SAVE_KEY) } catch {}
}
const inRange = (n: unknown, len: number) => Number.isInteger(n) && (n as number) >= 0 && (n as number) < len
function load(): Save | null {
  let s: Partial<Save> | null = null
  try { s = JSON.parse(sessionStorage.getItem(SAVE_KEY) ?? 'null') } catch {}
  const at = SAVES.indexOf(s?.at as At)
  const ok = !!s && s.v === 1 && at >= 0 && s.me === me && typeof s.hidden === 'boolean'
    && (at < 1 || (ids.includes(s.dream!) && typeof s.name === 'string' && !!s.name && typeof s.forgot === 'boolean'
      && inRange(s.things, things.length + 1) && inRange(s.q1, s3.q1.answers.length)))
    && (at < 2 || (inRange(s.q2, s3.q2.answers.length) && inRange(s.proud, s3.q3.answers.length)))
  if (ok) return s as Save
  clearSave()
  return null
}

// 저장된 세이브 포인트의 버튼이 떠 있던 화면을 그대로 만든다 (건너뛴 장면들이 남겼을 상태)
function restore(s: Save) {
  hidden = s.hidden
  if (hidden) { // 아침에 밤새 보낸 하소연을 다시 보여 줘야 해서 다시 만든다
    desk.msgs = [{ who: parent.who, text: parent.night.text, time: parent.night.at }, ...parent.vent.map(v => ({ me: true, text: v.text, time: v.at }))]
  }
  Object.assign(room, { laptopClosed: true, phoneOn: false })
  ui.mode = 'talk'
  if (s.at === 'sleep') {
    bgm('night-room')
    Object.assign(room, { view: 'ceiling', starsGlow: 0.6 })
    ui.lines = [{ text: scene0.ceiling.line, me: true }]
    return
  }
  Object.assign(result, { dream: s.dream, things: s.things })
  Object.assign(sent, { q1: s.q1, q2: s.q2, proud: s.proud })
  dreamName = s.name
  forgot = s.forgot
  talk = true
  bgm('diary')
  Object.assign(room, { view: 'room', starsGlow: 0.3, brightness: 1 })
  if (s.at === 'drawer') ui.lines = s3.q1.homework.map(text => ({ text }))
  else {
    result.proud = s3.q3.answers[s.proud]!
    ui.lines = s3.window.ask.map(text => ({ text }))
  }
}

// 세이브 포인트 버튼: 이것만은 아무 데나 탭해도 안 넘어가고 버튼을 눌러야 한다
async function checkpoint(at: At, label: string) {
  saveAt(at)
  await ask([label])
}

// ?fast 를 붙이면 10배 빨리 넘어간다 (개발 확인용)
const speed = useRoute().query.fast === undefined ? 1 : 0.1
let typeDelay = 45
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms * speed))

let answer = (_: number) => {}
function ask(choices: string[], prompt = '') {
  Object.assign(ui, { choices, prompt })
  return new Promise<number>((r) => { answer = r })
}
function pick(i: number) {
  Object.assign(ui, { choices: [], prompt: '' })
  answer(i)
}

let answerInput = (_: string) => {}
function input(opts: Input) {
  Object.assign(ui, { input: opts, typed: '' })
  return new Promise<string>((r) => { answerInput = r })
}
function submitInput() {
  const text = ui.typed.trim()
  Object.assign(ui, { input: null, typed: '' })
  answerInput(text)
}

// 화면 탭: 글자가 써지는 중이면 그 줄을 바로 다 쓰고, 기다리는 중이면 다음으로
let typing = false
let skip = false
let tapNext: (() => void) | null = null
let talk = false // 열 살의 나와 대화하는 동안은 한 줄마다 →를 누르면 넘어간다
function next(label = '') {
  Object.assign(ui, { tapHint: true, nextLabel: label })
  return new Promise<void>((r) => { tapNext = r })
}
function tap() {
  if (typing) skip = true
  else if (tapNext) {
    const go = tapNext
    tapNext = null
    ui.tapHint = false
    go()
  }
}

// 한 글자씩 쓴다. 아이의 말은 흰 손글씨, 내 속마음은 me
async function write(lines: string[], me = false) {
  for (const text of lines) {
    const line = ui.lines[ui.lines.push({ text: '', me }) - 1]!
    typing = true
    skip = false
    for (const ch of text) {
      if (skip) break
      line.text += ch
      if (typeDelay) await sleep(typeDelay)
    }
    line.text = text
    typing = false
    if (talk) {
      ui.more = true
      await new Promise<void>((r) => { tapNext = r })
      ui.more = false
    }
    else await sleep(skip ? 200 : 500)
  }
}
const say = (...lines: string[]) => write(lines)
const think = (...lines: string[]) => write(lines, true)
const said = (text: string) => ui.lines.push({ text, me: true }) // 고른 대답을 내 말로 남긴다

// 그림일기: 쪽을 넘기고, 원고지에 한 글자씩 쓴다 (탭하면 바로 다 쓴다)
async function turnPage(paper: DiaryPaper) {
  Object.assign(diary, { page: diary.page + 1, paper, text: '', stamp: false })
  await sleep(800)
}
async function scribble(text: string) {
  typing = true
  skip = false
  for (const ch of text) {
    if (skip) break
    diary.text += ch
    if (typeDelay) await sleep(typeDelay * 2)
  }
  diary.text = text
  typing = false
  await sleep(600)
}

// 입력창에 한 글자씩 쓰고, 지운다
async function typeInto(target: { typing: string }, text: string) {
  for (const ch of text) {
    target.typing += ch
    await sleep(110)
  }
}
async function erase(target: { typing: string }) {
  while (target.typing) {
    target.typing = [...target.typing].slice(0, -1).join('')
    await sleep(70)
  }
}

// 눈꺼풀: open(0~1)까지 ms 동안 움직이고 끝날 때까지 기다린다
async function eye(open: number, ms: number) {
  // 뜰 때는 끝이 느리게 풀리고, 감을 때는 끝으로 갈수록 빨라진다
  const ease = open > ui.eyes ? 'cubic-bezier(.2,.7,.3,1)' : 'ease-in'
  Object.assign(ui, { eyes: open, eyeMove: `${ms * speed}ms ${ease}` })
  await sleep(ms)
}

// 졸려서 깜빡임이 점점 느려지고 덜 뜨다가 천천히 감긴다
async function closeEyes() {
  await eye(0, 220)
  await eye(0.9, 350)
  await sleep(400)
  await eye(0, 300)
  await eye(0.6, 600)
  await sleep(600)
  await eye(0, 1200)
  await sleep(600)
}

// 처음부터, 또는 저장된 세이브 포인트부터. 장마다 맨 앞이 세이브 포인트 버튼이다
async function story() {
  const s = load()
  const from = s ? SAVES.indexOf(s.at) : -1
  if (s) restore(s)
  else await night()
  if (from < 1) await dream()
  if (from < 2) await diaryScene()
  await outro()
}

async function night() {
  // 장면 0-1. 새벽 1시 40분, 노트북 화면
  const d0 = scene0.desk
  bgm('night-room')
  await sleep(1200)
  room.view = 'screen'
  await sleep(1400)
  ui.mode = 'desk'
  for (let i = 1; i <= d0.mails.length; i++) {
    desk.mails = i
    await next()
  }
  for (const c of d0.chat[me]) {
    if ('me' in c) {
      await typeInto(desk, c.typed)
      await sleep(900) // 멈칫
      await erase(desk)
      await sleep(400)
      desk.picker = c.emoticon // 이모티콘 창을 열고, 고르고, 보낸다
      await sleep(700)
      desk.picked = true
      await sleep(900)
      Object.assign(desk, { picker: '', picked: false })
      desk.msgs.push({ me: true, img: c.emoticon, time: c.at })
    }
    else desk.msgs.push({ who: c.who, text: c.text, time: c.at })
    await next()
  }
  await think(...d0.thoughts)

  // 숨은 길: 부모 알림이 4초 떠 있다. 그 안에 누르면 하소연, 닫거나 놓치면 원래대로
  desk.popup = true
  const timer = setTimeout(() => onPopup(false), 4000) // ?fast여도 누를 틈을 주려고 sleep 대신 실제 4초
  hidden = await new Promise<boolean>((r) => { onPopup = r })
  clearTimeout(timer)
  desk.popup = false
  if (hidden) {
    ui.lines = []
    await sleep(500)
    desk.title = parent.who
    desk.msgs = [{ who: parent.who, text: parent.night.text, time: parent.night.at }]
    for (const v of parent.vent) {
      await next()
      await typeInto(desk, v.text)
      await sleep(300)
      desk.typing = ''
      desk.msgs.push({ me: true, text: v.text, time: v.at, unread: true })
    }
  }
  await sleep(800)
  await next(d0.action)
  ui.lines = []
  ui.mode = 'none'
  room.view = 'room'
  room.laptopClosed = true
  await sleep(1600)

  // 침대에 누워 폰 보기
  room.view = 'bed'
  await sleep(1800)

  // 장면 0-2. 이불 속, 폰
  room.phoneOn = true
  ui.mode = 'stories'
  for (let i = 0; i < stories.length; i++) {
    ui.story = i
    await next()
  }
  ui.mode = 'talk'
  await think(...scene0.bed.thoughts)
  await next(scene0.bed.action)
  ui.lines = []
  ui.mode = 'none'
  room.phoneOn = false

  // 장면 0-3. 천장, 눈 감기
  room.view = 'ceiling'
  await sleep(1800)
  room.starsGlow = 0.6
  ui.mode = 'talk'
  await think(scene0.ceiling.line)
}

async function dream() {
  await checkpoint('sleep', scene0.ceiling.action)
  ui.lines = []
  await closeEyes()
  ui.dark = true
  talk = true

  // 장면 1. 꿈속, 검은 화면
  bgm('dream')
  await sleep(1200)
  // 검은 화면이 다 덮었으니 눈 막을 걷는다. 눈 막은 자막보다 위라서, 감긴 채면 꿈속 대화가 가려진다
  Object.assign(ui, { eyes: 1, eyeMove: '0ms' })
  await say(scene1.hello)
  await think(scene1.who)
  await say(...scene1.intro)
  const h = await ask(scene1.howAreYou.map(a => a.text))
  said(scene1.howAreYou[h]!.text)
  await say(scene1.howAreYou[h]!.reply)
  await sleep(800)
  ui.lines = []
  await say(scene1.askDream)
  await think(scene1.forgot)
  const typed = await input({ ...scene1.input, chips: ids.map(id => dreams[id].label), label: '열 살 때 꿈' })
  const d = matchDream(typed)
  forgot = !typed || /모르|기억|없/.test(typed)
  // 문장으로 적어도 직업 이름만 남긴다: "제빵사가 되고 싶었어" → "제빵사"
  const name = dreamName = forgot ? dreams.unknown.name : typed.replace(/\s*(이|가)?\s*(되고\s*싶|될래|될\s*거|였|이었|요$).*$/, '') || typed
  result.dream = d
  await say(forgot ? scene1.confirmForgot : scene1.confirm(name), scene1.reply)
  await sleep(1000)

  // 꿈속 방이 서서히 보인다
  Object.assign(room, { view: 'room', starsGlow: 0.3 })
  ui.dark = false
  await sleep(1800)

  // 장면 2. 어른 방 구경
  ui.lines = []
  await say(...scene2.intro)
  const left = [...things]
  while (left.length) {
    ui.lines = []
    ui.objectChoices = left.map(t => t.image)
    const i = await ask([...left.map(t => t.name), ...(result.things >= 3 ? [scene2.enough] : [])], scene2.pick)
    ui.objectChoices = []
    if (i === left.length) break
    const t = left.splice(i, 1)[0]!
    ui.thing = t.image
    room.brightness = ++result.things / things.length
    await say(t.ask)
    const a = await ask(t.answers.map(x => x.text))
    said(t.answers[a]!.text)
    await say(t.answers[a]!.reply)
    ui.thing = ''
  }
  room.brightness = 1 // 다 안 보여 주고 끝내도 방은 다 밝힌다
  ui.lines = []
  await say(...scene2.done)
  await sleep(1000)

  // 장면 3-1. 숙제: 아이가 밀린 그림일기를 꺼내 달라고 한다
  bgm('diary')
  ui.lines = []
  await say(s3.q1.question)
  sent.q1 = await ask(s3.q1.answers.map(a => a.text))
  said(s3.q1.answers[sent.q1]!.text)
  await say(s3.q1.answers[sent.q1]!.reply)
  await sleep(800)
  ui.lines = []
  await say(...s3.q1.homework)
}

async function diaryScene() {
  await checkpoint('drawer', s3.q1.action)
  const d = result.dream
  const name = dreamName
  ui.lines = []
  room.view = 'desk'
  await sleep(900)
  room.drawer = true
  await sleep(1200)

  // 3-2. 일기 1쪽: 열 살 때 쓴 꿈
  ui.mode = 'diary'
  // 기억 안 나면 직업 글자만 흐릿하게, 목록에 없는 꿈이면 그림 대신 크레용 글씨
  const page1 = s3.dreamPage.text(name, dreams[d].mind)
  const at = page1.indexOf(name)
  const own = d === 'unknown' && !forgot
  const dreamImage = d === 'unknown' && me === 'daughter'
    ? '/images/drawings/dream-unknown-daughter.webp'
    : `/images/drawings/dream-${d}.webp`
  await turnPage({
    ...s3.dreamPage.paper,
    image: own ? undefined : dreamImage,
    label: own ? name : undefined,
    blur: forgot ? [at, at + name.length] : undefined,
  })
  await scribble(page1)
  await say(...s3.dreamPage.react)
  await sleep(800)
  ui.lines = []
  await say(s3.q2.question)
  sent.q2 = await ask(s3.q2.answers.map(a => a.text))
  said(s3.q2.answers[sent.q2]!.text)
  await say(s3.q2.answers[sent.q2]!.reply)
  await sleep(600)
  await say(s3.still)
  await sleep(1500)

  // 3-3. 일기 2쪽: 부끄러운 날. 고른 일이 일기에 써진다 (직접 쓴 말은 화면에만)
  ui.lines = []
  const m = s3.memories
  await turnPage(s3.shamePage.paper)
  await say(s3.shamePage.react, m.ask)
  const mi = await ask([...m.answers, m.custom.label])
  if (mi < m.answers.length) said(m.answers[mi]!)
  // 직접 쓰기: 치는 대로 일기 칸에 바로 써진다
  const typing3 = mi === m.answers.length
  const stop = typing3 ? watch(() => ui.typed, (t) => { diary.text = t ? s3.shamePage.text(t) : '' }) : undefined
  const shame = typing3 ? await input({ ...m.custom, label: '부끄러웠던 일' }) : s3.shamePage.diary[mi]!
  stop?.()
  ui.lines = []
  diary.text = ''
  if (typing3 && shame) {
    diary.text = s3.shamePage.text(shame)
    await sleep(600)
  }
  else await scribble(s3.shamePage.text(shame || s3.shamePage.diary[0]!))
  for (const chunk of m.outro) {
    ui.lines = []
    await say(...chunk)
    await sleep(700)
  }

  // 3-4. 마지막 쪽: 오늘. 아이가 대신 써 주고 도장을 찍는다 → 위로 B
  ui.lines = []
  await turnPage(s3.todayPage.paper(new Date()))
  await say(s3.todayPage.react, s3.q3.question)
  sent.proud = await ask(s3.q3.answers)
  result.proud = s3.q3.answers[sent.proud]!
  ui.lines = []
  await scribble(s3.todayPage.text(result.proud))
  await say(...s3.q3.reply)
  await sleep(800)
  ui.lines = []
  await say(s3.stamp[0]!)
  await sleep(500)
  diary.stamp = true
  navigator.vibrate?.(30)
  await sleep(900)
  await say(s3.stamp[1]!)
  await sleep(800)
  for (const chunk of s3.comfortHonest) {
    ui.lines = []
    await say(...chunk)
    await sleep(800)
  }
  ui.lines = []
  ui.mode = 'talk' // 일기장을 덮는다
  room.drawer = false
  await sleep(600)

  // 3-5. 창밖: 불이 하나씩 켜지고, 그 불빛을 보며 위로 A
  await say(...s3.window.ask)
}

async function outro() {
  await checkpoint('window', s3.window.action)
  ui.lines = []
  room.view = 'window'
  await sleep(1400)
  Object.assign(city, { lit: 0, focus: false })
  ui.mode = 'city'
  await sleep(1000)
  await Promise.all([say(...s3.windows), (async () => {
    for (let i = 1; i <= s3.window.spots.length; i++) {
      city.lit = i
      await sleep(260)
    }
  })()])
  city.focus = true
  await sleep(1400)
  ui.lines = []
  await say(...s3.comfortLight)
  await sleep(1200)

  // 장면 4. 별 편지
  ui.lines = []
  await say(...scene4.intro)
  sent.reply = await ask(scene4.replies)
  Object.assign(ui, { lines: [], mine: scene4.replies[sent.reply]!, writing: true })
  await say(...scene4.fold)
  await ask([scene4.action])
  // ui.free(한 줄 더 쓴 글)는 보내지 않는다. 전송이 실패해도 이야기는 계속된다
  $fetch('/api/letters', { method: 'POST', body: { dream: result.dream, things: result.things, ...sent } }).catch(() => {})
  Object.assign(ui, { writing: false, free: '', mine: '', lines: [], mode: 'sky' })
  room.view = 'sky'
  await sleep(3500)
  await say(...scene4.farewell(parent.who))
  talk = false
  await sleep(1500)

  // 깨어남: 아침, 어젯밤 부모 메시지에 이제야 답한다. 숨은 길이면 밤새 온 답장이 쌓여 있다
  ui.lines = []
  ui.mode = 'none'
  bgm('morning')
  await eye(0, 900)
  // 잠들 때 본 천장으로 눈을 뜬다. 야광별 하나만 편지 별 색으로 환하다
  Object.assign(room, { view: 'ceiling', morning: true, starsGlow: 0.2, myStar: true })
  await sleep(2400) // 하늘에서 천장까지 카메라가 다 내려온 뒤에 눈을 뜬다 (1.2초면 눈 뜨는 동안 화면이 미끄러진다)
  // 잠결: 실눈 → 다시 감김 → 천천히 다 뜬다
  await eye(0.25, 700)
  await sleep(500)
  await eye(0, 250)
  await sleep(300)
  await eye(1, 1400)
  await sleep(3000)
  room.view = 'bed'
  await sleep(1500)
  phone.msgs = hidden
    ? [...desk.msgs.map(m => ({ ...m, unread: false })), ...parent.hidden.msgs.map(m => ({ who: parent.who, text: m.text, time: m.at }))]
    : [{ who: parent.who, text: parent.night.text, time: parent.night.at }]
  ui.mode = 'wake'
  await next()
  for (const text of hidden ? parent.hidden.replies : parent.replies) {
    await typeInto(phone, text)
    await sleep(300)
    phone.typing = ''
    phone.msgs.push({ me: true, text, time: wake.alarm })
    await sleep(700)
  }
  await sleep(1500)

  // 장면 5. 결과
  clearSave()
  ui.mode = 'result'
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) typeDelay = 0
  story()
})

const nextType = computed(() => ids[(ids.indexOf(result.dream) + 1) % ids.length])
const story0 = computed(() => stories[ui.story]!)
// 아이 말은 가운데, 내 말은 아래. 아이 말 최근 2줄과 그 사이의 내 말만 보인다 (기록을 쌓지 않는다)
const view = computed(() => {
  const lines = ui.lines.map((l, i) => ({ ...l, i }))
  const cut = lines.filter(l => !l.me).at(-3)?.i ?? -1
  const shown = lines.slice(cut + 1)
  return { kid: shown.filter(l => !l.me), mine: shown.filter(l => l.me).slice(-2), lastMe: !!lines.at(-1)?.me }
})
const showPanel = computed(() => ['desk', 'talk', 'stories', 'diary', 'city'].includes(ui.mode) && (ui.lines.length || ui.choices.length || ui.input || ui.writing || ui.mine))

// shortcut: 휴대폰 공유 창(Web Share)으로 보낸다, 카카오 앱 키를 받으면 카카오 공유 템플릿으로 바꾼다
async function share() {
  const url = `${location.origin}/result/${result.dream}`
  if (navigator.share) return navigator.share({ title: landing.title, text: `나는 ${dreams[result.dream].type.name}래요.`, url }).catch(() => {}) // 공유 창을 닫아도 그냥 둔다
  await navigator.clipboard.writeText(url)
  toast.value = '링크를 복사했어요'
}
const save = () => saveCard(result.dream, result.things, result.proud)
</script>

<template>
  <main class="play" @click="tap">
    <TresCanvas clear-color="#0b1020">
      <Room v-bind="room" />
    </TresCanvas>

    <Desktop v-if="ui.mode === 'desk'" v-bind="desk" @open="onPopup(true)" @dismiss="onPopup(false)" />

    <section v-if="ui.mode === 'stories'" class="stories" :class="{ regram: !!story0.repost }" :style="story0.repost ? {} : { backgroundImage: `url(${story0.image})` }" aria-label="친구들의 스토리">
      <div class="bars">
        <span v-for="(s, i) in stories" :key="s.who" :class="{ done: i < ui.story, now: i === ui.story }" />
      </div>
      <header><img class="avatar" :src="story0.avatar" alt="" />{{ story0.who }}</header>
      <div v-if="story0.repost" class="repost-card" :style="{ backgroundImage: `url(${story0.image})` }">
        <div class="repost-header"><img :src="story0.repost.avatar" alt="" />{{ story0.repost.who }}</div>
        <div class="repost-original"><strong>{{ story0.repost.headline }} 💐</strong><span>{{ story0.repost.caption }}</span></div>
        <span class="repost-tag">{{ '@' + story0.who }}</span>
      </div>
      <div class="story-sticker" :class="story0.layout">
        <div class="story-title">
          <strong class="story-headline">{{ story0.headline }}</strong>
          <span class="story-emoji" aria-hidden="true">{{ story0.emoji }}</span>
        </div>
        <span v-if="story0.caption" class="story-caption">{{ story0.caption }}</span>
      </div>
    </section>

    <section v-if="ui.mode === 'wake'" class="phone" aria-label="아침 휴대폰">
      <p class="alarm">{{ wake.alarm }}</p>
      <Messenger :title="parent.who" :msgs="phone.msgs" :typing="phone.typing" />
    </section>

    <div v-if="ui.mode === 'diary'" class="diary-wrap">
      <Transition name="flip" mode="out-in">
        <Diary :key="diary.page" v-bind="diary.paper" :text="diary.text" :stamp="diary.stamp" />
      </Transition>
    </div>

    <Transition name="fade">
      <CityWindow v-if="ui.mode === 'city'" v-bind="city" />
    </Transition>

    <Transition name="fade">
      <img v-if="ui.thing" class="thing" :src="ui.thing" alt="" aria-hidden="true">
    </Transition>

    <div class="dark" :class="{ on: ui.dark }" />
    <div class="eye" :style="{ '--open': ui.eyes, '--move': ui.eyeMove }" aria-hidden="true" />

    <div v-if="ui.mode === 'sky'" class="sky">
      <p v-for="(line, i) in ui.lines" :key="i">{{ line.text }}</p>
      <button v-if="ui.more" class="more" aria-label="다음" @click.stop="tap">→</button>
    </div>

    <div v-if="showPanel" class="panel" :class="{ below: ui.mode === 'diary' || ui.mode === 'city' }">
      <div class="kid" aria-live="polite">
        <p v-for="l in view.kid" :key="l.i" :class="{ old: l !== view.kid.at(-1) }">{{ l.text }}</p>
        <button v-if="ui.more && !view.lastMe" class="more" aria-label="다음" @click.stop="tap">→</button>
      </div>

      <div class="bottom">
        <div v-if="view.mine.length && ui.choices.length < 2 && !ui.input" class="said" aria-live="polite">
          <p v-for="l in view.mine" :key="l.i" :class="{ old: l !== view.mine.at(-1) }">{{ l.text }}</p>
          <button v-if="ui.more && view.lastMe" class="more" aria-label="다음" @click.stop="tap">→</button>
        </div>

        <article v-if="ui.mine || ui.writing" class="letter">
          <p v-if="ui.mine" class="mine">{{ ui.mine }}</p>
          <input
            v-if="ui.writing"
            v-model="ui.free"
            class="mine"
            :maxlength="scene4.freeLine.max"
            :placeholder="scene4.freeLine.placeholder"
            aria-label="열 살의 나에게 한 줄 더 쓰기"
          >
        </article>

        <form v-if="ui.input" class="answer" @submit.prevent="submitInput">
          <p class="answer-label">{{ ui.input.label }}</p>
          <div class="field">
            <input v-model="ui.typed" :maxlength="ui.input.max" :placeholder="ui.input.placeholder" :aria-label="ui.input.label" autocomplete="off">
            <button>{{ ui.input.submit }}</button>
          </div>
          <div v-if="ui.input.chips" class="chips">
            <button v-for="c in ui.input.chips" :key="c" type="button" :class="{ on: ui.typed === c }" @click="ui.typed = c">{{ c }}</button>
          </div>
        </form>

        <p v-if="ui.prompt" class="prompt">{{ ui.prompt }}</p>
        <div v-if="ui.choices.length > 1" class="choices">
          <button v-for="(c, i) in ui.choices" :key="c" :style="{ animationDelay: `${i * 60}ms` }" @click.stop="pick(i)">
            <img v-if="ui.objectChoices[i]" class="object-option" :src="ui.objectChoices[i]" alt="" aria-hidden="true">
            <span>{{ c }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 진행 버튼은 하나: 행동(노트북 덮기 등)이면 그 말, 아니면 다음 -->
    <button v-if="ui.choices.length === 1 || ui.tapHint" class="next" :class="{ hint: ui.choices.length !== 1 }" @click.stop="ui.choices.length === 1 ? pick(0) : tap()">
      {{ ui.choices.length === 1 ? ui.choices[0] : ui.nextLabel || '다음' }} <span class="arrow" aria-hidden="true">→</span>
    </button>

    <section v-if="ui.mode === 'result'" class="result ending-backdrop">
      <ResultCard :id="result.dream" :things="result.things" :proud="result.proud" />
      <div class="actions">
        <button class="primary" @click="share">{{ scene5.buttons.kakao }}</button>
        <button @click="save">{{ scene5.buttons.save }}</button>
        <NuxtLink :to="`/result/${nextType}`">{{ scene5.buttons.others }}</NuxtLink>
      </div>
      <p v-if="toast" role="status" class="toast">{{ toast }}</p>
      <a v-if="scene5.coffee.url" class="coffee" :href="scene5.coffee.url" target="_blank" rel="noopener">{{ scene5.coffee.label }}</a>
      <a class="help" href="tel:109">{{ scene5.helpline }}</a>
    </section>
  </main>
</template>

<style scoped>
.play { position: fixed; inset: 0; overflow: clip; }

/* 꿈속 검은 화면과 눈꺼풀 */
.dark { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity 1.2s; }
.dark.on { opacity: 1; }
/* 눈: 화면 전체를 덮는 검은 그림자 가운데 타원 구멍. 높이만 줄여서, 감으면 가로 한 줄로 닫힌다.
   scaleY로 줄이면 그림자까지 납작해져 화면이 드러나서 height를 움직인다. 자막·버튼보다 위에 둔다 */
.eye {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 20;
  width: 170vmax;
  height: calc(120vmax * var(--open));
  border-radius: 50%;
  box-shadow: 0 0 6vmin 300vmax #000;
  transform: translate(-50%, -50%);
  transition: height var(--move);
  pointer-events: none;
}

.panel {
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 16px 16px 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none; /* 빈 곳 탭은 아래 장면으로 */
  gap: 12px;
  /* 아래 자막이 밝은 화면(노트북·폰) 위에서도 읽히게 바닥만 살짝 어둡게 */
  background: linear-gradient(transparent 55%, rgb(0 0 0 / 0.5));
  animation: fade-in 0.6s both;
}
.panel button, .panel input { pointer-events: auto; }
/* 가운데: 열 살의 나. 박스 없이 장면 위에 손글씨로 */
.kid {
  flex: 1;
  width: min(100%, 460px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: #fbf8f1;
  font-family: Gaegu, cursive;
  font-size: 1.6rem;
  line-height: 1.45;
  text-shadow: 0 2px 14px rgb(0 0 0 / 0.95), 0 0 3px rgb(0 0 0 / 0.8);
}
/* 아래: 나. 영화 자막처럼 */
.bottom { width: min(100%, 460px); display: flex; flex-direction: column; gap: 12px; }
.said {
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 2px 10px rgb(0 0 0 / 0.95), 0 0 2px rgb(0 0 0 / 0.8);
}
.kid p, .said p { margin: 0 0 6px; transition: opacity 0.5s; animation: pop 0.4s both; }
.kid .old, .said .old { opacity: 0.4; }
.kid .more, .said .more { margin: 0 auto; }
/* 그림일기와 창밖: 그림은 가운데 위, 대사는 다른 장면처럼 아래 자막 */
.panel.below { justify-content: flex-end; }
.below .kid { flex: none; }
.diary-wrap { position: absolute; inset: max(16px, 6dvh) 0 auto; z-index: 2; display: flex; justify-content: center; }
/* 아래 대사·선택지 자리를 남기게 일기를 화면 높이에 맞춰 줄인다 */
.diary-wrap :deep(.diary) { width: min(calc(100vw - 32px), 360px, 34dvh); }
@media (min-aspect-ratio: 1/1) and (min-width: 800px) {
  .diary-wrap :deep(.diary) { width: min(400px, 40dvh); }
}
/* 장면 2: 보여 주는 물건이 대사 위에 둥실 뜬다 */
.thing { position: absolute; top: 7dvh; left: 50%; z-index: 2; width: min(32vw, 24dvh, 180px); aspect-ratio: 1; object-fit: contain; translate: -50% 0; filter: drop-shadow(0 6px 18px rgb(255 207 138 / 0.35)); animation: bob 2.4s ease-in-out infinite; pointer-events: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 1.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.letter {
  width: min(100%, 420px);
  max-height: 46dvh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px 22px;
  border: 0;
  border-radius: 18px;
  background: rgb(8 10 22 / 0.6);
  backdrop-filter: blur(12px);
  color: #fbf8f1;
  font-family: Gaegu, cursive;
  font-size: 1.35rem;
  line-height: 1.5;
  animation: pop 0.5s both;
}
/* 대사 넘기기 →: 오른쪽 아래에서 살짝 움직인다 */
.more { display: block; margin: 0 0 0 auto; padding: 0 4px; border: 0; background: none; color: inherit; font: inherit; font-size: 1rem; cursor: pointer; animation: nudge 1.4s ease-in-out infinite; }
.letter .mine { margin: 0 0 12px; color: #ffcf8a; }
.letter input.mine {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  background: transparent;
  font: inherit;
  color: #ffcf8a;
}

/* 선택지 */
.prompt { margin: 0; padding: 6px 14px; border-radius: 999px; background: rgb(0 0 0 / 0.5); font-style: italic; text-align: center; }
.choices { width: min(100%, 420px); display: grid; gap: 8px; }
.choices button, .answer button, .actions > * {
  font: inherit;
  color: #f4f2ec;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, transform 0.1s, border-color 0.15s;
}
.choices button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 18px;
  border: 0;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(10px);
  text-align: left;
  animation: pop 0.35s both;
}
.object-option { flex: none; width: 32px; height: 32px; object-fit: contain; }
.choices button:hover { background: rgb(255 255 255 / 0.2); }
.choices button:active, .answer button:active, .actions > *:active { transform: scale(0.98); }
.actions .primary, .answer .field button {
  padding: 14px 28px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.18);
  backdrop-filter: blur(8px);
  color: #fff;
  font-weight: 700;
  text-align: center;
}
button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

/* 직접 쓰기 + 추천 칩: 유리 카드 한 장 안에 제목·입력·칩 */
.answer {
  width: min(100%, 420px);
  box-sizing: border-box;
  display: grid;
  gap: 16px;
  padding: 20px;
  border: 0;
  border-radius: 28px;
  background: rgb(14 12 22 / 0.6);
  backdrop-filter: blur(20px);
  animation: pop 0.35s both;
}
.answer-label { margin: 0; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; color: rgb(255 255 255 / 0.6); text-align: center; }
/* 입력과 버튼을 알약 하나로 묶는다 */
.field {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 6px 6px 20px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
  transition: background 0.2s;
}
.field:focus-within { background: rgb(255 255 255 / 0.12); }
.field input { flex: 1; min-width: 0; padding: 8px 0; border: 0; background: none; color: #fff; caret-color: #fff; font: inherit; font-size: 1.05rem; }
.field input::placeholder { color: rgb(255 255 255 / 0.35); }
.field input:focus-visible { outline: none; } /* 포커스는 .field 배경이 밝아지는 걸로 보인다 */
.answer .field button { padding: 10px 20px; font-size: 0.95rem; }
.chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.chips button {
  padding: 10px 4px;
  border: 0;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.05);
  color: rgb(255 255 255 / 0.8);
  font-size: 0.9rem;
  white-space: nowrap;
}
.chips button:hover { background: rgb(255 255 255 / 0.1); color: #fff; }
.chips button.on { background: rgb(255 255 255 / 0.22); color: #fff; }

/* 이불 속 인스타 스토리 */
.stories {
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(100%, 420px);
  height: min(100%, 760px);
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  box-sizing: border-box;
  overflow: hidden;
  color: #fff;
  background-color: #14182a;
  background-position: center;
  background-size: cover;
  text-shadow: 0 1px 6px rgb(0 0 0 / 0.35);
}
.stories::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 0 0 / 0.5), transparent 22%, transparent 60%, rgb(0 0 0 / 0.62));
  pointer-events: none;
}
.stories .bars, .stories header { position: relative; z-index: 2; }
.bars { display: flex; gap: 4px; }
.bars span { flex: 1; height: 3px; border-radius: 2px; background: rgb(255 255 255 / 0.35); }
.bars .done { background: #fff; }
.bars .now { background: linear-gradient(90deg, #fff 50%, rgb(255 255 255 / 0.35) 50%); }
.stories header { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 0.9rem; font-weight: 600; }
.stories .avatar { flex: none; width: 32px; height: 32px; border: 2px solid rgb(255 255 255 / 0.85); border-radius: 50%; background: #d7dce4; object-fit: cover; }
.stories.regram { background-image: radial-gradient(circle at 50% 45%, #58413e, #161a28 75%); }
.repost-card {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: min(72vw, 42dvh, 420px);
  aspect-ratio: 9 / 16;
  transform: translate(-50%, -50%) rotate(-2deg);
  border: 7px solid #151820;
  border-radius: 12px;
  background-position: center;
  background-size: cover;
  box-shadow: 0 16px 44px rgb(0 0 0 / 0.55);
  overflow: hidden;
}
.repost-header { position: absolute; inset: 0 0 auto; display: flex; align-items: center; gap: 6px; padding: 10px; background: linear-gradient(rgb(0 0 0 / 0.55), transparent); color: #fff; font-size: 0.8rem; font-weight: 700; text-shadow: 0 1px 5px #000; }
.repost-header img { width: 23px; height: 23px; border-radius: 50%; background: #ddd; }
.repost-original { position: absolute; top: 29%; right: 5%; display: grid; gap: 4px; padding: 8px 10px; border-radius: 6px; background: rgb(5 5 7 / 0.9); color: #fff; text-align: right; font-size: clamp(0.8rem, 2.8vw, 1.1rem); font-weight: 700; }
.repost-tag { position: absolute; bottom: 13%; left: 7%; padding: 5px 9px; border-radius: 4px; background: #fff; color: #20202a; font-size: 0.85rem; font-weight: 700; transform: rotate(-5deg); }
.story-sticker {
  position: absolute;
  z-index: 1;
  width: max-content;
  max-width: calc(100% - 40px);
  box-sizing: border-box;
  padding: 14px 17px 15px;
  border-radius: 9px;
  background: rgb(5 5 7 / 0.96);
  box-shadow: 0 6px 20px rgb(0 0 0 / 0.4);
  pointer-events: none;
  font-family: system-ui, sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.25;
  word-break: keep-all;
  overflow-wrap: break-word;
  white-space: pre-line;
  color: #fff;
  text-shadow: none;
}
.story-title { display: flex; align-items: center; gap: 10px; }
.story-headline { display: block; min-width: 0; font-size: inherit; font-weight: inherit; line-height: inherit; }
.story-emoji { flex: none; width: 1.25em; height: 1.25em; display: grid; place-items: center; font-size: inherit; line-height: 1; }
.story-caption { display: block; margin-top: 8px; font-size: inherit; font-weight: inherit; line-height: inherit; }
.story-sticker.office { top: 24%; left: 6%; transform: rotate(-5deg); }
.story-sticker.travel {
  right: 5%;
  bottom: 10%;
  text-align: right;
  transform: rotate(-3deg);
}
.story-sticker.travel-arrival { top: 24%; left: 6%; transform: rotate(-3deg); }
.story-sticker.travel .story-title, .story-sticker.anniversary .story-title { justify-content: flex-end; }
.story-sticker.anniversary { top: 31%; right: 5%; text-align: right; transform: rotate(5deg); }
.story-sticker.regram { top: 69%; left: 50%; z-index: 3; transform: translateX(-50%) rotate(5deg); background: #fff; color: #20202a; white-space: nowrap; }
.story-sticker.wedding { left: 5%; bottom: 14%; transform: rotate(-4deg); }
.story-sticker.bodyprofile { top: 54%; left: 50%; text-align: center; transform: translate(-50%, -50%) rotate(-4deg); }
.story-sticker.bodyprofile .story-title { justify-content: center; }

/* 아침 휴대폰 */
.phone { position: absolute; inset: 0; margin: auto; width: min(calc(100% - 32px), 380px); height: min(70%, 560px); display: flex; flex-direction: column; gap: 12px; }
.phone .alarm { margin: 0; text-align: center; font-size: 2.6rem; font-weight: 300; color: #fff; text-shadow: 0 2px 10px rgb(0 0 0 / 0.5); }
.phone :deep(.messenger) { flex: 1; }

/* 진행 버튼: 배경 없이 글자와 화살표만. 꼭 눌러야 하는 버튼(세이브 포인트 등)은 밑줄로 구별한다 */
.next {
  position: absolute;
  left: 50%;
  bottom: 56px;
  z-index: 4;
  translate: -50% 0;
  padding: 8px 12px;
  border: 0;
  background: none;
  color: #fff;
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-decoration: underline 1px rgb(255 255 255 / 0.6);
  text-underline-offset: 6px;
  text-shadow: 0 1px 8px rgb(0 0 0 / 0.9); /* 밝은 화면(폰 불빛) 위에서도 읽히게 */
  opacity: 0.9;
  cursor: pointer;
  transition: opacity 0.2s;
  animation: pop 0.35s both;
}
.next:hover { opacity: 1; }
.next:active { scale: 0.98; }
.next.hint { font-size: 0.95rem; font-weight: 500; text-decoration: none; opacity: 0.85; }
.next .arrow { display: inline-block; margin-left: 4px; }
.next.hint .arrow { animation: nudge 1.4s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateX(5px); } }
@keyframes bob { 50% { transform: translateY(-8px); } }

.sky {
  position: absolute;
  inset: 0;
  height: fit-content;
  margin: auto;
  text-align: center;
  font-family: Gaegu, cursive;
  width: min(calc(100% - 32px), 460px);
  padding: 20px 22px;
  box-sizing: border-box;
  border-radius: 18px;
  background: rgb(0 0 0 / 0.6);
  backdrop-filter: blur(8px);
  font-size: 1.6rem;
  line-height: 1.5;
}
.sky p { margin: 0 0 8px; }
.sky p:last-child { margin: 0; }

.result {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 24px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: safe center; /* safe: 화면이 작아 넘치면 위가 잘리지 않게 위쪽부터 */
  gap: 14px;
  animation: pop 0.6s both;
}
/* 카드가 먼저 떠오르고, 버튼들이 뒤따라 나타난다 */
.result > .actions { animation: pop 0.6s 0.7s both; }
.result > .coffee, .result > .help { animation: pop 0.6s 1s both; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.actions > * { padding: 10px 16px; border: 0; border-radius: 999px; background: rgb(255 255 255 / 0.12); backdrop-filter: blur(8px); }
.actions > *:hover { background: rgb(255 255 255 / 0.24); }
.toast { margin: 0; font-size: 0.9rem; }
/* 세이브 포인트 알림: 오른쪽 위 소리 버튼과 겹치지 않게 왼쪽 위 */
.saved { position: absolute; top: 20px; left: 16px; z-index: 21; margin: 0; color: #fff; font-size: 0.8rem; opacity: 0.75; text-shadow: 0 1px 6px rgb(0 0 0 / 0.9); pointer-events: none; }
.coffee {
  color: #ffe2b0;
  font-family: Gaegu, cursive;
  font-size: 1rem;
  text-decoration: none;
  padding: 4px 12px;
  border-bottom: 1px dashed rgb(255 226 176 / 0.4);
  opacity: 0.85;
  transition: opacity 0.15s, transform 0.15s;
}
.coffee:hover { opacity: 1; transform: translateY(-1px); }
.help { color: inherit; opacity: 0.7; font-size: 0.8rem; text-align: center; }

@keyframes pop { from { opacity: 0; transform: translateY(8px); } }
@keyframes fade-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .panel, .kid p, .said p, .letter, .choices button, .answer, .result, .result > *, .next, .next.hint .arrow, .more { animation: none; }
  .dark, .eye { transition: none; }
}
</style>
