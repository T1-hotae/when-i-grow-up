# 이미지 프롬프트

모든 그림은 17장이에요. 각 그림의 프롬프트는 통째로 복사해서 쓰면 됩니다.

- 저장 위치: `public/images/<파일 이름>`
- 파일 이름 끝의 `astronaut`, `teacher` 같은 말은 `app/data/script.ts`의 꿈 id와 같아요. 코드에서는 `/images/card-${id}.webp`처럼 불러옵니다.
- 사람 캐릭터(열 살의 나)는 따로 그리지 않아요. 같은 얼굴을 여러 장에서 똑같이 뽑는 게 AI 그림에서 제일 어렵기 때문이에요. 아이는 편지 글씨와 크레용 그림으로만 등장합니다.

## 그림체 두 가지

**A. 장면 그림체 (방, 창밖, 결과 카드, 미리보기)**
```
soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos
```

**B. 열 살 그림체 (벽에 붙는 크레용 그림 8장)**
```
a drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

아래 프롬프트에는 이 문장이 이미 들어 있어요.

## 뽑는 순서

1. `window-city`를 먼저 4장쯤 뽑고 마음에 드는 걸 하나 고릅니다. 이 그림이 장면 그림체의 기준이 돼요.
2. 나머지 A 그림체 그림은 고른 그림을 레퍼런스 이미지로 함께 넣고 "same style as the reference image"를 덧붙여 뽑습니다. (Midjourney는 `--sref`, ChatGPT나 Gemini는 이미지 첨부)
3. 크레용 그림도 첫 장(`drawing-house`)을 고른 뒤 나머지 7장의 레퍼런스로 씁니다. 그래야 같은 아이가 그린 것처럼 보여요.
4. 비율은 도구 설정에서 맞춥니다. Midjourney는 프롬프트 끝에 `--ar 16:9`처럼 붙이면 됩니다.

## 다 뽑은 뒤 확인

- [ ] 그림 안에 글자나 가짜 글씨가 없나요? 있으면 다시 뽑거나 지웁니다. 글자는 화면에서 HTML로 얹어요.
- [ ] 결과 카드 위아래에 글자가 들어갈 빈 공간이 있나요?
- [ ] 크레용 그림 8장이 한 아이가 그린 것처럼 보이나요?
- [ ] webp로 바꿔서 한 장에 300KB 아래인가요? 휴대폰에서 빨리 떠야 해요. (미리보기 `og.jpg`만 jpg)

---

## 1. 공간 (2장)

### window-city.webp (16:9, 1920×1080)
쓰는 곳: 장면 0~4의 창문 너머. 창틀은 3D로 만들기 때문에 그림에는 넣지 않아요.
```
View from a 4th-floor window of a small one-room apartment at 2 a.m.: a quiet city at night, scattered lit apartment windows, a softly glowing shop sign far below with no letters, a few street lamps, thin mist, deep navy sky with a faint crescent moon, no people. Straight-on view that fills the frame edge to edge, no window frame. Calm and a little lonely, but warm. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos
```

### letter-paper.webp (3:4, 1200×1600)
쓰는 곳: 장면 1~4의 편지지. 아이의 말이 여기에 써져요. 글씨는 HTML로 얹고, 번진 자국은 꿈 칸 자리예요.
```
A sheet of children's letter paper seen flat from directly above, pale cream paper with faint blue horizontal lines, small crayon doodles only along the edges (a star, a rocket, a smiling sun, a cat), soft creases from being folded into a paper airplane and unfolded again, one small water stain in the middle-left area, a large empty center for handwriting. Soft even light, detailed paper texture, no text, no letters, no handwriting
```

## 2. 열 살의 크레용 그림 (8장)

장면 3에서 답할 때마다 벽에 한 장씩 붙어요.
- 질문 1 뒤: `drawing-house`
- 질문 2 뒤 "내가 ○○ 되고 싶었던 건…" 대사와 함께: `dream-<꿈 id>` (고른 꿈의 그림 한 장)
- 질문 3 뒤: `drawing-playground`

모두 4:3, 1600×1200

### drawing-house.webp
```
A child and a small dog standing in front of a little house with a red roof, a big smiling sun in the corner, green grass drawn as zigzag lines, a few flowers. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### drawing-playground.webp
```
Children playing on a school playground: a slide, a swing, a soccer ball, three kids running with big smiles, clouds drawn as bumpy lines. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-astronaut.webp (우주비행사)
```
"Me when I grow up": a grown-up astronaut planting a flag on a red planet, a rocket behind, stars and a ringed planet in a black crayon sky. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-teacher.webp (선생님)
```
"Me when I grow up": a grown-up teacher smiling in front of a green chalkboard with simple chalk shapes and no words, small students at desks raising their hands happily. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-doctor.webp (의사)
```
"Me when I grow up": a grown-up doctor in a white coat with a stethoscope giving a gentle shot to a smiling kid who is not crying, a big red heart drawn above them. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-celebrity.webp (연예인)
```
"Me when I grow up": a grown-up star singing on a stage with a microphone, spotlights drawn as yellow triangles, a crowd of tiny smiling faces and hearts. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-painter.webp (화가)
```
"Me when I grow up": a grown-up painter at an easel painting a rainbow and flowers, holding a palette, colorful paint splashes all around. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-unknown.webp (기억이 안 나 → 치킨집 사장)
```
"Me when I grow up": a grown-up fried chicken shop owner in an apron proudly holding up a big plate of fried chicken in front of a small shop, the shop sign shows only a drawing of a chicken with no letters, smiling customers. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

## 3. 결과 카드 (6장)

쓰는 곳: 장면 5 결과 카드와 공유 이미지. 유형 이름과 설명은 위쪽 빈 공간에, 버튼은 아래쪽 빈 공간에 HTML로 얹어요. 사람은 넣지 않아요.

모두 9:16, 1080×1920. 아래 문장이 공통으로 들어가 있어요.
`Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline.`

### card-astronaut.webp (종이비행기형 어른)
```
A white paper airplane, slightly crumpled from falling before, gliding upward again over quiet night rooftops, leaving a faint trail of light. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-teacher.webp (등대형 어른)
```
A small lighthouse on a rocky shore at night, its warm beam lighting a path across the dark sea for a tiny boat. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-doctor.webp (우산형 어른)
```
An amber umbrella standing on a rainy night street, tilted to shelter a small sleeping kitten, while rain falls on the umbrella's other side. Puddles reflect street lights. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-celebrity.webp (모닥불형 어른)
```
A small campfire at night with mugs and folded blankets placed in a circle around it, warm sparks drifting up into the sky. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-painter.webp (늦게 피는 꽃형 어른)
```
A single flower blooming late in an autumn field at night, its petals deep and vivid while the grass around it has already turned golden, a few fireflies nearby. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-unknown.webp (고양이형 어른)
```
A cat stretching happily in a warm patch of lamplight on a wooden floor beside a window at night, completely relaxed. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky seen through the window, loosely tracing the cat's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

## 4. 공유 미리보기 (1장)

### og.jpg (1.91:1, 1200×630)
쓰는 곳: 카카오톡이나 인스타에 링크를 보냈을 때 뜨는 미리보기. 제목은 왼쪽 빈 공간에 나중에 얹어요.
```
A cozy dark one-room apartment at 2 a.m., a closed laptop on a wooden desk, a warm desk lamp, a white paper airplane resting on the sill of an open window, city lights outside. The left third of the image is calm and empty for a title. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

---

## 지금은 안 뽑는 것

- 밤하늘: 장면 4의 별은 3D로 만들어요 (InstancedMesh). 그림은 필요 없어요.
- 구겨진 걱정 종이: 3D 종이 공으로 충분해요.
- 책상 소품(컵라면, 포스트잇): 배경을 투명하게 뽑아야 해서 손이 많이 가요. 방이 허전하면 그때 추가합니다.
