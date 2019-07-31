<template>
  <div id="wrapper">
    <transition name="fade">
      <div class="left" v-if="show1">
        <div class="left_title">
          <img src="http://file.rzkeji.com/web/wanxiang/icon/logo.png"/>
          <span class="title_details">
            <div>{{sellerName}}</div>
            <div class="drag">
              <Dropdown trigger="click" style="width:100%;height:100%;" @on-click="selectMenu" class="drag">
                <a href="javascript:void(0)" style="color:#fff;line-height:40px;margin-left:15px;font-size:16px;">
                    {{banData.username}}
                    <Icon type="ios-arrow-down" style="top:12px;"></Icon>
                </a>
                <DropdownMenu slot="list" class="drag">
                    <DropdownItem name="cancellation" class="drag">切换用户</DropdownItem>
                    <DropdownItem name="close" class="drag">下班打卡</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </span>
        </div>
        <div class="left-pos-info">
          <span>收银机：{{user_login_info.cash_register_name}}</span>
          <span>班次：{{user_login_info.work_classes_name}}</span>
        </div>
        <ul class="left_content drag">
          <li @click="select('0')" :class="{select_Color:selectIndex=='0'}">
            <router-link to="/index/basic/buyCoins">
              <img :src="selectIndex=='0'? 'http://file.rzkeji.com/web/wanxiang/icon/basicImg1.png':'http://file.rzkeji.com/web/wanxiang/icon/basicImg.png'"/>
              <span>日常业务</span>
            </router-link>
          </li>
          <li @click="select('1')" :class="{select_Color:selectIndex=='1'}">
            <router-link to="/index/card/applyCard">
              <img :src="selectIndex=='1'? 'http://file.rzkeji.com/web/wanxiang/icon/cardImg1.png':'http://file.rzkeji.com/web/wanxiang/icon/cardImg.png'"/>
              <span>卡业务</span>
            </router-link>
          </li>
          <li @click="select('2')" :class="{select_Color:selectIndex=='2'}">
            <router-link to="/index/vip/admissionVip">
              <img :src="selectIndex=='2'? 'http://file.rzkeji.com/web/wanxiang/icon/vipImg1.png':'http://file.rzkeji.com/web/wanxiang/icon/vipImg.png'"/>
              <span>会员管理</span>
            </router-link>
          </li>
          <li @click="select('4')" :class="{select_Color:selectIndex=='4'}">
            <router-link to="/index/special/specialDetails">
              <img :src="selectIndex=='4'? 'http://file.rzkeji.com/web/wanxiang/icon/cao1.png':'http://file.rzkeji.com/web/wanxiang/icon/cao.png'"/>
              <span>特殊操作</span>
            </router-link>
          </li>
          <li @click="select('5')" :class="{select_Color:selectIndex=='5'}">
            <router-link to="/index/checkOut/entryCheckOut">
              <img :src="selectIndex=='5'? 'http://file.rzkeji.com/web/wanxiang/icon/integralImg1.png':'http://file.rzkeji.com/web/wanxiang/icon/integralImg.png'"/>
              <span>营业结账</span>
            </router-link>
          </li>
          <li @click="select('6')" :class="{select_Color:selectIndex=='6'}">
            <router-link to="/index/order/orderCheckOut">
              <img :src="selectIndex=='6'? 'http://file.rzkeji.com/web/wanxiang/icon/orderSelect.png':'http://file.rzkeji.com/web/wanxiang/icon/order.png'"/>
              <span>综合查询</span>
            </router-link>
          </li>
        </ul>
        <div style="text-align: center">
          <div class="showBi drag" style="bottom:80px;cursor:pointer" @click="showPrintType('money')"><div style="width:100px;">收银打印机:</div><span style="color:#803d24;flex:1;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{moneyPrint}}</span></div>
          <div class="showBi drag" style="bottom:40px;cursor:pointer"  @click="showPrintType('ticket')"><div style="width:100px;">门票打印机:</div><span style="color:#803d24;flex:1;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{ticketPrint}}</span></div>
          <div class="showBi"><div style="width:100px;">出币机(状态):</div><span style="color:#803d24;flex:1;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{showMessage}}</span></div>
        </div>
      </div>
    </transition>
    <div style="width:30px;height:100%;background-color:#2F82E4;font-size:20px;position:relative;" class="drag" @click="show">
      <div style="position:absolute;left:0px;top:50%;color:#fff;cursor: pointer;">{{show1 ?'<<':'>>'}}</div>
    </div>
    <div class="right drag">
      <router-view></router-view>
    </div>
    <startWork v-if="startWorkShow"></startWork>
    <endWork v-if="endWorkShow"></endWork>
    <messageBox v-if="messageBoxShow"></messageBox>
    <print v-if="printShow"></print>
    <printType v-if="printTypeShow"></printType>
    <printTicket v-if="printTicketShow"></printTicket>
    <printTicket1 v-if="printTicketShow1"></printTicket1>
    <informationBox v-if="informationBoxShow"></informationBox>
    <duihuanBox v-if="duihuanBoxShow"></duihuanBox>
    <authorization v-if="authorization"></authorization>
    <tip v-if="tipShow"></tip>
    <ticketNum v-if="ticketNumShow"></ticketNum>
    <endWorkPrint v-if="endWorkPrint"></endWorkPrint>
  </div>
