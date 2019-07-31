<template>
  <div  class="ticketPayment" >
    <div class="service_title"><b>{{!isTuidan?'门票':"退单详情"}}</b></div>
        <div class="service_content">
            <div class="service_details_title" v-if="!isTuidan">
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_number">{{type=='ticket'?'类型':'数量'}}</div>
                <div class="messageBox_id">{{type=='ticket'?'数量':'套餐编号'}}</div>
                <div class="messageBox_integral">{{type=='ticket'?'套餐编号':'积分'}}</div>
                <div class="messageBox_amount">{{type=='ticket'?'积分':'总币数'}}</div>
                <div class="messageBox_quan">优惠券</div>
                <div class="messageBox_total">原价</div>
                <div class="messageBox_total">优惠价</div>
            </div>
            <div class="service_details_title" v-else>
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_number">数量</div>
                <div class="messageBox_id">套餐编号</div>
                <div class="messageBox_integral">扣除积分</div>
                <div class="messageBox_amount">回收币数</div>
                <div class="messageBox_quan">单价</div>
                <div class="messageBox_total">原支付方式</div>
                <div class="messageBox_total">退回费用</div>
            </div>
            <div class="service_container">
                <ul v-if="!isTuidan">
                    <li class="service_details_content" v-for="(value,index) in selectData.order_items">
                        <div class="messageBox_projectName">{{value==""?"":value.goods_product.name}}</div>
                        <div class="messageBox_number">{{type=='ticket'?'门票':value.num|messageFilter}}</div>
                        <div class="messageBox_id">{{type=='ticket'?value.num:value.goods_product.ssn_num |messageFilter}}</div>
                        <div class="messageBox_integral">{{type=='ticket' ? value.goods_product.ssn_num:value.goods_product.amount_integral|messageFilter}}</div>
                        <div class="messageBox_amount ">{{type=='ticket'? 0 :value.amount_coin}}</div>
                        <div class="messageBox_quan">无</div>
                        <div class="messageBox_total">{{value==""?"":value.o_amount}}元</div>
                        <div class="messageBox_total">{{value==""?"":value.amount}}元</div>
                    </li>
                </ul>
                <ul v-else>
                    <li class="service_details_content">
                        <div class="messageBox_projectName">{{selectData.good_name}}</div>
                        <div class="messageBox_number">{{selectData.num}}</div>
                        <div class="messageBox_id">{{selectData.good_ssn_num}}</div>
                        <div class="messageBox_integral">{{selectData.amount_integral}}</div>
                        <div class="messageBox_amount ">{{selectData.coin}}</div>
                        <div class="messageBox_quan">{{selectData.unit_o_price}}</div>
                        <div class="messageBox_total">{{selectData.pay_type}}</div>
                        <div class="messageBox_total">{{selectData.pay_amount}}</div>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: 'realMoney',
        data(){
            return {
                vipPrice:""
            }
        },
        computed: {
          selectData(){
            console.log(this.$store.state.basic.selectData)
            return this.$store.state.basic.selectData
          },
          type(){
            return this.$store.state.basic.type
          },
          isTuidan(){
            return this.$store.state.special.isTuidan
          },
          selectNumber(){
            return this.$store.state.basic.selectNumber
          },
          mealInformation(){
            return this.$store.state.basic.mealInformation
          },
        },
        methods: {
            async getVipPrice(){
                let member_goods_info=[]
                member_goods_info.push(this.selectData.goods_key)
                let res=await this.$request.getData('/member/getMemberGradePrice',{card_num:this.mealInformation.card_num,goods_keys:member_goods_info})
                this.vipPrice=res.data[0]
                this.$store.dispatch('setGetVipPrice',this.vipPrice)
            },
        },
        mounted(){
            // if(!this.isTuidan){
            //     this.getVipPrice()
            // }
        }
    }
</script>
    
<style>
.ticketPayment {width: 100%;height: 100%;display: flex;flex-direction: column;}
.ticketPayment .service_container{width: 100%;flex:1;overflow-y: hidden;}
.ticketPayment .service_details_quan div.messageBox_total{width: 100px;border-right:0px;}
.ticketPayment .service_details_quan div.messageBox_quan{width: 125px;}
.ticketPayment .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.ticketPayment .service_details_content div.messageBox_total{width: 100px;border-right:0px;}
.ticketPayment .service_details_content div.messageBox_quan{width: 164px;}
.ticketPayment .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.ticketPayment .messageBox_projectName{width: 130px;}
.ticketPayment .messageBox_number{width: 100px;}
.ticketPayment .messageBox_id,.ticketPayment .messageBox_amount{width: 80px;}
.ticketPayment .messageBox_integral{width: 80px;}
.ticketPayment .service_details_title div.messageBox_total{width: 100px;border-right:0px;}
.ticketPayment .service_details_title div.messageBox_quan{width: 164px;}
.ticketPayment .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.ticketPayment .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
</style>