<template>
  <div id="updateCard">
    <readCard></readCard>
    <div class="updateCard_content_wrap">
        <div class="updateCard_content_title">
          <ul>
            <li @click="select('0')" :class="{select:selectIndex=='0'}">币转余额</li>
            <li @click="select('1')" :class="{select:selectIndex=='1'}">门票转余额</li>
          </ul>
          <div style="width:80px;height:40px;background: #3B89E5;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height:40px;margin:10px 20px;cursor:pointer;text-indent: 0px;"  @click="shou">{{authorizationTag!=''?'过户':'授权过户'}}</div>
        </div>
        <div class="updateCard_contaioner">
          <div class="updateCard_wrap" ref="left">
            <vue-scroll :ops="ops">
              <div class="updateCard_scroll">
                <ul class="clearfloat updateCard_content_ul">
                  <li class="li">
                    <div v-if="selectIndex=='0'">
                      <div class="updateCard_title">需转换的币数</div>
                      <input placeholder="输入转换的币数" v-model="coin" @blur="getMoney('coin')" @keydown.enter="getMoney('coin')"/><div style="line-height:50px;font-size:20px;margin-left:10px;">元</div>
                    </div>
                    <div v-else>
                      <div class="updateCard_title">门票转余额</div>
                      <Select style="width:260px;height:50px;" size="large" v-model="ticket_id" @on-change='getTicketValue'>
                        <Option  :value="value.id" :key="value.ticket_name" style="height:50px;"  v-for="(value,index) in mealInformation.user_ticket">{{value.ticket_name}}</Option>
                      </Select>
                    </div>
                  </li>
                </ul>
                <ul class="clearfloat updateCard_content_ul updateCard_content_ul1">
                  <li class="li">
                    <div>
                      <div class="updateCard_title">转成的余额</div>
                      <div>{{money}}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </vue-scroll>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data(){ 
        return {
          selectIndex:'0',
          coin:"",
          ticket_id:"",
          money:"",
          type:"coin",
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
    components: { readCard ,vueScroll},
    computed:{
      authorizationTag(){
        return this.$store.state.special.authorizationTag
      },
      mealInformation(){
        return this.$store.state.basic.mealInformation
      },
    },
    methods: {
      select(value){
        this.selectIndex=value
        this.type=this.selectIndex=='0'?'coin':'ticket'
      },
      getTicketValue(value){
        this.ticket_id=value
        this.getMoney('ticket')
      },
      async shou(){
        if(this.mealInformation!=''&&this.authorizationTag==''){
          this.$store.dispatch('setAuthorizationShow',true)
        }else{
          //授权成功，进行转换
          let baseUrl=await this.$baseFunction.getFileData()
          let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
          let res=await this.$request.postData('/special/cardMoneyConvert',{card_num:this.mealInformation.card_num,type:this.type,num:this.type=='coin'?this.coin:this.ticket_id,convert_money:this.money,power_key:this.authorizationTag,user_token:userToken})
          console.log(res)
          this.$baseFunction.showTotals(this,res.message)
          this.$store.dispatch('setAuthorizationTag','')
          this.money='';
          this.coin="";
          this.$store.dispatch('setMealInformation','')
          this.informationErr=""
        }
      },
      async getMoney(type){
        let res=await this.$request.getData('/special/getConvertCardMoney',{card_num:this.mealInformation.card_num,type:type,num:type=='coin'?this.coin:this.ticket_id})
        console.log(res)
        if(res.level=='success'){
          this.money=res.data
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      }
    },
    mounted(){
      this.$store.dispatch('setReadCardType','change_card');
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
    }
  }
</script>

<style scoped>
#updateCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.updateCard_content_wrap{width:calc(100%-30px);margin:0px 30px;flex: 1;display: flex;flex-direction: column;background-color: #fff;}
.updateCard_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;display: flex;}
.updateCard_contaioner{width: 100%;flex: 1;overflow-y: hidden;}
.updateCard_wrap{width: 100%;height: 100%;}
.updateCard_scroll{width: 100%;padding-bottom: 60px;}
.updateCard_content_title ul{width: 100%;height: 100%;display: flex;justify-content: row;}
.updateCard_content_title ul li{width: 120px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
.updateCard_content_title ul li.select{border-bottom: 4px solid  #3B89E5;}
.updateCard_content_ul{margin:40px 0px 0px 68px;border-bottom:1px solid  #EFEFF4;width: 720px;}
.updateCard_content_ul:nth-of-type(2){border-bottom: 0;}
.updateCard_content_ul li.li{width: 720px;height: 50px;display: flex;margin-bottom: 20px;}
.updateCard_content_ul li>div{width: 360px;height: 50px;display: flex;}
.updateCard_content_ul li>div div.updateCard_ka{width: 60px;background: #8BC0FF;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;cursor: pointer;}
.updateCard_content_ul li>div div.updateCard_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 10px;}
/*.updateCard_content_ul li:nth-of-type(1)>div:nth-of-type(1) input{width: 190px;margin-right: 10px;}
.updateCard_content_ul1 li:nth-of-type(1)>div:nth-of-type(1) input{width: 260px;margin-right: 0px;}*/
.updateCard_content_ul li>div input,.updateCard_content_ul1 li>div div:nth-of-type(2){width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}
.ivu-select .ivu-select-dropdown{width: 260px;}
.updateCard_content_ul li{width: 260px;}
@media screen and (max-width: 1025px) {
  .updateCard_content_ul{width: 640px;margin: 40px 0px 0px 30px;}
  .updateCard_content_ul li.li{width: 640px;}
  .updateCard_content_ul li>div{width: 315px;}
}
</style>
