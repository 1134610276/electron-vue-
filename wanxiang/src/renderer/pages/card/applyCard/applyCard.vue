<template>
  <div id="applyCard">
      <div class="content_left">
        <ul class="content_classify clearfloat">
          <li :class="{select:selectIndex==value.type}" @click="select(value.type,value.id)" v-for="(value,index) in cardClassify" :key="index">{{value.name}}</li>
        </ul>
        <div class="content_select" >
          <div class="content_wrap" ref="left">
            <vue-scroll :ops="ops">
              <ul>
                <li @click="selectData(value)" v-for="(value,index) in getCardList" :class="{select:selectListId==value.id}" :key="index">
                  <div>{{value.name}}</div>
                  <div>{{value.amount_money}}元</div>
                  <div>{{value.coin}}币</div>
                  <div>{{value.ssn_num}}</div>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </div>
      </div>
      <div class="content_right1">
        <div class="content_title">卡说明</div>
        <ul class="card_details">
          <li>
            <div>卡级别</div>
            <div>{{cardDetails==""?'':cardDetails.name}}</div>
          </li>
          <li>
            <div>金额</div>
            <div>{{cardDetails==""?'':`${cardDetails.amount_money}元` }}</div>
          </li>
          <li>
            <div>办卡费</div>
            <div>{{cardDetails==""?'':`${cardDetails.deposit}元`}}</div>
          </li>
          <li>
            <div>币数</div>
            <div>{{cardDetails==""?'':`${cardDetails.coin}币`}}</div>
          </li>
          <li>
            <div>编号</div>
            <div>{{cardDetails==""?'':cardDetails.ssn_num}}</div>
          </li>
          <li>
            <div>预存余额</div>
            <div>{{cardDetails==""?'':cardDetails.money}}</div>
          </li>
          <li style="height:130px">
            <div>描述</div>
            <div style="height:100px;">{{cardDetails==""?'':cardDetails.desc}}</div>
          </li>
        </ul>
        <div class="card_btn" @click="buyCard">购卡</div>
        <Modal
              v-model="modal1"
              :mask="true"
              :transition-names="['ease','ease']"
              @on-ok="accessConfirm"
              @on-cancel="accessCancel">
        <p slot="header" style="color:#f60;text-align:center">
          <span>请输入授权密码</span>
        </p>
        <input type="text" placehoder="请输入授权密码" style="height:30px;width:300px;">
      </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    data(){
      return {
        selectIndex:"",
        cardClassify:"",
        userToken:"",
        getCardList:"",
        selectListId:"",
        cardDetails:"",
        select_goods_id:"",
        ops:{
          vuescroll:{
            detectResize:true
          },
          scrollPanel:{},
          rail:{},
          bar:{background: '#3B89E5',}
        },
        modal1:false,
        modalOk:''
      }
    },
    components: { Titlebtn ,vueScroll},
    watch: {
      modalOk(nval){
        if(nval==true){
          this.showBuyCard()
        }
      }
    },
    methods: {
      selectData(value){
        this.selectListId=value.id;
        this.cardDetails=value
      },
      select(value,id){
        this.selectIndex=value
        this.getCardData(value)
      },
      async getCardClassify(){
        let res=await this.$request.getData('/goods/getTranCardClassify',{user_token:this.userToken})
        this.cardClassify=res.data
        this.selectIndex=res.data[0].type
        this.getCardData(res.data[0].type)
      },
      async getCardData(type){
        let res=await this.$request.getData('/goods/getGoodsProductList',{user_token:this.userToken,type:type})
        this.getCardList=res.data;
      },
      buyCard(){
        // if(this.cardDetails!=''){
        //     this.modal1=true
        // }
        this.modalOk=true
      },
      async showBuyCard(){
        this.modalOk=false
        this.$store.dispatch('setMessageBoxTag','')
        let tag
        this.$store.dispatch('setMessageBoxTag','card')
          let cardId=ipcRenderer.sendSync('synchronous-message')
          // let cardId="210150074760"
          tag=this.selectIndex=='member_card'?'vip':'linshi'
          this.$store.dispatch('setType',tag)
          this.$store.dispatch('setIsdoka',true)
          this.$store.dispatch('setSelectData1',this.cardDetails)
          this.$store.dispatch('setGoodsId',this.selectListId)
          if(this.selectIndex!='member_card'){
            this.$store.dispatch('setMessageBoxShow',true)
            this.$store.dispatch('setMealInformation',{'card_num':cardId})
          }else{
            this.$store.dispatch('setInformationBoxShow',true)
            let res=await this.$baseFunction.getCardNumber(cardId)
            this.$store.dispatch('setMealInformation',res.level=='success'?res.data:"")
            this.$store.dispatch('setIsdoka',false)
          }
          if(tag!='vip'){
            this.$baseFunction.order(this,'',this.$store.state.basic.mealInformation.card_num,this.cardDetails.goods_key)
          }

      },
      accessConfirm(){
        //确认权限
         this.modalOk=true
         },
      accessCancel(){
         this.modalOk=false
         }
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
      this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
      this.getCardClassify()
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
      this.$store.dispatch('setMealInformation','')
    }
  }
