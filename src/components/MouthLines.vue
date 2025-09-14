<template>
    <canvas ref="lineCanvas" class="line-canvas" width="640" height="880"></canvas>
</template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  
  const props = defineProps({
    faceLandmarks: Array,   // landmarks de MediaPipe
    paddleX: Number,        // posición X de la paleta
    paddleW: Number         // ancho de la paleta
  })
  
  const lineCanvas = ref(null)
  let ctx = null
  
  onMounted(() => {
    ctx = lineCanvas.value.getContext('2d')
    draw()
  })
  
  watch([() => props.faceLandmarks, () => props.paddleX], () => {
    draw()
  })
  

  function draw() {
    let variable = 600
    if (!ctx || !props.faceLandmarks) return

    // tamaño real del video (sin espejar landmarks)
    const vw = props.videoW || variable
    const vh = props.videoH || 880

    const mirrorX = (x) => vw - x * vw

    const leftMouthX  = mirrorX(props.faceLandmarks[61].x) 
    const leftMouthY  = props.faceLandmarks[61].y  * vh
    const rightMouthX = mirrorX(props.faceLandmarks[291].x)

    const rightMouthY = props.faceLandmarks[291].y * vh

    // bordes de la paleta (izquierdo y derecho, sin cruzar)
    const paddleLeftX  = props.paddleX
    const paddleRightX = props.paddleX + props.paddleW
    const paddleY      = 880 - 60

    ctx.clearRect(0, 0, variable, 880)
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth   = 

    // línea izquierda (boca izquierda → borde izquierdo)
    ctx.beginPath()
    ctx.moveTo(rightMouthX, rightMouthY)
    ctx.lineTo(paddleLeftX, paddleY)
    ctx.stroke()

    // línea derecha (boca derecha → borde derecho)
    ctx.beginPath()
    ctx.moveTo(leftMouthX, leftMouthY)
    ctx.lineTo(paddleRightX, paddleY)
    ctx.stroke()
}

function draw2() {
  if (!ctx || !props.faceLandmarks) return

  const vw = props.videoW || 600   // tamaño real de la cámara
  const vh = props.videoH || 880

  // ⬅️ ESPEJAMOS X para que coincida con el video espejado
  const mirrorX = (x) => vw - x * vw

  let leftMouthX  = mirrorX(props.faceLandmarks[61].x)
  let leftMouthY  = props.faceLandmarks[61].y  * vh
  let rightMouthX = mirrorX(props.faceLandmarks[291].x)
  let rightMouthY = props.faceLandmarks[291].y * vh

  // ⬅️ RECORTAMOS al canvas visible (600×880)
  leftMouthX  = Math.max(0, Math.min(600, leftMouthX))
  rightMouthX = Math.max(0, Math.min(600, rightMouthX))
  leftMouthY  = Math.max(0, Math.min(880, leftMouthY))
  rightMouthY = Math.max(0, Math.min(880, rightMouthY))

  const paddleLeftX  = props.paddleX
  const paddleRightX = props.paddleX + props.paddleW
  const paddleY      = 880 - 60

  ctx.clearRect(0, 0, 600, 880)
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth   = 2

  // izquierda a izquierdo
  ctx.beginPath()
  ctx.moveTo(rightMouthX, rightMouthY)
  ctx.lineTo(paddleLeftX, paddleY)
  ctx.stroke()

  // derecha a derecho
  ctx.beginPath()
  ctx.moveTo(leftMouthX, leftMouthY)
  ctx.lineTo(paddleRightX, paddleY)
  ctx.stroke()
}
  </script>
  
  <style scoped>
  .line-canvas {
    position: absolute;
    inset: 0;
    z-index: 3; 
    pointer-events: none;
  }
  </style>