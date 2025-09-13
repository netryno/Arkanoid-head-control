<template>
    <div class="camera-error" v-if="show">
      <h2>¡Se necesita la cámara para jugar!</h2>
      <p>{{ mensaje }}</p>
      <button class="button default" @click="$emit('reintentar')">Reintentar</button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean,
    mensaje: String
  })
  defineEmits(['reintentar'])
  </script>
  
  <style scoped>
  .camera-error {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: grid;
    place-content: center;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    text-align: center;
    padding: 2rem;
  }
  button {
    margin-top: 1rem;
    padding: 0.6rem 1.4rem;
    font-size: 1rem;
    cursor: pointer;
  }
  </style>