<template>
  <div  class="duihuanBox">
    <div class="duihuanWrap">
        <div class="wrap_title">
            <div><b>兑换商品</b></div>
            <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
        </div>
        <div class="wrap_readInformation">
            <div class="information_title">
                <div>读卡信息</div>
                <div  @click="doka">
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
                        <div>奖票</div>
                        <div>{{mealInformation.win_ticket}}</div>
                    </li>
                </ul>
                <ul class="content_right">
                  <li>预存款：{{mealInformation.money|moneyFromat}}</li>
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
        <div class="wrap_service">
            <div class="service_title"><b>礼品详情</b></div>
            <div class="service_content">
                <ul class="service_content_details"> 
                    <li class="service_details_title service_details_content1" style="height:30px;">
                        <div class="messageBox_projectName" style="line-height:30px;">商品</div>
                        <div class="messageBox_number" style="line-height:30px;">礼品名称</div>
                        <div class="messageBox_id" style="line-height:30px;">数量</div>
                        <div class="messageBox_id" style="line-height:30px;">礼品编号</div>
                        <div class="messageBox_integral" style="line-height:30px;">兑换积分/兑换奖票</div>
                    </li>
                    <div class="service_container">
                        <div class="service_wrap" ref="left">
                            <ul>
                                <li class="service_details_content service_details_content1" v-for="(value,index) in selectData.order_items">
                                    <div class="messageBox_projectName"><img :src="selectData==''?'':value.goods_product.thumb_url" v-if="selectData!=''"/></div>
                                    <div class="messageBox_number">{{selectData==''?'':value.goods_product.name}}</div>
                                    <div class="messageBox_id">{{selectData==''?'':value.num}}</div>
                                    <div class="messageBox_id">{{selectData==''?'':value.goods_product.ssn_num}}</div>
                                    <div class="messageBox_integral">{{selectData==''?'':value.amount_integral}}积分/{{selectData==''?'':value.amount_win_ticket}}奖票</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
        <div class="service_content_payment">
            <div class="payment_title">兑换方式</div>
            <ul class="payment_methods">
                <li class="select">
                    <input name="money" type="radio" value="integral" v-model="type"/>
                    <div class="methods_title">积分兑换</div>
                </li>
                <li v-if="mealInformation==''?false:true">
                    <input name="money" type="radio" value="win_ticket" v-model="type"/>
                    <div class="methods_title">奖票兑换</div>
                </li>
            </ul>
        </div>
        <div class="messageBox_wrap">
            <div class="messageBox_details">
                <div class="messageBox_details_one">
                    <span>{{type=='integral'?'总计积分：':'总奖票：'}}</span>
                    <span v-if="type=='integral'">{{type=='integral'&&selectData!=''?selectData.amount_integral+'积分':''}}</span>
                    <span v-else>{{type=='win_ticket'&&selectData!=''?selectData.amount_win_ticket+'张':""}}</span>
                </div>
            </div>
            <div class="messageBox_wrap_btn" @click="dui">兑换</div>
        </div>
        <payShow v-if="payshow"></payShow>
    </div>
  </div>
</template>

<script>
import payShow from '@/components/payShow'
import BScroll from 'better-scroll'
const {ipcRenderer: ipc} = require('electron');
const {ipcRenderer} = require('electron')
    export default {
        data(){
            return {
                type:'integral',
                card_num:""
            }
        },
        components:{payShow},
        computed: {      
          selectData(){   //兑换得信息
            return this.$store.state.basic.selectData
          },
          isdoka(){   //是否读卡成功
            return this.$store.state.basic.isdoka
          },
          mealInformation(){    //读取卡得信息
            return this.$store.state.basic.mealInformation
          },
          payshow(){
            return this.$store.state.together.payshow
          },
        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setDuihuanBoxShow',false)
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
                    ipc.send('doka',res.data);
                    this.$store.dispatch('setMealInformation',res.data)
                }

                this.$store.dispatch('setIsdoka',tag)

                this.$store.dispatch('setCardId',this.card_num)

                //点击读取卡号时执行刷新订单接口
                if(this.card_num.trim() != "" &&!this.isTuidan){
                    this.$baseFunction.reloadOrder(this,this.card_num)
                }
                // this.$store.dispatch('setIsdoka',tag)
                // this.$store.dispatch('setMealInformation',res.data==undefined?"":res.data)
                // this.$baseFunction.reloadOrder(this,res.data==undefined?"":res.data.card_num)
            },
            dui(){
                // console.log('aaaa')
                this.$store.dispatch('setPayshow',true)
                this.$store.dispatch('setPayType',this.type)
                this.$store.dispatch('setSelectType',this.type)
            }
        },
        mounted(){
            this.$nextTick(()=>{
            const scroll=new BScroll(this.$refs.left,{
              click:true,
              // scrollbar:true
            })
          })
        },
        destroyed(){
            console.log(this.$store.state.basic.isdoka,9999)
            // this.$store.dispatch('setMealInformation','')
            this.$store.dispatch('setIsdoka',false)
            this.$store.dispatch('setSelectData',"")
        }
    }
</script>
    
<style>
.duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}
.duihuanWrap{width: 800px;height:730px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -365px;margin-left: -400px;display: flex;flex-direction: column;}

.duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
.duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
.duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}


