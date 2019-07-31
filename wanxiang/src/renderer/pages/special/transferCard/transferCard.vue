<template>
  <div id="supplementCard">
    <readCard></readCard>
    <div  class="readCard" >
      <div class="meal_card">
        <div><b>被过户的卡号</b></div>
        <input type="type" placeholder="读卡/输入手机号码" v-model="cardId">
      </div>
      <div class="meal_btn" @click="doka">读卡</div>
      <div class="meal_careDetails" v-if="informationErr">
        <img src="http://file.rzkeji.com/web/wanxiang/icon/user.png"/>
        <div class="careDetails_name">
          <div><b>{{dataList1.member_grade_name}}</b></div>
          <div>会员号{{dataList1.member_num}}</div>
        </div>
        <ul class="careDetails_details">
          <li>预存款：{{dataList1.money}}</li>
          <li>积分：{{dataList1.integral}}</li>
          <li>姓名：{{dataList1.user_info==undefined ?"":dataList1.user_info.realname}}</li>
          <li>币余额：{{dataList1.coin}}</li>
          <li :title="dataList1.card_num">卡号：{{dataList1.card_num}}</li>
          <li>电话：{{dataList1.user_info==undefined ?"":dataList1.user_info.contact}}</li>
        </ul>
      </div>
    </div>
    <div class="supplementCard_content_wrap">
      <div class="supplementCard_content">
        <div class="supplementCard_content_title"><div style="display:flex">过户操作<div style="font-size:16px;color:red;" v-if="((dataList1.member_grade_id==mealInformation.member_grade_id) || (dataList1==''||mealInformation=='') )?false :true">(会员等级不同，需要授权才能过户)</div></div>
            <div style="width:80px;height:40px;background: #3B89E5;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height:40px;margin:10px 20px;cursor:pointer;text-indent: 0px;" @click="shou">{{authorizationTag!='' ||dataList1.member_grade_id==mealInformation.member_grade_id?'过户':'授权过户'}}
            </div>
        </div>
        <ul class="clearfloat">
          <li class="supplementCard_li">
            <div>
              <div class="supplementCard_title">预存款过户</div>
              <input type="text" v-model="money"/>
            </div>
            <div>
              <div class="supplementCard_title">余币过户</div>
              <input type="text" v-model="coin"/>
            </div>
          </li>
          <li class="supplementCard_li">
            <div>
              <div class="supplementCard_title">奖票过户</div>
              <input type="text" v-model="win_ticket"/>
            </div>
            <div>
              <div class="supplementCard_title">积分过户</div>
              <input type="text" v-model="integral"/>
            </div>
          </li>
          <li class="supplementCard_li">
            <div>
              <div class="supplementCard_title">门票过户</div>
              <!-- <input type="text" v-model="ticket_id"/> -->
            <Select style="width:260px;height:50px;" size="large" v-model="ticket_id" @on-change='getTicketValue'>
                  <Option  :value="value.id" :key="value.ticket_name" style="height:50px;"  v-for="(value,index) in mealInformation.user_ticket">{{value.ticket_name}}</Option>
              </Select>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import readCard from '@/components/readCard.vue';
const {ipcRenderer} = require('electron')
 const {ipcRenderer: ipc} = require('electron');
  export default {
    name: 'landing-page',
    data(){
      return {
        money:"",
        integral:"",
        win_ticket:"",
        dataList1:"",
        informationErr:false,
        cardId:"",
        coin:"",
        ticket_id:""
      }
    },
    components: { readCard },
    computed:{
      authorizationTag(){
        return this.$store.state.special.authorizationTag
      },
      mealInformation(){
        return this.$store.state.basic.mealInformation
      },
    },
    mounted(){
    },
    methods:{
      async doka(){
        var readCardId = ipcRenderer.sendSync('synchronous-message')
        if(readCardId != ""){
            this.cardId = readCardId
        }
        let res=await this.$baseFunction.getCardNumber(this.cardId)
        ipc.send('doka',res.data);
        if(res.level=='error'){
          this.$baseFunction.showTotals(this,res.message)
        }
        this.informationErr=res.level=='success'?true:false
        this.dataList1=res.level=='success'?res.data:""
      },
      getTicketValue(value){
        this.ticket_id=value
      },
      async shou(){
        if(this.mealInformation!='' &&this.dataList1!=''){
          console.log((this.dataList1.member_grade_id==this.mealInformation.member_grade_id) )
          if(this.dataList1.member_grade_id!=this.mealInformation.member_grade_id&&this.authorizationTag==''){
            this.$store.dispatch('setAuthorizationShow',true)
          }else{
            //授权成功，进行过户
            let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
            let res=await this.$request.postData('/special/CardMoneyTransfer',{user_token:userToken,want_card_num:this.mealInformation.card_num,been_card_num:this.dataList1.card_num,card_money:this.money,card_coin:this.coin,integral:this.integral,ticket_id:this.ticket_id,win_ticket:this.win_ticket,power_key:this.authorizationTag})
            this.$baseFunction.showTotals(this,res.message)
            if(res.level=='success'){
              this.$store.dispatch('setAuthorizationTag','')
              this.dataList1=''
              this.informationErr=""
              this.$store.dispatch('setMealInformation','')
              this.money="",
              this.integral="",
              this.win_ticket="",
              this.cardId="",
              this.coin="",
              this.ticket_id=""
            }
          }
        }else{
          this.$baseFunction.showTotals(this,'请先读卡')
        }
      }
    },
    destroyed(){
      
    }
  }
</script>

<style scoped>
#supplementCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.supplementCard_content_wrap{flex: 1;}
.supplementCard_content{background-color: #fff;margin:0px 30px;height: 100%;}
.supplementCard_content_title{height: 60px;line-height: 60px;text-indent: 10px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;display: flex;justify-content:space-between;}
.supplementCard_content ul{margin:40px 0px 0px 68px;}
.supplementCard_li{width: 720px;height: 50px;display: flex;margin-bottom:20px; }
.supplementCard_li>div{width: 360px;height: 50px;display: flex;}
.supplementCard_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 5px;}
.supplementCard_li>div input{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}


@media screen and (max-width: 1025px) {
  .supplementCard_li{width: 630px;}
 .supplementCard_li>div{width: 320px;} 
}
</style>
