<template>
  <div id="orderCheckOut">
    <ul class="orderCheckOut_title">
      <li>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">IC卡号</div>
          <div style="display:flex;">
            <input class="orderCheckOut_title_details" v-model="card_num"/>
            <div style="width:60px;height:40px;line-height:40px;text-align:center;background-color:#5CA7FF;color:#fff;border-radius:6px;margin-left:4px;cursor:pointer" @click="doka">读卡</div>
          </div>
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">订单号</div>
          <input class="orderCheckOut_title_details" v-model="order_num"/>
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">套餐编号</div>
          <input class="orderCheckOut_title_details" v-model="ssn_num"/>
        </div>
        <div class="orderCheckOut_title_container" style="height:50px;width:100px;margin-top:25px;">
          <div class="orderCheckOut_title_title" style="width:100%;height:100%;line-height:50px;text-align:center;border-radius:6px;background-color:#5CA7FF;color:#fff;cursor:pointer" @click="getData(0)">查询订单</div>
        </div>
      </li>
      <li>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">订单类型</div>
          <Select style="height:50px;" size="large" v-model="type" class="media" @on-change='getType'>
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
          <DatePicker type="date" placeholder="请选择时间" style="height:50px;" class="media" v-model="start_time" @on-change='getStart_time'></DatePicker>
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">结束时间</div>
          <DatePicker type="date" placeholder="请选择时间" style="height:50px;"  class="media" v-model="end_time" @on-change='getEnd_time'></DatePicker>
        </div>
        <div class="orderCheckOut_title_container" style="height:50px;width:100px;margin-top:25px;">
          <div class="orderCheckOut_title_title" style="width:100%;height:100%;line-height:50px;text-align:center;border-radius:6px;background-color:#B2B2B9;color:#fff;cursor:pointer" @click="clear">清空筛选</div>
        </div>
      </li>
      <li>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">支付方式</div>
          <Select style="height:50px;" size="large" v-model="pay_type" class="media" @on-change='getPayType'>
              <Option  value="alipay" style="height:50px;">支付宝</Option>
              <Option  value="wechat" style="height:50px;">微信</Option>
              <Option  value="coin" style="height:50px;">实币购买</Option>
              <Option  value="cash" style="height:50px;">现金</Option>
              <Option  value="card_money" style="height:50px;">余额支付</Option>
          </Select>
        </div>
      </li>
    </ul>
    <div class="orderCheckOut_content_wrap">
      <div class="orderCheckOut_content" >
        <ul class="orderCheckOut_content_ul">
          <li style="width:150px;">订单日期</li>
          <li style="width:200px;">订单号</li>
          <li style="width:110px;">IC卡号</li>
          <li style="width:126px;">订单名称</li>
          <li style="width:70px;">订单类型</li>
          <li style="width:80px;">门票类型</li>
          <li style="width:80px;">编号</li>
          <li style="width:63px;">单价</li>
          <li style="width:50px;">数量</li>
          <li style="width:87px;">购币数</li>
          <li style="width:80px;">储值金额</li>
          <li style="width:100px;">优惠券使用</li>
          <li style="width:60px;">积分</li>
          <li style="width:70px;">订单状态</li>
          <li style="width:70px;">付款方式</li>
          <li style="width:80px;">实付金额</li>
          <li style="width:60px;">班次</li>
          <li style="width:85px;">收银员</li>
          <li style="width:100px;">操作</li>
        </ul>
        <div class="orderCheckOut_content_container">
          <div class="orderCheckOut_container_wrap" ref="left">
            <vue-scroll :ops="ops">
              <div class="orderCheckOut_container_scorll">
                <ul class="orderCheckOut_content_ul orderCheckOut_content_ul1" v-for="(value,index) in dataList">
                    <li style="width:150px;" :title="value.created_at">{{value.created_at}}</li>
                    <li style="width:200px;border-top:1px solid #DCDCE5;"><input type="text" style="width:200px;background-color:#fff;text-align:center;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;border:0px;" disabled="disabled" v-model="value.order_num" :title="value.order_num"></li>
                    <!-- <input type="text" style="width:200px" v-model="value.order_num"> -->
                    <li style="width:110px;" :title="value.card_num">{{value.card_num}}</li>
                    <li style="width:126px;" v-if="value.goods_info != null && value.goods_info!=''" :title="value.goods_info.name">{{value.goods_info.name}}</li>
                    <li style="width:126px" v-else>-</li>
                    <li style="width:70px;" :title="value.goods_type">{{value.goods_type}}</li>
                    <li style="width:80px;" :title="value.good_ticket_type" v-if="value.ticket_info != null && value.ticket_info!=''">{{value.good_ticket_type}}({{value.good_ticket_nature}})</li>
                    <li style="width:80px;" v-else>-</li>
                    <li style="width:80px;" :title="value.goods_info.ssn_num" v-if="value.goods_info != null && value.goods_info!=''">{{value.goods_info.ssn_num}}</li>
                    <li style="width:80px;" v-else>-</li>
                    <li style="width:63px;">{{value.unit_price}}</li>
                    <li style="width:50px;">{{value.num}}</li>
                    <li style="width:87px;">{{value.coin}}</li>
                    <li style="width:80px;">{{value.goods_info.money}}</li>
                    <li style="width:100px;">无</li>
                    <li style="width:60px;">{{value.amount_integral}}</li>
                    <li style="width:70px;">{{value.status}}</li>
                    <li style="width:70px;">{{value.pay_type}}</li>
                    <li style="width:80px;color:#D0021B;">{{value.amount}}</li>
                    <li style="width:60px;">{{value.work_classes_name}}</li>
                    <li style="width:85px;">{{value.manager_name}}</li>
                    <li style="width:100px;display:flex;"><div class="tuidan_btn" v-if="parseInt(value.is_pay) == 1" @click="print(value)">打印收据</div></li>
                </ul>
                <Page :total="totalPage" show-elevator style="margin:20px 400px" @on-change="selectPage"/>
              </div>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data(){
      return {
        pay_type:"",
        end_time:"",
        start_time:"",
        type:"",
        ssn_num:"",
        order_num:"",
        card_num:"",
        dataList:"",
        totalPage:0,
        ops:{
          vuescroll:{
            detectResize:true
          },
          scrollPanel:{},
          rail:{},
          bar:{background: '#3B89E5',}
        }
      }
    },
    components: {vueScroll },
    methods: {
      doka(){
        var readCardId = ipcRenderer.sendSync('synchronous-message')
        if(readCardId != ""){
            this.card_num = readCardId
        }
        this.getData(0)
      },
      clear(){
        this.pay_type=''
        this.end_time=""
        this.start_time=''
        this.type=""
        this.ssn_num=''
        this.order_num=""
        this.card_num=''
      },
      async getData(page){
        let baseUrl=await this.$baseFunction.getFileData()
        let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
        let res=await this.$request.getData('/order/ordersSelect',{user_token:userToken,card_num:this.card_num,order_num:this.order_num,ssn_num:this.ssn_num,type:this.type,start_time:this.start_time,end_time:this.end_time,pay_type:this.pay_type,page:page})
        console.log(res)
        if(res.level=='success'){
          this.totalPage=parseInt(res.page_count)*10
          this.dataList=res.data
          if(this.dataList.length==0){
            this.$baseFunction.showTotals(this,'暂无查询到数据')
          }
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      },
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
      selectPage(page){
        console.log(page)
        this.getData(page-1)
      },
      print(value){
        this.$store.dispatch('setOrder_num',value.order_num)
        this.$store.dispatch('setPrintShow',true)
      }

    },
    mounted(){
      this.getData(0)
    }
  }
</script>

<style>
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
.orderCheckOut_content_ul{height: 50px;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;width: 1840px;z-index: 100}
.orderCheckOut_content_ul li{float: left;color: #5F5F68;}
.orderCheckOut_content_container{height: calc(100% - 50px);background-color: #fff;width: 1780px;}
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
