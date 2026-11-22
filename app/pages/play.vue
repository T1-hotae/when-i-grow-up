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
type Line = { text: string, me?: boolean } // me: 내 속마음 (괄호, 회색)
type Input = { placeholder: string, submit: string, max: number, chips?: string[], label: string }
const ids = Object.keys(dreams) as DreamId[]

const room = reactive({
  me,
  view: 'room' as View,
  laptopClosed: false,
  phoneOn: false,
  starsGlow: 0,
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
  eyes: false, // true = 눈 감음
  dark: false, // 꿈속 검은 화면
  tapHint: false,
  more: false, // 꿈속 대화: →를 띄우고 탭을 기다리는 중
  mine: '', // 내가 고른 답장
  writing: false,
  free: '', // 한 줄 더 쓴 글: 어디에도 저장하거나 보내지 않는다
  input: null as Input | null,
  typed: '', // 직접 쓴 꿈 / 부끄러운 일: 저장하거나 보내지 않는다
  prompt: '',
  choices: [] as string[],
  thing: '', // 장면 2: 지금 보여 주는 물건 (이모지)
})
const result = reactive({ dream: 'unknown' as DreamId, things: 0, proud: '' })
const sent = { q1: -1, q2: -1, proud: -1, reply: -1 } // 서버로 보낼 고른 답 번호
const toast = ref('')
const letter = ref<HTMLElement>()

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
function next() {
  ui.tapHint = true
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
watch(() => ui.lines.map(l => l.text.length).join(), () => nextTick(() => letter.value?.scrollTo(0, letter.value.scrollHeight)))

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

// 눈꺼풀: 두 번 천천히 깜빡이다 감는다
async function closeEyes() {
  for (const ms of [450, 550]) {
    ui.eyes = true
    await sleep(ms)
    ui.eyes = false
    await sleep(ms)
  }
  ui.eyes = true
  await sleep(900)
}

async function story() {
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
  await ask([d0.action])
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
  await ask([scene0.bed.action])
  ui.lines = []
  ui.mode = 'none'
  room.phoneOn = false

  // 장면 0-3. 천장, 눈 감기
  room.view = 'ceiling'
  await sleep(1800)
  room.starsGlow = 0.6
  ui.mode = 'talk'
  await think(scene0.ceiling.line)
  await ask([scene0.ceiling.action])
  ui.lines = []
  await closeEyes()
  ui.dark = true
  talk = true

  // 장면 1. 꿈속, 검은 화면
  bgm('dream')
  await sleep(1200)
  await say(scene1.hello)
  await think(scene1.who)
  await say(...scene1.intro)
  const h = await ask(scene1.howAreYou.map(a => a.text))
  await say(scene1.howAreYou[h]!.reply)
  await sleep(800)
  ui.lines = []
  await say(scene1.askDream)
  await think(scene1.forgot)
  const typed = await input({ ...scene1.input, chips: ids.map(id => dreams[id].label), label: '열 살 때 꿈' })
  const d = matchDream(typed)
  const forgot = !typed || /모르|기억|없/.test(typed)
  const name = forgot ? dreams.unknown.name : typed
  result.dream = d
  await say(scene1.confirm(name), scene1.reply)
  await sleep(1000)

  // 꿈속 방이 서서히 보인다
  Object.assign(room, { view: 'room', starsGlow: 0.3 })
  ui.eyes = false
  ui.dark = false
  await sleep(1800)

  // 장면 2. 어른 방 구경
  ui.lines = []
  await say(...scene2.intro)
  const left = [...things]
  while (left.length) {
    ui.lines = []
    const i = await ask([...left.map(t => `${t.emoji} ${t.name}`), ...(result.things >= 3 ? [scene2.enough] : [])], scene2.pick)
    if (i === left.length) break
    const t = left.splice(i, 1)[0]!
    ui.thing = t.emoji
    room.brightness = ++result.things / things.length
    await say(t.ask)
    const a = await ask(t.answers.map(x => x.text))
    await say(t.answers[a]!.reply)
    ui.thing = ''
  }
  room.brightness = 1 // 다 안 보여 주고 끝내도 방은 다 밝힌다
  ui.lines = []
  await say(...scene2.done)
  await sleep(1000)

  // 장면 3-1. 숙제: 아이가 밀린 그림일기를 꺼내 달라고 한다
  const s3 = scene3
  bgm('diary')
  ui.lines = []
  await say(s3.q1.question)
  sent.q1 = await ask(s3.q1.answers.map(a => a.text))
  await say(s3.q1.answers[sent.q1]!.reply)
  await sleep(800)
  ui.lines = []
  await say(...s3.q1.homework)
  await ask([s3.q1.action])
  ui.lines = []
  room.view = 'desk'
  await sleep(900)
  room.drawer = true
  await sleep(1200)

  // 3-2. 일기 1쪽: 열 살 때 쓴 꿈
  ui.mode = 'diary'
  await turnPage({ ...s3.dreamPage.paper, image: `/images/drawings/dream-${d}.webp` })
  await scribble(s3.dreamPage.text(name, dreams[d].mind))
  await say(...s3.dreamPage.react)
  await sleep(800)
  ui.lines = []
  await say(s3.q2.question)
  sent.q2 = await ask(s3.q2.answers.map(a => a.text))
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
  const shame = mi < m.answers.length ? s3.shamePage.diary[mi]! : await input({ ...m.custom, label: '부끄러웠던 일' })
  ui.lines = []
  await scribble(s3.shamePage.text(shame || s3.shamePage.diary[0]!))
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
  await ask([s3.window.action])
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

  // 장면 4. 답장
  ui.lines = []
  await say(...scene4.intro)
  sent.reply = await ask(scene4.replies)
  ui.mine = scene4.replies[sent.reply]!
  ui.writing = true
  await ask([scene4.action])
  // ui.free(한 줄 더 쓴 글)는 보내지 않는다. 전송이 실패해도 이야기는 계속된다
  $fetch('/api/letters', { method: 'POST', body: { dream: d, things: result.things, ...sent } }).catch(() => {})
  Object.assign(ui, { writing: false, free: '', mine: '', lines: [], mode: 'sky' })
  room.view = 'sky'
  await sleep(3500)
  await say(...scene4.farewell(parent.who))
  talk = false
  await sleep(1500)

  // 깨어남: 아침, 어젯밤 부모 메시지에 이제야 답한다. 숨은 길이면 밤새 온 답장이 쌓여 있다
  ui.lines = []
  ui.mode = 'none'
  ui.eyes = true
  bgm('morning')
  await sleep(900)
  Object.assign(room, { view: 'bed', morning: true, starsGlow: 0.2 })
  await sleep(1200)
  ui.eyes = false
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
  ui.mode = 'result'
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) typeDelay = 0
  story()
})

