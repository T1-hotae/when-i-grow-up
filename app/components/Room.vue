<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { IcosahedronGeometry, InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import type { Group, Mesh, PerspectiveCamera } from 'three'
import type { Me } from '~/data/script'

export type View = 'room' | 'screen' | 'bed' | 'ceiling' | 'desk' | 'window' | 'sky'

// 성별마다 방 색: 아들은 남색, 딸은 장밋빛
const PALETTES = {
  son: { wall: '#2b2f45', ceiling: '#262a3d', blanket: '#7d8fc4', fold: '#e6e9f2', pillow: '#eef0f7', lamp: '#ffb766' },
  daughter: { wall: '#3b2f44', ceiling: '#33293b', blanket: '#d39aa8', fold: '#f7e8ec', pillow: '#fbf1ee', lamp: '#ffc48a' },
} satisfies Record<Me, Record<string, string>>

const props = defineProps<{
  me: Me
  view: View
  laptopClosed: boolean
  phoneOn: boolean // 이불 속 폰 빛
  starsGlow: number // 0~1, 천장 야광별 밝기
  myStar: boolean // 깨어남: 꿈에서 접어 띄운 편지 별처럼 야광별 하나만 환하다
  brightness: number // 0~1, 어른 방 물건을 보여 줄수록 밝아진다
  drawer: boolean // 장면 3: 그림일기가 든 서랍이 열린다
  morning: boolean // 깨어남: 아침 햇빛
}>()

const instant = matchMedia('(prefers-reduced-motion: reduce)').matches
const c = computed(() => PALETTES[props.me])

// shortcut: 세로/가로 구도를 처음 한 번만 정한다, 화면 회전을 지원할 때 resize에 맞춰 바꾼다
const portrait = window.innerWidth < window.innerHeight
const BED_X = -1.5
const views: Record<View, { pos: Vector3, look: Vector3 }> = {
  room: portrait
    ? { pos: new Vector3(-0.3, 2.2, 4.6), look: new Vector3(-0.3, 0.75, 0) }
    : { pos: new Vector3(0.1, 1.45, 2.6), look: new Vector3(0.1, 1.05, 0) },
  screen: { pos: new Vector3(0, 1.02, 0.45), look: new Vector3(0, 0.98, -0.1) },
  bed: { pos: new Vector3(BED_X, 0.72, -0.25), look: new Vector3(BED_X, 0.62, 1.6) }, // 누워서 이불 속 폰을 본다
  ceiling: { pos: new Vector3(BED_X, 0.72, -0.2), look: new Vector3(BED_X + 0.05, 3, 0.25) },
  desk: { pos: new Vector3(0.35, 1.35, 1), look: new Vector3(0.32, 0.68, 0.25) }, // 열린 서랍을 내려다본다
  window: { pos: new Vector3(0.55, 1.65, 0.7), look: new Vector3(0.65, 1.72, -0.6) },
  sky: { pos: new Vector3(0, 4.5, 1.5), look: new Vector3(0, 10, -8) },
}

// 이불: 매트리스 위에 덮여 가장자리로 둥글게 흘러내리는 천 (주름 포함)
const MAT_TOP = 0.46
function drape(c: number, edge: number, r = 0.04) {
  const d = Math.abs(c) - (edge - r)
  if (d <= 0) return { c, drop: 0, hang: false }
  const arc = (r * Math.PI) / 2
  if (d < arc) return { c: Math.sign(c) * (edge - r + r * Math.sin(d / r)), drop: r * (1 - Math.cos(d / r)), hang: false }
  return { c: Math.sign(c) * edge, drop: r + d - arc, hang: true }
}
const blanketGeo = new PlaneGeometry(1.3, 1.75, 64, 64).rotateX(-Math.PI / 2)
{
  const p = blanketGeo.attributes.position!
  for (let i = 0; i < p.count; i++) {
    const x0 = p.getX(i)
    const z0 = p.getZ(i) + 0.68 // 머리 쪽 -0.2 ~ 발끝 1.55
    const sx = drape(x0, 0.51)
    const sz = z0 > 0.6 ? drape(z0 - 0.6, 0.86) : { c: z0 - 0.6, drop: 0, hang: false } // 발끝으로만 흘러내린다
    const fold = 0.012 * Math.sin(z0 * 23 + x0 * 3) // 흘러내린 자락의 세로 주름
    const x = sx.c + (sx.hang ? Math.sign(x0) * fold : 0)
    const z = sz.c + 0.6 + (sz.hang ? fold : 0)
    const wrinkle = sx.drop + sz.drop > 0 ? 0 : 0.01 * Math.sin(x0 * 11 + 1) * Math.sin(z0 * 9) + 0.035 * Math.exp(-(x0 * x0) / 0.06) * Math.min(1, Math.max(0, z0 * 2)) // 누운 다리 모양으로 가운데가 살짝 솟는다
    p.setXYZ(i, x, MAT_TOP - sx.drop - sz.drop + wrinkle, z)
  }
  blanketGeo.computeVertexNormals()
}

// 루프가 움직이는 물체는 위치 배열을 상수로 둔다 (다시 그릴 때 값이 덮어써지지 않게)
const START = views.room.pos.toArray()
const WINDOW_AT = [0.65, 1.75, -0.5] as const // 편지 별은 창밖으로 나간다
const SKY_SPOT = new Vector3(0.6, 9, -7)
const DRAWER_IN = new Vector3(0.35, 0.66, 0.05)
const DRAWER_OUT = new Vector3(0.35, 0.66, 0.35)
const DRAWER_AT = DRAWER_IN.toArray()
const FRAME = [
  { pos: [0.65, 1.99, -0.58], size: [0.86, 0.04, 0.04] },
  { pos: [0.65, 1.51, -0.58], size: [0.86, 0.04, 0.04] },
  { pos: [0.23, 1.75, -0.58], size: [0.04, 0.52, 0.04] },
  { pos: [1.07, 1.75, -0.58], size: [0.04, 0.52, 0.04] },
] as const
// 천장 야광별 스티커 (어릴 때 붙인 것)
const GLOW_STARS = [
  [-1.6, 0.1, 0.4], [-1.3, 0.3, 0.9], [-1.8, -0.2, 0.6], [-1.45, -0.05, 0.5],
  [-1.15, 0.15, 0.7], [-1.7, 0.35, 0.45], [-1.35, -0.3, 0.8], [-1.9, 0.2, 0.55],
].map(([x, z, s]) => ({ pos: [x!, 2.59, z!] as const, s: s! }))

const cityTex = new TextureLoader().load('/images/scenes/window-city.webp')
cityTex.colorSpace = SRGBColorSpace

// 밤하늘 별: 드로우콜 1번으로 1200개
const STAR_COUNT = 1200
const stars = new InstancedMesh(new IcosahedronGeometry(0.035, 0), new MeshBasicMaterial({ color: '#fff6dd' }), STAR_COUNT)
const dummy = new Object3D()
for (let i = 0; i < STAR_COUNT; i++) {
  dummy.position.set((Math.random() - 0.5) * 30, 6 + Math.random() * 12, -4 - Math.random() * 16)
  dummy.scale.setScalar(0.5 + Math.random())
  dummy.updateMatrix()
  stars.setMatrixAt(i, dummy.matrix)
}

const camera = shallowRef<PerspectiveCamera>()
const lid = shallowRef<Group>()
const hand = shallowRef<Group>()
const drawerMesh = shallowRef<Mesh>()
const mine = shallowRef<Mesh>()
const look = views.room.look.clone()
let lift = 0 // 0~1, 폰을 눈앞으로 든 정도

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta }) => {
  const k = instant ? 1 : 1 - Math.exp(-delta * 2.5) // 프레임 수와 상관없이 같은 빠르기로 따라간다
  const f = (n: number) => Math.min(1, k * n)
  const sky = props.view === 'sky'
  const v = views[props.view]
  const cam = camera.value
  if (cam) {
    cam.position.lerp(v.pos, f(sky ? 0.5 : 1))
    look.lerp(v.look, f(sky ? 0.5 : 1))
    cam.lookAt(look)
  }
  if (lid.value) lid.value.rotation.x += ((props.laptopClosed ? Math.PI / 2 : -0.25) - lid.value.rotation.x) * f(2)
  // 폰: 침대에 누우면 아래에서 눈앞으로 올라온다
  lift += ((props.view === 'bed' ? 1 : 0) - lift) * f(1.5)
  if (hand.value && cam) {
    hand.value.visible = lift > 0.02
    hand.value.position.copy(cam.position)
    hand.value.quaternion.copy(cam.quaternion)
    hand.value.translateY((lift - 1) * 0.5)
  }
  drawerMesh.value?.position.lerp(props.drawer ? DRAWER_OUT : DRAWER_IN, f(2))
  if (sky) mine.value?.position.lerp(SKY_SPOT, f(0.4))
})
</script>

