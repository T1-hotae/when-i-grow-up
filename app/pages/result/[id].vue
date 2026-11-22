<script setup lang="ts">
import { dreams, landing, type DreamId } from '~/data/script'

// 유형을 넘겨 볼 때 페이지를 새로 그린다
definePageMeta({ key: route => route.fullPath })

const ids = Object.keys(dreams) as DreamId[]
const id = useRoute().params.id as DreamId
if (!ids.includes(id)) throw createError({ statusCode: 404, statusMessage: '없는 유형이에요' })

const at = ids.indexOf(id)
const prev = ids[(at + ids.length - 1) % ids.length]
const next = ids[(at + 1) % ids.length]
const { name, desc } = dreams[id].type

useSeoMeta({
  title: `${name} | ${landing.title}`,
  description: desc,
  ogTitle: `나는 ${name}`,
  ogDescription: `${desc}. ${landing.lines.join(' ')}`,
  ogImage: new URL('/images/og.jpg', useRequestURL()).href, // 카카오톡 미리보기는 전체 주소가 필요하다
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main class="result">
    <ResultCard :id="id" />
    <nav>
      <NuxtLink :to="`/result/${prev}`" aria-label="이전 유형">‹</NuxtLink>
      <NuxtLink to="/" class="start">{{ landing.start }}</NuxtLink>
      <NuxtLink :to="`/result/${next}`" aria-label="다음 유형">›</NuxtLink>
    </nav>
  </main>
</template>

<style scoped>
.result {
  min-height: 100dvh;
  padding: 24px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
nav { display: flex; align-items: center; gap: 12px; }
nav a {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  color: inherit;
  text-decoration: none;
  font-size: 1.1rem;
}
nav .start { padding: 12px 24px; background: #ffcf8a; color: #2a1d10; font-weight: 700; font-size: 1rem; }
</style>