const nextType = computed(() => ids[(ids.indexOf(result.dream) + 1) % ids.length])
const story0 = computed(() => stories[ui.story]!)
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
      <p v-if="ui.thing" class="thing" aria-hidden="true">{{ ui.thing }}</p>
    </Transition>

    <div class="dark" :class="{ on: ui.dark }" />
    <div class="lid top" :class="{ shut: ui.eyes }" />
    <div class="lid bottom" :class="{ shut: ui.eyes }" />

    <div v-if="ui.mode === 'sky'" class="sky">
      <p v-for="(line, i) in ui.lines" :key="i">{{ line.text }}</p>
      <button v-if="ui.more" class="more" aria-label="다음" @click.stop="tap">→</button>
    </div>

    <div v-if="showPanel" class="panel" :class="{ below: ui.mode === 'diary' || ui.mode === 'city', side: ui.mode === 'diary' }">
      <article v-if="ui.lines.length || ui.mine || ui.writing" ref="letter" class="letter" :class="{ bare: ui.dark }" aria-live="polite">
        <p v-for="(line, i) in ui.lines" :key="i" :class="{ me: line.me }">{{ line.text }}</p>
        <button v-if="ui.more" class="more" aria-label="다음" @click.stop="tap">→</button>
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
          {{ c }}
        </button>
      </div>
    </div>

    <!-- 진행 버튼은 하나: 행동(노트북 덮기 등)이면 그 말, 아니면 다음 -->
    <button v-if="ui.choices.length === 1 || ui.tapHint" class="next" :class="{ hint: ui.choices.length !== 1 }" @click.stop="ui.choices.length === 1 ? pick(0) : tap()">
      {{ ui.choices.length === 1 ? ui.choices[0] : '다음' }} <span class="arrow" aria-hidden="true">→</span>
    </button>

    <section v-if="ui.mode === 'result'" class="result">
      <ResultCard :id="result.dream" :things="result.things" :proud="result.proud" />
      <div class="actions">
        <button class="primary" @click="share">{{ scene5.buttons.kakao }}</button>
        <button @click="save">{{ scene5.buttons.save }}</button>
        <NuxtLink :to="`/result/${nextType}`">{{ scene5.buttons.others }}</NuxtLink>
      </div>
      <p v-if="toast" role="status" class="toast">{{ toast }}</p>
      <a class="help" href="tel:109">{{ scene5.helpline }}</a>
    </section>
  </main>