<template>
  <TresPerspectiveCamera ref="camera" :position="START" />
  <TresAmbientLight :intensity="morning ? 1.1 : 0.15 + brightness * 0.5" :color="morning ? '#ffe2b8' : '#ffffff'" />
  <TresDirectionalLight v-if="morning" :position="[1, 3, 2]" color="#ffd7a0" :intensity="1.2" />
  <!-- 스탠드 -->
  <TresPointLight :position="[-0.6, 1.2, 0.2]" :color="c.lamp" :intensity="1.5 + brightness" />
  <!-- 노트북 화면 빛: 덮으면 꺼진다 -->
  <TresPointLight :position="[0, 1.1, 0.4]" color="#8fa8ff" :intensity="laptopClosed ? 0 : 1.2" />

  <!-- 벽과 천장 -->
  <TresMesh :position="[0, 0, -0.6]">
    <TresPlaneGeometry :args="[10, 8]" />
    <TresMeshStandardMaterial :color="c.wall" />
  </TresMesh>
  <TresMesh :position="[0, 2.6, 0]" :rotation-x="Math.PI / 2">
    <TresPlaneGeometry :args="[10, 10]" />
    <TresMeshStandardMaterial :color="c.ceiling" :side="2" />
  </TresMesh>
  <!-- 천장 야광별 -->
  <TresMesh v-for="(s, i) in GLOW_STARS" :key="i" :position="s.pos" :rotation-x="Math.PI / 2" :scale="myStar && i === 4 ? s.s * 1.4 : s.s">
    <TresCircleGeometry :args="[0.05, 5]" />
    <TresMeshBasicMaterial :color="myStar && i === 4 ? '#ffcf8a' : '#d8ffb8'" transparent :opacity="myStar && i === 4 ? 1 : 0.15 + starsGlow * 0.85" :side="2" />
  </TresMesh>

  <!-- 창문: 창밖 그림, 유리, 창틀 (불이 켜지는 건 CityWindow.vue가 화면 가득 보여 준다) -->
  <TresMesh :position="[0.65, 1.75, -0.595]">
    <TresPlaneGeometry :args="[0.8, 0.45]" />
    <TresMeshBasicMaterial :map="cityTex" />
  </TresMesh>
  <TresMesh :position="[0.65, 1.75, -0.585]">
    <TresPlaneGeometry :args="[0.8, 0.45]" />
    <TresMeshBasicMaterial color="#9fb3d9" transparent :opacity="0.18" />
  </TresMesh>
  <TresMesh v-for="(b, i) in FRAME" :key="i" :position="b.pos">
    <TresBoxGeometry :args="b.size" />
    <TresMeshStandardMaterial color="#4a3a2e" />
  </TresMesh>

  <!-- 책상과 서랍 -->
  <TresMesh :position="[0, 0.75, 0]">
    <TresBoxGeometry :args="[1.6, 0.06, 0.8]" />
    <TresMeshStandardMaterial color="#5a4636" />
  </TresMesh>
  <TresMesh ref="drawerMesh" :position="DRAWER_AT">
    <TresBoxGeometry :args="[0.5, 0.12, 0.6]" />
    <TresMeshStandardMaterial color="#6b5442" />
  </TresMesh>
  <!-- 스탠드 갓 -->
  <TresMesh :position="[-0.6, 1.05, 0]">
    <TresConeGeometry :args="[0.12, 0.14, 24, 1, true]" />
    <TresMeshStandardMaterial color="#ffcf8a" emissive="#ffb766" :emissive-intensity="0.8" :side="2" />
  </TresMesh>
  <TresMesh :position="[-0.6, 0.9, 0]">
    <TresCylinderGeometry :args="[0.01, 0.01, 0.3]" />
    <TresMeshStandardMaterial color="#3a3a42" />
  </TresMesh>
  <!-- 노트북 바닥 -->
  <TresMesh :position="[0, 0.79, 0.1]">
    <TresBoxGeometry :args="[0.6, 0.02, 0.4]" />
    <TresMeshStandardMaterial color="#3a3a42" />
  </TresMesh>
  <!-- 노트북 화면: 뒤쪽 경첩을 축으로 돈다 -->
  <TresGroup ref="lid" :position="[0, 0.8, -0.1]" :rotation-x="-0.25">
    <TresMesh :position="[0, 0.2, 0]">
      <TresBoxGeometry :args="[0.6, 0.4, 0.02]" />
      <TresMeshStandardMaterial color="#1c1c22" :emissive="laptopClosed ? '#000000' : '#6f8cff'" :emissive-intensity="0.5" />
    </TresMesh>
  </TresGroup>

  <!-- 침대: 프레임, 매트리스, 베개, 덮인 이불과 접힌 끝자락 -->
  <TresMesh :position="[BED_X, 0.12, 0.45]">
    <TresBoxGeometry :args="[1.08, 0.24, 2.08]" />
    <TresMeshStandardMaterial color="#4a3a2e" />
  </TresMesh>
  <TresMesh :position="[BED_X, 0.34, 0.45]">
    <TresBoxGeometry :args="[1, 0.2, 2]" />
    <TresMeshStandardMaterial color="#d9dce8" />
  </TresMesh>
  <TresMesh :position="[BED_X, 0.5, -0.33]" :scale="[1, 0.35, 0.6]">
    <TresSphereGeometry :args="[0.3, 24, 12]" />
    <TresMeshStandardMaterial :color="c.pillow" />
  </TresMesh>
  <TresMesh :position="[BED_X, 0, 0]">
    <primitive :object="blanketGeo" attach="geometry" />
    <TresMeshStandardMaterial :color="c.blanket" :side="2" />
  </TresMesh>
  <!-- 이불 머리 쪽 접힌 끝자락 -->
  <TresMesh :position="[BED_X, MAT_TOP + 0.03, -0.2]" :rotation-z="Math.PI / 2">
    <TresCapsuleGeometry :args="[0.035, 1.0, 6, 16]" />
    <TresMeshStandardMaterial :color="c.fold" />
  </TresMesh>

  <!-- 성별마다 다른 물건: 아들은 침대 옆 바닥에 농구공, 딸은 이불 발치에 곰인형 -->
  <TresMesh v-if="me === 'son'" :position="[BED_X + 0.75, 0.12, 1]">
    <TresSphereGeometry :args="[0.12, 24, 16]" />
    <TresMeshStandardMaterial color="#d9772f" />
  </TresMesh>
  <TresGroup v-else :position="[BED_X + 0.25, MAT_TOP, 1.2]">
    <TresMesh :position="[0, 0.09, 0]">
      <TresSphereGeometry :args="[0.09, 20, 14]" />
      <TresMeshStandardMaterial color="#b98a62" />
    </TresMesh>
    <TresMesh :position="[0, 0.22, 0]">
      <TresSphereGeometry :args="[0.065, 20, 14]" />
      <TresMeshStandardMaterial color="#b98a62" />
    </TresMesh>
    <TresMesh v-for="x in [-0.045, 0.045]" :key="x" :position="[x, 0.28, 0]">
      <TresSphereGeometry :args="[0.025, 12, 8]" />
      <TresMeshStandardMaterial color="#9c714d" />
    </TresMesh>
  </TresGroup>

  <!-- 손에 든 폰: 카메라를 따라다닌다 -->
  <TresGroup ref="hand" :visible="false">
    <TresGroup>
      <TresGroup :position="[0, -0.1, -0.3]" :rotation-x="-0.35">
        <TresMesh>
          <TresBoxGeometry :args="[0.075, 0.15, 0.01]" />
          <TresMeshStandardMaterial color="#1c1c22" />
        </TresMesh>
        <TresMesh :position="[0, 0, 0.006]">
          <TresPlaneGeometry :args="[0.066, 0.136]" />
          <TresMeshBasicMaterial :color="phoneOn ? '#dbe6ff' : '#0d0f16'" />
        </TresMesh>
        <!-- 이불 속을 비추는 폰 빛 -->
        <TresPointLight :position="[0, 0, 0.08]" color="#9fb8ff" :intensity="phoneOn ? 1.5 : 0" :distance="1.2" />
      </TresGroup>
    </TresGroup>
  </TresGroup>

  <!-- 밤하늘과 내가 띄운 별 -->
  <primitive :object="stars" />
  <TresMesh ref="mine" :visible="view === 'sky'" :position="WINDOW_AT">
    <TresIcosahedronGeometry :args="[0.12, 0]" />
    <TresMeshBasicMaterial color="#ffcf8a" />
  </TresMesh>
</template>
