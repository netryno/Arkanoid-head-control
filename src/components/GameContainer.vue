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
      @loadedmetadata="onVideoResize"
      @resize="onVideoResize"
    />

    <!-- líneas desde la boca hasta la paleta -->
    <MouthLines
      v-if="camReady && faceLandmarks"
      :face-landmarks="faceLandmarks"
      :paddle-x="game.paddle.x"
      :paddle-w="game.paddle.w"
      :video-w="videoW"
      :video-h="videoH"
    />

    <!-- 2. UI -->
    <UiPanel :score="score" :level="level" :lives="lives" />

    <!-- 3. canvas -->
    <canvas ref="canvas" class="game-canvas" width="600" height="880" />

    <!-- 4. bloqueo hasta que la cámara esté OK -->
    <CameraError
      v-if="!camReady && !camErrorDismissed"
      :mensaje="camErrorMsg"
      @reintentar="reintentarCam"
    />

    <!-- 5. overlays normales (solo si cámara lista) -->
    <div v-if="camReady && !running && !ended" class="overlay">
      <button class="button default" @click="start">Jugar</button>
    </div>
    <div v-if="camReady && ended" class="overlay">
      <h2 class="gameover">{{ lives ? '¡Victoria!' : 'Game Over' }}</h2>
      <button class="button default" @click="reload">Reiniciar</button>
    </div>

    <!-- 6. confeti -->
    <Confetti ref="confettiRef" />

    <!-- 7. créditos -->
    <p class="fge-version-label"></p>
    <p class="fge-version-label">Max Nivel: {{ maxLevelUrl }} Vel. Base: {{ velBaseUrl }} &nbsp;&nbsp;  maxnivel=2&velbase=2</p>
  </div>
</template>

<style scoped>
.fge-version-label {
  font-size: 10px;
  color: #797878;
  text-align: right;
  background: #000000;
  display: block;
  position: fixed;
}
.gameover {
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-family: monospace;
  font-size: 1.1rem;
  z-index: 10;
  border-radius: 4px;
  text-shadow: 1px 1px 5px white;
  text-align: center;
}
.game {
  position: relative;
  width: 600px;
  height: 880px;
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
  height: 880px;
  pointer-events: none;
}
.overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #fffd9d;
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
</style>

<script setup>
import { ref, onMounted } from 'vue'
import CameraError from './CameraError.vue'
import UiPanel from './UiPanel.vue'
import Confetti from './Confetti.vue'
import { useGameEngine } from '../composables/useGameEngine.js'
import { useMediaPipe } from '../composables/useMediaPipe.js'

const canvas   = ref(null)
const camVideo = ref(null)
const camReady = ref(false)
const camErrorDismissed = ref(false)
const camErrorMsg = ref('')

const confettiRef = ref(null)
const images = {}
const game = useGameEngine(images)

// imágenes con URL resueltas por Vite
import block1 from '/assets/images/elements/elements_game-01.png?url'
import block1_1 from '/assets/images/elements/elements_game-06.png?url'
import block1_2 from '/assets/images/elements/elements_game-07.png?url'
import block1_3 from '/assets/images/elements/elements_game-01.png?url'
import block2 from '/assets/images/elements/elements_game-02.png?url'
import block3 from '/assets/images/elements/elements_game-04.png?url'
import ball from '/assets/images/elements/elements_game-11.png?url'
import logo from '/assets/images/elements/elements roma-10.png?url'


import MouthLines from './MouthLines.vue'



const videoW = ref(700)
const videoH = ref(880)

import {  MAX_LEVEL, VELOCIDAD_BASE } from '../utils/constants.js'
const urlParams   = new URLSearchParams(window.location.search)
const maxLevelUrl = parseInt(urlParams.get('maxnivel')) || MAX_LEVEL
const velBaseUrl  = parseInt(urlParams.get('velbase'))  || VELOCIDAD_BASE


function onVideoResize () {
  if (!camVideo.value) return
  videoW.value = camVideo.value.videoWidth || camVideo.value.clientWidth
  videoH.value = camVideo.value.videoHeight || camVideo.value.clientHeight
}

// almacenamos los landmarks que llegan de MediaPipe
const faceLandmarks = ref(null)


onMounted(async () => {
  const ctx = canvas.value.getContext('2d')
  const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src })

  images.block1   = await load(block1)
  images.block1_1 = await load(block1_1)
  images.block1_2 = await load(block1_2)
  images.block1_3 = await load(block1_3)
  images.block2   = await load(block2)
  images.block3   = await load(block3)
  images.ball     = await load(ball)
  images.logo     = await load(logo)

  draw(ctx)
  initCamera()
})

function draw (ctx) {
  if (!ctx) return
  ctx.clearRect(0, 0, 700, 880)
  game.blocks.value.forEach(b => b.draw(ctx))
  game.powerUps.value.forEach(p => p.draw(ctx))
  game.paddle.draw(ctx, images.logo)
  game.ball.draw(ctx, images.ball)
  if (game.running.value || !game.ended.value) requestAnimationFrame(() => draw(ctx))
  if (game.ended.value && game.lives.value) confettiRef.value.lanzar()
}

/* ----------  cámara  ---------- */
async function initCamera () {
  try {
    const { ready } = await useMediaPipe(camVideo.value,  (x, landmarks) => {
      const inverted = 1 - x
      game.onFaceMove(inverted)
      faceLandmarks.value = landmarks
    })    
    camReady.value = ready.value
    camErrorDismissed.value = false
  } catch (err) {
    camErrorMsg.value = err.name === 'NotAllowedError'
      ? 'Por favor permite el uso de la cámara.'
      : 'No se pudo acceder a la cámara.'
    camErrorDismissed.value = false
  }
}

function reintentarCam () {
  initCamera()
}

function reload () {
  window.location.reload()
}

const { score, level, lives, running, ended, start } = game
</script>