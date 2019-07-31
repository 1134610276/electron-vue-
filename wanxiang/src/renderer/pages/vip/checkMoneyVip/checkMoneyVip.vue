<template>
  <div id="checkMoneyVip">
    <readCard></readCard>
    <div class="checkMoneyVip_content" > 
      <div class="checkMoneyVip_content_title">
          <b>余额信息</b>
          <div class="print" @click='printInformation' style="margin:10px 20px;">打印会员信息</div>
      </div>
      <div class="checkMoneyVip_container" ref="left">
        <vue-scroll :ops="ops">
          <div class="checkMoneyVip_wrap">
            <ul class="checkMoneyVip_content_ul">
              <li>
                  <div class="checkMoneyVip_content_name">
                    <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
                    <span>预存款</span>
                  </div>
                  <div class="checkMoneyVip_content_money">{{mealInformation==''?'- ':mealInformation.money}}<span>元</span></div>
                  <div class="checkMoneyVip_content_time">{{mealInformation==''?'- ':mealInformation.updated_at}}</div>
              </li>
              <li>
                  <div class="checkMoneyVip_content_name">
                    <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
                    <span>币余额</span>
                  </div>
                  <div class="checkMoneyVip_content_money">{{mealInformation==''?'- ':mealInformation.coin}}<span>个</span></div>
                  <div class="checkMoneyVip_content_time">{{mealInformation==''?'- ':mealInformation.updated_at}}</div>
              </li>
              <li>
                  <div class="checkMoneyVip_content_name">
                    <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
                    <span>积分</span>
                  </div>
                  <div class="checkMoneyVip_content_money">{{mealInformation==''?'- ':mealInformation.integral}}<span>分</span></div>
                  <div class="checkMoneyVip_content_time">{{mealInformation==''?'- ':mealInformation.updated_at}}</div>
              </li>
              <li>
                  <div class="checkMoneyVip_content_name">
                    <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
                    <span>奖票</span>
                  </div>
                  <div class="checkMoneyVip_content_money">{{mealInformation==''?'- ':mealInformation.win_ticket}}<span>个</span></div>
                  <div class="checkMoneyVip_content_time">{{mealInformation==''?'- ':mealInformation.updated_at}}</div>
              </li>
            </ul>
            <div class="checkMoneyVip_content_details">
   <!--          <div class="checkMoneyVip_details_title">
              <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
              <div class="checkMoneyVip_details_number">优惠券:<span>1张</span></div>
            </div> -->
  <!--           <div class="checkMoneyVip_details_nameList">
              <div class="checkMoneyVip_details_id">门票编号</div>
              <div class="checkMoneyVip_details_name">门票名称</div>
              <div class="checkMoneyVip_details_type">门票类型</div>
              <div class="checkMoneyVip_details_money">门票价值</div>
              <div class="checkMoneyVip_details_time">有效日期</div>
            </div> -->
  <!--           <ul class="checkMoneyVip_details_content">
                <li class="checkMoneyVip_details_nameList checkMoneyVip_details_nameList1">
                  <div class="checkMoneyVip_details_id">39483938</div>
                  <div class="checkMoneyVip_details_name">小火车</div>
                  <div class="checkMoneyVip_details_type">月票</div>
                  <div class="checkMoneyVip_details_money">¥20</div>
                  <div class="checkMoneyVip_details_time">2018-12-26</div>
                </li>
                <li class="checkMoneyVip_details_nameList checkMoneyVip_details_nameList1">
                  <div class="checkMoneyVip_details_id">39483938</div>
                  <div class="checkMoneyVip_details_name">小火车</div>
                  <div class="checkMoneyVip_details_type">月票</div>
                  <div class="checkMoneyVip_details_money">¥20</div>
                  <div class="checkMoneyVip_details_time">2018-12-26</div>
                </li>
                <li class="checkMoneyVip_details_nameList checkMoneyVip_details_nameList1">
                  <div class="checkMoneyVip_details_id">39483938</div>
                  <div class="checkMoneyVip_details_name">小火车</div>
                  <div class="checkMoneyVip_details_type">月票</div>
                  <div class="checkMoneyVip_details_money">¥20</div>
                  <div class="checkMoneyVip_details_time">2018-12-26</div>
                </li>
                <li class="checkMoneyVip_details_nameList checkMoneyVip_details_nameList1">
                  <div class="checkMoneyVip_details_id">39483938</div>
                  <div class="checkMoneyVip_details_name">小火车</div>
                  <div class="checkMoneyVip_details_type">月票</div>
                  <div class="checkMoneyVip_details_money">¥20</div>
                  <div class="checkMoneyVip_details_time">2018-12-26</div>
                </li>
              </ul> -->
            </div>
            <div class="checkMoneyVip_content_details">
              <div class="checkMoneyVip_details_title">
                <div style="display:flex">
                  <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png"/>
                  <div class="checkMoneyVip_details_number">
                  票余额：<span>{{mealInformation==''?0:mealInformation.user_ticket.length}}张</span>
                  </div>
                </div>
              </div>
              <div class="checkMoneyVip_details_nameList">
                <div class="checkMoneyVip_details_id">门票编号</div>
                <div class="checkMoneyVip_details_name">门票名称</div>
                <div class="checkMoneyVip_details_type">门票类型</div>
                <div class="checkMoneyVip_details_money">门票价值</div>
                <div class="checkMoneyVip_details_time" style="border-right: 1px solid #DEEDFF;">有效日期</div>
                <div class="checkMoneyVip_details_time">操作</div>
              </div>
              <ul class="checkMoneyVip_details_content">
                <li class="checkMoneyVip_details_nameList checkMoneyVip_details_nameList1" v-for="(value,index) in mealInformation.user_ticket">
                  <div class="checkMoneyVip_details_id">{{value.ticket_num}}</div>
                  <div class="checkMoneyVip_details_name">{{value.ticket_name}}</div>
                  <div class="checkMoneyVip_details_type">{{value.type}}</div>
                  <div class="checkMoneyVip_details_money">{{value.ticket_money}}</div>
                  <div class="checkMoneyVip_details_time" style="border-right: 1px solid #DEEDFF;">{{value.end_time}}</div>
                    <div class="checkMoneyVip_details_time"><div class="print" @click="printTicket(value.ticket_key)" v-if="mealInformation!='' && mealInformation.status == '1'">打印</div><div v-else>不可打印</div></div>
                </li>
              </ul>
            </div>

          </div>
        </vue-scroll>
      </div>
    </div>
      <printWebView v-if="printWebView_show"></printWebView>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';
