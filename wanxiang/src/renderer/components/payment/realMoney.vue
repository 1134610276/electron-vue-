<template>
  <div  class="realMoney" >
    <div class="service_title">
        <!--<b>bi</b>-->
    </div>
        <div class="service_content">
            <div class="service_details_title">
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_number">数量</div>
                <div class="messageBox_id">套餐编号</div>
                <div class="messageBox_integral">积分</div>
                <div class="messageBox_amount">币总数</div>
                <div class="messageBox_quan">优惠券</div>
                <div class="messageBox_total">小计</div>
            </div>
            <div class="service_container">
                <ul>
                    <li class="service_details_content" v-for="(value,index) in selectData.order_items">
                        <div class="messageBox_projectName">{{value.goods_product.name}}</div>
                        <div class="messageBox_number">{{value.num|messageFilter}}</div>
                        <div class="messageBox_id">{{value.goods_product.ssn_num |messageFilter}}</div>
                        <div class="messageBox_integral">{{value.amount_integral |messageFilter}}</div>
                        <div class="messageBox_amount ">{{value.coin}}币</div>
                        <div class="messageBox_quan">无</div>
                        <div class="messageBox_total">{{value.o_amount}}元</div>
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
            console.log(this.$store.state.basic.selectData,777777)
            return this.$store.state.basic.selectData
          },
          selectNumber(){
            return this.$store.state.basic.selectNumber
          }
        },
    }
</script>
    
<style>
.realMoney {width: 100%;height: 100%;display: flex;flex-direction: column;}
.service_title{width: 100%;height: 20px;font-size: 14px;color: #303039;margin-bottom: 5px;}
 .service_content{width: 100%;background: #F4F9FF;border: 1px solid #DEEDFF;border-radius: 8px;flex:1;display: flex;flex-direction: column;}
 .service_container{width: 100%;flex:1;}
 .service_details_title, .service_details_content, .service_details_quan{width: 100%;height: 30px;display: flex;background: #F4F9FF;border-bottom: 1px solid #DEEDFF;border-radius: 8px 8px 0px 0px;}
 .service_details_content:nth-last-of-type(1){border-bottom: 0px;}
 .service_details_content{height: 60px;}
 .service_details_quan{height: 50px;}
 .service_details_quan div{line-height: 60px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.realMoney .service_details_quan div.messageBox_total{width: 100px;border-right:0px;}
.realMoney .service_details_quan div.messageBox_quan{width: 125px;}
.realMoney .service_details_content div{font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;line-height: 60px;}
.realMoney .service_details_content div.messageBox_total{width: 100px;border-right:0px;}
.realMoney .service_details_content div.messageBox_quan{width: 164px;}
.realMoney .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.realMoney .messageBox_projectName{width: 130px;}
.realMoney .messageBox_number{width: 80px;}
.realMoney .messageBox_id,.realMoney .messageBox_amount{width: 100px;}
.realMoney .messageBox_integral{width: 60px;}
.realMoney .service_details_title div.messageBox_total{width: 100px;border-right:0px;}
.realMoney .service_details_title div.messageBox_quan{width: 164px;}
.realMoney .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.realMoney .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
 .service_content_label{flex:1;line-height: 40px;font-size: 14px;color: #5F5F68;letter-spacing: 0;text-align: right;}
 .service_content_input{width: 200px;height: 40px;background: #E7F2FF;border: 1px solid #C8E1FF;border-radius: 4px;font-size: 16px;color: #303039;text-indent: 10px;margin-left: 10px;line-height: 40px;}
</style>