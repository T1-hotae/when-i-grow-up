<script setup lang="ts">
import { landing } from '~/data/script'
</script>

<template>
  <main class="landing">
    <h1>{{ landing.title }}</h1>
    <p v-for="line in landing.lines" :key="line">{{ line }}</p>
    <NuxtLink to="/play" class="start">{{ landing.start }}</NuxtLink>
    <small>{{ landing.note }}</small>
  </main>
</template>

<style scoped>
.landing {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  text-align: center;
}
h1 { font-size: 2rem; margin: 0 0 16px; }
p { margin: 0; line-height: 1.6; }
.start {
  margin: 32px 0 12px;
  padding: 14px 28px;
  border-radius: 999px;
  background: #ffcf8a;
  color: #2a1d10;
  font-weight: 700;
  text-decoration: none;
}
small { opacity: 0.6; }
</style>
