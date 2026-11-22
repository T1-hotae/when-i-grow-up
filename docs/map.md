# 지도: 무슨 이야기고, 어디에 뭐가 있나

처음 보는 사람(사람이든 에이전트든)이 이 파일 하나만 보고 고칠 파일을 바로 찾게 하는 문서입니다.
자세한 대사는 [story.md](story.md), 왜 그렇게 정했는지는 [planning-session.md](planning-session.md)에 있습니다.

## 이야기 한 줄

취업 준비 중인 "나"가 새벽에 잠들어, 꿈속에서 열 살의 나를 만난다. 그때 꿈꾸던 직업은 못 됐어도 그 안의 "마음"은 아직 있다는 걸 알게 되고, "나는 ○○형 어른" 카드를 받는다. 약 6분짜리 3D 웹 스토리.

## 장면 순서와 담당 파일

장면은 전부 [app/pages/play.vue](../app/pages/play.vue)의 `story()` 함수 한 곳에서 순서대로 흘러갑니다. 대사는 전부 [app/data/script.ts](../app/data/script.ts)에 장면별 객체로 있습니다.

| 장면 | 내용 | 대사 (script.ts) | 화면 (컴포넌트) |
| --- | --- | --- | --- |
| 첫 화면 | 제목, 성별(여자/남자) 고르면 시작 | `landing` | [pages/index.vue](../app/pages/index.vue) |
| 0-1 노트북 | 탈락 메일, 동기 단톡방, 부모 알림(숨은 길: 4초 안에 누르면 하소연) → 노트북 덮기 | `scene0.desk`, `family` | [Desktop.vue](../app/components/Desktop.vue), [Messenger.vue](../app/components/Messenger.vue) |
| 0-2 이불 속 폰 | 친구들 인스타 스토리 넘기기 | `scene0.bed` | play.vue 템플릿 안 (스토리 화면) |
| 0-3 천장 | 야광별 보다 잠듦 (눈꺼풀 감기) | `scene0.ceiling` | [Room.vue](../app/components/Room.vue) (`view: 'ceiling'`) |
| 1 꿈속 검은 화면 | 열 살의 나와 대화, 어릴 적 꿈 적기 | `scene1`, `dreams` | play.vue 템플릿 (대사·입력창) |
| 2 어른 방 구경 | 아이가 내 방 물건을 하나씩 묻고 내가 대답을 고름 | `scene2` | play.vue 템플릿 (선택지, 물건 이모지 `.thing`) |
| 3 그림일기 숙제 | 일기를 넘기며 꿈 속 "마음" 발견, 도장, 창밖 불빛 | `scene3` | [Diary.vue](../app/components/Diary.vue), [CityWindow.vue](../app/components/CityWindow.vue) |
| 4 답장 | 열 살의 나에게 답장 고르기 | `scene4` | play.vue 템플릿 |
| 깨어남 | 아침, 부모 채팅에 답장 (숨은 길이면 밤새 온 답장) | `wake`, `family` | Room.vue, Messenger.vue |
| 5 결과 카드 | ○○형 어른 카드, 공유·저장 | `scene5`, `dreams[id].type` | [ResultCard.vue](../app/components/ResultCard.vue) |

## 성별 (`Me`: son / daughter)

첫 화면에서 고른 값이 `/play?me=son`으로 넘어옵니다(없으면 daughter). play.vue 맨 위의 `me` 하나로 정해집니다.
아들이면 엄마, 딸이면 아빠가 새벽 알림을 보냅니다(`family[me]`). 단톡방 `scene0.desk.chat[me]`, 스토리 `scene0.bed.stories[me]`, 장면 2 마지막 물건 `scene2.hobby[me]`, 방 색과 물건 Room.vue `PALETTES`도 성별마다 다릅니다.
결과 카드와 공유 페이지는 성별과 상관없습니다.

## 그 밖의 파일

- [app/components/Room.vue](../app/components/Room.vue): 3D 방 전체(TresJS). 카메라 위치는 `view` prop(`room`, `screen`, `bed`, `ceiling`, `desk`, `window`, `sky`)으로 바꿉니다.
- [app/pages/result/[id].vue](../app/pages/result/[id].vue): 공유 링크로 들어오는 결과 유형 페이지 (`/result/doctor` 등).
- [app/utils/matchDream.ts](../app/utils/matchDream.ts): 직접 쓴 꿈 글자를 결과 유형 id로 바꿈. 못 알아들으면 `unknown`.
- [app/utils/saveCard.ts](../app/utils/saveCard.ts): 결과 카드를 png로 저장.
- [server/api/letters.post.ts](../server/api/letters.post.ts): 고른 답의 번호만 받는 API. 직접 쓴 글은 받지 않음.
- [nuxt.config.ts](../nuxt.config.ts): 페이지 제목·설명, 손글씨 글꼴.

## 결과 유형 (꿈)

`DreamId` 12개: scientist, astronaut, teacher, doctor, soccer, celebrity, president, police, gamer, designer, painter, unknown(고양이형).
유형 하나를 고칠 땐 script.ts의 `dreams[id]`(이름, 마음, 결과 문구)와 아래 그림을 같이 봅니다.

## 그림 (public/images)

| 폴더 | 무엇 |
| --- | --- |
| `scenes/` | 첫 화면 배경, 창밖 도시 |
| `stories/` | 장면 0-2 친구 스토리 사진 |
| `avatars/` | 스토리·단톡방 프로필 |
| `drawings/` | 열 살의 크레용 그림 (그림일기, `dream-<id>`) |
| `cards/` | 결과 카드 배경 (`card-<id>`) |
| `ui/` | 이모티콘 등 |
| `social/` | 공유 미리보기 og.jpg |

그림을 새로 뽑을 땐 [image-prompts.md](image-prompts.md)의 프롬프트를 씁니다. 원본(가공 전)은 `assets/image-sources/`에 둡니다.

## 소리 (public/audio)

배경음악 `bgm/`(효과음 `sfx/`는 아직 없음). 재생은 [app/utils/bgm.ts](../app/utils/bgm.ts)의 `bgm('곡 이름')` 한 줄이고, 장면마다 play.vue `story()` 안에서 부릅니다. 소리 끄기 버튼은 [app.vue](../app/app.vue)에 있습니다. 프롬프트는 [bgm-prompts.md](bgm-prompts.md).

## 개발 팁

- `/play?fast`: 10배 빨리 넘어감 (확인용). 새벽 알림 4초는 fast여도 그대로
- `/play?me=son&fast`: 남자로 바로 확인
- 대사를 고치면 script.ts를 먼저, 그다음 story.md를 맞춥니다.