import printWebView from '@/components/printWebView.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
  export default {
    name: 'landing-page',
    components: { readCard,printWebView ,vueScroll},
    data(){
      return {
        webShows:"",
        webSrcs:"",
        status:"",
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
    computed: {
      mealInformation(){
        return this.$store.state.basic.mealInformation
      },
        printWebView_show(){
            return this.$store.state.together.printWebView_show
        }
    },
    methods:{
      async printInformation(){
          //打印卡信息
          let baseUrl=await this.$baseFunction.getFileData()
         let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
          this.$store.dispatch('setPrintSrc',`${this.$store.state.basic.domainUrl}/printMemberInfo?user_token=${userToken}&card_num=${this.mealInformation.card_num}`)
          this.$store.dispatch('setPrintWebView_show',true)
      },
      async printTicket(value){
          this.$store.dispatch('setPrintSrc',`${this.$store.state.basic.domainUrl}/printTicketOne?ticket_key=${value}`)
          this.$store.dispatch('setPrintWebView_show',true)
      },
    },
    mounted(){
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    }
  }
</script>

<style scoped>
#checkMoneyVip{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.checkMoneyVip_content{background-color: #fff;margin:20px 0px 0px 30px;height: 100%;overflow-y: hidden;display: flex;flex-direction: column;}
.checkMoneyVip_container{flex:1;overflow-y: hidden;}
.checkMoneyVip_wrap{padding-bottom: 30px;}
.checkMoneyVip_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;line-height: 60px;text-indent: 10px;margin-bottom: 20px;display: flex; justify-content:space-between;}
#checkMoneyVip .print{width: 100px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px auto;text-indent: 0px;cursor: pointer;}

.checkMoneyVip_content_ul{margin:0px 40px 20px 40px;display: flex;height: 200px;justify-content: space-around;}
.checkMoneyVip_content_ul li{width: 240px;height: 200px;background: #FFF6E6;border-radius: 6px;margin-right: 10px;color: #F5A623;}
.checkMoneyVip_content_ul li:nth-of-type(4){margin-right: 0px;color: #09BB07;}
.checkMoneyVip_content_name{width: 100%;height: 50px;font-size: 18px;color: #303039;line-height: 50px;}
.checkMoneyVip_content_ul li:nth-of-type(2){color: #9013FE;}
.checkMoneyVip_content_name img{width: 50px;height: 50px;margin:0px 0px 0px 10px;vertical-align: middle;}
.checkMoneyVip_content_money{height: 112px;margin: 7px auto;line-height: 112px;font-size: 50px;text-align: center;}
.checkMoneyVip_content_money span{font-size: 34px;}
.checkMoneyVip_content_time{float: right;line-height: 20px;font-size: 14px;margin-right: 15px;}
.checkMoneyVip_content_details{margin:20px 40px 0px 40px;background: #F4F9FF;border-radius: 6px 6px 0px 0px;display: flex;flex-direction: column;flex: 1;}
.checkMoneyVip_details_content{flex: 1;}
.checkMoneyVip_details_title{height:60px;background: #DEEDFF;border-radius: 6px 6px 0px 0px;display: flex;font-size: 18px;color: #303039;line-height: 60px;display: flex; justify-content:space-between;}
.checkMoneyVip_details_title img{width: 40px;height: 40px;margin:10px;}
.checkMoneyVip_details_title span{color: #3081e0}
.checkMoneyVip_details_nameList{height: 60px;display: flex;font-size: 18px;color: #303039;justify-content: space-around;}
.checkMoneyVip_details_nameList div{line-height: 60px;text-align:center;height: 100%;border-right: 1px solid #DEEDFF;border-bottom: 1px solid #DEEDFF;}
.checkMoneyVip_details_nameList1{height:50px;font-size: 14px;color: #0D6BDA;}
.checkMoneyVip_details_nameList1 div{line-height:50px;}
.checkMoneyVip_details_id{width: 19.9%;}
.checkMoneyVip_details_name{width: 26.8%;}
.checkMoneyVip_details_type{width: 13%;}
.checkMoneyVip_details_money{width: 15%;}
.checkMoneyVip_details_nameList .checkMoneyVip_details_time{width: 25.3%;border-right: 0px;}
.checkMoneyVip_details_wrap{width: 100%;height: 100%;}
.checkMoneyVip_details_wrap ul{width: 100%;}
@media screen and (max-width: 1025px) {
  .checkMoneyVip_content_ul li{width: 170px;}
  .checkMoneyVip_content_ul{margin: 0px 10px 20px 10px}
  .checkMoneyVip_content_money{font-size: 40px;}
}
</style>
