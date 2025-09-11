<template>
  <div class="ui">
    <span>Puntos: {{ score }}</span>
    <span>Nivel: {{ level }}</span>
    <span>Vidas: {{ lives }}</span>
  </div>
</template>

<script setup>
defineProps(['score', 'level', 'lives'])
</script>

<style scoped>

.ui {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 0, 0, 0.55);   /* fondo semitransparente */
  color: #0f0;
  font-family: monospace;
  font-size: 1.1rem;
  z-index: 10;                       /* <-- por encima del video */
  border-radius: 4px;
}
</style>