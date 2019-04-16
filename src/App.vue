<template>
  <div id="app">
    <h2>{{msg}}</h2>
    <router-view/>
  </div>
  <div></div>
</template>

<script>
export default {
  data(){
    return {
      msg:'这是自配一个webpack4 + vue2.6的项目，惊不惊喜，意不意外'
    }
  }
}
</script>

<style>
h2{
  text-align: center;
}
</style>
