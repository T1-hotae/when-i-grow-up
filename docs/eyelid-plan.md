# 눈 감기·뜨기 모션 계획

쓰는 곳: 장면 0-3 잠들기 ([play.vue](../app/pages/play.vue) `closeEyes()`), 장면 1→2 꿈속 방이 보일 때, 깨어남(아침 천장).

## 지금 문제

- **하단이 안 가려진다.** 눈꺼풀(`.lid`)에 `z-index`가 없어서 `.panel`(z-index 3, 아래쪽 자막·버튼·바닥 그라데이션)과 `.next` 같은 층이 눈꺼풀 위에 그려진다. 화면 아래쪽이 가장 많이 겹친다.
- 위·아래 눈꺼풀이 두 장이라 각자 딱 20%씩 움직여야 맞물린다. 화면 비율이나 타이밍이 조금만 어긋나도 틈이 생긴다.
- 감아도 눈꺼풀 가장자리 곡선이 그대로다. 실제 눈은 감을수록 위아래 곡선이 납작해지다가 가로 한 줄로 만난다.
- 감기와 뜨기가 같은 속도(0.45초, ease-in-out)다. 잠결에 뜨는 눈도 깜빡임처럼 빠르다.

## 바꿀 방식: 구멍 하나로 된 눈

눈꺼풀 두 장을 **한 장의 검은 막과 가운데 타원 구멍**으로 바꾼다.

```html
<div class="eye" :style="{ '--open': ui.eyes, '--dur': ui.eyeDur }" aria-hidden="true" />
```

```css
.eye {
  position: absolute; left: 50%; top: 50%; z-index: 20; /* 모든 층 위 */
  width: 170vmax;                             /* 다 뜨면 화면 밖까지 커서 검은 데가 안 보인다 */
  height: calc(120vmax * var(--open));
  border-radius: 50%;                         /* 타원 = 눈 모양 틈 */
  box-shadow: 0 0 6vmin 300vmax #000;         /* 구멍 밖 전부 검게. 블러로 눈꺼풀 가장자리가 부드럽다 */
  transform: translate(-50%, -50%);
  transition: height var(--dur) var(--ease, ease-in-out);
  pointer-events: none;
}
```

- `--open` 1 = 다 뜸, 0 = 다 감음. 높이만 줄이니 곡선이 저절로 납작해지다 가운데 가로 한 줄로 닫힌다.
- `scaleY`로 줄이면 그림자까지 같이 납작해져 화면이 드러난다. 그래서 `height`를 움직인다 (요소 하나라 성능 부담은 작다).
- 검은 막이 화면 전체(300vmax)라서 위·아래·모서리 어디에도 틈이 생길 수 없다.
- `z-index: 20`으로 자막·버튼·꿈속 화면 위에 올린다. 눈 감은 동안 누를 것은 없으니 가려도 된다.

## 상태

`ui.eyes: boolean` 을 숫자로 바꾼다.

| 값 | 뜻 |
|----|----|
| `ui.eyes` | 0~1, 뜬 정도 |
| `ui.eyeDur` | 이번 움직임 길이 (`'0.18s'` 등) |

헬퍼 하나로 묶는다.

```ts
async function eye(open: number, ms: number) {
  Object.assign(ui, { eyes: open, eyeDur: `${ms}ms` })
  await sleep(ms)
}
```

## 장면별 모션

### 잠들기 (장면 0-3, `closeEyes`)
졸려서 무거운 눈꺼풀. 깜빡임이 점점 느려지고 덜 뜬다.

1. `eye(0, 220)` 감기 → `eye(0.9, 350)` 뜨기
2. 400ms 멈춤
3. `eye(0, 300)` → `eye(0.6, 600)` (반쯤만 뜬다)
4. 600ms 멈춤
5. `eye(0, 1200)` 천천히 감긴다 → 600ms 뒤 `ui.dark = true`

### 꿈속 방이 보일 때 (장면 1→2)
검은 화면이 걷히며 방이 보이는 장면이라 눈꺼풀은 바로 다 뜬 상태로 둔다 (`eyes = 1`, `eyeDur 0`). 지금처럼 `.dark` 페이드만 쓴다.

### 깨어남 (아침 천장)
잠결: 실눈 → 다시 감김 → 제대로 뜬다.

1. `eyes = 0` 상태에서 카메라를 천장으로 옮기고 2400ms 기다린다 (카메라가 멈춘 뒤 뜬다, 이미 반영됨)
2. `eye(0.25, 700)` 실눈
3. 500ms 멈춤
4. `eye(0, 250)` 다시 감김
5. 300ms 멈춤
6. `eye(1, 1400)` 천천히 다 뜬다 (`--ease: cubic-bezier(.2,.7,.3,1)`, 뜰 때는 끝이 느리게)

## 접근성

- `prefers-reduced-motion`: 깜빡임 없이 `eyes`를 0/1로 바로 바꾼다 (`transition: none`, 지금 규칙 그대로).
- `.eye`는 `aria-hidden`. 화면 읽기 흐름은 지금처럼 대사로 이어진다.

## 할 일

1. [play.vue](../app/pages/play.vue): `.lid` 두 개와 CSS 지우고 `.eye` 하나로 교체
2. `ui.eyes`를 숫자(기본 1)로, `ui.eyeDur` 추가, `eye()` 헬퍼
3. `closeEyes()`와 깨어남 부분을 위 순서로 바꾸기
4. 장면 1→2의 `ui.eyes = false` → `ui.eyes = 1`
5. 확인: 폰 세로·PC 가로에서 다 감았을 때 아래 자막 영역까지 검은지, `?fast`로 흐름이 끊기지 않는지
6. [story.md](story.md) 96행·320행 묘사가 바뀐 모션과 맞는지 보고, 필요하면 고치기
