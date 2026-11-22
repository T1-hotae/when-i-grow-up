import { dreams, type DreamId } from '../data/script'

// 직접 쓴 꿈을 결과 유형으로 바꾼다. 못 알아들으면 'unknown'(고양이형)
export function matchDream(text: string): DreamId {
  const t = text.replace(/\s/g, '')
  if (!t) return 'unknown'
  for (const [id, d] of Object.entries(dreams)) {
    if (id !== 'unknown' && [d.label, ...(d.keywords ?? [])].some(k => t.includes(k))) return id as DreamId
  }
  return 'unknown'
}
