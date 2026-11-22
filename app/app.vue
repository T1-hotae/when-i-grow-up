<template>
  <NuxtPage />
  <button class="mute" :aria-label="muted ? '소리 켜기' : '소리 끄기'" @click.stop="toggleMute">{{ muted ? '🔇' : '🔊' }}</button>
</template>

<style>
.mute {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.35);
  font-size: 1.1rem;
  cursor: pointer;
}
html, body {
  margin: 0;
  background: #0b1020;
  color: #e8e6f0;
  font-family: system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  word-break: keep-all;
}
</style>
