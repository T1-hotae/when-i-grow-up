import { dreams, scene2, scene3, scene4, type DreamId } from '../../app/data/script'

// 답장 한 통 = 고른 답의 번호들 + 지금 가는 길. 직접 쓴 꿈·잘한 일과 "나만 봐요" 한 줄은 받지 않는다
// 지금 가는 길(path)만 직접 쓴 글도 받는다: 입력칸에 익명으로 모인다고 적혀 있다
type Body = { dream: DreamId, q1: number, q2: number, path: string | null, proud: number, reply: number, things: number }

const pick = <T>(list: readonly T[], i: unknown) => (Number.isInteger(i) ? list[i as number] : undefined)

export default defineEventHandler(async (event) => {
  const b = await readBody<Partial<Body>>(event)
  const letter = {
    dream: b?.dream && Object.hasOwn(dreams, b.dream) ? b.dream : undefined,
    q1: pick(scene3.q1.answers, b?.q1)?.text,
    q2: pick(scene3.q2.answers, b?.q2)?.text,
    path: typeof b?.path === 'string' ? b.path.trim().slice(0, scene3.q2.path.custom.max) || null : null, // 비밀이면 null
    proud: b?.proud === -1 ? null : pick(scene3.q3.answers, b?.proud), // -1: 직접 써서 안 보낸 답
    reply: pick(scene4.replies, b?.reply),
    things: Number.isInteger(b?.things) && b!.things! >= 0 && b!.things! <= scene2.things.length + 1 ? b!.things : undefined, // +1: 화면엔 취미 물건(scene2.hobby)이 하나 더 있다
  }
  if (Object.values(letter).includes(undefined)) throw createError({ statusCode: 400, statusMessage: '잘못된 답장이에요' })

  // 개발 땐 .data/kv 파일, 배포(Vercel)에선 Upstash Redis에 쌓인다 (nuxt.config.ts $production)
  await useStorage('data').setItem(`letters:${Date.now()}-${crypto.randomUUID()}`, { ...letter, at: new Date().toISOString() })
  return { ok: true }
})
