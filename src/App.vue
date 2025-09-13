<template>
    <div class="cabezera">
      <div class="titulos"> 
          <h2>Arkanoid - Ministerio Público</h2>
          <h4>Superar nivel 3 = Souvenir</h4>
      </div>
      <img class="logo" src="/public/assets/images/elements/fiscalia.png"></img>
    </div>
  <GameContainer />
</template>

<script setup>
import GameContainer from './components/GameContainer.vue'
const appName = import.meta.env.VITE_APP_NAME;
console.log("Modo:", import.meta.env.MODE);
console.log("Nombre de la app:", appName);

</script>
<style lang="css">
.cabezera{
  display: block;
  margin: auto auto;
  width: 600px;
  height: 80px;


}
.cabezera .titulos{
  width: 390px;
  display: block;
  float: left;

}
.cabezera h2{
  width: 100%;
  display: block;
  float: left;
  color: white;
  margin-top: 5px;
  padding-top: 5px;
  font-family: monospace;
}
.cabezera h4{
  width: 100%;
  display: block;
  float: left;
  color: white;
  margin: 1px;
  padding: 1px;
  font-family: monospace;
}
.cabezera .logo{
  width: 100px;
  display: block;
  float: right;
}
</style>