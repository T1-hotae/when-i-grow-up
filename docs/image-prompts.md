# 이미지 프롬프트

모든 그림은 17장이에요 (남자용 스토리 3장은 따로). 각 그림의 프롬프트는 통째로 복사해서 쓰면 됩니다.

- 저장 위치: 카드 `public/images/cards/`, 크레용 그림 `public/images/drawings/`, 스토리 `public/images/stories/`, 장면 `public/images/scenes/`, 이모티콘 `public/images/ui/`, 공유 미리보기 `public/images/social/`
- 파일 이름 끝의 `astronaut`, `teacher` 같은 말은 `app/data/script.ts`의 꿈 id와 같아요. 코드에서는 `/images/cards/card-${id}.webp`처럼 불러옵니다.
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
3. 크레용 그림도 첫 장(`drawing-house`)을 고른 뒤 나머지 13장의 레퍼런스로 씁니다. 그래야 같은 아이가 그린 것처럼 보여요.
4. 비율은 도구 설정에서 맞춥니다. Midjourney는 프롬프트 끝에 `--ar 16:9`처럼 붙이면 됩니다.

## 다 뽑은 뒤 확인

- [ ] 그림 안에 글자나 가짜 글씨가 없나요? 있으면 다시 뽑거나 지웁니다. 글자는 화면에서 HTML로 얹어요.
- [ ] 결과 카드 위아래에 글자가 들어갈 빈 공간이 있나요?
- [ ] 크레용 그림 14장이 한 아이가 그린 것처럼 보이나요?
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

## 2. 열 살의 크레용 그림 (14장)

장면 3의 그림일기 그림 칸에 들어가요 ([Diary.vue](../app/components/Diary.vue)).
- 1쪽 "나의 꿈": `dream-<꿈 id>` (고른 꿈의 그림 한 장)
- 2쪽 "부끄러운 날": `drawing-blanket` (아래 5번)
- 마지막 쪽 "오늘": 그림 없이 「참 잘했어요」 도장만 찍혀요
- `drawing-house`, `drawing-playground`는 이제 쓰지 않아요

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

### dream-scientist.webp (과학자)
```
"Me when I grow up": a grown-up scientist in a white lab coat holding a bubbling flask, a friendly boxy robot beside, a microscope on the table. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-soccer.webp (축구선수)
```
"Me when I grow up": a grown-up soccer player kicking a ball into a goal net on a green field, a crowd waving red flags in the stands. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-president.webp (대통령)
```
"Me when I grow up": a grown-up president waving from a podium with a microphone, a large South Korean Taegeukgi flag behind, many tiny smiling people holding hands. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-police.webp (경찰)
```
"Me when I grow up": a grown-up police officer with a cap blowing a whistle, a police car with a red and blue light, a small kitten safe on the sidewalk. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-gamer.webp (프로게이머)
```
"Me when I grow up": a grown-up pro gamer sitting at a computer with headphones, holding up a big gold trophy, tiny cheering people behind. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-designer.webp (디자이너)
```
"Me when I grow up": a grown-up fashion designer holding up a colorful dress on a hanger, a mannequin and rolls of fabric beside, scissors and a measuring tape. The figure is simple and gender-neutral. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-unknown.webp (기억이 안 나 → 직업 없는 범용 그림, 일기 글의 직업은 흐릿하게)
```
"Me when I grow up": a simple gender-neutral grown-up standing on a small green hill with both arms open wide and a big smile, plain everyday clothes with no uniform, no tools and no props that hint at any job, a big smiling sun, bumpy clouds, a few flowers and a winding path leading off the page. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### dream-unknown-daughter.webp (딸 경로)
```
Same composition and childlike crayon style as dream-unknown.webp, but the grown-up is a woman with simple shoulder-length wavy hair and a plain bright red everyday shirt and pants. Keep the small green hill, open arms, big smile, smiling sun, bumpy clouds, flowers, winding path, yellowed paper, and full-sheet overhead scan. No uniform, tools, job props, text, letters, or signature.
```

## 3. 결과 카드 (12장)

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

### card-scientist.webp (돋보기형 어른)
```
A brass magnifying glass on a windowsill at night, focusing moonlight into a small bright spot on an open notebook full of sketches, a tiny beetle looking up at it. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-soccer.webp (운동장형 어른)
```
An empty school dirt playground at night, a worn soccer ball resting near a small goal, a scuffed line of footprints leading to it. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-president.webp (반장형 어른)
```
A dark path at night with a row of unlit paper lanterns, the first lantern glowing warmly and lighting the way for the others. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-police.webp (호루라기형 어른)
```
A silver whistle on a red string hanging from a hook beside an open door, glinting in the moonlight. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-gamer.webp (이어하기형 어른)
```
An old boxy CRT monitor glowing in a dark room, a single bright play-triangle icon on its screen, a worn game controller resting in front of it. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

