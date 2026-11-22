<script setup lang="ts">
import { dreams, landing, scene0, scene1, scene2, scene3, scene4, scene5, type DreamId } from '~/data/script'

type Mode = 'notifications' | 'none' | 'letter' | 'worries' | 'sky' | 'result'
const ids = Object.keys(dreams) as DreamId[]

const room = reactive({
  laptopClosed: false,
  windowOpen: false,
  plane: 'hidden' as 'hidden' | 'window' | 'desk',
  brightness: 0,
  drawings: [] as string[],
  sky: false,
})
const ui = reactive({
  mode: 'notifications' as Mode,
  lines: [] as string[], // 편지에 써진 아이의 말
  blurAt: -1, // 물에 번진 줄
  mine: '', // 내가 고른 답장
  writing: false,
  free: '', // 한 줄 더 쓴 글: 어디에도 저장하거나 보내지 않는다
  prompt: '',
  choices: [] as string[],
})
const result = reactive({ dream: 'unknown' as DreamId, worries: 0, proud: '' })
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

// 아이의 말은 편지지에 한 글자씩 저절로 써진다
async function say(...lines: string[]) {
  for (const line of lines) {
    const at = ui.lines.push('') - 1
    for (const ch of line) {
      ui.lines[at] += ch
      if (typeDelay) await sleep(typeDelay)
    }
    await sleep(700)
  }
}
watch(() => ui.lines.map(l => l.length).join(), () => nextTick(() => letter.value?.scrollTo(0, letter.value.scrollHeight)))

let worriesDone = (_: number) => {}
function onHit(thrown: number, total: number) {
  room.brightness = thrown / total
  ui.lines = [scene2.cheers[(thrown - 1) % scene2.cheers.length] ?? '']
}

async function story() {
  // 장면 0. 새벽 2시
  await sleep(scene0.notifications.length * 900 + 400)
  await ask([scene0.action])
  ui.mode = 'none'
  room.laptopClosed = true
  await sleep(1800)
  room.plane = 'window' // 창문에서 "톡"
  await sleep(900)

  // 장면 1. 날아온 편지
  await ask([scene1.actions.open])
  room.windowOpen = true
  await sleep(500)
  room.plane = 'desk'
  await sleep(1600)
  await ask([scene1.actions.unfold])
  room.plane = 'hidden'
  ui.mode = 'letter'
  await say(...scene1.letter.before)
  ui.blurAt = ui.lines.push('내 꿈은 ○○○○○○다.') - 1
  await sleep(500)
  await say(scene1.letter.after)
  const d = ids[await ask(ids.map(id => dreams[id].label), scene1.blurred)]!
  result.dream = d
  ui.lines[ui.blurAt] = dreams[d].letter
  ui.blurAt = -1
  await sleep(1500)
  await say(scene1.reply)
  await sleep(1500)

  // 장면 2. 걱정 구기기
  ui.lines = []
  await say(...scene2.intro)
  ui.mode = 'worries'
  result.worries = await new Promise<number>((r) => { worriesDone = r })
  ui.mode = 'letter'
  ui.lines = []
  await say(...scene2.done)
  await sleep(1200)

  // 장면 3. 열 살의 질문 (답할 때마다 벽에 그림이 한 장씩)
  ui.lines = []
  await say(scene3.q1.question)
  await say(scene3.q1.answers[await ask(scene3.q1.answers.map(a => a.text))]!.reply)
  room.drawings.push('drawing-house')
  await sleep(1500)
  ui.lines = []
  await say(scene3.q2.question)
  await say(scene3.q2.answers[await ask(scene3.q2.answers.map(a => a.text))]!.reply)
  await sleep(800)
  room.drawings.push(`dream-${d}`)
  await say(...scene3.core(dreams[d]))
  await sleep(1500)
  ui.lines = []
  await say(scene3.q3.question)
  result.proud = scene3.q3.answers[await ask(scene3.q3.answers)]!
  await say(...scene3.q3.reply)
  room.drawings.push('drawing-playground')
  await sleep(1800)

  // 장면 4. 답장
  ui.lines = []
  await say(...scene4.intro)
  ui.mine = scene4.replies[await ask(scene4.replies)]!
  ui.writing = true
  await ask([scene4.action])
  Object.assign(ui, { writing: false, free: '', mine: '', lines: [], mode: 'sky' })
  room.sky = true
  await sleep(3500)
  await say(...scene4.farewell)
  await sleep(1800)

  // 장면 5. 결과
  ui.mode = 'result'
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) typeDelay = 0
  story()
})

const nextType = computed(() => ids[(ids.indexOf(result.dream) + 1) % ids.length])

