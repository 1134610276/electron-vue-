<template>
  <div id="supplementCard">
    <readCard></readCard>
    <div class="supplementCard_content_wrap">
      <div class="supplementCard_content">
        <div class="supplementCard_content_title">
          <ul>
            <li @click="select('0')" :class="{select:selectIndex=='0'}">IC卡报失</li>
            <li @click="select('1')" :class="{select:selectIndex=='1'}">取消报失</li>
          </ul>
        </div>
        <ul class="clearfloat">
          <li>
            <div>
              <div>IC卡号</div>
              <input v-model="cardId1" :disabled="selectIndex==0?'disabled':false"/>
            </div>
          </li>
          <li>
            <div>
              <div>证件号码</div>
              <input v-model="cardId"/>
            </div>
          </li>
        </ul>
        <div class="supplementCard_content_btn" @click="confrim()">确定</div>
      </div>
    </div>
    <tip v-if="tipShow"></tip>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';
import tip from '@/components/tip.vue';
  export default {
    name: 'landing-page',
    data(){
      return {
        selectIndex:0,
        cardId:"",
        tipShow:false
      }
    },
    components: { readCard ,tip},
    computed:{
      cardId1(){
        return this.$store.state.basic.mealInformation.card_num
      },
    },
    methods: {
      select(value){
          this.selectIndex=value;
          this.cardId=""
      },
      async confrim(){
       let tag=this.selectIndex==0?"":"cancel"
       let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
       let res=await this.$request.postData('/member/memberCardReportLoss',{id_card_num:this.cardId,type:tag,user_token:userToken,card_num:this.cardId1})
       this.$baseFunction.showTotals(this,res.message)
       this.cardId=''
       this.$store.dispatch('setCardId','')
      }
    },
    destroyed(){
      this.$store.dispatch('setMealInformation',"")
    }
  }
</script>

<style scoped>
#supplementCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.supplementCard_content_wrap{flex: 1;}
.supplementCard_content{background-color: #fff;margin:0px 30px;height: 100%;}
.supplementCard_content_title{height: 60px;line-height: 60px;text-indent: 10px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;}
.supplementCard_content_title ul{width: 100%;height: 100%;display: flex;justify-content: row;}
.supplementCard_content_title ul li{width: 120px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
.supplementCard_content_title ul li.select{border-bottom: 4px solid  #3B89E5;}

.supplementCard_content>ul{margin:40px 0px 0px 98px;border-bottom:1px solid  #EFEFF4; padding-bottom: 30px;width: 360px;}
.supplementCard_content>ul li{width: 360px;height: 50px;margin-bottom: 30px;}
.supplementCard_content>ul li>div{width: 360px;height: 50px;display: flex;}
.supplementCard_content>ul li>div div{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;}
.supplementCard_content>ul li>div input{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;margin-left: 5px;}
.supplementCard_content_btn{width: 100px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin:0px 0px 0px 168px;}
</style>