### card-designer.webp (조각보형 어른)
```
A half-finished patchwork quilt of mismatched fabric squares on a wooden table at night, a needle and amber thread mid-stitch, scraps scattered around. Vertical card composition: the main subject sits in the middle third, the top quarter and the bottom third are calm empty night sky or ground for text. Faint thin constellation lines connect small stars in the sky, loosely tracing the subject's outline. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

## 4. 공유 미리보기 (1장)

### og.jpg (1.91:1, 1200×630)
쓰는 곳: 카카오톡이나 인스타에 링크를 보냈을 때 뜨는 미리보기. 제목은 왼쪽 빈 공간에 나중에 얹어요.
```
A cozy dark one-room apartment at 2 a.m., a closed laptop on a wooden desk, a warm desk lamp, a white paper airplane resting on the sill of an open window, city lights outside. The left third of the image is calm and empty for a title. Soft gouache illustration, warm desk lamp glow, deep navy night, amber highlights, gentle film grain, cozy and quiet mood, no text, no letters, no logos, no people
```

---

## 5. 대본 v2에서 추가한 그림

### drawing-blanket.webp (장면 3, 그림일기 2쪽 "부끄러운 날")
```
A child hiding under a big blanket on a bed, only two feet sticking out and kicking in the air, small motion lines around the feet, a pillow fallen on the floor. A drawing made by a 10-year-old child with crayons and colored pencils on slightly yellowed drawing paper, simple wobbly lines, uneven coloring that goes outside the lines, naive proportions, bright primary colors, visible paper texture, flat scan from directly above, the whole sheet visible with a thin margin, no text, no letters, no signature
```

### scenes/window-city-off.webp (장면 3 창밖, 16:9, 1920×1080)
새로 뽑지 않고 `scenes/window-city.webp`를 이미지 편집에 넣어 만들어요. 구도가 한 픽셀이라도 바뀌면 불 켜지는 칸이 어긋나니, 크기와 구도는 그대로 두라고 지시해요.
창문 칸 좌표는 `app/data/script.ts`의 `scene3.window.spots`에 있어요. 없으면 켜진 그림을 어둡게 깔아 대신해요.
```
Edit this image: turn off the lights in almost all apartment windows so they become dark, unlit glass with a faint cool blue reflection. Keep the street lamps and the moon glowing. Keep everything else exactly the same: same size, same composition, same buildings, same sky, same painting style. Do not move, add, or remove anything.
```

### 인스타 스토리 5장 (장면 0-2, 9:16)
- `stories/story-minji.webp`: 회사 복도와 흑백 증명사진·이름이 인쇄된 사원증
- `stories/story-junho.webp`: 바르셀로나 여행
- `stories/story-anniversary.webp`: 저녁 차 안 조수석에서 운전대·기어 변속 손잡이·운전석 남자와 함께 찍은 꽃다발, 300일 기념
- `stories/story-wedding.webp`: 결혼식
- `stories/story-daeun.webp`: 모던한 프로필 스튜디오의 복잡한 작업대. 오른쪽 위에서 내려다본 작은 모니터에 사진 선택 프로그램, 메인 사진과 아래 후보 사진이 보이는 장면

경로는 `app/data/script.ts`의 `scene0.bed.stories[me][].image`에 있습니다. 위 5장은 여자(딸)로 고른 사람이 봅니다.

### 남자(아들)용 추가 스토리 사진 3장 (장면 0-2, 9:16, 900×1600)
남자로 고르면 아래 세 장을 사용해요. 기념일은 남자가 운전석에 있는 기존 `story-anniversary.webp`를 리그램으로 다시 쓰고, 결혼식도 기존 사진을 같이 씁니다.
같은 단계의 여자용 그림을 레퍼런스로 넣고 "same photo style as the reference image"를 덧붙이면 두 길의 사진이 같은 결로 나와요.
글자는 앱이 스티커로 올리니 사진 안에는 넣지 않아요. 위쪽 3분의 1은 스티커가 올라갈 자리라 비워 둡니다.

#### stories/story-office-son.webp (junho_ 첫 출근)
```
Vertical smartphone photo for a social media story, first day at a new job. A hand holding up a white employee ID card on a lanyard in a bright modern office corridor, the card shows a small black-and-white ID photo of a young Korean man in a suit, the name area is blurred and unreadable. Glass meeting rooms and soft ceiling lights blurred in the background, shallow depth of field, natural daylight, slightly warm tone, casual phone snapshot feel. The upper third is calm background with no important details. No readable text, no logos, no company names, 9:16
```

#### stories/story-barcelona-son.webp (travel.seoyeon 바르셀로나)
```
Vertical casual smartphone photo of an ordinary Barcelona street corner on arrival: warm pale stone apartment facades with wrought-iron balconies, a small outdoor cafe, a parked scooter and a few distant pedestrians in late afternoon Mediterranean sunlight. Spontaneous, slightly imperfect travel snapshot from the sidewalk, not a staged selfie or landmark photo. The upper third has calm room for the app's "바르셀로나 왔다" sticker. No readable text, signs, logos or built-in story UI, 9:16
```

기념일 리그램은 사진 안에 글자를 굽지 않아요. `play.vue`가 여자친구의 "사랑해 💐 300일 동안 고마워" 원래 스토리와 `minsu_`의 "나도 사랑해" 답장을 겹쳐 보여 줍니다.

#### stories/story-gym-son.webp (gym_daehyun 바디프로필)
```
Vertical smartphone photo for a social media story, body profile photo shoot result day. A cluttered workbench in a modern photo studio seen from above at the upper right, a small monitor showing a photo selection program: one large main photo of a fit young Korean man posing in a gray tank top under studio light, and a row of small candidate thumbnails below it. Around the monitor: a camera body, a lens, a coffee cup, a protein shaker, cables. Soft studio lighting, clean neutral colors, casual phone snapshot feel. The upper third is calm with no important details. No readable text, no logos, no UI labels, 9:16
```

### 이제 안 쓰는 그림
- `letter-paper.webp`: 편지가 검은 화면의 흰 글씨로 바뀌어서 쓰지 않아요. 원본은 `assets/image-sources/`에 보관합니다.
- `drawing-house.webp`, `drawing-playground.webp`: 벽에 그림을 거는 대신 그림일기로 바뀌어서 쓰지 않아요.

## 지금은 안 뽑는 것

- 밤하늘: 장면 4의 별은 3D로 만들어요 (InstancedMesh). 그림은 필요 없어요.

## 장면 2 물건 그림 (6장)

`public/images/objects/object-<이름>.webp`에 512×512 투명 WebP로 둡니다. 원본 PNG는 `assets/image-sources/object-<이름>.png`에 있습니다. 선택지에서는 작은 아이콘으로, 물건을 보여 줄 때는 화면 위쪽의 큰 그림으로 씁니다.

공통 프롬프트: `Small collectible object icon for a Korean interactive bedtime story; hand-painted soft gouache with slightly imperfect edges and subtle paper grain; cozy deep-navy nighttime palette and warm amber lamplight; exactly one complete centered object in gentle three-quarter view; generous genuinely transparent padding; readable at 48px and 160px; no floor, scenery, labels, lettering, logos, border, extra objects, or shadow outside the object.`

| 파일 | 물건 요청 문장 |
| --- | --- |
| `object-coffee` | A half-finished ceramic coffee mug with coffee visible and a little moon-and-cloud decoration. |
| `object-suit` | A charcoal-navy interview suit jacket and cream shirt on one wooden hanger. |
| `object-vitamins` | An amber glass vitamin bottle with plain cream cap and two tablets. |
| `object-ramen` | A short stack of two plain paper instant noodle cups, peeled lid, and chopsticks. |
| `object-gamepad` | A slightly dusty retro handheld game console with an unlit screen. |
| `object-camera` | A slightly dusty vintage 35mm film camera with a round lens. |

`window-city-off.webp`는 `window-city.webp`를 편집 대상으로 삼아 노란 창문과 가게 불만 끈 버전입니다. 건물·창문 위치, 달, 가로등, 붓질, 구도는 최대한 보존하도록 요청했고, 생성 원본은 `assets/image-sources/window-city-off.png`에 있습니다. `CityWindow.vue`가 원래 켜진 그림의 창문 조각을 그 위에 순서대로 올립니다.
