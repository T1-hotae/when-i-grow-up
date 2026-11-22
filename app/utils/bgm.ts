// 배경음악은 한 번에 한 곡. 모듈에 하나만 두어서 페이지를 옮겨도 끊기지 않는다
const VOLUME = 0.5
let current: HTMLAudioElement | null = null
export const muted = ref(false)

// shortcut: iOS Safari는 volume을 못 바꿔서 페이드 없이 바로 바뀐다
function fade(a: HTMLAudioElement, to: number, ms = 1500) {
  const from = a.volume
  const t0 = performance.now()
  const step = () => {
    if (to > 0 && a !== current) return // 커지는 도중에 다른 곡으로 바뀌면 멈춘다 (줄이는 페이드가 끄게 둔다)
    const k = Math.min(1, (performance.now() - t0) / ms)
    a.volume = from + (to - from) * k
    if (k < 1) requestAnimationFrame(step)
    else if (to === 0) a.pause()
  }
  requestAnimationFrame(step)
}

/** public/audio/bgm/<name>.mp3 로 천천히 바꿔 튼다 */
export function bgm(name: string) {
  if (current?.src.endsWith(`/${name}.mp3`)) return
  if (current) fade(current, 0)
  const a = current = new Audio(`/audio/bgm/${name}.mp3`)
  a.loop = true
  a.volume = 0
  a.muted = muted.value
  // 휴대폰은 한 번 누르기 전엔 소리를 못 낸다: 막히면 첫 터치 때 다시 튼다
  const start = () => {
    if (a === current) a.play().then(() => a === current ? fade(a, VOLUME) : a.pause()).catch(() => addEventListener('pointerdown', start, { once: true }))
  }
  start()
}

export function toggleMute() {
  muted.value = !muted.value
  if (current) current.muted = muted.value
}
