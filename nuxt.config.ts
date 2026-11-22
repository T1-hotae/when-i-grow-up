export default defineNuxtConfig({
  compatibilityDate: '2026-11-22',
  modules: ['@tresjs/nuxt'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '어른이 되면',
      meta: [{ name: 'description', content: '열 살의 내가 편지를 보냈어요. 꿈꾸던 어른이 되었나요?' }],
    },
  },
})
