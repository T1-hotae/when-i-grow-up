<script setup lang="ts">
import { scene2 } from '~/data/script'

type Note = { id: number, text: string, state: 'idle' | 'flying' | 'miss' }

const emit = defineEmits<{ hit: [thrown: number, total: number], miss: [], done: [thrown: number] }>()
const notes = ref<Note[]>(scene2.worries.map((text, id) => ({ id, text, state: 'idle' })))
const bin = ref<SVGSVGElement>()
const binHit = ref(false)
const writing = ref(false)
const custom = ref('')
const customInput = ref<HTMLInputElement>()
let thrown = 0
let lastMiss = true // 첫 번째는 꼭 들어간다
let nextId = 100

function toss(note: Note, el: HTMLElement) {
  if (note.state !== 'idle' || !bin.value) return
  const a = el.getBoundingClientRect()
  const b = bin.value.getBoundingClientRect()
  el.style.setProperty('--dx', `${b.left + b.width / 2 - (a.left + a.width / 2)}px`)
  el.style.setProperty('--dy', `${b.top + b.height / 3 - (a.top + a.height / 2)}px`)
  const miss = !lastMiss && Math.random() < 0.2 // 가끔 빗나간다. 두 번 연속은 없다
  lastMiss = miss
  note.state = miss ? 'miss' : 'flying'
}

function landed(note: Note) {
  if (note.state === 'miss') {
    note.state = 'idle'
    emit('miss')
    return
  }
  notes.value = notes.value.filter(n => n !== note)
  thrown++
  binHit.value = true
  setTimeout(() => { binHit.value = false }, 300)
  emit('hit', thrown, thrown + notes.value.length)
  if (!notes.value.length) emit('done', thrown)
}

async function startWriting() {
  writing.value = true
  await nextTick()
  customInput.value?.focus()
}

// 직접 쓴 걱정은 저장하지 않고 바로 구겨서 던진다
async function addCustom() {
  const text = custom.value.trim()
  writing.value = false
  custom.value = ''
  if (!text) return
  const id = nextId++
  notes.value.push({ id, text, state: 'idle' })
  await nextTick()
  const el = document.querySelector<HTMLElement>(`[data-note="${id}"]`)
  const added = notes.value.find(n => n.id === id) // 반응형 객체로 넘겨야 상태 변화가 화면에 반영된다
  if (el && added) toss(added, el)
}
</script>

<template>
  <div class="toss">
    <div class="notes">
      <button
        v-for="n in notes"
        :key="n.id"
        class="note"
        :class="n.state"
        :data-note="n.id"
        :style="{ rotate: `${(n.id * 37) % 9 - 4}deg` }"
        @click="toss(n, $event.currentTarget as HTMLElement)"
        @animationend="landed(n)"
      >
        {{ n.text }}
      </button>
      <form v-if="writing" class="note custom" @submit.prevent="addCustom">
        <input ref="customInput" v-model="custom" maxlength="20" aria-label="걱정 직접 쓰기">
        <button>구기기</button>
      </form>
      <button v-else class="note custom" @click="startWriting">{{ scene2.custom }}</button>
    </div>
    <p class="hint">{{ scene2.hint }}</p>
    <svg ref="bin" class="bin" :class="{ hit: binHit }" viewBox="0 0 64 72" aria-hidden="true">
      <rect x="6" y="8" width="52" height="7" rx="3" fill="#c9b8a6" />
      <rect x="24" y="2" width="16" height="7" rx="3" fill="#c9b8a6" />
      <path d="M11 18h42l-4 50H15z" fill="#8a7a6c" />
      <path d="M24 26v34M32 26v34M40 26v34" stroke="#6e6055" stroke-width="3" />
    </svg>
  </div>
</template>

<style scoped>
.toss { position: absolute; inset: 0; }
.notes {
  position: absolute;
  inset: 120px 16px 170px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  gap: 14px;
}
.note {
  padding: 10px 14px;
  border: 0;
  background: #fff6c2;
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.35);
  color: #3b2f2a;
  font-family: Gaegu, cursive;
  font-size: 1.15rem;
  cursor: pointer;
}
.note:nth-child(3n + 2) { background: #ffe0e6; }
.note:nth-child(3n) { background: #dff0ff; }
.note.custom { background: transparent; border: 1px dashed #fff6c2; color: #fff6c2; box-shadow: none; }
form.custom { display: flex; gap: 6px; }
form.custom input { width: 9em; border: 0; border-bottom: 1px solid currentColor; background: transparent; color: inherit; font: inherit; }
form.custom button { border: 0; background: #fff6c2; color: #3b2f2a; font: inherit; border-radius: 4px; cursor: pointer; }
.note.flying { animation: toss 0.7s ease-in forwards; pointer-events: none; }
.note.miss { animation: miss 1s ease-in-out; pointer-events: none; }
.hint { position: absolute; inset: auto 16px 110px; margin: 0; text-align: center; opacity: 0.8; }
.bin { position: absolute; bottom: 28px; left: calc(50% - 32px); width: 64px; }
.bin.hit { animation: wobble 0.3s; }

@keyframes toss {
  35% { transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.35 - 120px)) scale(0.45) rotate(160deg); border-radius: 50%; color: transparent; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.2) rotate(420deg); border-radius: 50%; color: transparent; }
}
@keyframes miss {
  35% { transform: translate(calc(var(--dx) * 0.35), calc(var(--dy) * 0.35 - 100px)) scale(0.45) rotate(160deg); border-radius: 50%; color: transparent; }
  65% { transform: translate(calc(var(--dx) - 70px), var(--dy)) scale(0.3) rotate(300deg); border-radius: 50%; color: transparent; }
}
@keyframes wobble {
  30% { rotate: -8deg; }
  70% { rotate: 6deg; }
}
</style>
