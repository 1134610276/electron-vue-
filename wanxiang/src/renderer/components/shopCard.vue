<template>
  <div  class="shopCard">
    <div class="exchange_right">
      <div class="exchange_title" ><Icon type="md-cart" /> 总金额: <span style="color: #E86F69;">{{cardLength}}</span>  <div class="shopCard_total" @click="shopCard_total">结算</div></div>
      <div class="shopCard_container">
        <div class="shopCard_wrap">
          <vue-scroll :ops="ops">
          <ul class="exchange_details drag">
            <li v-for="(value,index) in cardList">
              <img :src="value.goods_thumb_url"/>
              <div class="shopCar_wrap">
                <div class="shopCar_title">{{value.goods_product.name}}<span v-if="value.goods_product.type!='entity_coin'">({{value.goods_product.type=='ticket'? value.goods_product.ticket_rule.name:value.goods_product.desc}})</span></div>
                <div class="shopCar_number" v-if="type!='duihuan'">
                  ￥{{value.goods_product.amount_money}}
                  <span v-if="value.goods_product.type=='entity_coin'">元{{value.goods_product.coin}}币({{value.goods_product.desc}})</span>  
                  <span v-if="value.goods_product.type=='physical_commodity'">/{{value.goods_product.amount_coin}}币 </span>
                  <span v-if="value.goods_product.type=='ticket'">元</span>
                </div>
                <div class="shopCar_number" v-else>
                  {{value.goods_product.amount_integral}}积分/{{value.goods_product.amount_win_ticket}}奖票
                </div>
              </div>
              <div class="shopCar_add">
                <div @click="getCard(value.goods_key,'reduce')">-</div>
                <div>{{value.num}}</div>
                <div @click="getCard(value.goods_key,'add')">+</div>
              </div>
            </li>
          </ul>
          </vue-scroll>
        </div>
      </div>
      <img src="http://file.rzkeji.com/web/wanxiang/icon/kongCard.png" class="kongCardImg" v-if="cardList.length==0"/>
      <div class="shopBtn">
        <div class="clearCard" v-if="cardList.length!=0" @click="clearCard">清空购物车</div>
        <div style="margin-top:40px;color:red;text-align: center">扫描条形码请点击输入框</div>
        <div class="saoInput" style="display:flex;margin-left:20px;">
          <input class="saoInput" v-model="code" @keyup.enter="checkGood"/>
         <!--  <div style="width:70px;height:30px;line-height:30px;text-align:center;border-radius:6px;cursor:pointer;background-color:#3B89E5;font-size:16px;margin-left:10px;color:#fff;" @click="checkGood">搜索</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const {ipcRenderer} = require('electron')