.duihuanBox .service_container{width: 100%;flex:1;overflow-y: scroll;}
.duihuanBox .service_wrap{width: 100%;height: 100%;}
.duihuanBox .wrap_readInformation{width: 700px;height: 105px;margin:20px 0px 0px 50px;display: flex;flex-direction: column;}
.duihuanBox .information_title{width: 100%;height: 20px;display: flex;justify-content: space-between;}
.duihuanBox .information_title div:nth-of-type(1){font-size: 14px;color: #303039;}
.duihuanBox .information_title div:nth-of-type(2){background: #DEEDFF;border-radius: 10px;font-size: 12px;color: #303039;width: 80px;line-height: 20px;text-align:center;cursor: pointer;}
.duihuanBox .information_content{flex:1;background: #FFFFFF;border: 1px solid #DEEDFF;border-radius: 8px;display: flex;justify-content: row;margin-top: 5px;}
.duihuanBox .information_content1{font-size: 16px;color: #B3D6FF;text-align: center;display: block;line-height: 80px;}
.duihuanBox .content_left{width: 276px;height: 100%;display: flex;justify-content: row;}
.duihuanBox .content_left>li{width: 92px;height: 60px;margin-top: 10px;border-right: 1px solid #DEEDFF;}
.duihuanBox .content_left>li:nth-last-o-type(1){border-right: 0;}
.duihuanBox .content_left>li div:nth-of-type(1){font-size: 12px;color: #5F5F68;text-align: center;}
.duihuanBox .content_left>li div:nth-of-type(2){font-size: 34px;color: #1E7FEE;text-align: center;}
.duihuanBox .content_right{flex: 1;display: flex;justify-content: row;flex-wrap:wrap;}
.duihuanBox .content_right>li{width: 140px;height: 39px;line-height: 39px;font-size: 14px;text-align: center;color: #5F5F68;}
.duihuanBox .content_right>li span{color: #303039;}
.duihuanBox .content_right>li:nth-of-type(1) span{color: #1E7FEE;}

.duihuanBox .wrap_service{width: 700px;height: 164px;margin:20px 0px 0px 50px;}
.duihuanBox .service_title{width: 100%;height: 20px;font-size: 14px;color: #303039;margin-bottom: 5px;}
.duihuanBox .service_content{width: 100%;height: 144px;background: #F4F9FF;border: 1px solid #DEEDFF;border-radius: 8px;}
.duihuanBox .service_content_details{width: 100%;height: 144px;border-bottom:1px solid #DEEDFF;}
.duihuanBox .service_details_title,.duihuanBox .service_details_content{width: 100%;height: 30px;display: flex;background: #F4F9FF;border-bottom: 1px solid #DEEDFF;border-radius: 8px 8px 0px 0px;}
.duihuanBox .service_details_content{height: 64px;}
.duihuanBox .service_details_content div{line-height: 64px;font-size: 14px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.duihuanBox .service_details_content div.messageBox_total{width: 225px;border-right:0px;}


.duihuanBox .service_details_title div{line-height: 30px;font-size: 12px;color: #303039;text-align: center;border-right: 1px solid #DEEDFF;}
.duihuanBox .service_details_content1{height: 120px;}
.duihuanBox .service_details_content1 div{line-height: 120px;}
.duihuanBox .service_details_content1 .messageBox_projectName{width: 145px;}
.duihuanBox .service_details_content1 .messageBox_projectName img{width: 120px;height: 120px;}
.duihuanBox .service_details_content1 .messageBox_number{width: 150px;}
.duihuanBox .service_details_content1 .messageBox_id,.duihuanBox .messageBox_amount{width: 120px;}
.duihuanBox .service_details_content1 .messageBox_integral{width: 301px;}


.duihuanBox .service_details_content1 .messageBox_integral,.duihuanBox .service_details_content .messageBox_integral{border:0px}

.duihuanBox .messageBox_projectName{width: 130px;}
.duihuanBox .messageBox_number{width: 80px;}
.duihuanBox .messageBox_id,.duihuanBox .messageBox_amount{width: 100px;}
.duihuanBox .messageBox_integral{width: 60px;}
.duihuanBox .service_details_title div.messageBox_total{width: 225px;border-right:0px;}





.duihuanBox .service_content_payment{width: 100%;height: 81px;margin: 30px 0px;}
.duihuanBox .payment_title{margin-left:48px;font-size: 14px;color: #5F5F68;}
.duihuanBox .payment_methods{display: flex;justify-content: row;margin-left: 48px;}
.duihuanBox .payment_methods li{display: flex;justify-content: row;font-size: 16px;color: #5F5F68;height: 40px;margin-top: 11px;margin-right: 30px;}


.duihuanBox .payment_methods li input{width: 20px;height: 20px;margin-top: 10px;}

.duihuanBox .methods_title{height: 100%;line-height: 40px;}

.duihuanBox .messageBox_wrap{width: 100%;height: 100px;background: #F4F9FF;border-radius: 0px 0px 6px 6px;display: flex;justify-content: space-between;}
.duihuanBox .messageBox_details{width: 250px;margin-left: 56px;height: 100%;display: flex;flex-direction: column;}
.duihuanBox .messageBox_wrap_btn{width: 160px;height: 50px;margin:25px 55px;background: #3B89E5;border-radius: 8px;line-height: 50px;font-size: 18px;color: #FFFFFF;text-align: center;}

.duihuanBox .messageBox_details_one{line-height: 25px;margin: 25px 0px 8px;font-size: 14px;color: #303039;}
.duihuanBox .messageBox_details_one span:nth-of-type(2){color: #ee5c6e;font-size: 24px;}
.duihuanBox .messageBox_details_one span:nth-of-type(3){font-size: 14px;color: #B2B2B9;text-decoration:line-through}
</style>