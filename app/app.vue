<script setup lang="ts">
import { about, scene5 } from '~/data/script'

const menu = ref(false)
const dlg = ref<HTMLDialogElement>()
function openAbout() {
  menu.value = false
  dlg.value?.showModal()
}
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
    <button class="icon" aria-label="메뉴" :aria-expanded="menu" @click="menu = !menu">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12M6 12h12M6 16h12" /></svg>
    </button>
    <!-- 바깥 클릭은 메뉴만 닫고 장면은 넘기지 않게 투명한 막이 받는다 -->
    <div v-if="menu" class="backdrop" @click="menu = false" />
    <Transition name="pop">
      <nav v-if="menu" class="menu">
        <!-- 일반 링크로 새로 불러와서 진행 중인 장면(타이머·음악)을 확실히 멈춘다 -->
        <a href="/">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7M6 10v10h12V10" /></svg>{{ about.home }}
        </a>
        <button type="button" @click="openAbout">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>{{ about.open }}
        </button>
        <a v-if="scene5.coffee.url" :href="scene5.coffee.url" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M9 3v3M12 3v3" /></svg>{{ about.coffee }}
        </a>
      </nav>
    </Transition>
    <!-- 화면 가운데 창. 바깥(::backdrop)을 누르거나 Esc면 닫힌다 -->
    <dialog ref="dlg" class="about" :aria-label="about.title" @click="$event.target === dlg && dlg?.close()">
      <div class="about-body">
        <p class="about-star" aria-hidden="true">✦</p>
        <h2>{{ about.title }}</h2>
        <p class="words"><span v-for="line in about.words" :key="line">{{ line }}</span></p>
        <p class="sign">— {{ about.name }}</p>
        <div class="about-actions">
          <a v-if="scene5.coffee.url" :href="scene5.coffee.url" target="_blank" rel="noopener">☕ {{ about.coffee }}</a>
          <a :href="about.github" target="_blank" rel="noopener">GitHub</a>
          <button type="button" @click="dlg?.close()">{{ about.close }}</button>
        </div>
      </div>
    </dialog>
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
.corner svg {
  width: 20px;
  height: 20px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.corner .icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.corner .icon:hover, .corner .icon[aria-expanded="true"] { background: rgb(255 255 255 / 0.22); }
.backdrop { position: fixed; inset: 0; z-index: -1; }
.menu {
  position: absolute;
  top: 50px;
  right: 0;
  display: grid;
  min-width: 200px;
  padding: 6px;
  border-radius: 16px;
  background: rgb(20 24 44 / 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.35);
  transform-origin: top right;
}
.menu > a, .menu > button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 0;
  border-radius: 10px;
  background: none;
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}
.menu > a:hover, .menu > button:hover, .menu > a:focus-visible, .menu > button:focus-visible { background: rgb(255 255 255 / 0.12); outline: none; }
.menu svg { opacity: 0.8; }
.pop-enter-active, .pop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95) translateY(-4px); }

.about {
  width: min(360px, calc(100% - 32px));
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: rgb(20 24 44 / 0.85);
  color: #fff;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.5);
}
.about::backdrop { background: rgb(5 8 20 / 0.55); backdrop-filter: blur(6px); }
.about[open] { animation: rise 0.25s ease-out; }
@keyframes rise { from { opacity: 0; transform: translateY(12px); } }
.about-body { padding: 32px 24px 24px; text-align: center; }
.about-star { margin: 0; font-size: 1.4rem; opacity: 0.8; }
.about h2 { margin: 8px 0 20px; font-size: 1.1rem; font-weight: 600; letter-spacing: 0.02em; }
.about .words { display: grid; gap: 4px; margin: 0; line-height: 1.6; opacity: 0.9; }
.about .sign { margin: 20px 0 24px; font-size: 0.85rem; opacity: 0.6; }
.about-actions { display: grid; gap: 8px; }
.about-actions a, .about-actions button {
  padding: 12px;
  border: 0;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}
.about-actions a:hover, .about-actions button:hover { background: rgb(255 255 255 / 0.2); }
.about-actions button { background: none; opacity: 0.7; }

html, body {
  margin: 0;
  background: #0b1020;
  color: #e8e6f0;
  font-family: system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  word-break: keep-all;
}
</style>
