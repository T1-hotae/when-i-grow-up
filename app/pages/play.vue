<script setup lang="ts">
import { scene0 } from '~/data/script'

// shortcut: 장면 0의 자리표시 방(상자 몇 개)만 있다. AI 이미지와 장면 전환은 장면별로 만들 때 붙인다.
const closed = ref(false)
</script>

<template>
  <main class="play">
    <TresCanvas clear-color="#0b1020">
      <TresPerspectiveCamera :position="[0, 1.5, 2.4]" :look-at="[0, 0.85, 0]" />
      <TresAmbientLight :intensity="0.15" />
      <!-- 스탠드 -->
      <TresPointLight :position="[-0.7, 1.4, 0.2]" color="#ffb766" :intensity="1.5" />
      <!-- 노트북 화면 빛: 덮으면 꺼진다 -->
      <TresPointLight :position="[0, 1.1, 0.4]" color="#8fa8ff" :intensity="closed ? 0 : 1.2" />

      <!-- 벽 -->
      <TresMesh :position="[0, 1, -0.6]">
        <TresPlaneGeometry :args="[8, 5]" />
        <TresMeshStandardMaterial color="#2b2f45" />
      </TresMesh>
      <!-- 책상 -->
      <TresMesh :position="[0, 0.75, 0]">
        <TresBoxGeometry :args="[1.6, 0.06, 0.8]" />
        <TresMeshStandardMaterial color="#5a4636" />
      </TresMesh>
      <!-- 노트북 바닥 -->
      <TresMesh :position="[0, 0.79, 0.1]">
        <TresBoxGeometry :args="[0.6, 0.02, 0.4]" />
        <TresMeshStandardMaterial color="#3a3a42" />
      </TresMesh>
      <!-- 노트북 화면: 뒤쪽 경첩을 축으로 돈다 -->
      <TresGroup :position="[0, 0.8, -0.1]" :rotation-x="closed ? Math.PI / 2 : -0.25">
        <TresMesh :position="[0, 0.2, 0]">
          <TresBoxGeometry :args="[0.6, 0.4, 0.02]" />
          <TresMeshStandardMaterial color="#1c1c22" :emissive="closed ? '#000000' : '#6f8cff'" :emissive-intensity="0.5" />
        </TresMesh>
      </TresGroup>
    </TresCanvas>

    <div v-if="!closed" class="overlay">
      <ul>
        <li v-for="(n, i) in scene0.notifications" :key="n" :style="{ animationDelay: `${i * 0.9}s` }">{{ n }}</li>
      </ul>
      <p :style="{ animationDelay: `${scene0.notifications.length * 0.9}s` }">{{ scene0.line }}</p>
      <button :style="{ animationDelay: `${scene0.notifications.length * 0.9 + 0.4}s` }" @click="closed = true">
        {{ scene0.action }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.play { position: fixed; inset: 0; }
.overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 0 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
ul { list-style: none; margin: 0; padding: 0; width: min(100%, 360px); display: grid; gap: 8px; }
li {
  padding: 10px 14px;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(8px);
  font-size: 0.9rem;
}
li, p, button { animation: pop 0.4s both; }
p { margin: 8px 0 0; }
button {
  padding: 12px 24px;
  border: 0;
  border-radius: 999px;
  background: #ffcf8a;
  color: #2a1d10;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
@keyframes pop { from { opacity: 0; transform: translateY(8px); } }
@media (prefers-reduced-motion: reduce) { li, p, button { animation: none; } }
</style>
