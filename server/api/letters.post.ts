import { dreams, scene2, scene3, scene4, type DreamId } from '../../app/data/script'

// 답장 한 통 = 고른 답의 번호들. 직접 쓴 꿈과 "나만 봐요" 한 줄은 받지 않는다
type Body = { dream: DreamId, q1: number, q2: number, proud: number, reply: number, things: number }

const pick = <T>(list: readonly T[], i: unknown) => (Number.isInteger(i) ? list[i as number] : undefined)

export default defineEventHandler(async (event) => {
  const b = await readBody<Partial<Body>>(event)
  const letter = {
    dream: b?.dream && Object.hasOwn(dreams, b.dream) ? b.dream : undefined,
    q1: pick(scene3.q1.answers, b?.q1)?.text,
    q2: pick(scene3.q2.answers, b?.q2)?.text,
    proud: pick(scene3.q3.answers, b?.proud),
    reply: pick(scene4.replies, b?.reply),
    things: Number.isInteger(b?.things) && b!.things! >= 0 && b!.things! <= scene2.things.length ? b!.things : undefined,
  }
  if (Object.values(letter).includes(undefined)) throw createError({ statusCode: 400, statusMessage: '잘못된 답장이에요' })

  // shortcut: Nitro 기본 저장소(.data/kv 파일)에 쌓는다, 서버리스로 배포하거나 집계가 필요해지면 nuxt.config의 nitro.storage.data를 DB 드라이버(redis 등)로 바꾸거나 Supabase insert로 바꾼다
  await useStorage('data').setItem(`letters:${Date.now()}-${crypto.randomUUID()}`, { ...letter, at: new Date().toISOString() })
  return { ok: true }
})
