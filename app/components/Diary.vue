<script setup lang="ts">
import type { DiaryPaper } from '~/data/script'

// 그림일기 한 쪽. play.vue가 글자를 한 글자씩 넘겨주고, 여기선 그리기만 한다
const props = defineProps<DiaryPaper & { text: string, stamp: boolean }>()
const COLS = 12
const CELLS = COLS * 6 // 가장 긴 일기(직접 쓴 꿈 20자 + 마음)도 들어간다
const cells = computed(() => [...props.text].slice(0, CELLS).concat(Array(CELLS).fill('')).slice(0, CELLS))
const blurred = (i: number) => !!props.blur && i >= props.blur[0] && i < props.blur[1]
</script>

<template>
  <article class="diary" :class="{ stamped: stamp }" aria-label="그림일기" aria-live="polite">
    <header>
      <span>{{ date }}</span>
      <span>날씨: {{ weather }}</span>
    </header>
    <figure>
      <!-- 아직 안 뽑은 그림은 빈 도화지로 둔다 -->
      <img v-if="image" :src="image" alt="" @error="(e) => ((e.target as HTMLElement).style.visibility = 'hidden')">
      <p v-else-if="label" class="crayon"><span aria-hidden="true">★</span>{{ label }}<span aria-hidden="true">♥</span></p>
      <div v-if="stamp" class="stamp" role="img" aria-label="참 잘했어요 도장">
        참<br>잘했어요
      </div>
    </figure>
    <p class="grid" :style="{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }">
      <span v-for="(c, i) in cells" :key="i" :class="{ blur: blurred(i) }">{{ c }}</span>
    </p>
    <p class="sr-only">{{ text }}</p>
  </article>
</template>

<style scoped>
.diary {
  container-type: inline-size;
  width: min(calc(100vw - 32px), 380px, 40dvh);
  box-sizing: border-box;
  padding: 14px 14px 18px;
  border-radius: 4px 10px 10px 4px;
  background: #fbf6e6;
  box-shadow: inset 6px 0 0 #d9cfb4, 0 18px 40px rgb(0 0 0 / 0.5);
  color: #2c2a33;
  font-family: 'Hi Melody', cursive;
  transform-origin: left center;
}
header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 6px;
  font-size: 5.4cqw;
  border-bottom: 2px solid #9cb894;
}
figure {
  position: relative;
  margin: 8px 0;
  aspect-ratio: 4 / 3;
  border: 2px solid #9cb894;
  background: #fff;
}
figure img { width: 100%; height: 100%; object-fit: cover; display: block; }
.grid {
  display: grid;
  margin: 0;
  border-top: 1px solid #9cb894;
  border-left: 1px solid #9cb894;
}
.grid span {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-right: 1px solid #9cb894;
  border-bottom: 1px solid #9cb894;
  font-size: 5.6cqw;
  line-height: 1;
}
/* 기억 안 나는 꿈: 지우개로 문댄 연필 글씨 */
.grid span.blur { filter: blur(2.5px); opacity: 0.7; }
/* 목록에 없는 꿈: 그림 대신 크레용으로 크게 쓴 꿈 */
.crayon {
  position: absolute;
  inset: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4cqw;
  padding: 0 6cqw;
  color: #e0573c;
  font-size: 14cqw;
  line-height: 1.1;
  text-align: center;
  word-break: keep-all;
  transform: rotate(-4deg);
}
.crayon span { color: #f2b632; font-size: 9cqw; }
.crayon span:last-child { color: #e86a92; }
.stamp {
  position: absolute;
  right: 6%;
  bottom: 8%;
  width: 34%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 0.9cqw solid currentColor;
  outline: 0.5cqw solid currentColor;
  outline-offset: -2.4cqw;
  border-radius: 50%;
  color: #d2362a;
  font-family: system-ui, sans-serif;
  font-weight: 900;
  font-size: 5cqw;
  line-height: 1.15;
  text-align: center;
  opacity: 0.85;
  mix-blend-mode: multiply;
  transform: rotate(-8deg);
  animation: stamp 0.12s cubic-bezier(0.5, 0, 0.75, 0) both;
}
.stamped { animation: shake 0.25s 0.12s; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }

/* 쪽 넘김: play.vue가 <Transition name="flip">으로 감싼다 */
.flip-enter-active, .flip-leave-active { transition: transform 0.35s ease-in, opacity 0.35s; }
.flip-enter-active { transition-timing-function: ease-out; }
.flip-enter-from { transform: perspective(900px) rotateY(80deg); opacity: 0; }
.flip-leave-to { transform: perspective(900px) rotateY(-80deg); opacity: 0; }

@keyframes stamp { from { transform: rotate(-8deg) scale(1.6); opacity: 0; } }
@keyframes shake { 25% { translate: -4px 2px; } 50% { translate: 3px -2px; } 75% { translate: -2px 1px; } }
@media (prefers-reduced-motion: reduce) {
  .stamp, .stamped { animation: none; }
  .flip-enter-active, .flip-leave-active { transition: none; }
}
</style>
