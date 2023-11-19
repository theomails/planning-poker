<template>
  <div id="app">
    <vue-progress-bar></vue-progress-bar>
    <div class="app-header">
      <div class="app-header-logo" @click="logoClick">
        <el-icon ><ChatDotSquare /></el-icon>
        <!--img src="/favicon.ico" style="height:48px;"/-->
        <h4>Planning Poker</h4>
      </div>
    </div>

    <div class="app-body">
      <router-view />
    </div>
  </div>
</template>
<script>

export default {
  name: 'App',
  methods:{
    logoClick(){
      window.location.href = "/";
    }
  },
  components: {
    
  }
}
</script>
<style>
  @import './assets/app.css';
</style>
<style>
.app-header{
  padding: 30px 30px 15px 30px;
}
.app-header-logo{
  display: inline-flex;
  align-items: baseline;
  cursor: pointer;

  padding: 7px 15px 9px 15px;
  border-radius: 15px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  font-size: 15pt;
  font-weight: 600;
  background-color: white;
}
.app-header-logo > h4{
  margin:10px;  
}
.app-header i{
  font-size: 20pt; 
  position: relative; 
  top: 6px;
  margin: 0px 5px;
}
</style>