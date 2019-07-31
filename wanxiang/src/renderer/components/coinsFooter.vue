<template>
  <div  class="coinsFooter">
    <div v-if="tag=='setMeal' ?true:false" class="coinsFooter_add">
      <div class="footer_number">数量 :</div>
      <div class="accumulator" >
        <div class="reduce_btn" @click="reduce">-</div>
        <input type="text" v-model="number"/>
        <div class="add_btn" @click="add">+</div>
      </div>
    </div>
    <div class="footer_details" v-if="type=='duihuan'?false:true">
      <div class="details_title"><slot name="footer_title"></slot></div>
      <div class="details_content" v-if="type=='ticket' ?true:false">¥ {{selectData!=""?selectData.amount_money:0}} 元</div>
      <div class="details_content" v-else-if="type=='shopCard'">¥ {{selectData!=""?selectData.amount_money:0}}元{{selectData!=""?selectData.amount_coin:0}}币</div>
      <div class="details_content" v-else>¥ {{selectData!=""?selectData.amount_money:0}}元
       <span v-if="selectData.type!='recharge_money'">{{selectData!=""?selectData.coin:0}}币</span>
       <span v-else>{{selectData!=""?'='+selectData.money:0}}元</span>
      （{{selectData!=""?selectData.desc:'送0币'}}）</div>
    </div>
    <div class="coinsFooter_btn">
      <div class="buy real_buy" v-if="tag!='setMeal'" @click="joinCard">加入购物车</div>
      <div class="buy real_buy" @click="buyMessageBox" ><slot name="footer_btn"></slot></div>
    </div>
  </div>
</template>

<script>
    const {ipcRenderer} = require('electron')
    const {ipcRenderer: ipc} = require('electron');
    export default {
        props:['type','tag'],
        data(){
            return {
              number:0
            }
        },
        computed: {     
          selectData(){
            this.number=this.$store.state.basic.selectData1.length!=""?1:0
            return this.$store.state.basic.selectData1
          },
          cart_num(){
            return this.$store.state.basic.cart_num
          },
        },
        methods:{
          async buyMessageBox(){

            this.$store.dispatch('setMessageBoxTag','')  //设置这个用来区别是点击购物车的支付窗口还是普通的支付窗口
            if(this.type=='ticket' ||this.type=='shopCard'){
               this.$store.dispatch('setHuiyuanTag','huiyantag')
               if(this.type=='ticket'){
                this.$store.dispatch('setType','ticket')   //这个是点击门票购买按钮时触发
               }else{
                this.$store.dispatch('setType','shop')  //这个是点击商品单个购买按钮时触发
               }
             }else{  //这个是币购买按钮时触发
               if(this.type=='duihuan'){
                this.$store.dispatch('setType','duihuan')
               }else{
                this.$store.dispatch('setType','bi')
               }
               this.$store.dispatch('setHuiyuanTag',"")   //这设置这个是改变弹窗的大小
             }
            if(this.selectData!=""){
              let cardId = ipcRenderer.sendSync('synchronous-message')
              if(cardId == ""){
                cardId = this.$store.state.basic.cardId
              }
              let res=await this.$baseFunction.getCardNumber(cardId)
              let tag=res.level=='success' ?false :true
              this.$store.dispatch('setIsdoka',tag)
              this.$store.dispatch('setMealInformation',res.data==undefined?'':res.data)
              if(this.type=='duihuan'){
                this.$store.dispatch('setDuihuanBoxShow',true)
              }

              let card_num=res.level=='success'?res.data.card_num:''

              if(this.type=="ticket" && this.selectData.ticket_rule.ticket_type == "1"){
                this.$store.dispatch('setTicketNum',0)
                this.$store.dispatch('setCardId',card_num)
                this.$store.dispatch('setTicketNumShow',true)
              }else {
                if(this.type!='duihuan') {
                  this.$store.dispatch('setMessageBoxShow', true)
                }
                this.$store.dispatch('setSelectNumber',this.number)
                if(this.type=='setMeal'){   //点击是会员套餐的时候  不需要读卡
                  this.$store.dispatch('setType','bi')
                  this.$store.dispatch('setIsdoka',false)
                }
                this.$baseFunction.order(this,'',card_num,this.selectData.goods_key,this.number)
              }
            }
            console.log(this.$store.state.basic.selectData,66666)
          },
          reduce(){
            if(this.number--<2){
              this.number=1
            }
            this.$store.dispatch('setSelectNumber',this.number)
          },
          add(){
            this.$store.dispatch('setSelectNumber',++this.number)
          },
          async joinCard(){ //点击加入购物车
            if(this.selectData.length!=0){
              var outTradeNo=""; 
              if(this.cart_num==''){
                for(var i=0;i<6;i++) //6位随机数，用以加在时间戳后面。
                {
                  outTradeNo += Math.floor(Math.random()*10);
                }
                outTradeNo = new Date().getTime() + outTradeNo;
                this.$store.dispatch('setCart_num',outTradeNo)
              }
              let baseUrl=await this.$baseFunction.getFileData()
              let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');

              if(this.type=="ticket" && this.selectData.ticket_rule.ticket_type == "1"){
                this.$store.dispatch('setTicketNum',1)
                this.$store.dispatch('setTicketNumShow',true)
              }else {
                let res=await this.$request.postData('/goods/saveShopCart',{cart_num:this.cart_num,goods_key:this.selectData.goods_key,num:1})
                if(res.level=='error'){
                  this.$baseFunction.showTotals(this,res.message)
                }
                let shopData=await this.$request.getData('/goods/getShopCartList',{cart_num:this.cart_num})
                ipc.send('orderInformation',shopData);
                this.$store.dispatch('setShopCard',shopData.data)
              }

            }
          }
        },
    }
