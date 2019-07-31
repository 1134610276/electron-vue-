<template>
  <div  class="cardFooter">
    <div>
      <div class="cardFooter_number"><slot name="card_money"></slot></div>
    </div>
    <div>
      <div class="buy cardFooter_buy drag" @click="selectClick()"><slot name="card_name"></slot></div>
    </div>
  </div>
</template>

<script>
    const {ipcRenderer} = require('electron')
    export default {
        props:['type','newData'],
        methods: {
            async selectClick(){
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
                if(this.type=='vip1'){
                    this.$store.dispatch('setSelectData1',this.newData)
                }
                // console.log(this.$store.state.basic.selectData)
                // this.$store.dispatch('setMessageBoxTag','')
                // if(this.$store.state.basic.selectData!=""){
                //     this.$store.dispatch('setMessageBoxShow',true)
                //     this.$store.dispatch('setType',this.type)
                //     this.$store.dispatch('setIsdoka',false)
                //     if(this.$store.state.basic.mealInformation==''){
                //         var readCardId = ipcRenderer.sendSync('synchronous-message')
                //         let res=await this.$baseFunction.getCardNumber(readCardId)
                //         let tag=res.level=='success' ?false :true
                //         this.$store.dispatch('setIsdoka',tag)
                //         this.$store.dispatch('setMealInformation',res.data)
                //     }
                // }
                this.$store.dispatch('setHuiyuanTag',"")
                this.$store.dispatch('setMessageBoxTag',"")
                this.$store.dispatch('setType',this.type=='escalate_card'||this.type=='change_card'?'huan':this.type)

                if(this.$store.state.basic.mealInformation!=''&&(this.type=='xuqi' ||this.type=='change_card')){
                    let res=await this.$baseFunction.setCardOrder(this.type=='xuqi'?'renewal_card':this.type,this.$store.state.card.member_change_rule_id,this.$store.state.basic.mealInformation.card_num,this.$store.state.card.newCardId,this.$store.state.card.searson)
                    if(res.level=='error'){
                        this.$baseFunction.showTotals(this,res.message);
                        return
                    }
                    this.$store.dispatch('setOrder_num',res.data.order_num)
                    let data=await this.$request.getData('/order/getOrderList',{order_num:res.data.order_num,user_token:userToken})
                    if(data.level=='success'){
                      this.$store.dispatch('setSelectData',data.data)
                      this.$store.dispatch('setMessageBoxShow',true)

                    }else{
                      this.$store.dispatch('setMessageBoxShow',false)
                      this.$baseFunction.showTotals(this,data.message)
                    }
                }

                if(this.$store.state.basic.mealInformation!='' && this.type == 'escalate_card'){
                  var mgId = this.$store.state.card.memberGradeId
                  let res=await this.$request.postData('/member/setMemberGrade',{user_token:userToken,card_num:this.$store.state.basic.mealInformation.card_num,new_card_num:this.$store.state.card.newCardId,mg_id:mgId})
                  if(res.level == "success"){
                    var cardNum = this.$store.state.basic.mealInformation.card_num
                    if(this.$store.state.card.newCardId != ""){
                      cardNum = this.$store.state.card.newCardId
                    }
                    let resMemberInfo=await this.$baseFunction.getCardNumber(cardNum)
                    this.$store.dispatch('setMealInformation',resMemberInfo.data)
                  }
                  this.$baseFunction.showTotals(this,res.message)
                }

                if(this.type=='tuika' &&this.$store.state.basic.mealInformation!=''){
                    let res=await this.$request.postData('/member/setRebackCard',{card_num:this.$store.state.basic.mealInformation.card_num,user_token:userToken})
                    this.$store.dispatch('setOrder_num',res.data.order_num)
                    let data=await this.$request.getData('/order/getOrderList',{order_num:res.data.order_num,user_token:userToken})
                    if(data.level=='success'){
                      this.$store.dispatch('setSelectData',data.data)
                      this.$store.dispatch('setMessageBoxShow',true)
                    }else{
                      this.$store.dispatch('setMessageBoxShow',false)
                      this.$baseFunction.showTotals(this,res.message)
                    }
                } 
            },
        }
    }
</script>
    
<style>
.cardFooter{width: 100%;height: 90px;display: flex;justify-content: space-between;line-height: 90px;background: #FFFFFF;box-shadow: 0 -3px 10px 0 rgba(0,0,0,0.10);z-index: 99;}
.cardFooter_number{width: 200px;height: 100%;font-size: 18px;color: #303039;margin-left: 20px;}
.buy{width: 140px;height: 60px;line-height: 60px;text-align: center;font-size: 18px;color: #FFFFFF;border-radius: 8px;}
.cardFooter_buy{margin: 15px 0px 15px 12px;background-color: #3B89E5;margin-right: 10px;cursor: pointer;}
</style>