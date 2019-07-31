<template>
  <div  class="messageBox">
    <div class="message"> 
        <div class="messageWrap" :class="{card:messageBoxTag=='card',vip:huiyuanTag=='huiyantag'}">
            <div class="wrap_title">
                <div><b>代币购买</b></div>
                <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
            </div>
            <div :class="{wrap_readInformation:true,wrap_readInformation_vip:huiyuanTag=='huiyantag'}">
                <div class="information_title">
                    <div>读卡信息</div>
                    <div @click="doka">
                        <Icon type="md-refresh" />重新读卡
                    </div>
                </div>
                <div class="information_content" v-if="!isdoka">
                    <ul class="content_left">
                        <li>
                            <div>预存款</div>
                            <div>{{mealInformation.money |moneyFromat}}</div>
                        </li>
                        <li>
                            <div>币余额</div>
                            <div>{{mealInformation.coin}}</div>
                        </li>
                        <li>
                            <div>门票</div>
                            <div>{{mealInformation.user_ticket_num}}</div>
                        </li>
                    </ul>
                    <ul class="content_right">
                      <li>预存款：{{mealInformation.money |moneyFromat}}</li>
                        <li>积分：{{mealInformation.integral}}</li>
                        <li>姓名：{{mealInformation.user_info.realname}}</li>
                        <li>币余额：{{mealInformation.coin}}</li>
                        <li>卡号：{{mealInformation.card_num}}</li>
                        <li>电话：{{mealInformation.user_info.contact}}</li>
                    </ul>
                </div>
                <div class="information_content information_content1" v-else>
                    未读取到卡信息！
                </div>
            </div>
            <div :class="{wrap_service:true,wrap_service_vip:huiyuanTag=='huiyantag'}">
                <realMoney v-if="type=='bi' ||type=='bi1'" ></realMoney>
                <!-- //购买实币和会员套餐 -->
                <ticketPayment v-if="type=='ticket'||type=='shop' || isTuidan"></ticketPayment>
                <!-- //购买门票 //购买商品-->
                <shopCard v-if="type=='shopCard'"></shopCard>
                <!-- //会员卡和临时卡和赠送卡-->
                <cardList v-if="type=='vip' || type=='linshi'"></cardList>
                <!-- //购物车 -->
                <card v-if="type=='vip1'||type=='tuika'"></card>
                <!-- //办理换卡  -->
                <huan v-if="type=='huan'||type=='xuqi'"></huan>
                <!-- 续期   退卡 -->
            </div>
            <div class="service_content_payment">
                <div class="payment_title">支付方式{{selectType}}</div>
                <ul class="payment_methods" v-if="selectData.order_pay_type!='币支付'?true:false" >
                    <li class="select" v-if="type=='linshi'|| type=='tuika'|| type=='vip'||type=='bi1' ||product_type=='recharge_money' ||mealInformation==''?false :true"> 
                        <input name="money" type="radio" value="card_money" v-model="selectType" @click="selectPayType('card_money')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/balance.png"/>
                        <div class="methods_title">{{isTuidan?'余额退回':'余额支付'}}</div>
                    </li>
                    <li v-if="type=='tuika'||type=='bi1' ||isTuidan?false :true"> 
                        <input name="money" type="radio" value="alipay" v-model="selectType" @click="selectPayType('alipay')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/alipay.png"/>
                        <div class="methods_title">支付宝</div>
                    </li>
                    <li v-if="type=='tuika'||type=='bi1' ||isTuidan?false :true">
                        <input name="money" type="radio" value="wxpay" v-model="selectType"  @click="selectPayType('wxpay')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/wechat.png"/>
                        <div class="methods_title">微信支付</div>
                    </li>
                    <li v-if="type!='bi1'">
                        <input name="money" type="radio" value="cash" v-model="selectType" @click="selectPayType('cash')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/money.png"/>
                        <div class="methods_title">现金</div>
                    </li>
                    <li v-if="type=='shop' ||type=='bi1' ?true:false">
                        <input name="money" type="radio" value="coin" v-model="selectType" @click="selectPayType('coin')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/coinGive.png"/>
                        <div class="methods_title">实币支付</div>
                    </li>

                    <li v-if=" isTuidan?true:false">
                        <input name="money" type="radio" value="original_road" v-model="selectType" @click="selectPayType('original_road')"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/coinGive.png"/>
                        <div class="methods_title">原路返回</div>
                    </li>
                </ul>
