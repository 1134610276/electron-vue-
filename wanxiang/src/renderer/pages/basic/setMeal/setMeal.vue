<template>
  <div id="setMeal" class="drag">
    <div class="meal_title">
      <readCard></readCard>
    </div>
    <div class="meal_content">
      <ul class="content_nav">
        <li :class="{select:selectIndex=='0'?true:false}" @click="select('0')">购币</li>
        <li :class="{select:selectIndex=='1'?true:false}" @click="select('1')">预存款</li>
      </ul>
      <div class="content_list">
        <div class="content_list_wrap" ref="left">
            <vue-scroll :ops="ops" v-if="coinsDetailsShow">
              <coinsDetails :coninsData="coninsData" :typeTitle="selectIndex=='0' ?'会员购币' :'预存款'"></coinsDetails>
            </vue-scroll>
            <div v-else class="meal_none">
              <img src="http://file.rzkeji.com/web/wanxiang/icon/dokaImg.png"/>
            </div>
        </div>
      </div>
    </div>
    <coinsFooter type="bi" tag="setMeal"><span slot="footer_title">充入套餐：</span><span slot="footer_btn">{{selectIndex=='0'?'代币充值':'充值'}}</span></coinsFooter>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import readCard from '@/components/readCard.vue';
import coinsFooter from '@/components/coinsFooter.vue';
import coinsDetails from '@/components/coinsDetails.vue';
// import BScroll from 'better-scroll'
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
  export default {
    name: 'setMeal',
    components: { Titlebtn , coinsFooter ,coinsDetails,readCard,vueScroll},
    data(){
      return {
        selectIndex:'0',
        ops:{
          vuescroll:{
            detectResize:true
          },
          scrollPanel:{},
          rail:{},
          bar:{background: '#3B89E5',}
        }
      }
    },
    computed:{
      coinsDetailsShow(){
        return this.$store.state.basic.coinsDetailsShow
      },
      coninsData(){
        return this.$store.state.basic.coninsData
      },
      cardId(){
        return this.$store.state.basic.cardId
      },
      product_type(){
        return this.$store.state.basic.product_type
      }
    },
    methods: {
      async select(value){
        this.selectIndex=value;
        this.$store.dispatch('setProduct_type',this.selectIndex=='0'?'invent_coin' :'recharge_money');
        let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
        let res=await this.$request.getData('/goods/get-member-package-list',{user_token:userToken,card_num:this.cardId,product_type:this.product_type})
        if(res.level=='success'){
          this.$store.dispatch('setConinsData',res.data);
        }else{
          this.$store.dispatch('setCoinsDetailsShow',false)
        }
      },
    },
    mounted(){
      this.$store.dispatch('setReadCardType','setMeal');
      this.$store.dispatch('setProduct_type',this.selectIndex=='0'?'invent_coin' :'recharge_money')
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
      this.$store.dispatch('setConinsData','')
      this.$store.dispatch('setSelectData1','')
      this.$store.dispatch('setCoinsDetailsShow',false)
      this.$store.dispatch('setProduct_type','invent_coin')
    }
  }
</script>

<style scoped>
#setMeal{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.meal_title{width: 100%;height: 165px;}
.meal_content{flex: 1;display: flex;flex-direction: column;margin:0px 30px;background-color: #fff;}
.content_nav{height: 50px;display: flex;justify-content: row;border-bottom:1px solid #e3e3eb;}
.content_nav li{width: 100px;height: 50px;font-size: 18px;color: #5F5F68;text-align: center;line-height: 50px;text-align: center;cursor: pointer;}
.content_nav li.select{border-bottom: 4px solid #3B89E5;font-weight: 600}
.content_list{flex:1;overflow-y: hidden;}
.content_list_wrap{width: 100%;height: 100%;margin-top: 10px;position: relative;}
.content_list_details{display: flex;justify-content: row;flex-wrap: wrap;}
.meal_none{width: 100%;height: 100%;}
.meal_none img{width: 300px;height: 200px;position: absolute;top:130px;left: 50%;margin-left: -106px;}
@media screen and (max-width: 1365px) {
   .content_list_details li{margin-left: 85px;}
}
@media screen and (min-width:1366px) and (max-width:1920px){
  .content_list_details li{margin-left: 25px;}
}
@media screen and (min-width:1920px) {
  .content_list_details li{margin-left: 25px;}
}
</style>
