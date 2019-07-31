<template>
  <div id="tuidan">
    <div class="tuidan_content_title">
      <div class="tuidan_content_input">
        <input v-model="orderId" placeholder="请输入订单号" />
        <div @click="select(1)" class="tuidan_content_input_title">按订单号查询</div>
        <input v-model="card_num" placeholder="请输入卡号"/>
        <div @click="select(1)" class="tuidan_content_input_title">按卡号查询</div>
        <Select  class="name tuidan_content_input_title" v-model="type" style="margin-top:10px;border: 1px solid #DCDCE5;background:#fff;width:130px;color:#5F5F68;height:40px;text-align:left;">
            <Option v-for="item in listData" :value="item.type" :key="item.type" style="height:38px;line-height:38px;">{{ item.name }}</Option>
        </Select>
        <div  class="tuidan_content_input_title" @click="select">按类型查询</div>
      </div>
      <div class="tuidan_modify">打印</div>
    </div>
    <div class="tuidan_content_wrap">
      <div class="tuidan_content">
        <ul class="tuidan_content_ul">
            <li style="width:100px;">订单日期</li>
            <li style="width:110px;">订单号</li>
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
            <li style="width:70px;">付款方式</li>
            <li style="width:100px;">实付金额</li>
            <li style="width:100px">操作</li>
        </ul>
        <div class="tuidan_content_container">
          <div class="tuidan_container_wrap" ref="left">
            <vue-scroll :ops="ops">
              <div class="tuidan_container_scorll">
                <ul class="tuidan_content_ul tuidan_content_ul1" v-for="(value,index) in orderData">
                  <li style="width:100px;" :title="value.pay_time">{{value.pay_time}}</li>
                  <li style="width:110px;">{{value.orders}}</li>
                  <li style="width:110px;">{{value.card_num}}</li>
                  <li style="width:126px;">{{value.good_name}}</li>
                  <li style="width:70px;">{{value.good_type}}</li>
                  <li style="width:80px;" v-if="value.good_ticket_nature!=''">{{value.good_ticket_type}}({{value.good_ticket_nature}})</li>
                  <li style="width:80px;" v-else>-</li>
                  <li style="width:80px;">{{value.good_ssn_num}}</li>
                  <li style="width:63px;">{{value.unit_price}}</li>
                  <li style="width:50px;">{{value.num}}</li>
                  <li style="width:87px;">{{value.good_coin}}</li>
                  <li style="width:80px;">{{value.good_amount}}</li>
                  <li style="width:100px;">优惠券使用</li>
                  <li style="width:60px;">{{value.amount_integral}}</li>
                  <li style="width:70px;">{{value.pay_type}}</li>
                  <li style="width:100px;">{{value.amount}}</li>
                  <li style="width:100px"> <div class="tuidan_btn" @click="tuidan(value)">授权退单</div></li>
                </ul>
                <Page :total="10000" show-elevator style="margin:20px 400px" @on-change="selectPage"/>
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
    components:{vueScroll},
    data(){
      return {
        orderId:"",
        orderData:"",
        card_num:"",
        type:"",
        listData:"",
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
    computed:{
      authorizationTag(){
        return this.$store.state.special.authorizationTag
      },
    },
    methods: {
      async select(page){
        let userToken=await this.$baseFunction.getCookie(this.$baseConfig.baseUrl,'userTokenCookie')
        // var readCardId = ipcRenderer.sendSync('synchronous-message')
        // if(readCardId != ""){
        //     this.card_num = readCardId
        // }
        let res=await this.$request.getData('/special/getReturnOrder',{order_num:this.orderId,user_token:userToken,card_num:this.card_num,page:page,type:this.type})
        // res.data.pay_time=res.data.pay_time.spilt(' ')[0]
        // res.data.created_at=res.data.created_at.spilt(' ')[0]
        if(res.level=='success'){
          this.orderData=res.data;
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      },
      async tuidan(value){
          this.$store.dispatch('setType','')
          this.$store.dispatch('setIsTuidan',true)
          this.$store.dispatch('setDingId',value.id)
          this.$store.dispatch('setAuthorizationShow',true)
      },
      async getList(){
        let res=await this.$request.getData('/goods/getGoodsType',{})
        console.log(res)
        this.listData=res.data
      },
      selectPage(page){
        console.log(page)
        this.select(page-1)
      }
    },
    mounted(){
      this.select()
      this.getList()
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true,
      //   //   scrollY: true,
      //   //   pullDownRefresh: {
      //   //     threshold: 30, // 下拉距离超过30px触发pullingDown事件
      //   //     stop: 20 // 回弹停留在距离顶部20px的位置
      //   //   }
      //   })
      // // scroll.on('pullingDown', () => {
      // //     console.log('aaaa')
      // // });
      // })
    },
    destroyed(){
      this.$store.dispatch('setIsTuidan',false)
      this.$store.dispatch('setAuthorizationTag','');
    }
  }
</script>

<style>
#tuidan{width:100%;height:100%;background-color: #EFEFF4;display: flex;flex-direction: column;}
.tuidan_content_wrap{height: 100%;width: calc(100% - 60px);position: relative;overflow-x: scroll;overflow-y: hidden;margin:0px 30px;}
.tuidan_content{height: 100%;display: flex;flex-direction: column;position: absolute;width: 1385px;}
.tuidan_content_title{height: 60px;font-size: 18px;color: #5F5F68;line-height: 60px;display: flex;justify-content: space-between;background-color: #fff;margin: 30px 30px 0px;}
.tuidan_content_input{width:800px;height: 60px;display: flex;}
.tuidan_content_input input{width: 130px;height: 40px;margin: 10px;background: #EFEFF4;border: 1px solid #DCDCE5;border-radius: 6px;padding-left: 10px;font-size: 12px;}
.tuidan_content_input_title{width: 100px;height: 40px;background: #5CA7FF;border-radius: 6px;margin: 10px;font-size: 14px;color: #FFFFFF;line-height: 40px;cursor: pointer;text-align: center;}
.tuidan_modify{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;text-indent:0px;cursor: pointer;}
.tuidan_content_ul{width: 100%;height: 50px;display: flex;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;display: flex;justify-content: space-around;}
.tuidan_content_container{width: 100%;flex:1;overflow-y: hidden;background-color: #fff;}
.tuidan_container_wrap{width: 100%;height: 100%;}
.tuidan_container_scorll{width: 100%;padding-bottom: 30px;}
.tuidan_content_ul li{height: 50px;line-height: 50px;text-align:center;border-left: 1px solid #DCDCE5;font-size: 14px;color: #8E8E93;text-overflow:ellipsis;  white-space: nowrap; overflow: hidden;}
.tuidan_content_ul li:nth-of-type(1){border-left: 0;}
.tuidan_content_ul1{background-color: #fff;}
.tuidan_content_ul1 li:nth-of-type(2){line-height: 25px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden; word-break: break-all;white-space: normal;}
.tuidan_content_ul1 li{color: #303039;}
.tuidan_btn{width: 80px;height: 40px;background: #3B89E5;border-radius: 6px;line-height: 40px;cursor: pointer;color: #fff;margin: 5px auto;}
</style>
