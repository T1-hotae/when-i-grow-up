<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { IcosahedronGeometry, InstancedMesh, MeshBasicMaterial, Object3D, SRGBColorSpace, TextureLoader, Vector3 } from 'three'
import type { Group, Mesh, PerspectiveCamera, Texture } from 'three'

const props = defineProps<{
  laptopClosed: boolean
  windowOpen: boolean
  plane: 'hidden' | 'window' | 'desk'
  brightness: number // 0~1, 걱정을 던질수록 밝아진다
  drawings: string[] // 벽에 붙은 그림 (public/images 파일 이름)
  sky: boolean // 장면 4: 카메라가 하늘로 올라간다
}>()

// shortcut: 세로/가로 구도를 처음 한 번만 정한다, 화면 회전을 지원할 때 resize에 맞춰 바꾼다
const portrait = window.innerWidth < window.innerHeight
const views = {
  room: portrait
    ? { pos: new Vector3(0, 2.2, 4.6), look: new Vector3(0, 0.75, 0) }
    : { pos: new Vector3(0.45, 1.45, 2.5), look: new Vector3(0.45, 1.05, 0) },
  sky: { pos: new Vector3(0, 4.5, 1.5), look: new Vector3(0, 10, -8) },
}

// 루프가 움직이는 물체는 위치 배열을 상수로 둔다 (다시 그릴 때 값이 덮어써지지 않게)
const START = views.room.pos.toArray()
const WIN = new Vector3(0.65, 1.72, -0.45)
const DESK = new Vector3(0.3, 0.83, 0.2)
const SKY_SPOT = new Vector3(0.6, 9, -7)
const WIN_AT = WIN.toArray()
const DESK_AT = DESK.toArray()
const ONE = new Vector3(1, 1, 1)
const TINY = [0.01, 0.01, 0.01] as const
const SLOTS = [
  { pos: [-0.95, 1.6, -0.59], rot: 0.05 },
  { pos: [-0.55, 1.75, -0.59], rot: -0.04 },
  { pos: [-0.15, 1.55, -0.59], rot: 0.03 },
] as const
const FRAME = [
  { pos: [0.65, 1.99, -0.58], size: [0.86, 0.04, 0.04] },
  { pos: [0.65, 1.51, -0.58], size: [0.86, 0.04, 0.04] },
  { pos: [0.23, 1.75, -0.58], size: [0.04, 0.52, 0.04] },
  { pos: [1.07, 1.75, -0.58], size: [0.04, 0.52, 0.04] },
] as const

const loader = new TextureLoader()
const textures = new Map<string, Texture>()
function tex(name: string) {
  let t = textures.get(name)
  if (!t) {
    t = loader.load(`/images/${name}.webp`)
    t.colorSpace = SRGBColorSpace
    textures.set(name, t)
  }
  return t
}

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
const planeMesh = shallowRef<Mesh>()
const mine = shallowRef<Mesh>()
const art: (Mesh | null)[] = []
const look = views.room.look.clone()

watch(() => props.plane, (p) => {
  if (p === 'window') planeMesh.value?.position.copy(WIN)
})

const { onBeforeRender } = useLoop()
onBeforeRender(({ delta, elapsed }) => {
  const k = 1 - Math.exp(-delta * 2.5) // 프레임 수와 상관없이 같은 빠르기로 따라간다
  const f = (n: number) => Math.min(1, k * n)
  const v = props.sky ? views.sky : views.room
  if (camera.value) {
    camera.value.position.lerp(v.pos, f(props.sky ? 0.5 : 1))
    look.lerp(v.look, f(props.sky ? 0.5 : 1))
    camera.value.lookAt(look)
  }
  if (lid.value) lid.value.rotation.x += ((props.laptopClosed ? Math.PI / 2 : -0.25) - lid.value.rotation.x) * f(2)
  if (planeMesh.value) {
    planeMesh.value.position.lerp(props.plane === 'desk' ? DESK : WIN, f(1.5))
    planeMesh.value.rotation.z = Math.sin(elapsed * 3) * 0.15
  }
  for (const m of art) m?.scale.lerp(ONE, f(2))
  if (props.sky) mine.value?.position.lerp(SKY_SPOT, f(0.4))
})
</script>

<template>
  <TresPerspectiveCamera ref="camera" :position="START" />
  <TresAmbientLight :intensity="0.15 + brightness * 0.5" />
  <!-- 스탠드 -->
  <TresPointLight :position="[-0.6, 1.2, 0.2]" color="#ffb766" :intensity="1.5 + brightness" />
  <!-- 노트북 화면 빛: 덮으면 꺼진다 -->
  <TresPointLight :position="[0, 1.1, 0.4]" color="#8fa8ff" :intensity="laptopClosed ? 0 : 1.2" />

  <!-- 벽 -->
  <TresMesh :position="[0, 0, -0.6]">
    <TresPlaneGeometry :args="[10, 8]" />
    <TresMeshStandardMaterial color="#2b2f45" />
  </TresMesh>

  <!-- 창문: 창밖 그림, 유리, 창틀 -->
  <TresMesh :position="[0.65, 1.75, -0.595]">
    <TresPlaneGeometry :args="[0.8, 0.45]" />
    <TresMeshBasicMaterial :map="tex('window-city')" />
  </TresMesh>
  <TresMesh :visible="!windowOpen" :position="[0.65, 1.75, -0.585]">
    <TresPlaneGeometry :args="[0.8, 0.45]" />
    <TresMeshBasicMaterial color="#9fb3d9" transparent :opacity="0.18" />
  </TresMesh>
  <TresMesh v-for="(b, i) in FRAME" :key="i" :position="b.pos">
    <TresBoxGeometry :args="b.size" />
    <TresMeshStandardMaterial color="#4a3a2e" />
  </TresMesh>

  <!-- 벽에 붙는 어린 시절 그림 -->
  <TresMesh
    v-for="(name, i) in drawings"
    :key="name"
    :ref="(el) => { art[i] = el as unknown as Mesh }"
    :position="SLOTS[i]?.pos"
    :rotation-z="SLOTS[i]?.rot"
    :scale="TINY"
  >
    <TresPlaneGeometry :args="[0.36, 0.27]" />
    <TresMeshStandardMaterial :map="tex(name)" />
  </TresMesh>

  <!-- 책상 -->
  <TresMesh :position="[0, 0.75, 0]">
    <TresBoxGeometry :args="[1.6, 0.06, 0.8]" />
    <TresMeshStandardMaterial color="#5a4636" />
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

  <!-- 종이비행기 -->
  <TresMesh ref="planeMesh" :visible="plane !== 'hidden'" :position="WIN_AT" :rotation-x="Math.PI / 2" :scale="[1, 1, 0.3]">
    <TresConeGeometry :args="[0.1, 0.3, 3]" />
    <TresMeshStandardMaterial color="#f4f1ea" emissive="#ffffff" :emissive-intensity="0.25" flat-shading />
  </TresMesh>

  <!-- 밤하늘과 내가 띄운 별 -->
  <primitive :object="stars" />
  <TresMesh ref="mine" :visible="sky" :position="DESK_AT">
    <TresIcosahedronGeometry :args="[0.12, 0]" />
    <TresMeshBasicMaterial color="#ffcf8a" />
  </TresMesh>
</template>
