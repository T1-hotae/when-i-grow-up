<script setup lang="ts">
import { family, scene0, type Me } from '~/data/script'
import type { Msg } from './Messenger.vue'

// 장면 0-1: 노트북 화면. play.vue가 무엇이 보일지만 정하고 여기선 그리기만 한다
// title: 채팅창 이름 (비면 동기 단톡방). 숨은 길에선 엄마/아빠 1:1 채팅
const props = defineProps<{ me: Me, title: string, mails: number, msgs: Msg[], typing: string, popup: boolean, picker: string, picked: boolean }>()
const emit = defineEmits<{ open: [], dismiss: [] }>() // 알림 누름 / 닫음
const d = scene0.desk
const p = computed(() => family[props.me])
const open = computed(() => d.mails[props.mails - 1]!) // 방금 온 메일을 열어 둔다
// 작업표시줄 시계: 부모 알림 > 마지막 채팅 > 켰을 때 시각
const clock = computed(() => props.popup ? p.value.night.at : props.msgs.at(-1)?.time ?? d.clock)
</script>

<template>
  <div class="desktop">
    <section v-if="mails" class="mail" aria-label="메일함">
      <div class="bar" aria-hidden="true"><i /><i /><i /><span>mail.com/inbox</span></div>
      <div class="app">
        <nav><b>받은메일함 {{ mails }}</b><span>보낸메일함</span><span>스팸함</span></nav>
        <div class="main">
          <ul>
            <li v-for="(m, i) in d.mails.slice(0, mails).reverse()" :key="m.title" :class="{ open: i === 0 }">
              <b>{{ m.from }}</b><span>{{ m.title }}</span><time>{{ m.at.replace('어제 ', '') }}</time>
            </li>
          </ul>
          <article :key="mails">
            <h2>{{ open.title }}</h2>
            <p class="meta">{{ open.from }} · {{ open.at }}</p>
            <p>{{ open.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <Messenger v-if="msgs.length || typing" class="chat" :title="title || `${d.room} 4`" :msgs="msgs" :typing="typing" :picker="picker" :picked="picked" />

    <Transition name="drop">
      <aside v-if="popup" class="popup" role="status">
        <button class="open" :aria-label="`${p.who} 메시지 열기`" @click.stop="emit('open')">
          <span class="avatar" aria-hidden="true">{{ p.who[0] }}</span>
          <span class="text"><b>{{ p.who }}</b><span>{{ p.night.text }}</span></span>
        </button>
        <button class="x" aria-label="알림 닫기" @click.stop="emit('dismiss')">✕</button>
        <button class="off" @click.stop="emit('dismiss')">알림 끄기</button>
      </aside>
    </Transition>

    <footer class="taskbar">
      <span class="start" aria-hidden="true" />
      <time>{{ clock }}</time>
    </footer>
  </div>
</template>

<style scoped>
.desktop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: radial-gradient(circle at 30% 20%, #2c3e6b, #0d1428 70%);
  animation: on 0.8s both;
}
.mail {
  position: absolute;
  inset: 16px 16px 30%; /* 화면 대부분을 채우는 큰 창. 카톡은 그 위에 얹힌다 */
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  color: #222;
  font-size: 1.1rem;
  box-shadow: 0 12px 30px rgb(0 0 0 / 0.4);
}
.bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #e3e6eb; }
.bar i { width: 10px; height: 10px; border-radius: 50%; background: #c4c8cf; }
.bar span { flex: 1; margin-left: 8px; padding: 3px 10px; border-radius: 6px; background: #fff; color: #666; font-size: 0.75rem; }
.app { flex: 1; min-height: 0; display: flex; }
.app nav { display: none; flex-direction: column; gap: 10px; padding: 14px; width: 110px; background: #f5f6f8; font-size: 0.85rem; color: #666; }
.app nav b { color: #2b5fd9; }
.main { flex: 1; min-width: 0; overflow-y: auto; }
.main ul { list-style: none; margin: 0; padding: 0; border-bottom: 1px solid #e3e6eb; }
.main li { display: flex; gap: 10px; padding: 9px 14px; font-size: 0.85rem; color: #777; white-space: nowrap; animation: in 0.3s both; }
.main li span { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.main li time { flex: none; font-weight: 400; color: #999; }
.main li.open { background: #eef3ff; color: #222; font-weight: 700; }
.main li b { flex: none; width: 3.5em; }
.main article { padding: 16px 18px 20px; line-height: 1.6; animation: in 0.3s both; }
.main h2 { margin: 0 0 6px; font-size: 1.1rem; }
.main .meta { margin: 0 0 14px; padding-bottom: 12px; border-bottom: 1px solid #eee; font-size: 0.8rem; color: #888; }
.main article p:last-child { margin: 0; }
@media (min-width: 600px) { .app nav { display: flex; } }
.chat {
  position: absolute;
  top: 150px;
  right: 16px;
  bottom: 300px;
  width: min(calc(100% - 32px), 440px);
}
@media (min-width: 800px) {
  .chat { top: 40px; right: 3vw; bottom: 240px; }
  .mail { inset: 40px 15% 30% 6vw; }
}
.popup {
  position: absolute;
  right: 12px;
  bottom: 56px;
  z-index: 2;
  width: 260px;
  border-radius: 10px;
  background: #fff;
  color: #191919;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.45);
}
.popup button { border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.popup .open { display: flex; gap: 10px; align-items: center; width: 100%; padding: 12px 36px 10px 12px; text-align: left; }
.popup .avatar { flex: none; width: 36px; height: 36px; border-radius: 13px; display: grid; place-items: center; background: #f2a7a7; color: #fff; font-weight: 700; }
.popup .text b { display: block; font-size: 0.8rem; }
.popup .text span { display: block; margin-top: 2px; font-size: 0.85rem; }
.popup .x { position: absolute; top: 4px; right: 4px; width: 32px; height: 32px; color: #999; }
.popup .off { display: block; width: 100%; padding: 8px; border-top: 1px solid #eee; color: #888; font-size: 0.75rem; }
.popup button:focus-visible { outline: 2px solid #2b5fd9; outline-offset: -2px; }
/* 올라올 땐 아래에서, 사라질 땐 다시 아래로 */
.drop-enter-active, .drop-leave-active { transition: transform 0.4s, opacity 0.4s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(120%); }
.taskbar {
  position: absolute;
  inset: auto 0 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgb(15 18 30 / 0.85);
  backdrop-filter: blur(10px);
  font-size: 0.8rem;
}
.start { width: 18px; height: 18px; border-radius: 4px; background: rgb(255 255 255 / 0.6); }

@keyframes on { from { opacity: 0; filter: brightness(2); } }
@keyframes in { from { opacity: 0; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) { .desktop, .mail article { animation: none; } .drop-enter-active, .drop-leave-active { transition: none; } }
</style>