</script>
    
<style>
  .duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}

  .duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
  .duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
  .duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}

.coinsFooter{width: 100%;height: 90px;display: flex;line-height: 90px;background: #FFFFFF;box-shadow: 0 -3px 10px 0 rgba(0,0,0,0.10);z-index: 99;position: relative;}
.coinsFooter_add{width: 240px;height:100%;display: flex;}
.coinsFooter_btn{height:100%;position: absolute;right: 0px;top: 0px;display: flex;}
.footer_number{width: 50px;height: 100%;font-size: 18px;color: #303039;margin-left: 20px;}
.accumulator{width: 160px;height: 60px;margin: 15px 0px 15px 5px;display: flex;justify-content: row;}
.reduce_btn,.add_btn{width: 50px;height: 100%;background: #8BC0FF;border-radius: 8px 0px 0px 8px;font-size: 40px;color: #FFFFFF;text-align: center;line-height: 60px;cursor: pointer;}
.add_btn{border-radius: 0px 8px 8px 0px;}
.accumulator input{width: 60px;height: 100%;text-align: center;line-height: 60px;font-size: 24px;color: #303039;}
.footer_details{width: 570px;height: 100%;margin-left: 30px;font-size: 18px;color: #8E8E93;display: flex;justify-content: row;}
.footer_details div{line-height: 90px;}
.details_content{font-size: 20px;color: #303039;margin-left: 10px;}
.buy{width: 140px;height: 60px;line-height: 60px;text-align: center;font-size: 18px;color: #FFFFFF;border-radius: 8px;}
.real_buy{margin: 15px 12px 15px 0px;background-color: #3B89E5;cursor: pointer;}
@media screen and (max-width: 1025px) {
   .coinsFooter{height: 130px;}
   .footer_details{height: 50%;}
   .coinsFooter_btn{height: 50%;top:50px; }
   .footer_details{width: 100%;}
   .real_buy{width: 116px;height: 48px;line-height: 48px;}
}
</style>