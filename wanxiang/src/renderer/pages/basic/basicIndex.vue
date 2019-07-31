<template>
  <div id="basicIndex">
    <div class="right_nav">
      <div class="right_div" style="-webkit-user-select: none;-webkit-app-region: drag;">
          <Titlebtn></Titlebtn>
      </div>
      <navSelect :navData='navData'></navSelect>
    </div>
    <div class="right_content">
      <router-view></router-view>
    </div>
    <!-- <tip v-if="tipShow"></tip> -->
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
// import tip from '@/components/tip.vue';
import navSelect from '@/components/navSelect.vue';
  export default {
    name: 'cardIndex',
    components: { Titlebtn ,navSelect},
    data(){
      return {
        navData:[
          {
            routerLink:'/index/basic/buyCoins',
            name:"实币购买"
          },
          {
            routerLink:'/index/basic/setMeal',
            name:"会员充值"
          },
          {
            routerLink:'/index/basic/ticket',
            name:"活动门票"
          },
          {
            routerLink:'/index/basic/exchange',
            name:"商品购买"
          },
          {
            routerLink:'/index/basic/commodity',
            name:"礼品兑换"
          },
        ]
      }
    },
    computed: {
      // tipShow(){
      //   return this.$store.state.together.tipShow
      // }
    },
  }
</script>

<style scoped>
#basicIndex{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction:column;position: relative;}
.right_nav{width: 100%;height:80px;background-color: #fff;}
.right_div{width: 100%;height: 40px;display: flex;justify-content: flex-end;}
.right_content{width: 100%;display: flex;flex: 1;}
</style>