<!--                 <ul class="payment_methods" v-else>
                    <li v-if="type=='shop'|| isTuidan ?true:false">
                        <input name="money" type="radio" value="coin" v-model="selectType1"/>
                        <img src="http://file.rzkeji.com/web/wanxiang/icon/coinGive.png"/>
                        <div class="methods_title">{{isTuidan?'实币退回':'实币支付'}}</div>
                    </li>
                </ul> -->
            </div>
            <div class="messageBox_wrap">
                <div class="messageBox_details">
                    <div class="messageBox_details_one" v-if="selectType!='coin'">
                        <span>总计费用：</span>
                        <span>¥ {{isTuidan?selectData.pay_amount:selectData.amount}}</span>
                        <span>¥ {{isTuidan?selectData.pay_amount:selectData.amount}}</span>
                    </div>
                    <div class="messageBox_details_one" v-if="selectType=='coin'">
                        <span>总计费用：</span>
                        <span>{{selectData.coin}}币</span>
                        <span>{{selectData.coin}}币</span>
                    </div>
                   <!--  <div class="messageBox_details_two">
                        <span>通用优惠券：</span>
                        <span>-¥10</span>
                    </div> -->
                </div>
                <div class="messageBox_wrap_btn" @click="payment">{{isTuidan ?'退回':'支付'}}</div>
            </div>
            <payShow v-if="payshow"></payShow>
        </div>
    </div>
  </div>
</template>

<script>
    import payShow from '@/components/payShow'
    import realMoney from '@/components/payment/realMoney'
    import ticketPayment from '@/components/payment/ticketPayment'
    import shopCard from '@/components/payment/shopCard'
    import cardList from '@/components/payment/cardList'
    import card from '@/components/payment/card'
    import huan from '@/components/payment/huan'
    const {ipcRenderer} = require('electron')
    export default {
        data(){
            return {
                userToken:"",
                card_num:"",
                order_num:"",
                selectType:""
            }
        },
        components:{realMoney,ticketPayment,shopCard,card,huan,payShow,cardList},
        computed: {  
          selectNumber(){
            return this.$store.state.basic.selectNumber
          },
          payshow(){
            return this.$store.state.together.payshow
          },
          isdoka(){
            return this.$store.state.basic.isdoka
          },
          mealInformation(){
            return this.$store.state.basic.mealInformation
          },
          messageBoxTag(){
            return this.$store.state.basic.messageBoxTag
          },
          huiyuanTag(){
            return this.$store.state.basic.huiyuanTag
          },
          type(){
            return this.$store.state.basic.type
          },
          isTuidan(){
            return this.$store.state.special.isTuidan
          },
          selectData(){
            return this.$store.state.basic.selectData
          },
          information(){
            return this.$store.state.card.information
          },
          shopCard(){
            return this.$store.state.basic.shopCard
          },
          getVipPrice(){
            return this.$store.state.basic.vipPice
          },
          product_type(){
            return this.$store.state.basic.product_type
          }
        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setMessageBoxShow',false)
            },
            async doka(){
                var readCardId = ipcRenderer.sendSync('synchronous-message')
                if(readCardId != ""){
                    this.card_num = readCardId
                }else {
                    this.$store.dispatch('setPayshow',true)
                    this.$store.dispatch('setPayType','no_read_card')
                }
                let res=await this.$baseFunction.getCardNumber(this.card_num)
                let tag=res.level=='success'?false:true
                if(res.level=='success'){
                    this.$store.dispatch('setMealInformation',res.data)
                }
                this.$store.dispatch('setIsdoka',tag)
                
                this.$store.dispatch('setCardId',this.card_num)

                //点击读取卡号时执行刷新订单接口
                if(this.card_num.trim() != "" &&!this.isTuidan){
                    this.$baseFunction.reloadOrder(this,this.card_num)
                }

            },
            async tuidan(){   //点击退单的时候执行
                let res=await this.$request.postData('/order/confirmOrdersReback',{pay_type:this.selectType,user_token:this.userToken,order_num:this.$store.state.together.order_num})
                this.$store.dispatch('setMessageBoxShow',false)
                this.$baseFunction.showTotals(this,res.message)
            },
            selectPayType(newValue){
                console.log(newValue)
                this.selectType = newValue
            },
            payment(){   //点击支付按钮时执行
                if(this.selectType!=''){
                    console.log(this.selectType)
                    this.$store.dispatch('setPayshow',true)
                    if(this.selectType=='card_money'){
                        this.$store.dispatch('setPayType','card_money')
                    }else if(this.selectType=='alipay' ||this.selectType=='wxpay'){
                        this.$store.dispatch('setPayType','loading')
                    }else if(this.selectType=='cash'){
                        this.$store.dispatch('setPayType','cash')
                    }else if(this.selectType=='coin'){
                        this.$store.dispatch('setPayType','coin')
                    }
                    this.$store.dispatch('setSelectType',this.selectType)
                    if(this.isTuidan){   //退订单的时候执行
                        this.tuidan()
                    }
                }
            },
        },
        async mounted(){
            if(this.type=='tuika'){
                // this.selectType='cash'
                this.selectType= 'cash'
            }else if(this.type=='vip' || this.type == "linshi"||this.mealInformation==''){
                 this.selectType= 'alipay'
            }else{
                this.selectType=this.$store.state.together.selectType==''?'card_money':this.$store.state.together.selectType
                // return this.$store.state.together.selectType==''?'card_money':this.$store.state.together.selectType
            }
            let baseUrl=await this.$baseFunction.getFileData()
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
            
            this.order_num = this.$store.state.basic.orderNum
        },
        destroyed(){
            this.$store.dispatch('setPayshow',false)
            this.$store.dispatch('setSelectType','')
        }
    }
