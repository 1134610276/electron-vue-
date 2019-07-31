<template>
  <div id="totalCheckOut">
    <div class="totalCheckOut_content_wrap">
      <div class="totalCheckOut_content">
          <ul class="orderCheckOut_title">
              <li>
                  <div class="orderCheckOut_title_container">
                      <div class="orderCheckOut_title_title">订单类型</div>
                      <Select style="height:50px;" size="large" v-model="type" class="media" @on-change='getType'>
                          <Option  value="" style="height:50px;">全部</Option>
                          <Option  value="ticket" style="height:50px;">门票</Option>
                          <Option  value="physical_commodity" style="height:50px;">商品销售</Option>
                          <Option  value="member_card" style="height:50px;">会员卡</Option>
                          <Option  value="give_card" style="height:50px;">赠送卡</Option>
                          <Option  value="interim_card" style="height:50px;">临时卡</Option>
                          <Option  value="entity_coin" style="height:50px;">实体币</Option>
                          <Option  value="invent_coin" style="height:50px;">虚拟币</Option>
                          <Option  value="recharge_money" style="height:50px;">余额充值</Option>
                          <Option  value="gift_convert" style="height:50px;">兑换商品</Option>
                      </Select>
                  </div>
                  <div class="orderCheckOut_title_container">
                      <div class="orderCheckOut_title_title">开始时间</div>
                      <Select style="width:130px;height:50px;" size="large" v-model="start">
                        <Option value="" style="height:50px;" >全部</Option>
                        <Option  :value="value.value" style="height:50px;" v-for="(value) in selectTime">{{value.name}}</Option>
                      </Select>
                  </div>
                  <div class="orderCheckOut_title_container">
                      <div class="orderCheckOut_title_title">结束时间</div>
                      <Select style="width:130px;height:50px;" size="large" v-model="end">
                          <Option value="" style="height:50px;" >全部</Option>
                        <Option  :value="value.value" style="height:50px;" v-for="(value) in selectTime">{{value.name}}</Option>
                      </Select>
                  </div>
                  <div class="orderCheckOut_title_container" style="height:50px;width:100px;margin-top:25px;">
                      <div class="orderCheckOut_title_title" style="width:100%;height:100%;line-height:50px;text-align:center;border-radius:6px;background-color:#5CA7FF;color:#fff;cursor:pointer" @click="getData(0)">查询订单</div>
                  </div>
              </li>
              <li>
                  <div class="orderCheckOut_title_container">
                      <div class="orderCheckOut_title_title">支付方式</div>
                      <Select style="height:50px;" size="large" v-model="pay_type" class="media" @on-change='getPayType'>
                          <Option  value="" style="height:50px;">全部</Option>
                          <Option  value="alipay" style="height:50px;">支付宝</Option>
                          <Option  value="wechat" style="height:50px;">微信</Option>
                          <Option  value="coin" style="height:50px;">实币购买</Option>
                          <Option  value="cash" style="height:50px;">现金</Option>
                          <Option  value="card_money" style="height:50px;">余额支付</Option>
                      </Select>
                  </div>
              </li>
          </ul>
        <!--<div class="totalCheckOut_content_title" style="position:relative">-->
          <!--<b>今日账目总结（{{user_login_info.work_classes_name}}）</b>-->
          <!--<div class="totalCheckOut_xuan" @click="shai">-->
              <!--<img src="http://file.rzkeji.com/web/wanxiang/icon/shaixuan.png"/>-->
              <!--<div>筛选</div>-->
          <!--</div>-->
          <!--&lt;!&ndash; <div class="totalCheckOut_modify" @click="pirct">打印</div> &ndash;&gt;-->
          <!--<div style="position:absolute;width:320px;height:280px;background: #F8F8FB;box-shadow: 0 5px 10px 0 rgba(0,0,0,0.20);border-radius: 6px;right:60px;top:60px;z-index:99;" v-if="shaiShow">-->
            <!--<div style="font-size: 12px;color: #303039;height:40px">时间筛选</div>-->
            <!--<div style="width:300px;height:50px;display:flex;margin-left:10px;">-->
              <!--<Select style="width:130px;height:50px;" size="large" v-model="start">-->
                <!--<Option  :value="value.value" style="height:50px;" v-for="(value) in selectTime">{{value.name}}</Option>-->
              <!--</Select>-->
              <!--<div style="width:20px;margin:0px 15px;line-height:50px;text-indent:0px;">至</div>-->
              <!--<Select style="width:130px;height:50px;" size="large" v-model="end">-->
                <!--<Option  :value="value.value" style="height:50px;" v-for="(value) in selectTime">{{value.name}}</Option>-->
              <!--</Select>-->
            <!--</div>-->

            <!--<div style="font-size: 12px;color: #303039;height:40px">类型筛选</div>-->
            <!--<Select style="width:300px;height:50px;margin:20px 10px;" size="large" v-model="type">-->
                  <!--<Option  value="十点" style="height:50px;">十点</Option>-->
                  <!--<Option  value="十一点" style="height:50px;">十一点</Option>-->
            <!--</Select>-->
            <!--<div style="width:100%;">-->
              <!--<div style="width:80px;height:40px;float:right;background: #3B89E5;border-radius: 6px;line-height:40px;text-align:center;margin:0px 10px;font-size: 14px;color: #FFFFFF;text-indent:0px;cursor:pointer" @click="select">确定</div>-->
              <!--<div style="width:80px;height:40px;float:right;background: #8BC0FF;border-radius: 6px;line-height:40px;text-align:center;font-size: 14px;color: #FFFFFF;text-indent:0px;cursor:pointer" @click="clear">清空</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <div class="orderCheckOut_content_wrap">
          <div class="orderCheckOut_content">
            <ul class="orderCheckOut_content_ul" >
                <li style="width:150px;">下单时间</li>
                <li style="width:200px;">订单号</li>
                <li style="width:100px;">IC卡号</li>
                <li style="width:100px;">商品名称</li>
                <li style="width:100px;">订单类型</li>
                <li style="width:100px;">门票类型</li>
                <li style="width:100px;">编号</li>
                <li style="width:100px;">单价</li>
                <li style="width:100px;">数量</li>
                <li style="width:100px;">购币数</li>
                <li style="width:100px;">储值金额</li>
                <li style="width:100px;">积分</li>
                <li style="width:100px;">付款方式</li>
                <li style="width:100px;">实付金额</li>
            </ul>
            <div class="orderCheckOut_content_container">
              <div class="orderCheckOut_container_wrap" ref="left">
              <vue-scroll :ops="ops">
                <div class="orderCheckOut_container_scorll">
                  <ul class="orderCheckOut_content_ul orderCheckOut_content_ul1" v-for="(value,index) in orderData">
                    <li style="width:150px;" :title="value.pay_time">{{value.pay_time}}</li>
                    <li style="width:200px;" v-if="value.order != null">{{value.order.order_num}}</li><li style="width:200px;" v-else>-</li>
                    <li style="width:100px;">{{value.card_num}}</li>
                    <li style="width:100px;">{{value.good_name}}</li>
                    <li style="width:100px;">{{value.good_type}}</li>
                    <li style="width:100px;" v-if="value.good_ticket_nature!=''">{{value.good_ticket_type}}({{value.good_ticket_nature}})</li>
                    <li style="width:100px;" v-else>-</li>
                    <li style="width:100px;">{{value.good_ssn_num}}</li>
                    <li style="width:100px;">{{value.unit_price}}</li>
                    <li style="width:100px;">{{value.num}}</li>
                    <li style="width:100px;">{{value.good_coin}}</li>
                    <li style="width:100px;">{{value.good_amount}}</li>
                    <li style="width:100px;">{{value.amount_integral}}</li>
                    <li style="width:100px;">{{value.pay_type}}</li>
                    <li style="width:100px;">{{value.amount}}</li>
                  </ul>
                  <Page :total="10000" show-elevator style="margin:20px 400px" @on-change="selectPage"/>
                </div>
              </vue-scroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="webShow">
      <webview ref="printWebview" :src="webSrc" nodeintegration style="visibility:hidden"/>
    </div>
  </div>
