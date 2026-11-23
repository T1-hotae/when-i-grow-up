<script setup lang="ts">
import { dreams, scene5, type DreamId } from '~/data/script'

const props = defineProps<{ id: DreamId, things?: number, proud?: string }>()
const type = computed(() => dreams[props.id].type)
</script>

<template>
  <figure class="card" :style="{ backgroundImage: `url(/images/cards/card-${id}.webp)` }">
    <header>
      <h2>{{ type.name }}</h2>
      <p>{{ type.desc }}</p>
    </header>
    <footer>
      <blockquote>"{{ type.words }}"</blockquote>
      <p v-if="things !== undefined">{{ scene5.thingCount(things) }}</p>
      <p v-if="proud">{{ scene5.proudLabel }}: {{ proud }}</p>
    </footer>
    <span class="shine" aria-hidden="true" />
  </figure>
</template>

<style scoped>
.card {
  position: relative;
  flex: none;
  margin: 0;
  width: min(100%, 340px, calc((100dvh - 270px) * 9 / 16)); /* 270px: 아래 버튼·커피·상담전화 자리 */
  aspect-ratio: 9 / 16;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #0b1020 center / cover;
  box-shadow: 0 12px 40px rgb(0 0 0 / 0.5), 0 0 60px rgb(255 214 150 / 0.18);
  outline: 1px solid rgb(255 255 255 / 0.15);
  outline-offset: -1px;
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 8px rgb(0 0 0 / 0.7);
  animation: rise 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
/* 카드 위로 빛이 한 번 스치고 지나간다 */
.shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 40%, rgb(255 255 255 / 0.25) 50%, transparent 60%);
  transform: translateX(-100%);
  animation: shine 1.4s 0.6s ease-out both;
}
@keyframes rise { from { opacity: 0; transform: translateY(24px) scale(0.96) rotate(-1.5deg); } }
@keyframes shine { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .card, .shine { animation: none; }
  .shine { display: none; }
}
.card::before, .card::after { content: ''; position: absolute; inset: 0 0 auto; pointer-events: none; }
.card::before { height: 32%; background: linear-gradient(rgb(5 8 20 / 0.75), transparent); }
.card::after { inset: auto 0 0; height: 43%; background: linear-gradient(transparent, rgb(5 8 20 / 0.75)); }
header, footer { position: relative; z-index: 1; padding: 22px 18px; }
h2 { margin: 0 0 6px; font-size: 1.4rem; }
header p { margin: 0; font-size: 0.9rem; }
blockquote { margin: 0 0 12px; font-family: Gaegu, cursive; font-size: 1.25rem; line-height: 1.4; }
footer p { margin: 2px 0; font-size: 0.8rem; opacity: 0.9; }
</style>
