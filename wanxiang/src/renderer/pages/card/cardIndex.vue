<template>
  <div id="cardIndex">
    <div class="right_nav">
      <div class="right_div" style="-webkit-user-select: none;-webkit-app-region: drag;">
          <Titlebtn></Titlebtn>
      </div>
      <navSelect :navData="navData"></navSelect>
    </div>
    <div class="right_content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import navSelect from '@/components/navSelect.vue';
  export default {
    name: 'cardIndex',
    data(){
      return {
        navData:[
          {
            routerLink:'/index/card/applyCard',
            name:"办卡"
          },
          {
            routerLink:'/index/card/backCard',
            name:"退卡"
          },
          {
            routerLink:'/index/card/updateCard',
            name:"升级/换卡"
          },
          {
            routerLink:'/index/card/lossCard',
            name:"报失"
          },
          {
            routerLink:'/index/card/supplementCard',
            name:"续期"
          },
        ]
      }
    },
    components: { Titlebtn  ,navSelect },
  }
</script>

<style scoped>
#cardIndex{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction:column;position: relative;}
.right_nav{width: 100%;height:80px;background-color: #fff;}
.right_div{width: 100%;height: 40px;display: flex;justify-content: flex-end;}
.right_content{width: 100%;display: flex;flex: 1;}
</style>