</template>

<script>
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import { ipcRenderer } from 'electron';
const path = require('path')
  export default {
    name: 'landing-page',
    components: { vueScroll},
    data(){
      return {
        printList:"",
        webShow:false,
        webSrc:"",
        start:"",
        end:"",
        type:"",
        ops:{
          vuescroll:{
            detectResize:true
          },
          scrollPanel:{},
          rail:{},
          bar:{background: '#3B89E5',}
        },
        shaiShow:false,
        orderData:"",
        userToken:"",
        user_login_info:"",
        page:0,
          pay_type:"",
        selectTime:[
          {
            value:0,
            name:'0点'
          },
          {
            value:1,
            name:'1点'
          },
          {
            value:2,
            name:'2点'
          },
          {
            value:3,
            name:'3点'
          },
          {
            value:4,
            name:'4点'
          },
          {
            value:5,
            name:'5点'
          },
          {
            value:6,
            name:'6点'
          },
          {
            value:7,
            name:'7点'
          },
          {
            value:8,
            name:'8点'
          },
          {
            value:9,
            name:'9点'
          },
          {
            value:10,
            name:'10点'
          },
          {
            value:11,
            name:'11点'
          },
          {
            value:12,
            name:'12点'
          },
          {
            value:13,
            name:'13点'
          },
          {
            value:14,
            name:'14点'
          },
          {
            value:15,
            name:'15点'
          },
          {
            value:16,
            name:'16点'
          },
          {
            value:17,
            name:'17点'
          },
          {
            value:18,
            name:'18点'
          },
          {
            value:19,
            name:'19点'
          },
          {
            value:20,
            name:'20点'
          },
          {
            value:21,
            name:'21点'
          },
          {
            value:22,
            name:'22点'
          },
          {
            value:23,
            name:'23点'
          },
        ]
      }
    },

    methods: {
      shai(){
        this.shaiShow=!this.shaiShow
      },
      // async pirct(){
      //   this.webShow=true
      //  this.webSrc=`http://dev-test.allonyun.com/printOrder?order_num=2018122504200077079892`
      //  const webview = this.$refs.printWebview;
      //  let printData=await this.$baseFunction.getPrintList()
      //  let res=await this.$baseFunction.printing(webview,printData)
      //  if(res){
      //   this.webShow=false
      //  }
      // },
        getPayType(value){
            this.pay_type=value
        },
        getType(value){
            this.type=value
        },
        getStart_time(value){
            this.start_time=value
        },
        getEnd_time(value){
            this.end_time=value
        },
      selectPage(){
        this.page++
        this.getData(this.page)
      },
      select(){
        this.page=0
        this.getData(this.page)
      },
      async getData(page){
        let baseUrl=await this.$baseFunction.getFileData()
          let work_record_id=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
        let res=await this.$request.getData('/special/getClassBusinessClosing',{pay_type:this.pay_type,work_record_id:work_record_id[0],user_token:this.userToken,work_classes_id:this.user_login_info.work_classes_id,cash_register_id:this.user_login_info.cash_register_id,page:page,start_time:this.start,end_time:this.end,type:this.type})
        this.orderData=res.data
        this.shaiShow=false
        this.start=''
        this.end=''
        this.type=''
      },
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
      let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
        this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
      this.user_login_info=JSON.parse(user_login_info)
      this.getData(this.page)
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    }
  }
