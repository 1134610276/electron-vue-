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
            routerLink:'/index/vip/admissionVip',
            name:"新建会员"
          },
          {
            routerLink:'/index/vip/informationVip',
            name:"会员资料"
          },
          {
            routerLink:'/index/vip/securityVip',
            name:"安全设置"
          },
          {
            routerLink:'/index/vip/checkMoneyVip',
            name:"余额查询"
          },
          {
            routerLink:'/index/vip/detailsVip',
            name:"账单明细"
          },
        ]
      }
    },
    computed:{
    },
    components: { Titlebtn  ,navSelect},
  }
</script>

<style scoped>
#vipIndex{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction:column;position: relative;}
 .right_nav{width: 100%;height:80px;background-color: #fff;}
 .right_div{width: 100%;height: 40px;display: flex;justify-content: flex-end;}
.right_content{width: 100%;display: flex;flex: 1;}
</style>
