<template>
  <div id="detailsVip">
    <readCard></readCard>
      <div class="detailsVip_content_title">
        <ul>
          <li @click="select('')" :class="{select:selectIndex==''}">全部消费</li>
          <li @click="select('coin')" :class="{select:selectIndex=='coin'}">存币记录</li>
          <li @click="select('recharge_money')" :class="{select:selectIndex=='recharge_money'}">充值记录</li>
          <li @click="select('ticket')" :class="{select:selectIndex=='ticket'}">门票记录</li>
          <li @click="select('win_ticket')" :class="{select:selectIndex=='win_ticket'}">奖票记录</li>
          <li @click="select('coupon')" :class="{select:selectIndex=='coupon'}">优惠券记录</li>
          <li @click="select('integral')" :class="{select:selectIndex=='integral'}">积分记录</li>
        </ul>
      </div>
      <div class="detailsVip_content">
        <div class="detailsVip_content_details">
          <div class="detailsVip_details_nameList">
            <div style="width:150px;">订单日期</div>
            <div style="width:200px;">订单号</div>
            <div style="width:110px;">IC卡号</div>
            <div style="width:126px;">订单名称</div>
            <div style="width:70px;">订单类型</div>
            <div style="width:80px;">门票类型</div>
            <div style="width:80px;">编号</div>
            <div style="width:63px;">单价</div>
            <div style="width:50px;">数量</div>
            <div style="width:87px;">购币数</div>
            <div style="width:80px;">储值金额</div>
            <div style="width:100px;">优惠券使用</div>
            <div style="width:60px;">积分</div>
            <div style="width:70px;">订单状态</div>
            <div style="width:70px;">付款方式</div>
            <div style="width:110px;">实付金额</div>
          </div>
          <div class="detailsVip_details_container">
            <div class="detailsVip_details_wrap" ref="left">
              <vue-scroll :ops="ops">
                <ul>
                  <li class="detailsVip_details_nameList detailsVip_details_nameList1" v-for="(value,index) in coninsData">
                    <div style="width:150px;" :title="value.pay_time">{{value.pay_time}}</div>
                    <input type="text" v-model="value.orders" disabled class="detailsVip_details_id" style="background-color:#fff;border:0px;text-align:center;border-right: 1px solid #DEEDFF;border-bottom: 1px solid #DEEDFF;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:200px;" />
                    <div style="width:110px;">{{value.card_num}}</div>
                    <div style="width:126px;">{{value.good_name}}</div>
                    <div style="width:70px;">{{value.good_type}}</div>
                    <div style="width:80px;" v-if="value.good_ticket_nature!=''">{{value.good_ticket_type}}({{value.good_ticket_nature}})</div>
                    <div style="width:80px;" v-else>-</div>
                    <div style="width:80px;">{{value.good_ssn_num}}</div>
                    <div style="width:63px;">{{value.unit_price}}</div>
                    <div style="width:50px;">{{value.num}}</div>
                    <div style="width:87px;">{{value.good_coin}}</div>
                    <div style="width:80px;">{{value.good_amount}}</div>
                    <div style="width:100px;">未使用</div>
                    <div style="width:60px;">{{value.amount_integral}}</div>
                    <div style="width:70px;">{{value.status}}</div>
                    <div style="width:70px;">{{value.order_pay_type}}</div>
                    <div style="width:80px;">{{value.amount}}</div>
                  </li>
                </ul>
              </vue-scroll>
              <Page :total="10000" show-elevator style="margin:20px 400px" @on-change="selectPage"/>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
export default {
  name: 'landing-page',
  data(){
      return {
        selectIndex:'',
        dataList:"",
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
    coninsData(){
      return this.$store.state.basic.coninsData
    },
  },
  components: { readCard ,vueScroll},
  methods: {
    select(value){
        this.selectIndex=value
        this.$store.dispatch('setSelectIndex',this.selectIndex);
        this.getData(0)
    },
    async getData(page){
      let baseUrl=await this.$baseFunction.getFileData()
      let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
      let res=await this.$request.getData('/member/getBill',{type:this.selectIndex,user_token:userToken,card_num:this.$store.state.basic.mealInformation.card_num,page:page})
      this.$store.dispatch('setConinsData',res.data)
    },
    selectPage(page){
      this.getData(page-1)
    }
  },
  mounted(){
    this.$store.dispatch('setReadCardType','detailsVip');
    //   this.$nextTick(()=>{
    //    const scroll=new BScroll(this.$refs.left,{
    //     click:true,
    //   })
    // })
  },
  destroyed(){
    this.$store.dispatch('setConinsData','')
    this.$store.dispatch('setReadCardType','');
    this.$store.dispatch('setSelectIndex','');
  }
}
</script>

<style scoped>
#detailsVip{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.detailsVip_content{background-color: #fff;margin:0px 30px;height: 100%;display: flex;flex-direction: column;flex: 1;width: calc(100% - 60px);position: relative;overflow-x:scroll;overflow-y: hidden;}
.detailsVip_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;background-color: #fff;margin:0px 30px;}
.detailsVip_content_title ul{width: 100%;height: 100%;display: flex;justify-content: row;}
.detailsVip_content_title ul li{width: 100px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
.detailsVip_content_title ul li.select{border-bottom: 4px solid  #3B89E5;}
.detailsVip_content_details{background: #F4F9FF;border-radius: 6px 6px 0px 0px;display: flex;flex-direction: column;flex: 1;width: 1505px;position: absolute;height: 100%;}
.detailsVip_details_container{height: calc(100% - 80px);overflow-y: hidden;position: absolute;width: 1500px;top: 60px;left: 0px;}
.detailsVip_details_nameList{height: 60px;font-size: 14px;color: #303039;background: #F4F9FF;width: 100%;display: flex;}
.detailsVip_details_nameList div{line-height: 60px;text-align:center;height: 100%;border-right: 1px solid #DEEDFF;border-bottom: 1px solid #DEEDFF;width: 200px;}
.detailsVip_details_nameList1{height:50px;font-size: 14px;color: #5F5F68;background: #fff;}
.detailsVip_details_nameList1 div{line-height:50px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.detailsVip_details_wrap{height: 100%;width: 1500px;position: absolute;overflow-y: scroll;overflow-x:hidden;}
.detailsVip_details_wrap ul{width: 100%;padding-bottom: 30px;}
</style>
