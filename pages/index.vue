<template>
  <div class="home">
      <div class="header">
        
      </div>
      <div class="logo">
        <img src="../assets/imgs/logo.jpg" alt="">
      </div>
  </div>
  
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',
})
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  .header {
    background-color: #c7a67a;
    height: 100px;
  }
  .logo {
    top: 0;
    left: 50%;
    z-index: 10;
    position: absolute;
    padding: 0px;
    margin-left: -100px;
    
    img {
      width:100%;
      height:100%;
      object-fit: cover;
    }
    
  }
}

</style>
