# 배경음악·효과음 프롬프트

배경음악 5곡, 효과음 7개예요. 프롬프트는 통째로 복사해서 씁니다.

- 저장 위치: 배경음악 `public/audio/bgm/`, 효과음 `public/audio/sfx/`
- 배경음악 도구: Suno(Custom 모드, Instrumental 켜기)는 프롬프트를 Style 칸에 넣고 가사 칸은 비웁니다. Udio는 프롬프트 칸에 넣고, Manual 모드와 Instrumental을 켭니다.
- 효과음 도구: ElevenLabs Sound Effects, 또는 freesound.org에서 검색어로 찾기 (CC0만)

## 소리 방향 (모든 곡 공통)

```
instrumental, no vocals, soft and intimate, lo-fi warmth, gentle tape hiss, slow tempo, sparse arrangement, cozy late-night mood
```

현실(장면 0)은 거의 소리가 없고, 꿈(장면 1~4)에 들어가면서 오르골·피아노가 생기고, 깨어나면 밝아집니다. 같은 악기(업라이트 피아노 + 오르골)를 계속 써서 한 앨범처럼 들리게 해요.

## 뽑는 순서

1. `dream`을 먼저 4번쯤 뽑아 하나 고릅니다. 이 곡의 멜로디가 기준이에요.
2. 나머지 곡은 Suno의 Cover 또는 Extend로 고른 곡을 넣고 뽑으면 같은 멜로디가 이어져요. 안 되면 프롬프트만으로 뽑아도 됩니다.
3. 반복(loop)되는 곡은 앞뒤 1~2초를 잘라 끊김 없이 이어지게 다듬습니다. (Audacity)

## 다 뽑은 뒤 확인

- [ ] 목소리, 허밍이 안 들어갔나요?
- [ ] 반복될 때 툭 끊기는 소리가 없나요?
- [ ] 음량이 곡마다 비슷한가요? (Audacity Loudness Normalization, -16 LUFS)
- [ ] mp3 128kbps, 한 곡 2MB 아래인가요? 휴대폰에서 빨리 떠야 해요.

---

## 1. 배경음악 (5곡)

### title.mp3 (반복, 1~2분)
쓰는 곳: 첫 화면. 시작 버튼을 누르는 순간부터 소리가 나요. (휴대폰은 누르기 전엔 소리를 못 냄)
```
quiet lo-fi piano lullaby at 2 a.m., soft felt upright piano, distant city ambience, light vinyl crackle, slow 70 bpm, nostalgic and a little lonely, simple four-chord loop, instrumental, no vocals, soft and intimate, lo-fi warmth, gentle tape hiss, slow tempo, sparse arrangement, cozy late-night mood
```

### night-room.mp3 (반복, 1~2분)
쓰는 곳: 장면 0-1~0-3 (노트북, 이불 속 폰, 천장). 음악보다는 방 공기에 가까워요. 대사·알림 소리를 덮지 않게 아주 작게.
```
minimal ambient drone, low warm pad, faint refrigerator hum and room tone, very sparse single piano notes every few seconds, no melody, no drums, tired and heavy late-night feeling, instrumental, no vocals, soft and intimate, lo-fi warmth, gentle tape hiss, slow tempo, sparse arrangement, cozy late-night mood
```

### dream.mp3 (반복, 2분) ← 기준 곡
쓰는 곳: 장면 1~2 (꿈속 검은 화면, 어른 방 구경). 열 살의 내가 말을 거는 순간부터.
```
dreamy music box melody over soft felt piano, childlike and innocent, gentle glockenspiel, warm airy pad, slow 72 bpm, simple memorable melody a child could hum, feeling of meeting your younger self, tender and slightly magical, instrumental, no vocals, soft and intimate, lo-fi warmth, gentle tape hiss, slow tempo, sparse arrangement, cozy late-night mood
```

### diary.mp3 (한 번, 2~3분)
쓰는 곳: 장면 3~4 (그림일기, 창밖 불빛, 답장). 일기를 넘길수록 조금씩 커지다가, 창밖 불빛에서 가장 따뜻해져요.
```
emotional slow build, starts with solo music box and soft piano, gradually adds warm cello and gentle strings, swells softly in the second half then settles, bittersweet and comforting, like reading an old childhood diary, 70 bpm, cinematic but small and intimate, instrumental, no vocals, soft and intimate, lo-fi warmth, gentle tape hiss, slow tempo, sparse arrangement
```

### morning.mp3 (반복, 1~2분)
쓰는 곳: 깨어남 ~ 장면 5 결과 카드. 공유 페이지(`/result/[id]`)에도 써도 돼요.
```
bright gentle morning acoustic, soft piano and fingerpicked acoustic guitar, light glockenspiel echoing the earlier music box melody, birds faintly in the distance, hopeful and fresh, 84 bpm, warm sunlight feeling, quiet optimism, instrumental, no vocals, lo-fi warmth, gentle tape hiss, sparse arrangement
```

## 2. 효과음 (7개)

ElevenLabs에는 영어 문장을 그대로, freesound에는 괄호 안 검색어를 넣어요. 모두 1~2초, 앞에 빈 소리 없이 잘라서.

| 파일 | 쓰는 곳 | 프롬프트 (검색어) |
| --- | --- | --- |
| `mail.mp3` | 0-1 탈락 메일 도착 | `soft single email notification chime, laptop, quiet room` (email notification) |
| `message.mp3` | 0-1 단톡방·엄마 알림 | `short smartphone messenger pop notification, muffled` (message pop) |
| `laptop-close.mp3` | 0-1 노트북 덮기 | `laptop lid closing gently, soft plastic click` (laptop close) |
| `swipe.mp3` | 0-2 스토리 넘기기 | `very soft finger swipe on phone screen under blanket` (swipe) |
| `fall-asleep.mp3` | 0-3 눈 감기 | `slow deep breath out, fading into silence, falling asleep` (breath sleep) |
| `page-turn.mp3` | 3 일기 넘기기 | `turning a page of an old children's notebook` (page turn) |
| `stamp.mp3` | 3 「참 잘했어요」 도장 | `rubber stamp pressed firmly on paper, satisfying thump` (rubber stamp) |

## 코드에 넣을 때 메모

- 휴대폰은 사용자가 한 번 누르기 전엔 소리가 안 나요. 첫 화면 시작 버튼에서 재생을 시작합니다.
- 장면이 바뀔 땐 1~2초 페이드로 넘깁니다. 뚝 끊기면 꿈에서 깨는 느낌이 망가져요.
- 소리 끄기 버튼은 꼭 둡니다. 밤에 몰래 보는 사람이 많을 거예요.
- Suno 무료 요금제로 만든 곡은 상업적으로 못 써요. 수업·포트폴리오용이면 괜찮지만, 돈 받는 곳에 쓰려면 유료 요금제에서 뽑아야 합니다.