const {ipcRenderer: ipc} = require('electron');
// import BScroll from 'better-scroll'
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
export default {
    name: 'shopCard',
  components: {vueScroll},
    data(){
        return {
          code:"",
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
      type(){
        return this.$store.state.basic.type
      },
      cardList(){ 
        return this.$store.state.basic.shopCard
      },
      cart_num(){
        return this.$store.state.basic.cart_num
      },
      cardLength(){
        let total=0
        for(let [index,value] of this.cardList.entries()){
          if(this.type!='duihuan'){
            total+=parseFloat(value.amount)
          }else{
            total+=parseFloat(value.amount_integral)
          }
        }
        if(this.type!='duihuan'){
            return '￥'+total
          }else{
            return total+'积分'
          }
      },
      cart_num(){
        return this.$store.state.basic.cart_num
      },
    },
    methods: {
      async getCard(value,type){
        let number=type=='add'?1:-1
        let baseUrl=await this.$baseFunction.getFileData()
        let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
        this.addCard(value,number)
      },
      async shopCard_total(){
        if(this.cardList!=''){
          let cardId=ipcRenderer.sendSync('synchronous-message')
          let res=await this.$baseFunction.getCardNumber(cardId)
          this.$store.dispatch('setMealInformation',res.level=='success'?res.data:"")
          if(this.$store.state.basic.type=='duihuan'){
            let tag=this.$store.state.basic.mealInformation==''?true:false
            this.$store.dispatch('setIsdoka',tag)
            let card_num=!tag ? this.$store.state.basic.mealInformation.card_num:''
            this.$baseFunction.order(this,this.$store.state.basic.cart_num,card_num)
            this.$store.dispatch('setDuihuanBoxShow',true)
          }else{
            this.$store.dispatch('setType','shopCard')
            this.$store.dispatch('setIsdoka',res.level=='success'?false:true)
            this.$store.dispatch('setMessageBoxTag','card')
            this.$store.dispatch('setHuiyuanTag','huiyantag')
            this.$store.dispatch('setMessageBoxShow',true)
            this.$baseFunction.order(this,this.$store.state.basic.cart_num,res.level=='success'?res.data.card_num:"")
          }
        }
        // console.log(this.$store.state.basic.type,888888)
      },
      clearCard(){
        this.$store.dispatch('setCart_num','');
        this.$store.dispatch('setShopCard',[])
        ipc.send('clear');
      },
      async addCard(goods_key,number){
        let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
        let res=await this.$request.postData('/goods/saveShopCart',{cart_num:this.cart_num,goods_key:goods_key,num:number})
        let shopData=await this.$request.getData('/goods/getShopCartList',{cart_num:this.cart_num})
        if(res.level=='error'){
          this.$baseFunction.showTotals(this,res.message)
        }
        if(shopData.count.amount != null){
          ipc.send('orderInformation',shopData);
        }else {
          ipc.send('clear');
        }
        this.$store.dispatch('setShopCard',shopData.data)
        this.code=''
      },
      async checkGood(){
        var outTradeNo=""; 
        if(this.cart_num==''){
          for(var i=0;i<6;i++) //6位随机数，用以加在时间戳后面。
          {
            outTradeNo += Math.floor(Math.random()*10);
          }
          outTradeNo = new Date().getTime() + outTradeNo;
          this.$store.dispatch('setCart_num',outTradeNo)
        }
        this.addCard(this.code,1)
      }
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
    
<style>
.shopCard {width: 340px;height: 100%;-webkit-app-region: no-drag;margin-right: 5px;display: flex;justify-content: row;}
.shopCard_total{width: 100px;height: 40px;background: #E86F69;border-radius: 6px;position: absolute;right: 10px;top: 10px;line-height: 40px;color: #fff;text-indent:30px;cursor: pointer;}
.exchange_right{width: 340px;height: 100%;background-color: #fff;position: relative;display: flex;flex-direction: column;}
.exchange_title{width: 100%;height: 60px;border-radius: 6px 6px 0px 0px;line-height: 60px;text-indent: 15px;border:1px solid  #EFEFF4;position: relative;font-size: 18px;color: #5F5F68;}
.exchange_details{width: 100%;padding-bottom: 130px;}
.shopCard_container{width: 100%;flex:1;overflow-y: hidden;}
.shopCard_wrap{width: 100%;height: 100%;}
.exchange_details li{width: 100%;height: 80px;display: flex;justify-content: row;border-bottom: 1px solid #EFEFF4;}
.exchange_details li img{width: 60px;height: 60px;margin: 10px;}
.shopCar_wrap{width:152px;height: 60px;display:flex; flex-direction:column;margin: 10px 0px;}
.shopCar_title{font-size: 14px;color: #5F5F68;line-height: 30px;height: 30px;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;}
.shopCar_number{font-size: 14px;color: #5F5F68;line-height: 30px;height: 30px;text-overflow:ellipsis;white-space: nowrap;overflow: hidden;}
.shopCar_add{width: 90px;height: 30px;background: #FFFFFF;border: 1px solid #B3D6FF;border-radius: 4px;display: flex;margin:15px 10px;}
.shopCar_add div{width: 30px;height: 30px;font-size: 16px;color: #303039;line-height: 30px;text-align: center;}
.shopCar_add div:nth-of-type(1),.shopCar_add div:nth-of-type(3){background: #B3D6FF;border-radius: 4px 0px 0px 4px;color: #fff;font-size: 25px;cursor: pointer;}
.shopCar_add div:nth-of-type(3){border-radius: 0px 4px 4px 0px;}
.kongCardImg{position: absolute;left: 50%;top: 50%;margin-left: -90px;margin-top: -90px;}
.clearCard{width: 100px;height: 30px;background-color: #D6D6DD;border-radius: 6px;text-align: center;line-height: 30px;font-size: 14px;position: absolute;bottom: 60px;right: 30px;cursor: pointer;}
.saoInput{width: 300px;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #8E8E93;height: 30px;}
.shopBtn{width: 340px;height: 100px;position:absolute;right: 0;bottom: 0;background-color: #fff;}
</style>