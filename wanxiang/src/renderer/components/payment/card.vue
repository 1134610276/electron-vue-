<template>
  <div  class="card1" >
    <div class="service_title"><b>会员卡/退卡/临时卡</b></div>
        <div class="service_content">
            <div class="service_details_title">
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_number">{{type=='linshi'||type=='tuika'?'押金':'办卡费'}}</div>
                <div class="messageBox_id">套餐编号</div>
                <div class="messageBox_integral">{{type=='linshi'||type=='vip'||type=='vip1'?'积分':'门票'}}</div>
                <div class="messageBox_amount">{{type=='linshi'||type=='vip'||type=='vip1'?'币数':'剩余币数'}}</div>
                <div class="messageBox_quan">{{type=='linshi'||type=='vip'||type=='vip1'?'总币数':'预存款'}}</div>
                <div class="messageBox_total">小计</div>
            </div>
            <div class="service_container">
                <ul  v-if="type=='tuika'?false:true">
                    <li class="service_details_content" v-for="(value,index) in selectData.order_items">
                        <div class="messageBox_projectName">{{type=='tuika'?'退卡业务':value.goods_product.name}}</div>
                        <div class="messageBox_number">￥{{value.amount}}</div>
                        <div class="messageBox_id">{{value.goods_product.ssn_num==""?'-':value.goods_product.ssn_num }}</div>
                        <div class="messageBox_integral">{{type=='linshi'||type=='vip'||type=='vip1'?value.amount_integral:value.win_ticket}}</div>
                        <div class="messageBox_amount "> {{type=='linshi'||type=='vip'||type=='vip1'?value.coin:value.coin}}</div>
                        <div class="messageBox_quan">{{type=='linshi'||type=='vip'||type=='vip1'?value.coin:value.money }}</div>
                        <div class="messageBox_total">{{value.amount}}元</div>
                    </li>
                </ul>
                <ul v-else>
                    <li class="service_details_content">
                        <div class="messageBox_projectName">退卡业务</div>
                        <div class="messageBox_number">{{selectData.order_items.deposit}}</div>
                        <div class="messageBox_id">-</div>
                        <div class="messageBox_integral">{{selectData.order_items.ticket}}</div>
                        <div class="messageBox_amount "> {{selectData.order_items.coin}}</div>
                        <div class="messageBox_quan">{{selectData.order_items.card_money}}</div>
                        <div class="messageBox_total">{{selectData.amount}}元</div>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</template>

<script>
    export default {
        name: 'realMoney',
        computed: {
          selectData(){
            console.log(this.$store.state.basic.selectData)
            return this.$store.state.basic.selectData
          },
          selectNumber(){
            return this.$store.state.basic.selectNumber
          },
         type(){
            return this.$store.state.basic.type
          }
        },
    }
</script>
    
<style>
.card1 {width: 100%;height: 100%;display: flex;flex-direction: column;}
.card1 .service_details_quan div.messageBox_total{width: 100px;border-right:0px;}
.card1 .service_details_quan div.messageBox_quan{width: 125px;}
.card1 .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.card1 .service_details_content div.messageBox_total{width: 100px;border-right:0px;}
.card1 .service_details_content div.messageBox_quan{width: 164px;}
.card1 .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.card1 .messageBox_projectName{width: 130px;}
.card1 .messageBox_number{width: 80px;}
.card1 .messageBox_id,.card1 .messageBox_amount{width: 100px;}
.card1 .messageBox_integral{width: 60px;}
.card1 .service_details_title div.messageBox_total{width: 100px;border-right:0px;}
.card1 .service_details_title div.messageBox_quan{width: 164px;}
.card1 .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.card1 .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
</style>