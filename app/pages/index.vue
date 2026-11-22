<script setup lang="ts">
import { landing } from '~/data/script'

onMounted(() => bgm('title'))

const asking = ref(false)
const who = ref<HTMLElement>()
async function start() {
  asking.value = true
  await nextTick()
  who.value?.querySelector('a')?.focus() // 키보드 사용자가 바로 고를 수 있게
}
</script>

<template>
  <main class="landing">
    <div class="content">
      <div class="intro">
        <h1>{{ landing.title }}</h1>
        <p v-for="line in landing.lines" :key="line">{{ line }}</p>
      </div>
      <div class="actions">
        <button v-if="!asking" type="button" class="start" @click="start">{{ landing.start }} <span class="arrow" aria-hidden="true">→</span></button>
        <template v-else>
          <p class="ask">{{ landing.ask }}</p>
          <div ref="who" class="who" role="group" :aria-label="landing.ask">
            <NuxtLink v-for="(label, me) in landing.me" :key="me" :to="`/play?me=${me}`" class="start">{{ label }} <span class="arrow" aria-hidden="true">→</span></NuxtLink>
          </div>
        </template>
        <small>{{ landing.note }}</small>
      </div>
    </div>
  </main>
</template>

<style scoped>
.landing {
  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: clamp(32px, 6vw, 96px);
  background-color: #0b1020;
  background-image: linear-gradient(90deg, rgb(5 11 25 / 0.4), transparent 65%), url('/images/scenes/landing-desktop.webp');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.content { width: min(100%, 560px); }
h1 {
  margin: 0 0 24px;
  color: #fff9ed;
  font-family: Gaegu, system-ui, sans-serif;
  font-size: clamp(3.8rem, 6vw, 6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  text-shadow: 0 3px 20px rgb(0 0 0 / 0.4);
}
p { margin: 0; color: #f1eee8; font-size: clamp(1.05rem, 1.6vw, 1.25rem); line-height: 1.75; text-shadow: 0 2px 12px rgb(0 0 0 / 0.6); }
.actions { margin-top: 40px; }
.ask { margin-bottom: 12px; font-weight: 600; }
.who { display: flex; flex-wrap: wrap; gap: 12px; }
@media (max-width: 700px) { .who { justify-content: center; } }
.start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 60px;
  box-sizing: border-box;
  padding: 8px 8px 8px 28px;
  border: 1px solid rgb(255 255 255 / 0.35);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 10px 40px rgb(0 0 0 / 0.3), inset 0 1px 0 rgb(255 255 255 / 0.25);
  transition: transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}
.arrow {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffcf8a;
  color: #2a1d10;
  font-size: 1.1rem;
  transition: transform 0.25s ease;
}
.start:hover { transform: translateY(-2px); background: rgb(255 255 255 / 0.22); box-shadow: 0 14px 44px rgb(0 0 0 / 0.35), 0 0 0 4px rgb(255 207 138 / 0.18), inset 0 1px 0 rgb(255 255 255 / 0.3); }
.start:hover .arrow { transform: translateX(3px); }
.start:active { transform: translateY(0) scale(0.98); }
.start:focus-visible { outline: 3px solid #fff; outline-offset: 4px; }
small { display: block; margin-top: 16px; color: #e8e6f0; opacity: 0.8; font-size: 0.8rem; }

@media (max-width: 700px) {
  .landing {
    padding: max(44px, env(safe-area-inset-top)) 20px max(36px, env(safe-area-inset-bottom));
    background-image: linear-gradient(180deg, rgb(5 11 25 / 0.18), transparent 40%, transparent 65%, rgb(5 11 25 / 0.32)), url('/images/scenes/landing-mobile.webp');
  }
  .content { min-height: calc(100dvh - 80px); display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; }
  .intro { padding-top: clamp(12px, 4dvh, 40px); }
  h1 { margin-bottom: 14px; font-size: clamp(2.8rem, 12vw, 4rem); }
  p { font-size: 1.02rem; }
  .actions { margin-top: 24px; }
}

@media (prefers-reduced-motion: reduce) { .start, .arrow { transition: none; } }
</style>
