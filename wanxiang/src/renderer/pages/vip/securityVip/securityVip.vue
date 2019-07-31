<template>
  <div id="securityVip">
    <readCard></readCard>
    <div class="securityVip_content_wrap">
      <div class="securityVip_content">
        <div class="securityVip_content_title">
          <ul>
            <li @click="select('0')" :class="{select:selectIndex=='0'}">密码重置</li>
<!--             <li @click="select('1')" :class="{select:selectIndex=='1'}">更改指纹</li>
            <li @click="select('2')" :class="{select:selectIndex=='2'}">人脸识别</li> -->
          </ul>
        </div>
        <ul class="clearfloat securityVip_content_ul">
          <li>
              <div class="securityVip_title">手机号码</div>
              <input  class="securityVip_input" v-model="mealInformation==''?'':mealInformation.user_info.contact" disabled maxlength="11"/>
          </li>
          <li>
              <div class="securityVip_title">获取验证码</div>
              <input  class="securityVip_doKa" v-model="verify_code"/>
              <div class="securityVip_doKaBtn" @click="getYan" >获取</div>
          </li>
        </ul>
        <ul class="clearfloat securityVip_content_ul">
          <li>
              <div class="securityVip_title">新密码</div>
              <input  class="securityVip_input" v-model="password" type="password"/>
          </li>
          <li>
              <div class="securityVip_title">确认密码</div>
              <input  class="securityVip_input" v-model="again" type="password"/>
          </li>
        </ul>
        <div class="securityVip_commit" @click="modifyPassword">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';
  export default {
    name: 'landing-page',
    data(){
        return {
          selectIndex:0,
          verify_code:"",
          password:"",
          again:"",
        }
    },
    computed:{
      mealInformation(){
        return this.$store.state.basic.mealInformation
      },
    },
    components: { readCard },
    methods: {
      select(value){
            this.selectIndex=value
      },
      async getYan(){
        if(this.mealInformation!=""){
          let res=await this.$request.postData('/sendVerifyCode',{phone:this.mealInformation.user_info.contact})
          this.$baseFunction.showTotals(this,res.message)
        }
      },
      async modifyPassword(){
        let baseUrl=await this.$baseFunction.getFileData()
        let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
        let res=await this.$request.postData('/changePayPassword',{phone:this.mealInformation.user_info.contact,password:this.password,confirm_password:this.again,card_num:this.mealInformation.card_num,verify_code:this.verify_code,user_token:userToken})
        this.$baseFunction.showTotals(this,res.message)
        this.verify_code='';
        this.password='';
        this.again='';
      }
    },
  }
</script>

<style scoped>
#securityVip{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.securityVip_content_wrap{flex: 1;}
.securityVip_content{background-color: #fff;margin:0px 30px;height: 100%;}
.securityVip_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;}
.securityVip_content_title ul{width: 100%;height: 100%;display: flex;justify-content: row;}
.securityVip_content_title ul li{width: 120px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
.securityVip_content_title ul li.select{border-bottom: 4px solid  #3B89E5;}

.securityVip_content_ul{margin:40px 0px 0px 68px;border-bottom:1px solid  #EFEFF4;width: 460px;}
.securityVip_content_ul:nth-of-type(2){border-bottom: 0;}
.securityVip_content_ul li{width: 420px;height: 50px;margin-bottom: 20px;display: flex;}
.securityVip_title{width: 100px;line-height: 50px;font-size: 14px;color: #303039;text-align: right;}
.securityVip_input,.securityVip_doKa{width: 320px;line-height: 50px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;text-indent: 10px;margin-left: 10px;}
.securityVip_doKa{width: 230px;}
.securityVip_doKaBtn{width: 80px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;margin-left: 10px;line-height: 50px;cursor: pointer;}
.securityVip_commit{width: 100px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin:50px 0px 0px 168px;cursor: pointer;}


@media screen and (max-width: 1025px) {
  .checkMoneyVip_content_ul{}
}
</style>
