<template>
  <div id="backCard">
    <div class="backCard_content_wrap">
      <div class="backCard_content">
        <div class="backCard_content_title"><div>退卡操作</div> <div @click="doka">读卡</div></div>
        <ul class="clearfloat">
          <li>
            <div>
              <div>IC卡号</div>
              <div>{{mealInformation.card_num}}</div>
            </div>
            <div>
              <div>卡等级</div>
              <div>{{mealInformation.member_grade_name}}</div>
            </div>
          </li>
          <li>
            <div>
              <div>预存款</div>
              <div>{{mealInformation.money}}</div>
            </div>
            <div>
              <div>门票</div>
              <div>{{mealInformation.user_ticket_num}}</div>
            </div>
          </li>
          <li>
            <div>
              <div>奖票余额</div>
              <div>{{mealInformation.win_ticket}}</div>
            </div>
            <div>
              <div>剩余币数</div>
              <div>{{mealInformation.coin}}</div>
            </div>
          </li>
          <li>
            <div>
              <div>积分</div>
              <div>{{mealInformation.integral}}</div>
            </div>
            <div>
              <div>{{mealInformation.type=='member_card'?'办卡费':'押金'}}</div>
              <div>{{mealInformation.deposit}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <cardFooter type="tuika"><span slot="card_money">应退金额:{{money}}</span><span slot="card_name">退卡</span></cardFooter>
  </div>
</template>
<script>
import cardFooter from '@/components/cardFooter.vue';
const {ipcRenderer} = require('electron')
const {ipcRenderer: ipc} = require('electron');
  export default {
    name: 'landing-page',
    data(){
      return {
        mealInformation:"",
        money:"",
        card_id:""
      }
    },
    components: { cardFooter }, 
    methods:{
      async doka(){
        var readCardId = ipcRenderer.sendSync('synchronous-message')
        if(readCardId != ""){
            this.card_id = readCardId
        }
        let res=await this.$baseFunction.getCardNumber(this.card_id)

        if(res.level=='error'){
          this.$baseFunction.showTotals(this,res.message)
        }else{
          ipc.send('doka',res.data);
         let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
          let cardMoney=await this.$request.getData('/member/getRebackMemberMoney',{card_num:this.card_id,user_token:userToken})
          if(cardMoney.level=='success'){
            this.money=cardMoney.data
            this.mealInformation=res.data
            this.$store.dispatch('setIsdoka',false)
            this.$store.dispatch('setMealInformation',res.data)
          }else{
            this.$baseFunction.showTotals(this,cardMoney.message)
          }
        }
      }
    },
    destroyed(){
      this.$store.dispatch('setMealInformation','')
    }
  }
</script>

<style scoped>
#backCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.backCard_content_wrap{flex: 1;margin-top: 30px;}
.backCard_content{background-color: #fff;margin:0px 30px;height: 100%;}
.backCard_content_title{height: 60px;line-height: 60px;text-indent: 10px;border-bottom: 1px solid #EFEFF4;display: flex;justify-content: space-between}
.backCard_content_title div:nth-of-type(1){font-size: 18px;color: #5F5F68;}
.backCard_content_title div:nth-of-type(2){width: 100px;height: 40px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 40px;margin: 10px 10px 0px 0px;cursor: pointer;text-indent: 0px;}
.backCard_content ul{width: 740px;margin:60px 0px 0px 68px;}
.backCard_content li{width: 720px;height: 50px;display: flex;margin-bottom:40px; }
.backCard_content li>div{width: 360px;height: 50px;display: flex;}
.backCard_content li>div div:nth-of-type(1){width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;}
.backCard_content li>div div:nth-of-type(2){width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;margin-left: 5px;}
@media screen and (max-width: 1025px) {
    .backCard_content{margin: 0px 20px;}
    .backCard_content ul{width: 620px;margin: 60px 0px 0px 40px;}
    .backCard_content li>div{width: 310px;}
}
</style>
