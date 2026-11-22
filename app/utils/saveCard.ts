import { dreams, landing, scene5, type DreamId } from '~/data/script'

const W = 1080
const H = 1920

// 카드 그림 위에 글자를 얹어 png로 내려받는다 (화면의 ResultCard와 같은 배치)
export async function saveCard(id: DreamId, worries: number, proud: string) {
  const { name, desc, words } = dreams[id].type
  const img = new Image()
  img.src = `/images/card-${id}.webp`
  await Promise.all([img.decode(), document.fonts.load('60px Gaegu', words)]) // 한글 글꼴은 쓰는 글자가 든 조각만 받아 온다

  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  if (!g) return
  g.drawImage(img, 0, 0, W, H)
  shade(g, 0, 620, true)
  shade(g, H - 820, 820, false)

  g.fillStyle = '#fff'
  g.textAlign = 'center'
  g.font = '700 80px sans-serif'
  g.fillText(name, W / 2, 230)
  g.font = '42px sans-serif'
  wrap(g, desc, 330, 60)
  g.font = '60px Gaegu, sans-serif'
  wrap(g, `"${words}"`, 1380, 80)
  g.font = '38px sans-serif'
  g.fillText(scene5.worryCount(worries), W / 2, 1660)
  g.fillText(`${scene5.proudLabel}: ${proud}`, W / 2, 1720)
  g.globalAlpha = 0.6
  g.fillText(landing.title, W / 2, 1850)

  const a = document.createElement('a')
  a.href = c.toDataURL('image/png')
  a.download = `${landing.title}-${id}.png`
  a.click()
}

function shade(g: CanvasRenderingContext2D, y: number, h: number, darkTop: boolean) {
  const grad = g.createLinearGradient(0, y, 0, y + h)
  grad.addColorStop(darkTop ? 0 : 1, 'rgba(5, 8, 20, 0.75)')
  grad.addColorStop(darkTop ? 1 : 0, 'rgba(5, 8, 20, 0)')
  g.fillStyle = grad
  g.fillRect(0, y, W, h)
}

// 띄어쓰기 단위로 줄을 바꾼다
function wrap(g: CanvasRenderingContext2D, text: string, y: number, lineHeight: number, max = 900) {
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (line && g.measureText(next).width > max) {
      g.fillText(line, W / 2, y)
      y += lineHeight
      line = word
    }
    else {
      line = next
    }
  }
  g.fillText(line, W / 2, y)
}
