<!--
 * @Author: YCL
 * @Date: 2025-08-31 15:56:09
 * @LastEditors: YCL
 * @LastEditTime: 2025-09-14 19:28:41
 * @Description: 
-->
<template>
  <div id="app">
    <CameraDemo />
  </div>
</template>

<script>
import CameraDemo from './components/cameraDemo.vue'

export default {
  name: 'App',
  components: {
    CameraDemo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body, html {
  height: 100vh;
  width: 100vw;
  margin: 0;
}
</style>