</script>

<style scoped>
#totalCheckOut{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.totalCheckOut_content_wrap{height: 100%;}
.totalCheckOut_content{height: 100%;display: flex;flex-direction: column;}
.totalCheckOut_content_title{height: 60px;font-size: 18px;color: #5F5F68;line-height: 60px;text-indent: 10px;display: flex;margin-top: 30px;background-color: #fff;position: relative;}
.totalCheckOut_modify,.totalCheckOut_xuan{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;line-height: 40px;position: absolute;right: 10px;top: 10px;text-align: center;text-indent: 0px;cursor: pointer;}
.totalCheckOut_xuan{background: #C8E1FF;}
.totalCheckOut_xuan img{width: 40px;height: 40px; vertical-align: middle;display: block}
.totalCheckOut_xuan{right: 100px;top: 10px;display: flex;color: #0D6BDA;}
.totalCheckOut_content_ul{width: 100%;height: 50px;display: flex;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;display: flex;justify-content: space-around;}

/** ------------------- **/
#orderCheckOut{width:100%;height:100%;background-color: #EFEFF4;display: flex;flex-direction: column;overflow: hidden;}
.orderCheckOut_title{width: calc(100%-60px);margin: 10px 30px 10px;}
.orderCheckOut_title li{width: 100%;height: 60px;display: flex;margin-bottom: 10px;}
.orderCheckOut_title_container{width: 180px;height: 100%;margin-right: 60px;}
.orderCheckOut_title_title{margin-bottom: 4px;line-height: 15px;font-size: 14px;color: #5F5F68;}
.orderCheckOut_title_details{width: 100%;height: 41px;line-height: 41px;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;text-indent: 10px;}

.orderCheckOut_content_wrap{width: 100%;overflow: hidden;flex: 1;}
.orderCheckOut_content{margin:0px 30px;display: flex;flex-direction: column;overflow-x: scroll;position: absolute;width: calc(100% - 60px);height: calc(100% - 80px - 230px);overflow-y: hidden;}
.orderCheckOut_content_title{height: 60px;font-size: 18px;color: #5F5F68;line-height: 60px;text-indent: 10px;display: flex;justify-content: space-between;margin-top: 30px;background-color: #fff;}

.orderCheckOut_modify{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;}
.orderCheckOut_content_ul{height: 50px;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;width: 1580px;z-index: 100}
.orderCheckOut_content_ul li{float: left;color: #5F5F68;}
.orderCheckOut_content_container{height: calc(100% - 50px);background-color: #fff;width: 1580px;}
.orderCheckOut_container_wrap{width: 100%;height: 100%;overflow-y: scroll;overflow-x: hidden;}
.orderCheckOut_container_scorll{width: 100%;padding-bottom: 30px;}
.orderCheckOut_content_ul li{height: 50px;line-height: 50px;text-align:center;border-left: 1px solid #DCDCE5;font-size: 14px;color: #8E8E93;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.orderCheckOut_content_ul li:nth-of-type(1){border-left: 0;}
.orderCheckOut_content_ul1{background-color: #fff;}
.orderCheckOut_content_ul1:nth-last-of-type(1){}
.orderCheckOut_content_ul1 li{color: #303039;}
.media{width: 180px;}
@media screen and (max-width: 1025px) {
    .orderCheckOut_title_container{width: 125px; }
    .media{width: 125px;}
}
.tuidan_btn{width: 80px;height: 40px;background: #3B89E5;border-radius: 6px;line-height: 40px;cursor: pointer;color: #fff;margin: 5px auto;}
</style>
