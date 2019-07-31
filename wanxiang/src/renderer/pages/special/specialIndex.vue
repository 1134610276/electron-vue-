<template>
  <div id="vipIndex">
    <div class="right_nav">
      <div class="right_div" style="-webkit-user-select: none;-webkit-app-region: drag;">
          <Titlebtn></Titlebtn>
      </div>
      <navSelect :navData="navData"></navSelect>
    </div>
    <div class="right_content">
      <router-view></router-view>
    </div>
    <!-- <tip v-if="tipShow"></tip> -->
  </div>
</template>

<script>
// import tip from '@/components/tip.vue';
import Titlebtn from '@/components/btn.vue';
import navSelect from '@/components/navSelect.vue';
  export default {
    name: 'cardIndex',
    data(){
      return {
        navData:[
          {
            routerLink:'/index/special/specialDetails',
            name:"特殊操作"
          },
          // {
          //   routerLink:'/index/special/escalateCard',
          //   name:"卡升级"
          // },
          {
            routerLink:'/index/special/tuidan',
            name:"退单"
          },
          {
            routerLink:'/index/special/transferCard',
            name:"余额过户"
          },
          {
            routerLink:'/index/special/transformation',
            name:"余额转换"
          },
        ]
      }
    },
    computed:{
      // tipShow(){
      //   return this.$store.state.together.tipShow
      // }
    },
    components: { Titlebtn ,navSelect},
  }
</script>

<style scoped>
#vipIndex{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction:column;position: relative;}
 .right_nav{width: 100%;height:80px;background-color: #fff;}
 .right_div{width: 100%;height: 40px;display: flex;justify-content: flex-end;}
.right_content{width: 100%;display: flex;flex: 1;}

</style>
