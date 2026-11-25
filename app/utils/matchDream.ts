import { dreams, kidDreams, type DreamId } from '../data/script'

// 직접 쓴 꿈을 결과 유형과 화면에 다시 보여 줄 말로 바꾼다.
// name은 쓴 글이 아니라 목록 안의 말이라 욕이나 아무말이 화면에 다시 나오지 않는다. 못 찾으면 name은 ''
export function matchDream(text: string): { id: DreamId, name: string } {
  const t = text.replace(/\s/g, '')
  let best = { id: 'unknown' as DreamId, name: '', len: 0 }
  // 가장 길게 맞은 말을 고른다: "수의사"가 "의사"보다, "소설가"가 "작가"보다 먼저
  const pick = (word: string, id: DreamId, name: string) => {
    const w = word.replace(/\s/g, '')
    if (w && t.includes(w) && w.length > best.len) best = { id, name, len: w.length }
  }
  for (const [id, d] of Object.entries(dreams) as [DreamId, typeof dreams[DreamId]][]) {
    if (id !== 'unknown') [d.label, ...(d.keywords ?? [])].forEach(k => pick(k, id, d.name))
  }
  kidDreams.forEach(k => pick(k, 'unknown', k))
  return { id: best.id, name: best.name }
}
