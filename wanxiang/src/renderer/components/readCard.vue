<template>
  <div  class="readCard" >
    <div class="meal_card">
      <div><b>会员卡号</b></div>
      <input type="type" placeholder="读卡/输入手机号码" v-model="cardId">
    </div>
    <div class="meal_btn" @click="doka">读卡</div>
    <div class="meal_careDetails" v-if="informationErr">
      <img src="http://file.rzkeji.com/web/wanxiang/icon/user.png"/>
      <div class="careDetails_name">
        <div><b>{{dataList.member_grade_name}}</b></div>
        <div>【状态-{{dataList.status_name}}】</div>
      </div>
      <ul class="careDetails_details">
        <li>预存款：{{dataList.money}}</li>
        <li>积分：{{dataList.integral}}</li>
        <li>姓名：{{dataList.user_info==undefined ?"":dataList.user_info.realname}}</li>
        <li>币余额：{{dataList.coin}}</li>
        <li :title="dataList.card_num">卡号：{{dataList.card_num}}</li>
        <li>电话：{{dataList.user_info==undefined ?"":dataList.user_info.contact}}</li>
      </ul>
      <!--<div class="careDetails_more">更多详情</div>-->
    </div>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')
  const {ipcRenderer: ipc} = require('electron');
    export default {
        name: 'readCard',
        data(){
            return {
              cardId:'',
              // informationErr:false,
            }
        },
        computed: {
          dataList(){
            console.log(this.$store.state.basic.mealInformation)
            return this.$store.state.basic.mealInformation
          },
          product_type(){
            return this.$store.state.basic.product_type
          },
          readCardType(){
            return this.$store.state.basic.readCardType
          },
          selectIndex(){
            return this.$store.state.basic.selectIndex
          },
          informationErr(){
            return this.$store.state.basic.mealInformation==''?false:true
          }
        },
        methods: {
          async doka(){
            var readCardId = ipcRenderer.sendSync('synchronous-message')
            if(readCardId != ""){
                this.cardId = readCardId
            }
            let res=await this.$baseFunction.getCardNumber(this.cardId)
            if(res.level=='error'){
              this.$baseFunction.showTotals(this,res.message)
            }else{
              let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
              if(this.readCardType=='setMeal'){   //日常业务中点击读卡按钮的时候读取卡套餐
                var data=await this.$request.getData('/goods/get-member-package-list',{user_token:userToken,card_num:this.cardId,product_type:this.product_type})
                this.$store.dispatch('setConinsData',data.data)
              }else if(this.readCardType=='detailsVip'){   //账单明细 点击读卡 获取账单信息
                var data=await this.$request.getData('/member/getBill',{type:this.selectIndex,user_token:userToken,card_num:this.cardId,page:1})
                this.$store.dispatch('setConinsData',data.data)
              }else if(this.readCardType=='renewal_card'){    //续期，换卡，升级卡时候点击读卡的时候执行
                let data=await this.$request.getData('/member/getMemberChangeRule',{user_token:userToken,mg_id:res.data.member_grade_id,type:this.readCardType})
                let dataList={
                  qixian:data.data,
                  start_time:res.data.member_end_time
                }
                this.$store.dispatch('setXuqiData',dataList)
              }
              this.$store.dispatch('setCardId',this.cardId)
              if(res.level=='success'){
                this.$store.dispatch('setMealInformation',res.data)
                this.$store.dispatch('setCoinsDetailsShow',true)
                console.log(res.data)
                ipc.send('doka',res.data);
                // this.informationErr=true
              }else{
                // this.informationErr=false
                this.$baseFunction.showTotals(this,res.message)
                this.$store.dispatch('setMealInformation','')
              }
            }
          },
        },
        destroyed(){
          this.cardId=""
          this.$store.dispatch('setCardId',this.cardId)
          this.$store.dispatch('setMealInformation',"")
        }
    }
</script>
    
<style>
.readCard{width: 100%;height: 165px;display: flex;justify-content: row;}
.meal_card{width: 330px;}
.meal_card div{line-height: 52px;margin-left: 30px;font-size: 18px;color: #5F5F68;}
.meal_card input{width: 290px;height: 60px;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;margin-left: 30px;padding-left: 10px;}
.meal_btn{width: 100px;height: 60px;background: #3B89E5;border-radius: 8px;margin: 52px 0px 0px 14px;line-height: 60px;text-align:center;font-size: 18px;color: #FFFFFF;cursor: pointer;}
.meal_careDetails{width: 627px;height: 120px;background: #FFFFFF;border-radius: 8px;display: flex;justify-content: row;position: relative;margin: 20px 30px 0px 25px;}
.meal_careDetailsErr{border-radius: 8px;line-height: 120px;font-size: 24px;color: #B2B2B9;text-align: center;display: block;}
.meal_careDetails:before{position: absolute;content: "";width: 0;height: 0;right: 100%;top: 48px;border-top: 12px solid transparent;border-right: 14px solid #FFFFFF;border-bottom: 12px solid transparent;}
.meal_careDetails img{width: 60px;height: 60px;margin: 30px 20px;}
.careDetails_name{width: 100px;height: 60px;margin-top:30px;font-size: 20px;color: #303039;line-height: 30px;}
.careDetails_name div:nth-of-type(2){font-size: 12px;color: #303039;}
.careDetails_details{flex:1;display: flex;flex-wrap:wrap;justify-content: row;margin-top: 20px;height: 80px;}
.careDetails_details li{width: 130px;height: 40px;line-height: 40px;font-size: 14px;color: #5F5F68;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.careDetails_more{position: absolute;right: 10px;top: 5px;}

@media screen and (max-width: 1025px) {
.meal_btn{width: 70px;margin: 52px 0px 0px 0px;}
.meal_card input{width: 110px;}
.meal_card{width: 150px;}
.careDetails_details li{width: 110px;}
.meal_careDetails img{margin: 30px 10px;}
.meal_careDetails{width: 525px;margin: 20px 0px 0px 25px}
}
</style>