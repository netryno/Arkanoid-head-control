<template>
  <div class="setup">
    <video
      ref="video"
      autoplay
      muted
      playsinline
      width="600"
      height="480"
    />
    <p v-if="!ready">Detectando cámara…</p>
    <p v-else>Mueve la cabeza para calibrar</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMediaPipe } from '../composables/useMediaPipe.js'

const emit = defineEmits(['ready'])
const video = ref(null)
const ready = ref(false)

onMounted(() => {
  const { ready: mpReady } = useMediaPipe(video.value, () => emit('ready'))
  ready.value = mpReady.value
})
</script>

<style scoped>
.setup {
  display: grid;
  place-content: center;
}
video {
  transform: scaleX(-1);
  border: 2px solid #0f0;
}
</style>