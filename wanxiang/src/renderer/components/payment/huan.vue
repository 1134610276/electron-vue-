<template>
  <div  class="huan" >
    <div class="service_title"><b>换卡/续期</b></div>
      <div class="service_content">
          <div class="service_details_title">
            <div class="messageBox_projectName">项目</div>
            <div class="messageBox_number">{{type=='xuqi'?'续期年限':'新卡号'}}</div>
            <div class="messageBox_integral">有效期</div>
            <div class="messageBox_amount">{{type=='xuqi'?'续期费用':'换卡费用'}}</div>
            <div class="messageBox_total">小计</div>
          </div>
          <div class="service_container">
            <ul>
              <li class="service_details_content" v-for="(value,index) in selectData.order_items">
                <div class="messageBox_projectName">{{value.goods_product.name}}</div>
                <div class="messageBox_number">{{type=='xuqi'?value.renewal_name:value.new_card_num}}</div>
                <div class="messageBox_integral">{{value.member_end_time}}</div>
                <div class="messageBox_amount "> {{value.amount}}</div>
                <div class="messageBox_total">{{value.amount}}元</div>
              </li>
            </ul>
          </div>
      </div>
  </div>
</template>q
<script>
    export default {
        name: 'realMoney',
        computed: {
          selectData(){
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
.huan {width: 100%;height: 100%;display: flex;flex-direction: column;}
.huan .service_details_quan div.messageBox_total{width: 100px;border-right:0px;}
.huan .service_details_quan div.messageBox_quan{width: 125px;}
.huan .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.huan .service_details_content div.messageBox_total{width: 100px;border-right:0px;}
.huan .service_details_content div.messageBox_quan{width: 164px;}
.huan .service_details_content div.messageBox_amount{width: 164px;}
.huan .service_details_content div.messageBox_total{width: 164px;}
.huan .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.huan .messageBox_projectName{width: 130px;}
.huan .messageBox_number{width: 181px;}
.huan .realMoney .messageBox_id,.realMoney .messageBox_amount{width: 164px;}
.huan .messageBox_integral{width: 161px;}
.huan .service_details_title div.messageBox_total{width: 100px;border-right:0px;}
.huan .service_details_title div.messageBox_quan{width: 164px;}

.huan .service_details_title div.messageBox_amount{width: 164px;}
.huan .service_details_title div.messageBox_total{width: 164px;}
.huan .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.huan .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
</style>