export default defineNuxtConfig({
  compatibilityDate: '2026-11-22',
  modules: ['@tresjs/nuxt'],
  css: ['~/assets/css/ending.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '어른이 되면',
      meta: [{ name: 'description', content: '어젯밤 꿈에 열 살의 내가 나왔어요. 나 커서 뭐가 됐어?' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 열 살 손글씨 글꼴 (Hi Melody: 그림일기에 열 살 때 쓴 글씨)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Hi+Melody&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap' },
      ],
    },
  },
})
