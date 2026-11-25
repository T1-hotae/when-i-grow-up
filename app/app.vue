<script setup lang="ts">
const menu = ref(false)
const about = ref(false)
</script>

<template>
  <NuxtPage />
  <div class="corner" @click.stop>
    <button class="icon" :aria-label="muted ? '소리 켜기' : '소리 끄기'" @click="toggleMute">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
        <template v-if="muted"><path d="M16 9l6 6M22 9l-6 6" /></template>
        <template v-else><path d="M16 8.5a5 5 0 0 1 0 7" /><path d="M18.5 6a8.5 8.5 0 0 1 0 12" /></template>
      </svg>
    </button>
    <button class="icon" aria-label="메뉴" :aria-expanded="menu" @click="menu = !menu; about = false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
    </button>
    <!-- 바깥 클릭은 메뉴만 닫고 장면은 넘기지 않게 투명한 막이 받는다 -->
    <div v-if="menu" class="backdrop" @click="menu = false" />
    <nav v-if="menu" class="menu">
      <!-- 일반 링크로 새로 불러와서 진행 중인 장면(타이머·음악)을 확실히 멈춘다 -->
      <a href="/">메인으로 가기</a>
      <button type="button" @click="about = !about">개발자 정보</button>
      <div v-if="about" class="about">
        <p>만든 사람: 황호태</p>
        <a href="https://github.com/T1-hotae/when-i-grow-up" target="_blank" rel="noopener">GitHub</a>
      </div>
    </nav>
  </div>
</template>

<style>
.corner {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  display: flex;
  gap: 8px;
}
.corner .icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.35);
  color: #fff;
  cursor: pointer;
}
.corner svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
.backdrop { position: fixed; inset: 0; z-index: -1; }
.menu {
  position: absolute;
  top: 48px;
  right: 0;
  min-width: 160px;
  padding: 6px;
  border-radius: 12px;
  background: rgb(11 16 32 / 0.92);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.4);
}
.menu > a, .menu > button {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.menu > a:hover, .menu > button:hover { background: rgb(255 255 255 / 0.08); }
.about { padding: 4px 12px 10px; font-size: 0.85rem; opacity: 0.85; }
.about p { margin: 0 0 4px; }
.about a { color: #b9c4ff; }
html, body {
  margin: 0;
  background: #0b1020;
  color: #e8e6f0;
  font-family: system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  word-break: keep-all;
}
</style>