// shortcut: 휴대폰 공유 창(Web Share)으로 보낸다, 카카오 앱 키를 받으면 카카오 공유 템플릿으로 바꾼다
async function share() {
  const url = `${location.origin}/result/${result.dream}`
  if (navigator.share) return navigator.share({ title: landing.title, text: `나는 ${dreams[result.dream].type.name}래요.`, url }).catch(() => {}) // 공유 창을 닫아도 그냥 둔다
  await navigator.clipboard.writeText(url)
  toast.value = '링크를 복사했어요'
}
const save = () => saveCard(result.dream, result.worries, result.proud)
</script>

<template>
  <main class="play">
    <TresCanvas clear-color="#0b1020">
      <Room v-bind="room" />
    </TresCanvas>

    <WorryToss v-if="ui.mode === 'worries'" @hit="onHit" @miss="ui.lines = [scene2.miss]" @done="(n) => worriesDone(n)" />

    <div v-if="ui.mode === 'sky'" class="sky">
      <p v-for="(line, i) in ui.lines" :key="i">{{ line }}</p>
    </div>

    <div v-if="ui.mode !== 'sky' && ui.mode !== 'result'" class="panel" :class="{ compact: ui.mode === 'worries' }">
      <template v-if="ui.mode === 'notifications'">
        <ul>
          <li v-for="(n, i) in scene0.notifications" :key="n" :style="{ animationDelay: `${i * 0.9}s` }">{{ n }}</li>
        </ul>
        <p class="line" :style="{ animationDelay: `${scene0.notifications.length * 0.9}s` }">{{ scene0.line }}</p>
      </template>

      <article v-if="ui.mode === 'letter' || ui.mode === 'worries'" ref="letter" class="letter">
        <p v-for="(line, i) in (ui.mode === 'worries' ? ui.lines.slice(-1) : ui.lines)" :key="i" :class="{ blur: i === ui.blurAt }">{{ line }}</p>
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

      <p v-if="ui.prompt" class="prompt">{{ ui.prompt }}</p>
      <div v-if="ui.choices.length" class="choices" :class="{ single: ui.choices.length === 1 }">
        <button v-for="(c, i) in ui.choices" :key="c" @click="pick(i)">{{ c }}</button>
      </div>
    </div>

    <section v-if="ui.mode === 'result'" class="result">
      <ResultCard :id="result.dream" :worries="result.worries" :proud="result.proud" />
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
.play { position: fixed; inset: 0; overflow: hidden; }

.panel {
  position: absolute;
  inset: auto 0 0;
  padding: 0 16px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.panel.compact { inset: 0 0 auto; padding-top: 16px; }
@media (min-aspect-ratio: 1/1) and (min-width: 800px) {
  .panel:not(.compact) { inset: 0 4vw 0 auto; width: 420px; justify-content: center; padding: 0; }
}

ul { list-style: none; margin: 0; padding: 0; width: min(100%, 360px); display: grid; gap: 8px; }
li {
  padding: 10px 14px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
}
li, .line { animation: pop 0.4s both; }
.line { margin: 8px 0 0; }

.letter {
  width: min(100%, 400px);
  max-height: 46dvh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 28px 28px 20px;
  border-radius: 4px;
  background: #f6efdf url(/images/letter-paper.webp) center / cover;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.45);
  color: #3b2f2a;
  font-family: Gaegu, cursive;
  font-size: 1.3rem;
  line-height: 1.5;
  animation: pop 0.5s both;
}
.compact .letter { padding: 10px 18px; max-height: none; }
.letter p { margin: 0 0 4px; }
.letter .blur { filter: blur(4px); }
.letter .mine { margin-top: 12px; color: #2f4f9a; }
.letter input.mine {
  width: 100%;
  box-sizing: border-box;
  border: 0;
  border-bottom: 1px dashed #2f4f9a;
  background: transparent;
  font: inherit;
  color: #2f4f9a;
}

.prompt { margin: 0; font-style: italic; opacity: 0.85; text-align: center; }
.choices { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 420px; animation: pop 0.4s both; }
.choices button, .actions > * {
  padding: 10px 16px;
  border: 1px solid rgb(255 255 255 / 0.25);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  backdrop-filter: blur(8px);
  color: #f0ece4;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}
.choices.single button, .actions .primary {
  padding: 12px 24px;
  border: 0;
  background: #ffcf8a;
  color: #2a1d10;
  font-weight: 700;
}

.sky {
  position: absolute;
  inset: 14% 16px auto;
  text-align: center;
  font-family: Gaegu, cursive;
  font-size: 1.6rem;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.8);
}
.sky p { margin: 0 0 8px; }

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
.toast { margin: 0; font-size: 0.9rem; }
.help { color: inherit; opacity: 0.7; font-size: 0.8rem; text-align: center; }

@keyframes pop { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) { li, .line, .letter, .choices, .result { animation: none; } }
</style>
