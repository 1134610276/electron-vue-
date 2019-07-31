<template>
  <div id="checkOut">
    <div class="right_nav">
      <div class="right_div" style="-webkit-user-select: none;-webkit-app-region: drag;">
          <Titlebtn></Titlebtn>
      </div>
      <navSelect :navData="navData"></navSelect>
    </div>
    <div class="right_content">
      <router-view></router-view>
    </div>
    <!-- <messageBox></messageBox> -->
    <!-- <informationBox></informationBox> -->
  </div>
</template>

<script>
import informationBox from '@/components/informationBox.vue';
import messageBox from '@/components/messageBox.vue';
import Titlebtn from '@/components/btn.vue';
import navSelect from '@/components/navSelect.vue';
  export default {
    name: 'cardIndex',
    data(){
        return {
          navData:[
            {
              routerLink:'/index/order/orderCheckOut',
              name:"订单查询"
            },
            {
              routerLink:'/index/order/activeTicket',
              name:"门票查询"
            },
            {
              routerLink:'/index/order/goodsCheckOut',
              name:"在售商品"
            },
          ]
        } 
    },
    components: { Titlebtn,messageBox ,informationBox ,navSelect},
    methods: {
      select(value){
        this.selectIndex=value
      },
    },
    mounted(){
      
    }
  }
</script>

<style scoped>
#checkOut{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction:column;position: relative;overflow-x: hidden;}
 .right_nav{width: 100%;height:80px;background-color: #fff;}
 .right_div{width: 100%;height: 40px;display: flex;justify-content: flex-end;}
.right_content{width: 100%;display: flex;flex: 1;}

</style>
