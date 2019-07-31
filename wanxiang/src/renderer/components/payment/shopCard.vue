<template>
  <div  class="shopCard" >
    <div class="service_title"><b>shopCard</b></div>
        <div class="service_content">
            <div class="service_details_title">
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_number">类型</div>
                <div class="messageBox_id">数量</div>
                <div class="messageBox_integral">套餐编号</div>
                <div class="messageBox_id">积分</div>
                <div class="messageBox_amount">币总数</div>
                <div class="messageBox_quan">优惠券</div>
                <div class="messageBox_total" style="width:100px;">原价</div>
                <div class="messageBox_total">优惠价</div>
            </div>
            <div class="service_container">
                <div class="service_wrap" ref="left"> 
                    <ul>
                        <li class="service_details_content" v-for="(value,index) in selectData.order_items" :key="index">
                            <div class="messageBox_projectName">{{value.goods_product.name}}</div>
                            <div class="messageBox_number">{{value.type}}</div>
                            <div class="messageBox_id">{{value.num }}</div>
                            <div class="messageBox_integral">{{value.goods_product.ssn_num}}</div>
                            <div class="messageBox_id">{{value.goods_product.type=='entity_coin'?`${value.coin}`:'-'}}</div>
                            <div class="messageBox_amount">{{value.coin}}币</div>
                            <div class="messageBox_quan">无</div>
                            <div class="messageBox_total" style="width:100px;">{{value.o_amount}}元</div>
                            <div class="messageBox_total">{{value.amount}}元</div>
                        </li>
                    </ul>
                </div>
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
          // shopCard(){
          //   console.log(this.$store.state.basic.shopCard)
          //   return this.$store.state.basic.shopCard
          // },
          selectData(){
            console.log(this.$store.state.basic.selectData)
            return this.$store.state.basic.selectData
          },
          selectNumber(){
            return this.$store.state.basic.selectNumber
          },
          mealInformation(){
            return this.$store.state.basic.mealInformation
          },
        },
        methods: {
            // async getVipPrice(){
            //     let member_goods_info=[]
            //     for(let [index,value] of this.shopCard.entries()){
            //         member_goods_info.push(value.goods_key)
            //     }
            //     let res=await this.$request.getData('/member/getMemberGradePrice',{card_num:this.mealInformation.card_num,goods_keys:member_goods_info})
            //     this.vipPrice=res.data
            //     this.$store.dispatch('setGetVipPrice',this.vipPrice)
            // },
        },
        mounted(){
          // this.getVipPrice()
          this.$nextTick(()=>{
            const scroll=new BScroll(this.$refs.left,{
              click:true,
              // scrollbar:true
            })
          })
        }
    }
</script>
    
<style>
.shopCard {width: 100%;height: 100%;display: flex;flex-direction: column;}
.shopCard .service_container{width: 100%;flex:1;overflow-y: scroll;}
.shopCard .service_wrap{width: 100%;height: 100%;}
.shopCard .service_details_quan div.messageBox_total{width: 100px;}
.shopCard .service_details_quan div.messageBox_quan{width: 125px;}
.shopCard .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.shopCard .service_details_content div.messageBox_total{width: 100px;}
.shopCard .service_details_content div.messageBox_quan{width: 164px;}
.shopCard .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.shopCard .messageBox_projectName{width: 130px;}
.shopCard .messageBox_number{width: 80px;}
.shopCard .messageBox_id,.shopCard .messageBox_amount{width: 80px;}
.shopCard .messageBox_integral{width: 80px;}
.shopCard .service_details_title div.messageBox_total{width: 120px;}
.shopCard .service_details_title div.messageBox_quan{width: 164px;}
.shopCard .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.shopCard .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
</style>