<script setup lang="ts">
export type Msg = { who?: string, text?: string, img?: string, me?: boolean, time?: string, unread?: boolean } // unread: 상대가 아직 안 읽음 (1)

defineProps<{ title: string, msgs: Msg[], typing: string, picker?: string, picked?: boolean }>()
const list = ref<HTMLElement>()
// 새 말이 오면 맨 아래로
onUpdated(() => list.value?.scrollTo({ top: list.value.scrollHeight, behavior: 'smooth' }))
</script>

<template>
  <section class="messenger" aria-label="채팅방">
    <header>{{ title }}</header>
    <ol ref="list">
      <li v-for="(m, i) in msgs" :key="i" :class="{ me: m.me }">
        <span v-if="!m.me" class="avatar" aria-hidden="true">{{ m.who?.[0] }}</span>
        <div>
          <b v-if="!m.me">{{ m.who }}</b>
          <div class="row">
            <img v-if="m.img" :src="m.img" alt="축하해 이모티콘" class="emoticon">
            <p v-else class="bubble">{{ m.text }}</p>
            <span class="meta">
              <span v-if="m.unread" class="unread" aria-label="안 읽음">1</span>
              <time v-if="m.time">{{ m.time }}</time>
            </span>
          </div>
        </div>
      </li>
    </ol>
    <footer>
      <span class="input" :class="{ empty: !typing }">{{ typing || '메시지 입력' }}</span>
      <span class="emo" :class="{ on: picker }" aria-hidden="true">☺</span>
      <span class="send" :class="{ on: typing || picked }">전송</span>
    </footer>
    <div v-if="picker" class="picker" aria-hidden="true">
      <span class="tile" :class="{ on: picked }"><img :src="picker" alt=""></span>
      <span v-for="n in 7" :key="n" class="tile" />
    </div>
  </section>
</template>

<style scoped>
.messenger {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background: #b2c7da;
  color: #191919;
  font-size: 0.95rem;
  box-shadow: 0 16px 40px rgb(0 0 0 / 0.45);
}
header { padding: 12px 14px; background: rgb(255 255 255 / 0.35); font-weight: 700; }
ol { flex: 1; overflow-y: auto; list-style: none; margin: 0; padding: 12px; display: grid; align-content: start; gap: 10px; }
li { display: flex; gap: 8px; align-items: flex-start; animation: in 0.25s both; }
li.me { justify-content: flex-end; }
.avatar {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: #8fa6c4;
  color: #fff;
  font-weight: 700;
}
b { display: block; margin-bottom: 4px; font-size: 0.78rem; font-weight: 400; color: #333; }
.row { display: flex; align-items: flex-end; gap: 4px; }
.me .row { flex-direction: row-reverse; }
.bubble { margin: 0; padding: 7px 10px; max-width: 220px; border-radius: 4px 14px 14px; background: #fff; line-height: 1.4; }
.me .bubble { border-radius: 14px 4px 14px 14px; background: #fee500; }
.emoticon { width: 110px; height: 110px; object-fit: contain; animation: bounce 0.5s both; }
.meta { flex: none; display: flex; flex-direction: column; align-items: flex-start; }
.me .meta { align-items: flex-end; } /* 내 말은 말풍선 왼쪽에 붙는다 */
.unread { font-size: 0.66rem; font-weight: 700; color: #f5c400; }
time { font-size: 0.66rem; color: #556; }
footer { display: flex; gap: 8px; align-items: center; padding: 8px 10px; background: #fff; }
.input { flex: 1; min-height: 1.4em; padding: 6px 4px; }
.input.empty { color: #aaa; }
.send { padding: 6px 12px; border-radius: 6px; background: #eee; color: #aaa; font-size: 0.8rem; }
.send.on { background: #fee500; color: #191919; }
.emo { font-size: 1.3rem; line-height: 1; color: #aaa; }
.emo.on { color: #191919; }
.picker { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 10px; background: #f6f6f6; animation: up 0.25s both; }
.tile { aspect-ratio: 1; border-radius: 8px; background: #e6e6e6; }
.tile:first-child { display: grid; place-items: center; background: #fff; transition: box-shadow 0.15s, transform 0.15s; }
.tile img { width: 85%; height: 85%; object-fit: contain; }
.tile.on { box-shadow: 0 0 0 3px #fee500; transform: scale(1.06); }
@keyframes up { from { opacity: 0; transform: translateY(12px); } }

@keyframes in { from { opacity: 0; transform: translateY(6px); } }
@keyframes bounce { 0% { transform: scale(0.4); } 70% { transform: scale(1.08); } }
@media (prefers-reduced-motion: reduce) { li, .emoticon, .picker { animation: none; } }
</style>
