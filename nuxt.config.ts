const SITE = 'https://when-i-grow-up-rust.vercel.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-22',
  modules: ['@tresjs/nuxt'],
  css: ['~/assets/css/ending.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '어른이 되면',
      meta: [
        { name: 'description', content: '어젯밤 꿈에 열 살의 내가 나왔어요. 나 커서 뭐가 됐어?' },
        // 첫 화면 공유 미리보기. 결과 페이지는 result/[id].vue의 useSeoMeta가 덮어쓴다
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '어른이 되면' },
        { property: 'og:description', content: '어젯밤 꿈에 열 살의 내가 나왔어요. 나 커서 뭐가 됐어?' },
        { property: 'og:image', content: `${SITE}/images/social/og.jpg` }, // 카카오톡은 전체 주소만 읽는다
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
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
  $production: {
    // Vercel Analytics: 대시보드에서 켜면 이 주소가 생긴다 (@vercel/analytics는 vue-router 5와 안 맞아 스크립트로 넣음)
    app: { head: { script: [{ src: '/_vercel/insights/script.js', defer: true }] } },
    // 서버리스는 파일이 안 남아서 편지를 Upstash Redis에 쌓는다. UPSTASH_REDIS_REST_URL·_TOKEN 환경변수를 드라이버가 직접 읽는다
    nitro: { storage: { data: { driver: 'upstash', base: 'when-i-grow-up' } } },
  },
})
