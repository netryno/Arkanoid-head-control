<template>
    <canvas ref="lineCanvas" class="line-canvas" width="600" height="880"></canvas>
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
  
  function draw () {
    if (!ctx || !props.faceLandmarks) return
  
    // ⬅️ espejamos X para que coincida con el video espejado
    const mirrorX = (x) => 600 - x * 600

    // puntos de la boca (MediaPipe FaceMesh)
    const leftMouth  = props.faceLandmarks[61]   // extremo izquierdo
    const rightMouth = props.faceLandmarks[291]  // extremo derecho
  
    const mouthLeftX  = mirrorX(leftMouth.x)
    const mouthLeftY  = leftMouth.y  * 880
    const mouthRightX = mirrorX(rightMouth.x)
    const mouthRightY = rightMouth.y * 880

  
    // extremos de la paleta
    const paddleLeftX  = props.paddleX
    const paddleRightX = props.paddleX + props.paddleW
    const paddleY      = 880 - 60   // altura fija de la paleta (ajústala si cambia)
  
    // limpia y dibuja
    ctx.clearRect(0, 0, 600, 880)
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth   = 2
  
    // línea izquierda
    ctx.beginPath()
    ctx.moveTo(mouthRightX, mouthRightY)
    ctx.lineTo(paddleLeftX, paddleY)
    ctx.stroke()
  
    // línea derecha
    ctx.beginPath()
   
    ctx.moveTo(mouthLeftX, mouthLeftY)
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