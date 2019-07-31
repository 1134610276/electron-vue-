<template>
  <div  class="shopCard" >
    <div class="service_title"><b>shopCard</b></div>
        <div class="service_content">
            <div class="service_details_title">
                <div class="messageBox_projectName">项目</div>
                <div class="messageBox_id">套餐编号</div>
                <div class="messageBox_integral">积分</div>
                <div class="messageBox_id">币数</div>
                <div class="messageBox_amount">预存款</div>
                <div class="messageBox_total">小计</div>
            </div>
            <div class="service_container">
                <div class="service_wrap" ref="left"> 
                    <ul>
                        <li class="service_details_content" v-for="(value,index) in selectData.order_items" :key="index">
                            <div class="messageBox_projectName">{{value.goods_product.name}}</div>
                            <div class="messageBox_id">{{value.goods_product.ssn_num}}</div>
                            <div class="messageBox_integral">0</div>
                            <div class="messageBox_id">{{value.coin}}币</div>
                            <div class="messageBox_amount">{{value.goods_product.money}}元</div>
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
            type(){
                return this.$store.state.basic.type
            },
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
.shopCard .service_details_quan div.messageBox_total{width: 140px;}
.shopCard .service_details_quan div.messageBox_quan{width: 125px;}
.shopCard .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.shopCard .service_details_content div.messageBox_total{width: 140px;}
.shopCard .service_details_content div.messageBox_quan{width: 164px;}
.shopCard .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.shopCard .messageBox_projectName{width: 130px;}
.shopCard .messageBox_number{width: 80px;}
.shopCard .messageBox_id,.shopCard .messageBox_amount{width: 140px;}
.shopCard .messageBox_integral{width: 80px;}
.shopCard .service_details_title div.messageBox_total{width: 160px;}
.shopCard .service_details_title div.messageBox_quan{width: 164px;}
.shopCard .messageBox_quanNumber{width: 160px;height: 48px;border: 0px;background-color: #F4F9FF;text-indent: 10px;font-size: 14px;color: #B3D6FF;}
.shopCard .service_details_quan div.messageBox_tip{margin-left: 300px;line-height: 50px;font-size: 14px;color: #ED475B;border-right: 0px;}
</style>