</template>

<style scoped>
.play { position: fixed; inset: 0; overflow: clip; }

/* 꿈속 검은 화면과 눈꺼풀 */
.dark { position: absolute; inset: 0; background: #000; opacity: 0; pointer-events: none; transition: opacity 1.2s; }
.dark.on { opacity: 1; }
/* 눈꺼풀 가장자리를 타원으로 파서, 둘 사이 틈이 아몬드(눈) 모양이 되게 한다. 감으면 가운데에서 딱 맞물린다 */
.lid { position: absolute; left: 0; right: 0; height: 100%; pointer-events: none; transition: transform 0.45s ease-in-out; }
.lid.top { top: 0; transform: translateY(-100%); background: radial-gradient(60% 30% at 50% 100%, transparent 98%, #000 100%); }
.lid.bottom { bottom: 0; transform: translateY(100%); background: radial-gradient(60% 30% at 50% 0%, transparent 98%, #000 100%); }
.lid.top.shut { transform: translateY(-20%); }
.lid.bottom.shut { transform: translateY(20%); }

.panel {
  position: absolute;
  inset: 0;
  z-index: 3;
  padding: 16px 16px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 빈 곳 탭은 아래 장면으로 */
  gap: 12px;
}
.panel > * { pointer-events: auto; }
/* 그림일기와 창밖: 그림은 위, 대사는 아래 (가로 화면에선 일기 옆) */
.panel.below { justify-content: flex-end; }
.below .letter { max-height: 30dvh; }
.diary-wrap { position: absolute; inset: 16px 0 auto; z-index: 2; display: flex; justify-content: center; }
@media (min-aspect-ratio: 1/1) and (min-width: 800px) {
  .diary-wrap { inset: 0 auto 0 10vw; align-items: center; }
  .diary-wrap :deep(.diary) { width: min(440px, 62dvh, 40vw); }
  .panel.below.side { inset: 0 6vw 0 auto; width: min(420px, 42vw); justify-content: center; }
  .below.side .letter { max-height: 46dvh; }
}
/* 장면 2: 보여 주는 물건이 대사 위에 둥실 뜬다 */
.thing { position: absolute; top: 9dvh; left: 0; right: 0; z-index: 2; margin: 0; font-size: 5rem; text-align: center; filter: drop-shadow(0 6px 18px rgb(255 207 138 / 0.5)); animation: bob 2.4s ease-in-out infinite; pointer-events: none; }
.fade-enter-active, .fade-leave-active { transition: opacity 1.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.letter {
  width: min(100%, 420px);
  max-height: 46dvh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px 22px;
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 18px;
  background: rgb(8 10 22 / 0.6);
  backdrop-filter: blur(12px);
  color: #fbf8f1;
  font-family: Gaegu, cursive;
  font-size: 1.35rem;
  line-height: 1.5;
  animation: pop 0.5s both;
}
.letter.bare { border: 0; background: none; backdrop-filter: none; text-shadow: 0 2px 12px rgb(0 0 0 / 0.9); }
.letter p { margin: 0 0 4px; }
.letter .me { font-family: system-ui, sans-serif; font-size: 1.15rem; font-weight: 600; color: #d6d9e6; }
/* 대사 넘기기 →: 오른쪽 아래에서 살짝 움직인다 */
.more { display: block; margin: 0 0 0 auto; padding: 0 4px; border: 0; background: none; color: inherit; font: inherit; font-size: 1rem; cursor: pointer; animation: nudge 1.4s ease-in-out infinite; }
.letter .mine { margin-top: 12px; color: #ffcf8a; }
.letter input.mine {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px dashed #ffcf8a;
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
  padding: 13px 18px;
  border: 1px solid rgb(255 255 255 / 0.22);
  border-radius: 12px;
  background: rgb(0 0 0 / 0.28);
  backdrop-filter: blur(10px);
  text-align: left;
  animation: pop 0.35s both;
}
.choices button:hover { border-color: rgb(255 255 255 / 0.7); background: rgb(255 255 255 / 0.08); }
.choices button:active, .answer button:active, .actions > *:active { transform: scale(0.98); }
.actions .primary, .answer .field button {
  padding: 14px 28px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #111;
  font-weight: 700;
  text-align: center;
}
button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

/* 직접 쓰기 + 추천 칩 */
.answer { width: min(100%, 420px); display: grid; gap: 12px; animation: pop 0.35s both; }
.field { display: flex; gap: 8px; }
.field input {
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  color: #fff;
  font: inherit;
}
.answer .field button { padding: 12px 20px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.chips button {
  padding: 6px 12px;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
  font-size: 0.85rem;
}
.chips button.on { border-color: #fff; background: rgb(255 255 255 / 0.15); color: #fff; }

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

/* 진행 버튼: 행동은 테두리만 있는 알약, 그냥 넘기기는 글자와 화살표만 */
.next {
  position: absolute;
  left: 50%;
  bottom: 56px;
  z-index: 4;
  translate: -50% 0;
  padding: 12px 26px;
  border: 1px solid rgb(255 255 255 / 0.75);
  border-radius: 999px;
  background: rgb(0 0 0 / 0.5); /* 밝은 화면(폰 불빛) 위에서도 보이게 어둡게 깐다 */
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.4);
  color: #fff;
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  animation: pop 0.35s both;
}
.next:hover { background: #fff; color: #111; }
.next:active { scale: 0.98; }
.next.hint { padding: 8px 12px; border: 0; background: none; backdrop-filter: none; font-size: 0.95rem; font-weight: 500; opacity: 0.85; text-shadow: 0 1px 8px rgb(0 0 0 / 0.9); }
.next.hint:hover { color: #fff; opacity: 1; }
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
  gap: 14px;
  background: rgb(11 16 32 / 0.6);
  animation: pop 0.6s both;
}
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.actions > * { padding: 10px 16px; border: 1px solid rgb(255 255 255 / 0.25); border-radius: 999px; background: rgb(255 255 255 / 0.12); backdrop-filter: blur(8px); }
.toast { margin: 0; font-size: 0.9rem; }
.help { color: inherit; opacity: 0.7; font-size: 0.8rem; text-align: center; }

@keyframes pop { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) {
  .letter, .choices button, .answer, .result, .next, .next.hint .arrow, .more { animation: none; }
  .dark, .lid { transition: none; }
}
</style>
