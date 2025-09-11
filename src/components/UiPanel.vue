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
/*esto es head*/
.ui { 
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.3rem;
  background: rgba(0, 0, 0, 0.55);   /* fondo semitransparente */
  color: rgb(255, 255, 255);
  font-family: monospace;
  font-size: 1.1rem;
  z-index: 10;                       /* <-- por encima del video */
  border-radius: 4px;
  text-shadow: 1px 1px 5px white;
  text-transform: capitalize !important;
}
</style>