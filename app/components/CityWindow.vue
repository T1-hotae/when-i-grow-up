<script setup lang="ts">
import { scene3 } from '~/data/script'

// 창밖: 불 꺼진 그림 위에 켜진 그림의 창문 조각을 하나씩 올린다. lit = 켜진 창 수
defineProps<{ lit: number, focus: boolean }>()
const ON = '/images/scenes/window-city.webp'
const OFF = '/images/scenes/window-city-off.webp'
const noOff = ref(false) // 불 꺼진 그림을 불러오지 못했을 때 켜진 그림을 어둡게 깔아 대신한다
const spots = scene3.window.spots.map(([x, y, w, h]) => ({
  left: `${x}%`,
  top: `${y}%`,
  width: `${w}%`,
  height: `${h}%`,
  backgroundImage: `url(${ON})`,
  backgroundSize: `${10000 / w}% ${10000 / h}%`,
  backgroundPosition: `${(x / (100 - w)) * 100}% ${(y / (100 - h)) * 100}%`,
}))
</script>

<template>
  <section class="city" aria-label="창밖, 불 켜진 창문들">
    <div class="frame" :class="{ focus }">
      <!-- 삼항식이어야 컴파일러가 상수를 정적 import로 바꾸지 않는다 -->
      <img :src="noOff ? ON : OFF" alt="" :class="{ dim: noOff }" @error="noOff = true">
      <i v-for="(s, i) in spots" :key="i" :style="s" :class="{ on: i < lit }" />
    </div>
  </section>
</template>

<style scoped>
.city {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #0b1226;
  animation: in 1.2s both;
}
/* 그림 비율을 지켜야 창문 좌표가 맞는다. 가로 화면은 꽉 채우고, 세로 화면은 위쪽 60%에 둔다 (아래는 대사 자리) */
.frame {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(100vw, 177.78dvh);
  aspect-ratio: 16 / 9;
  translate: -50% -50%;
  filter: blur(6px);
  transition: filter 1.6s;
}
@media (orientation: portrait) {
  .frame { top: 0; width: 106.67dvh; translate: -50% 0; }
  .city::after { content: ''; position: absolute; inset: calc(60dvh - 80px) 0 0; background: linear-gradient(transparent, #0b1226 80px); }
}
.frame.focus { filter: none; }
img { width: 100%; height: 100%; display: block; }
.dim { filter: brightness(0.4) saturate(0.6); }
i {
  position: absolute;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.6s, box-shadow 0.6s;
}
i.on { opacity: 1; box-shadow: 0 0 24px 8px rgb(255 200 120 / 0.45); }

@keyframes in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .city { animation: none; }
  .frame, i { transition: none; }
}
</style>