</template>

<script>
  const path = require('path');
  const fs = require("fs");
  import ticketNum from '@/components/ticketNum.vue';
  import endWorkPrint from '@/components/endWorkPrint.vue';
  import authorization from '@/components/authorization.vue';
  import duihuanBox from '@/components/duihuanBox.vue';
  import messageBox from '@/components/messageBox.vue';
  import startWork from '@/components/startWork.vue';
  import endWork from '@/components/endWork.vue';
  import print from '@/components/print.vue';
  import printType from '@/components/printType.vue';
  import printTicket from '@/components/printTicket.vue';
  import printTicket1 from '@/components/printTicket1.vue';
  import informationBox from '@/components/informationBox.vue';
  import tip from '@/components/tip.vue';
  const {ipcRenderer: ipc} = require('electron');
  const {remote} = require('electron');
  export default {
    name: 'landing-page1',
    data(){
      return {
        selectIndex:"0",
        SellerNum:"",
        userToken:"",
        show1:false,
        showMessage:"未连接",  //提示售币机是否连接成功
        // moneyPrint:"未连接",   //收银机打印机
        // ticketPrint:"未连接",   //门票打印机
        selectPrintType:"",   //判断是选择收银打印机更改还是门票打印机更改
        user_login_info:"",  //用户登录的信息
        sellerName:""   //商家名称
      }
    },
    computed:{
      endWorkPrint(){
        return  this.$store.state.together.endWorkPrint
      },
      ticketNumShow(){
        return  this.$store.state.together.ticketNumShow
      },
      messageBoxShow(){
        return  this.$store.state.together.messageBoxShow
      },
      informationBoxShow(){
        return  this.$store.state.card.informationBoxShow
      },
      duihuanBoxShow(){
        return  this.$store.state.basic.duihuanBoxShow
      },
      authorization(){
        return  this.$store.state.together.authorizationShow
      },
      tipShow(){
        return this.$store.state.together.tipShow
      },
      banData(){
        return this.$store.state.together.banData
      },
      printShow(){
        return this.$store.state.together.printShow
      },
      printTypeShow(){
        return this.$store.state.together.printTypeShow
      },
      startWorkShow(){
          return this.$store.state.together.startWorkShow
      },
      endWorkShow(){
        return this.$store.state.together.endWorkShow
      },
      printTicketShow(){
        return this.$store.state.together.printTicketShow
      },
      printTicketShow1(){
        return this.$store.state.together.printTicketShow1
      },
      printList(){
        return this.$store.state.together.printList
      },
      ticketPrint(){
          let printName = this.$store.state.together.ticketPrint
          if(!printName || printName == ""){
            printName = "设置"
          }
          return this.$store.state.together.ticketPrint
      },
      moneyPrint(){
        let printName = this.$store.state.together.moneyPrint
        if(!printName || printName == ""){
          printName = "设置"
        }
          return this.$store.state.together.moneyPrint
      }
    },
    components: {endWorkPrint,endWork,startWork,messageBox ,duihuanBox ,informationBox ,authorization ,tip ,print ,printTicket ,printTicket1 ,printType,ticketNum},
    methods: {
      showPrintType(type){
          this.$store.dispatch('setSelectPrintTypeShow',type)
          this.$store.dispatch('setPrintTypeShow',true)
      },
      select(value){
        this.selectIndex=value
      },
      show(){
          this.show1=!this.show1
      },
      async setName(){
        let res=await this.$request.getData('/cseller/getSellerInfoByNum',{num:this.SellerNum,user_token:this.userToken})
        if(res.level=='success'){
          this.name=res.data.name
          if(res.data.name != null){
            this.sellerName = res.data.name
          }else {
            this.sellerName = "万象收银系统"
          }
          this.$store.dispatch('setBanData',res.data)
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      },
      async readConfig(){
        let configDir = remote.app.getPath('userData');
        const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
        var _this = this
        fs.exists(newFile_path,  (exists) =>{
          if (!exists) {
            _this.setDomain()
            return;
          } else {
            let getInfo = fs.readFileSync(newFile_path)
            if(getInfo == ""){
              _this.setDomain()
            }else {
              let result = JSON.parse(getInfo);
              if(result.domain == "" || result.num == ""){
                _this.setDomain()
              }else {
                _this.SellerNum = result.num;
                _this.$store.dispatch('setMoneyPrint',result.moneyPrint)
                _this.$store.dispatch('setTicketPrint',result.ticketPrint)
                _this.$store.dispatch('setDomainUrl',result.domain)
                _this.$store.dispatch('setSellerNum',result.num)
                _this.$store.dispatch('setResgiters_id',result.resgiters_id)
                _this.$store.dispatch('setWork_class_name',result.resgiters_id)
                _this.setName();
              }
            }
          }
        });
      },
      async selectMenu(value){
        if(value=='close'){
          let baseUrl=await this.$baseFunction.getFileData()
          let work_record_idCookie=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
          let res=await this.$request.postData('/setWorkEndTime',{work_record_id:work_record_idCookie,user_token:this.userToken})
        }
        ipc.send(value);
      }
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
      this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
      let res=await this.$request.getData('/special/hasStartWork',{user_token:this.userToken})
      if(res.level == "success"){
          if(res.data != false && res.data != "false"){
              this.$store.dispatch('setStartWorkShow',false)
          }else {
              this.$store.dispatch('setStartWorkShow',true)
          }
      }

      let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
      this.user_login_info=JSON.parse(user_login_info)

      this.readConfig();
      ipc.on('asynchronous-reply', (event, arg) => {
        console.log(arg) 
      })
    },
     created(){
         ipc.on('link_status', (event, arg) => {
            this.showMessage=arg
         })
    }
  }
</script>

<style>
#wrapper{width: 100%;height: 100%;display: flex;}
.left{height: 100%;background-color:  #3B89E5;position: relative;}
.right{height: 100%;flex:1; background-color: #efeff4;display: flex;flex-direction:column;}
.left_title{width: 100%;height: 80px;display: flex;justify-content: row;background-color: rgba(255,255,255,0.05);}
.left_title img{width: 50px;height: 50px;margin:15px 10px 0px 20px;vertical-align: middle;}
.title_details{margin-top: 15px;flex: 1;}
.title_details div{max-width: 142px;width: 100%;font-size: 15px;color: #fff;line-height: 25px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
.title_details>div:nth-of-type(2){font-size: 16px;width:100px;display: flex;align-items: center;line-height: 30px;height: 40px;overflow:hidden;}
.left-pos-info{margin-top: 10px;text-align: center;color: white}
.left-pos-info span{padding: 5px}
.left_content{width: 100%;margin-top: 40px;font-size: 18px;}
.left_content li{width: 100%;height:68px;}
.left_content li.select_Color{background-color: #0D6BDA;}
.left_content li.select_Color+li a{border-top:0px}
.left_content li.select_Color a{border-top:0px;font-weight: 600;}
.left_content li:nth-last-of-type(1).select_Color a{border-bottom:0px;}
.left_content li.lats_color:nth-last-of-type(1) a{border-bottom:0px}
.left_content li a{width: 220px;height: 100%;display: block;display: flex;justify-content: row;text-decoration: none;font-size: 18px;color: #FFFFFF;border-top: 1px solid #5699e8;}
.left_content li:nth-of-type(1) a{border-top: 0px;}
.left_content li:nth-last-of-type(1) a{border-bottom: 1px solid #5699e8;}
.left_content li img{width: 40px;height: 40px;margin:14px 14px 0px 20px;}
.left_content li span{display: block;height: 68px;line-height: 68px;}
.showBi{position: absolute;left: 0px;bottom: 0px;width: 100%;height: 50px;line-height: 50px;font-size: 15px;color: #fff;display: flex;justify-content: space-between;width: 100%;}
.fade-enter-active, .fade-leave-active {
  transition: all linear 0.5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
  width: 0px;
}
.fade-enter-to, .fade-leave{
  opacity: 1;
  width: 200px;
}
</style>
