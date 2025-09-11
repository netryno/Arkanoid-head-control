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
    <canvas ref="canvas" class="game-canvas" width="600" height="880" />

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

    <p  class="fge-version-label">Copyright ©   Ministerio Público de Bolivia</p>
  </div>
</template>

<style scoped>

  .fge-version-label{
    font-size: 10px;
    color: #797878;
    text-align: right;
    background: #000000;
    display: block;
    position: fixed;
  }

.gameover{
  background: rgba(0, 0, 0, 0.55);   /* fondo semitransparente */
  color: rgb(255, 255, 255);
  font-family: monospace;
  font-size: 1.1rem;
  z-index: 10;                       /* <-- por encima del video */
  border-radius: 4px;
  text-shadow: 1px 1px 5px white;
  text-align: center;
}
.game {
  position: relative;
  width: 600px;
  height: 840px;
  margin: auto;
  overflow: hidden;
  border: 1px solid #ffffff;
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
  width: 600px;
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
  images.block1 = await load('/assets/images/elements/elements_game-01.png') //base

  images.block1_1 = await load('/assets/images/elements/elements_game-06.png')   // variante 1
  images.block1_2 = await load('/assets/images/elements/elements_game-07.png')   // variante 2
  images.block1_3 = await load('/assets/images/elements/elements_game-01.png')   // variante 2

  images.block2 = await load('/assets/images/elements/elements_game-02.png')
  images.block3 = await load('/assets/images/elements/elements_game-04.png')
  images.ball   = await load('/assets/images/elements/elements_game-11.png') //balon
  images.logo   = await load('/assets/images/elements/elements_game-10.png') //paleta
  draw()
})

function draw () {
  if (!ctx) return
  ctx.clearRect(0, 0, 600, 880)
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