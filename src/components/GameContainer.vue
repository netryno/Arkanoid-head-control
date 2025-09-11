<template>
  <div class="game">
    <!-- 1. video de fondo (siempre presente) -->
    <video
      v-show="camReady"
      ref="camVideo"
      class="bg-video"
      autoplay
      muted
      playsinline
    />

    <!-- 2. UI -->
    <UiPanel :score="score" :level="level" :lives="lives" />

    <!-- 3. canvas -->
    <canvas ref="canvas" class="game-canvas" width="800" height="880" />

    <!-- 4. overlays -->
    <div v-if="!running && !ended" class="overlay">
      <button class="button default" @click="start">Jugar</button>
    </div>
    <div v-if="ended" class="overlay">
      <h2 class="gameover">{{ lives ? '¡Victoria!' : 'Game Over' }}</h2>
      <button class="button default" @click="reload">Reiniciar</button>
    </div>

    <!-- 5. pantalla de permisos (hasta que esté lista) -->
    <WebcamSetup v-if="!camReady" @ready="onCamReady" />
  </div>
</template>

<style scoped>
.gameover{
      color: #aa3232;
    font-weight: bold;
}
.game {
  position: relative;
  width: 800px;
  height: 840px;
  margin: auto;
  overflow: hidden;
  border: 1px solid #c1bf1e;
}
.bg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
  z-index: 0;
}
.game-canvas {
  position: relative;
  z-index: 1;
  display: block;
  width: 800px;
  height: 840px;
  pointer-events: none;
}
.overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #c1bf1e;
}
button {
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
}


.button {
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.default {
  border: 2px solid #3498db;
  color: #3498db;
  background-color: #fff;
}

.default:hover {
  background-color: #3498db;
  color: #fff;
}

.primary {
  border: 2px solid #2ecc71;
  color: #2ecc71;
  background-color: #fff;
}

.primary:hover {
  background-color: #2ecc71;
  color: #fff;
}



</style>

<script setup>
import { ref, onMounted } from 'vue'
import WebcamSetup from './WebcamSetup.vue'
import UiPanel from './UiPanel.vue'
import { useGameEngine } from '../composables/useGameEngine.js'
import { useMediaPipe } from '../composables/useMediaPipe.js'

const canvas   = ref(null)
const camVideo = ref(null)
const camReady = ref(false)

let ctx
const images = {}
const game   = useGameEngine(images)

onMounted(async () => {
  ctx = canvas.value.getContext('2d')
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src })
  images.block1 = await load('/assets/images/bloque150z.jpg')
  images.block2 = await load('/assets/images/bloque150eco.png')
  images.block3 = await load('/assets/images/bloque150c.png')
  images.ball   = await load('/assets/images/balon-200.png')
  images.logo   = await load('/assets/images/paleton.png')
  draw()
})

function draw () {
  if (!ctx) return
  ctx.clearRect(0, 0, 800, 880)
  game.blocks.value.forEach(b => b.draw(ctx))
  game.powerUps.value.forEach(p => p.draw(ctx))
  game.paddle.draw(ctx, images.logo)
  game.ball.draw(ctx, images.ball)
  if (game.running.value || !game.ended.value) requestAnimationFrame(draw)
}

/*
function onCamReady () {
  // conecta la cámara al video de fondo
  useMediaPipe(camVideo.value, (x) => game.onFaceMove(x))
  camReady.value = true
}
*/
function onCamReady () {
  useMediaPipe(camVideo.value, (x) => {
    // invierte dirección: 0 → 1, 1 → 0
    const inverted = 1 - x
    game.onFaceMove(inverted)
  })
  camReady.value = true
}


function reload () {
  window.location.reload()
}

const { score, level, lives, running, ended, start } = game
</script>