</script>
    
<style>
.messageBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}
.message{width: 100%;height: 100%;position: relative;}
.messageWrap{width: 840px;height:511px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -300px;margin-left: -400px;display: flex;flex-direction: column;}
.messageBox .card{height: 633px;}
.messageBox .vip{width: 940px;}
.wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
.wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
.wrap_title img{width: 50px;height: 50px;cursor: pointer;}
.wrap_readInformation{width: 740px;height: 110px;margin:10px 0px 0px 50px;display: flex;flex-direction: column;}
.wrap_readInformation_vip{width: 840px;}
.information_title{width: 100%;height: 30px;display: flex;justify-content: space-between;}
.information_title div:nth-of-type(1){font-size: 14px;color: #303039;line-height: 30px;}
.information_title div:nth-of-type(2){background: #DEEDFF;border-radius: 10px;font-size: 12px;color: #303039;width: 80px;line-height: 30px;text-align:center;cursor: pointer;}
.information_content{flex:1;background: #FFFFFF;border: 1px solid #DEEDFF;border-radius: 8px;display: flex;justify-content: row;margin-top: 1px;}
.information_content1{font-size: 16px;color: #B3D6FF;text-align: center;display: block;line-height: 80px;}
.content_left{width:290px;height: 100%;display: flex;justify-content: row;}
.content_left>li{width: 94px;height: 60px;margin-top: 10px;border-right: 1px solid #DEEDFF;}
.content_left>li:nth-last-o-type(1){border-right: 0;}
.content_left>li div:nth-of-type(1){font-size: 12px;color: #5F5F68;text-align: center;}
.content_left>li div:nth-of-type(2){font-size: 34px;color: #1E7FEE;text-align: center;}
.content_right{flex: 1;display: flex;justify-content: row;flex-wrap:wrap;}
.content_right>li{width: 147px;height: 39px;line-height: 39px;font-size: 14px;color: #5F5F68;}
.content_right>li span{color: #303039;}
.content_right>li:nth-of-type(1) span{color: #1E7FEE;}
.wrap_service{width: 740px;flex:1;margin:20px 0px 0px 50px;display: flex;flex-direction: column;}
.wrap_service_vip{width: 840px;}
.service_content_payment{width: 100%;height: 70px;margin: 20px 0px;}
.payment_title{margin-left:48px;font-size: 14px;color: #5F5F68;}
.payment_methods{display: flex;justify-content: row;margin-left: 48px;}
.payment_methods li{display: flex;justify-content: row;font-size: 16px;color: #5F5F68;height: 40px;margin-top: 11px;margin-right: 8px;}
.payment_methods li{width: 144px;}
.payment_methods li input{width: 20px;height: 20px;margin-top: 10px;}
.payment_methods li img{width: 50px;height: 40px;}
.methods_title{height: 100%;line-height: 40px;}
.messageBox_wrap{width: 100%;height: 100px;background: #F4F9FF;border-radius: 0px 0px 6px 6px;display: flex;justify-content: space-between;}
.messageBox_details{width: 300px;margin-left: 56px;height: 100%;display: flex;flex-direction: column;}
.messageBox_wrap_btn{width: 160px;height: 50px;margin:25px 55px;background: #3B89E5;border-radius: 8px;line-height: 50px;font-size: 18px;color: #FFFFFF;text-align: center;cursor: pointer;}
.messageBox_details_one{line-height: 25px;margin: 25px 0px 8px;font-size: 14px;color: #303039;}
.messageBox_details_one span:nth-of-type(2){color: #ee5c6e;font-size: 24px;}
.messageBox_details_one span:nth-of-type(3){font-size: 14px;color: #B2B2B9;text-decoration:line-through}
.messageBox_details_two{line-height: 17px;font-size: 12px;color: #303039;}
.messageBox_details_two span:nth-of-type(2){color: #ee5c6e;}
</style>