</script>

<style scoped>
#applyCard{width:100%;height:100%;background-color: #efeff4;display: flex;justify-content: row;}
.content_left{flex:1;margin:0px 10px 0px 30px;display: flex;flex-direction:column;}
.content_classify{width: 100%;height: 60px;display: flex;justify-content: row;margin-top: 30px;}
.content_classify li{width: 130px;height: 60px;background: #E3E3EA;font-size: 18px;color: #5F5F68;text-align: center;line-height: 60px;float: left;cursor: pointer;margin-left: 2px;}
.content_classify li.select{background:#fff;}
.content_classify li:nth-of-type(1){border-radius: 6px 0px 0px 0px;}
.content_classify li:nth-last-of-type(1){border-radius: 0px 6px 0px 0px;}
.content_select{width: 100%;background-color: #fff;flex: 1;position: relative;}
.content_wrap{width: 100%;height: 100%;overflow-y: hidden;position: absolute;left: 0;top: 0;}
.content_select ul{width: 100%;display: flex;justify-content:row;flex-wrap:wrap;margin-top: 10px;padding-bottom: 30px;}
.content_select ul li{max-width:220px;max-height:150px;width: 220px;height: 150px;background-color: #5CA7FF;border-radius: 7px;padding:3px 10px;cursor: pointer;}
.content_select ul li.select{border:4px solid #0D6BDA;width: 228px;height: 150px;}
@media screen and (max-width: 1366px) {
   .content_select ul li{margin: 10px 0px 0px 26px;}
}
@media screen and (min-width:1366px) and (max-width:1920px){
  .content_select ul li{margin: 10px 0px 0px 25px;}
}
@media screen and (min-width:1920px) {
  .content_select ul li{margin: 10px 0px 0px 40px;}
}
.content_select ul li div{width: 100%;color: #FFFFFF;line-height: 28px;font-size: 20px;}
.content_select ul li div:nth-of-type(2),.content_select ul li div:nth-of-type(3){text-align: right;}
.content_select ul li div:nth-of-type(2){font-size: 40px;line-height: 56px;}
.content_right1{width: 276px;height: 100%;margin: 0px 30px 0px 20px; background-color: #fff;position: relative;}
.content_title{width: 100%;height: 60px;background: #F8F8FB;border-radius: 6px 6px 0px 0px;line-height: 60px;text-indent: 15px;font-size: 18px;color: #5F5F68;}
.card_details{width: 100%;margin-top: 20px;}
.card_details li{width: 100%;height: 64px;}
.card_details li div{width: 100%;}
.card_details li div:nth-of-type(1){line-height: 24px;font-size: 14px;color: #8E8E93;text-indent:18px;}
.card_details li div:nth-of-type(2){width:232px;height:40px;line-height: 40px;font-size: 16px;color: #303039;background: #F8F8FB;border: 1px solid #EFEFF4;border-radius: 4px;text-indent:10px;margin-left:22px;}
.card_btn{width: 236px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;
color: #FFFFFF;text-align: center;line-height: 50px;position: absolute;left: 50%;margin-left: -118px;bottom: 50px;cursor: pointer;}
</style>
