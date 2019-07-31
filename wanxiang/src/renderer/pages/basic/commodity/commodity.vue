<template>
  <div id="commodity">
      <div class="commodity_header">
        <div class="commodity_left">
          <div class="commodity_select" >
            <div class="commodity_wrap drag" ref="left">
              <vue-scroll :ops="ops">
                <ul>
                  <li v-for="(value,index) in commodityData" @click="selectShop(value)" :class="{select:selectId==value.id?true:false}">
                    <div class="commodity_details_left">
                      <div>{{value.ssn_num}}</div>
                      <img :src="value.thumb_url"/>
                    </div>
                    <div class="commodity_details_right">
                      <div class="details_number">{{value.name}}</div>
                      <div class="details_title">{{value.amount_integral}}<span>积分</span>/{{value.amount_ticket}}<span>奖票</span></div>
                    </div>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>
          <coinsFooter type="duihuan" ><span slot="footer_title">商品费用：</span><span slot="footer_btn">兑换</span></coinsFooter>
        </div>
        <div class="buyCoins_right"><shopCard></shopCard></div>
      </div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import shopCard from '@/components/shopCard.vue';
import coinsFooter from '@/components/coinsFooter.vue';
const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data(){
      return {
        cardId:"",
        cardInformation:"",
        userToken:"",
        commodityData:"",
        selectId:"",
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
    components: { Titlebtn , coinsFooter ,shopCard ,vueScroll},
    methods: {
      async getCommodityData(){
        let res=await this.$request.getData('/goods/getGiftList',{user_token:this.userToken});
        this.commodityData=res.data
      },
      async exchange(value){//判断是否兑换礼品
          // this.$store.dispatch('setSelectData',value)
          let cardId=ipcRenderer.sendSync('synchronous-message')
          this.cardId=this.cardId==''?cardId:this.cardId
          let res=await this.$request.getData('/member/getMemberInfoByCardNum',{card_num:this.cardId,user_token:this.userToken})
          this.$store.dispatch('setMealInformation',res.level=='success'?res.data:"")
          let tag=this.$store.state.basic.mealInformation==''?true:false
          this.$store.dispatch('setIsdoka',tag)
          let card_num=!tag ? this.$store.state.basic.mealInformation.card_num:''
          this.$baseFunction.order(this,"",card_num,value.goods_key)
          this.$store.dispatch('setDuihuanBoxShow',true)
      },
      selectShop(value){
        this.selectId=value.id
        this.$store.dispatch('setSelectData1',value)
        this.$store.dispatch('setType','duihuan')
        console.log(this.$store.state.basic.type)
      },
    },
    async mounted(){
      this.$store.dispatch('setCart_num','');
      this.$store.dispatch('setShopCard',[])
      this.getCommodityData();
      let baseUrl=await this.$baseFunction.getFileData()
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
      this.$store.dispatch('setCart_num','');
      this.$store.dispatch('setSelectData1','');
      this.$store.dispatch('setShopCard',[])
      this.$store.dispatch('setType','')
    }
  }
</script>

<style scoped>
#commodity{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.commodity_header{flex: 1;display: flex;justify-content: row;margin-top: 30px;}
.commodity_left{flex:1;margin:0px 10px 0px 30px;display: flex;flex-direction:column;}
.commodity_classify li:nth-of-type(1){border-radius: 6px 0px 0px 0px;}
.commodity_classify li:nth-last-of-type(1){border-radius: 0px 6px 0px 0px;}
.commodity_select{width: 100%;background-color: #fff;flex: 1;position: relative;}
.commodity_wrap{width: 96%;height: 100%;overflow-y: hidden;position: absolute;left: 2%;}
.commodity_wrap ul{width: 100%;display: flex;justify-content:row;flex-wrap:wrap;padding:20px 0px 70px;}
.commodity_wrap ul li{width: 322px;height: 180px;border: 1px solid #CECED6;border-radius: 6px;display: flex;justify-content: row;margin:10px 10px 0px 0px;}

.commodity_wrap ul li.select {border:4px solid #0D6BDA;}
.commodity_details_left{width: 148px;height: 100%;position: relative;}
.commodity_details_left div{width: 100%;height: 20px;font-size: 12px;color: #5F5F68;position: absolute;left: 0;top: 3px;text-indent:5px;z-index: 99;}
.commodity_details_left img{width: 100%;height: 100%;position: absolute;left: 0;top: 0;}
.commodity_details_right{flex: 1;height: 100%;position: relative;margin-right: 10px;}
.commodity_details_right div{position: absolute;left: 0px;top: 80px}
.commodity_details_right .details_number{line-height: 33px;font-size: 24px;color: #5F5F68;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 156px;top: 50px;}
.details_title{top: 53px;font-size: 18px;color: #303039;}
.details_title span{font-size: 12px;color: #303039;}
.details_size{top: 120px;background: #5CA7FF;border-radius: 6px;width: 60px;height: 40px;font-size: 14px;text-align: center;line-height: 40px;color: #FFFFFF;cursor: pointer;}



/*.select{border:1px solid red;}*/





.commodity_right{width: 322px;height: 100%;margin: 0px 30px 0px 0px; background-color: #fff;position: relative;}
.commodity_title{width: 100%;height: 60px;border-radius: 6px 6px 0px 0px;line-height: 60px;text-indent: 15px;font-size: 18px;color: #5F5F68;border:1px solid  #EFEFF4}


.commodity_details{width: 100%;}
.commodity_details li{width: 100%;height: 64px;display: flex;flex-direction: column;margin-top: 10px;}
.commodity_details li>div:nth-of-type(1){width: 100%;text-indent: 30px;font-size: 14px;color: #8E8E93;}
.commodity_details li>div:nth-of-type(1) span{color: red;}
.commodity_details li:nth-of-type(1) div:nth-of-type(2){width: 272px;height:40px;margin-left: 30px;display: flex;justify-content: row;cursor: pointer;}
.commodity_details li:nth-of-type(n+2) div:nth-of-type(2){width: 272px;height:40px;margin-left: 30px;background: #F8F8FB;
border: 1px solid #EFEFF4;border-radius: 4px;line-height: 40px;text-indent: 10px;}
.commodity_details li div:nth-of-type(2) input{width: 200px;height: 40px;background: #EFEFF4;border: 1px solid #B2B2B9;border-radius: 4px;font-size: 16px;color: #303039;text-indent: 10px;}
.commodity_details li div:nth-of-type(2) div{width: 62px;height: 40px;background: #DEEDFF;border: 1px solid #B3D6FF;border-radius: 6px;font-size: 14px;color: #3B89E5;text-align: center;line-height: 40px;margin-left: 10px;}
</style>
