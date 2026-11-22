export default defineNuxtConfig({
  compatibilityDate: '2026-11-22',
  modules: ['@tresjs/nuxt'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '어른이 되면',
      meta: [{ name: 'description', content: '열 살의 내가 편지를 보냈어요. 꿈꾸던 어른이 되었나요?' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 열 살 손글씨 글꼴
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap' },
      ],
    },
  },
})
