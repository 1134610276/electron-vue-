<template>
  <div  class="authorization" >
    <div class="authorization_wrap">
        <div class="authorization_title">管理员授权<img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="close()" class="authorization_close"/></div>
        <div class="authorization_content">
            <div class="authorization_content_title">授权登陆</div>
            <div class="authorization_content_user">管理员帐号</div>
            <input placeholder="请输入管理员帐号" class="authorization_content_userInput" v-model="user"/>
            <div class="authorization_content_password">密码</div>
            <input placeholder="请输入密码" class="authorization_content_passwordInput" v-model="password" type="password" />
            <div class="authorization_content_why">授权原因</div>
            <Select style="width:300px;height:50px;margin:0px 0px 30px 60px;" size="large" v-model="card_sex">
                <Option  value="男" style="height:50px;">男</Option>
                <Option  value="女" style="height:50px;">女</Option>
            </Select>
        </div>
        <ul class="authorization_btn">
            <li>刷卡</li>
            <li @click="confirm">确定</li>
        </ul>
    </div>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')
    export default {
        name: 'authorization',
        data(){
            return {
                user:"",
                password:"",
                card_sex:""
            }
        },
        computed:{
          isTuidan(){
            return this.$store.state.special.isTuidan
          },
        },
        methods: {
            close(){
                this.$store.dispatch('setAuthorizationShow',false)
            },
            async confirm(){
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
                let res=await this.$request.postData('/getPowerKey',{username:this.user,password:this.password,user_token:userToken})
                this.$store.dispatch('setAuthorizationShow',false)
                if(res.level=='success'){
                    this.$store.dispatch('setAuthorizationTag',res.data)
                    //退订单得时候执行
                    if(this.isTuidan){
                      let value=await this.$request.postData('/order/buildRebackOrder',{id:this.$store.state.special.dingId,power_key:this.$store.state.special.authorizationTag})
                      // console.log(value)
                      if(value.level=="success"){
                        this.$store.dispatch('setOrder_num',value.data.order_num)
                        let data=await this.$request.getData('/order/getOrderList',{order_num:value.data.order_num,user_token:userToken})
                        if(data.level=='success'){
                            this.$store.dispatch('setSelectData',data.data)
                            this.$store.dispatch('setHuiyuanTag','huiyantag')
                            var readCardId = ipcRenderer.sendSync('synchronous-message')
                            let res=await this.$baseFunction.getCardNumber(readCardId)
                            let tag=res.level=='success' ?false :true
                            this.$store.dispatch('setIsdoka',tag)
                            this.$store.dispatch('setMealInformation',res.level=='error'?"":res.data)
                            this.$store.dispatch('setMessageBoxShow',true)
                        }
                      }else{
                        this.$baseFunction.showTotals(this,value.message)
                      }
                    }
                }else{
                    this.$baseFunction.showTotals(this,res.message)
                }
            }
        }
    }
</script>
    
<style>
.authorization {width:100%;height:100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.8);z-index: 99;}
.authorization_wrap{width: 420px;height: 500px;background-color: #fff;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-left: -210px;margin-top: -225px;}
.authorization_title{width: 100%;height: 50px;line-height: 50px;text-indent: 10px;background: #3B89E5;border-radius: 6px 6px 0px 0px;font-size: 20px;color: #FFFFFF;position: relative;}
.authorization_close{width:50px;height:50px;position: absolute;right: 0px;top: 0px;cursor: pointer;}
.authorization_content_title{width: 100%;text-align: center;line-height: 60px;font-size: 18px;color: #303039;}
.authorization_content_user,.authorization_content_password,.authorization_content_why{font-size: 14px;color: #303039;text-indent: 60px;}
.authorization_content_user{margin-top: 20px;}
.authorization_content_userInput,.authorization_content_passwordInput{width: 300px;height: 50px;font-size: 18px;color: #B2B2B9;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 8px;margin:5px 0px 10px 60px;font-size: 14px;}
.authorization_btn{width: 100%;height: 50px;display: flex;justify-content: center;}
.authorization_btn li{width: 140px;height: 100%;line-height: 50px;text-align: center;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;cursor: pointer;}
.authorization_btn li:nth-of-type(1){background: #8BC0FF;margin-right: 20px;}
.authorization_btn li:nth-of-type(2){background: #3B89E5;}
</style>