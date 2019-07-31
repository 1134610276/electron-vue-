<template>
  <div id="specialDetails">
    <readCard></readCard>
    <div class="specialDetails_content" > 
      <div class="specialDetails_content_title">
          <b>数据修改</b>
          <div class="specialDetails_content_btn specialDetails_content_btn1" @click="cancel" v-if="authorizationTag!=''">取消授权</div>
          <div class="specialDetails_content_btn" @click="shou">{{authorizationTag!=''?'保存':'授权修改'}}</div>
      </div>
      <div class="specialDetails_details">
        <div class="specialDetails_wrap" ref="left">
          <vue-scroll :ops="ops">
            <ul>
              <li class="specialDetails_li">
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">卡号</div>
                  <input v-model="dataList.card_num" class="specialDetails_wrap_content_details" disabled>
                </div>
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">会员等级</div>
                  <input v-model="dataList.member_grade_name" class="specialDetails_wrap_content_details" disabled>
                </div>
              </li>
              <li class="specialDetails_line"></li>
              <li class="specialDetails_li">
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">预存款</div>
                  <input v-model="dataList.money" class="specialDetails_wrap_content_details" :disabled="disabled">
                </div>
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">币余额</div>
                  <input v-model="dataList.coin" class="specialDetails_wrap_content_details" :disabled="disabled">
                </div>
              </li>
              <li class="specialDetails_li">
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">奖票</div>
                  <input v-model="dataList.win_ticket" class="specialDetails_wrap_content_details" :disabled="disabled">
                </div>
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">积分</div>
                  <input v-model="dataList.integral" class="specialDetails_wrap_content_details" :disabled="disabled">
                </div>
              </li>
              <li class="specialDetails_li specialDetails_wrap_content_areatext">
                <div class="specialDetails_wrap_content">
                  <div class="specialDetails_wrap_content_title">备注</div>
                  <textarea :disabled="disabled"></textarea>
                </div>
              </li>

            </ul>
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
  export default {
    name: 'landing-page',
    data(){
      return {
        dataList:{
          card_num:"",
          member_grade_name:"",
          money:"",
          coin:"",
          win_ticket:"",
          integral:"",
        },
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
      mealInformation(){
        return this.$store.state.basic.mealInformation
      },
      authorizationTag(){
        return this.$store.state.special.authorizationTag
      },
      disabled(){
          return  this.authorizationTag==''?true:false
      }
    },
    watch:{
      mealInformation(newData,oldData){
        this.dataList.card_num=newData.card_num
        this.dataList.member_grade_name=newData.member_grade_name
        this.dataList.money=newData.money
        this.dataList.coin=newData.coin
        this.dataList.win_ticket=newData.win_ticket
        this.dataList.integral=newData.integral
      }
    },
    methods: {
      async shou(){
        if(this.mealInformation!=''&&this.authorizationTag==''){
          this.$store.dispatch('setAuthorizationShow',true)
        }else{
          let baseUrl=await this.$baseFunction.getFileData()
          let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
          let res=await this.$request.postData('/special/special-operation',{user_token:userToken,power_key:this.authorizationTag,card_num:this.dataList.card_num,money:this.dataList.money,coin:this.dataList.coin,integral:this.dataList.integral,win_ticket:this.dataList.win_ticket})
            this.$baseFunction.showTotals(this,res.message)
            this.$store.dispatch('setMealInformation',res.data)
          if(res.level=='success'){
            this.$store.dispatch('setAuthorizationTag','')
          }
        }
      },
      async cancel(){
        if(this.authorizationTag!=''){
          let res=await this.$request.postData('/special/special-delete',{power_key:this.authorizationTag})
          if(res.level=='success'){
            this.$store.dispatch('setAuthorizationTag','')
            let newData=this.$store.state.basic.mealInformation
            this.dataList.card_num=newData.card_num
            this.dataList.member_grade_name=newData.member_grade_name
            this.dataList.money=newData.money
            this.dataList.coin=newData.coin
            this.dataList.win_ticket=newData.win_ticket
            this.dataList.integral=newData.integral
          }
          this.$baseFunction.showTotals(this,res.message)
        }
      }
    },
  }
</script>

<style scoped>
#specialDetails{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.specialDetails_content{background-color: #fff;margin:20px 30px 0px 30px;height: 100%;overflow-y: hidden;display: flex;flex-direction: column;}
.specialDetails_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;line-height: 60px;position: relative;}
.specialDetails_content_title b{margin-left: 30px;}
.specialDetails_content_btn{width: 100px;height: 40px;margin: 10px 20px;background-color: #3B89E5;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;cursor: pointer;position: absolute;right: 15px; top: 0px;}
.specialDetails_content_btn1{right: 135px;}
.specialDetails_details{width: 720px;margin: 40px 68px 0px;flex: 1;overflow-y: hidden;}
.specialDetails_wrap{width: 100%;}
.specialDetails_li{width: 100%;height: 50px;display: flex;margin: 30px 0px;}
.specialDetails_wrap_content{width: 360px;height: 50px;line-height: 50px;display: flex;}
.specialDetails_wrap_content_title{width: 90px;font-size: 14px;color: #303039;text-align: right;}
.specialDetails_wrap_content_details{width: 260px;margin-left: 10px;font-size: 18px;color: #303039;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;text-indent: 10px;}
.specialDetails_line{width: 100%;height: 1px;background-color: #EFEFF4;}
.specialDetails_wrap_content_areatext{width: 720px;height: 100px;margin-top: 70px;}
.specialDetails_wrap_content_areatext .specialDetails_wrap_content{width: 100%;height: 100%;}
.specialDetails_wrap_content textarea{width: 640px;height: 100px;margin-left: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #8E8E93;text-indent: 10px;}


@media screen and (max-width: 1025px) {
  .specialDetails_details{width: calc(100% - 20px);margin:30px 10px; }
}
</style>