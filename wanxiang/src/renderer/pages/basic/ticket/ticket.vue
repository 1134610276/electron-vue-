<template>
  <div id="ticket">
    <div class="ticket_list">
      <!-- <ul class="ticket_list_classify clearfloat drag">
        <li :class="{select:selectIndex=='1'}" @click="select('1')">虚票</li>
        <li :class="{select:selectIndex=='0'}" @click="select('0')">实票</li>
      </ul> -->
      <div class='ticket_list_container'>
      <div class="ticket_wrap" >
        <div class="ticket_scroll">
          <vue-scroll :ops="ops">
          <ul class="ticket_type">
            <li v-for="(value,index) in dataList" >
              <div class="type_title">{{value.name}}</div>
              <ul class="type_list drag">
                <li :class="{select:ticketId==ticket.id?true:false}" v-for="(ticket,index2) in value.ticket" @click="selectData(ticket)">
                  <div class="list_left">
                    <!--<img src="http://file.rzkeji.com/web/wanxiang/icon/shiTicket.png" class="ticket_list_type" v-if="selectIndex=='0'"/>-->
                    <div class="content_top" :title="ticket.name">{{ticket.name}}</div>
                    <div class="content_center">（{{ticket.ticket_rule.type}}）</div>
                    <div class="content_bottom">{{ticket.ssn_num}}</div>
                  </div>
                  <div class="list_right">
                    <div class="content_top">{{ticket.amount_money}}</div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          </vue-scroll>
        </div>
        <coinsFooter type="ticket"><span slot="footer_title">门票费用：</span><span slot="footer_btn">购票</span></coinsFooter>
      </div>
      </div>
    </div>
    <div class="ticket_right"><shopCard></shopCard></div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import coinsFooter from '@/components/coinsFooter.vue';
import shopCard from '@/components/shopCard.vue';
// import BScroll from 'better-scroll'
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

  export default {
    name: 'setMeal',
    components: { Titlebtn , coinsFooter ,shopCard,vueScroll},
    data(){
      return {
        dataList:"",
        ticketId:"",
        selectIndex:"0",
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
    methods: {
      select(value){  //点击商品分类导航执行切换
        this.selectIndex=value;
        this.getDataList(this.selectIndex);
      },
      async getDataList(type){
       let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
        let res=await this.$request.getData('/ticket/get-ticket-list',{user_token:userToken,ticket_type:type})
        this.dataList=res.data;
        console.log(this.dataList)
      },
      selectData(value){
        this.ticketId=value.id;
        this.$store.dispatch('setSelectData1',value)
      }
    },
    mounted(){
      this.getDataList('0');
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
      this.$store.dispatch('setSelectData1','')
    }
  }
</script>

<style scoped>
#ticket{width:100%;height:100%;background-color: #efeff4;display: flex;position: relative;margin-left:20px;}
.ticket_list{flex:1;display: flex;flex-direction: column;}
.ticket_list_classify{width: 100%;height: 60px;display: flex;justify-content: row;margin-top: 20px}
.ticket_list_classify li{width: 130px;height: 60px;background: #E3E3EA;font-size: 18px;color: #5F5F68;text-align: center;line-height: 60px;float: left;cursor: pointer;}
.ticket_list_classify li.select{background:#fff;}
.ticket_list_container{display:flex;flex:1;overflow-y: hidden;}
.ticket_list_classify li:nth-of-type(1){border-radius: 6px 0px 0px 0px;}
.ticket_list_classify li:nth-last-of-type(1){border-radius: 0px 6px 0px 0px;}
.ticket_wrap{flex: 1;height: 100%;display: flex;flex-direction: column;background-color: #fff;}
.ticket_scroll{width: 100%;display: flex;flex-direction: column;flex: 1}
.ticket_right{width: 340px;height: 100%;margin-left:20px;}
.ticket_type>li{padding-bottom: 30px;border-bottom:2px solid #E3E3EB;}
.ticket_type>li:nth-of-type(1){margin-top: 28px;}
.type_title{width: 100%;font-size: 18px;color: #5F5F68;text-indent: 5px;line-height: 35px;margin-top: 10px;}
.type_list{width: 100%;display: flex;justify-content: row;flex-wrap:wrap;}
.type_list li{width: 266px;height:166px;background-image: url('http://file.rzkeji.com/web/wanxiang/icon/ticket.png');background-size: 250px 150px;display: flex;margin: 0px 15px 15px 0px;cursor: pointer;
padding: 8px;background-repeat: no-repeat;background-position: 8px}
.type_list li.select{border: 2px solid #0D6BDA;background-image: url('http://file.rzkeji.com/web/wanxiang/icon/ticket1.png');}
.list_left{width:150px;height: 150px;position: relative;}
.list_left div{text-align: center;color: #FFFFFF;}
.list_left .content_top{margin-top: 18px;font-size: 28px;height: 42px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.list_left .content_center{font-size: 22px;}
.list_left .content_bottom{font-size: 18px;color: #0D6BDA;}
.list_right{flex:1;height: 150px;}
.list_right div{text-align: center;color: #FFFFFF;}
.list_right .content_top{margin-top: 18px;font-size: 26px;margin-top: 50px}
.list_right .content_center{font-size: 18px;color: #0D6BDA;}
.list_right .content_bottom{font-size: 12px;margin-top: 35px;}
.ticket_list_type{width: 30px;height: 18px;position: absolute;left: 10px;top: -1px;}
</style>
