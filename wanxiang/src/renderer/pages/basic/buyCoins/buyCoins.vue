<template>
  <div id="buyCoins">
      <div class="buyCoins_wrap drag">
        <div class="buyCoins_left">
          <div class="coins_header">
            <div class="coins_title"><b>自定义购币</b></div>
            <div class="header_details">
              <div class="coins_money">
                <input v-model="money" placeholder="输入金额" class="money" @keyup.enter="enter" @blur="enter"/>
                <div>元/币</div>
              </div>
              <div>送</div>
              <div class="coins_number">
                <div class="number">{{coins_number}}</div>
                <div>币</div>
              </div>
            </div>
            <div class="coins_title"><b>提币</b></div>
            <div class="header_details">
              <div class="coins_money">
                <input v-model="coinNumber" placeholder="输入币数" class="money" />
                <div>虚币</div>
              </div>
              <div class="tibi" @click="tibi">提币</div>
            </div>
          </div>
          <div class="coins_meal">
            <div class="meal_title">常规购币套餐</div>
            <div class="meal_container">
              <div class="meal_wrap" ref="left">
                <vue-scroll :ops="ops">
                  <coinsDetails :coninsData="coninsData" typeTitle="常规购币"></coinsDetails>
                </vue-scroll>
              </div>
            </div>
          </div>
          <div class="coins_footer">
            <coinsFooter type="bi"><span slot="footer_title">套餐明细：</span><span slot="footer_btn">实币购币</span></coinsFooter>
          </div>
        </div>
        <div class="buyCoins_right"><shopCard></shopCard></div>

        <Modal
                v-model="modal1"
                :mask="true"
                :transition-names="['ease','ease']"
                @on-ok="accessConfirm"
                @on-cancel="accessCancel">
          <p slot="header" style="color:#f60;text-align:center">
            <span>出币失败</span>
          </p>
          <div>币不足,请装入硬币后，确定是否继续出币？还需出{{out_coin}}币！</div>
        </Modal>
      </div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import coinsFooter from '@/components/coinsFooter.vue';
import coinsDetails from '@/components/coinsDetails.vue';
import shopCard from '@/components/shopCard.vue';
import vueScroll from 'vuescroll';

import 'vuescroll/dist/vuescroll.css';
const {ipcRenderer: ipc} = require('electron');

const {ipcRenderer} = require('electron')
  export default {
    name: 'landing-page',
    components: { Titlebtn , coinsFooter , coinsDetails ,shopCard,vueScroll},
    data(){
      return {
        money:"",
        coninsData:"",
        userToken:"",
        coins_number:"",
        coinNumber:"",
        ops:{
          vuescroll:{
            detectResize:true
          },
          scrollPanel:{},
          rail:{},
          bar:{background: '#3B89E5',}
        },
        modal1:false,
        out_coin:0
      }
    },
    watch: {
      modalOk(nval){
        if(nval==true){
          this.showBuyCard()
        }
      }
    },
    methods: {
      accessConfirm(){
        //确认权限
        let sendCoinNum = this.$store.state.together.sendCoinNum
        let lastCoin = parseInt(this.out_coin);
        this.$store.dispatch('setSendCoinNum',lastCoin)
        ipc.send('getCoin',lastCoin)
        this.modal1=false
      },
      accessCancel(){
        this.modal1=false
      },
      async enter(){
        let res=await this.$request.getData('/goods/getCommonPackage',{user_token:this.userToken,money:this.money})
        this.coins_number=res.data
        let value={amount_money:this.money==""?'0':this.money,coin:this.money==""?'0':this.coins_number,desc:`送${this.coins_number-this.money}币`,name:`自定义购币套餐(购${this.coins_number}个币)`}
        this.$store.dispatch('setSelectData1',value)
      },
      async getCoinsData(){
        let res=await this.$request.getData('/goods/getGoodsProductList',{user_token:this.userToken})
        this.coninsData=res.data
      },
      async tibi(){
        if(this.coinNumber!=''){
          let value={name:"提币项目",desc:'-',coin:this.coinNumber,amount_money:this.coinNumber}
          this.$store.dispatch('setType','bi1')
          this.$store.dispatch('setSelectData1',value)
          let cardId=ipcRenderer.sendSync('synchronous-message')
          let res=await this.$baseFunction.getCardNumber(cardId)
          let tag=res.level=='success' ?false :true
          this.$store.dispatch('setIsdoka',tag)
          this.$store.dispatch('setMealInformation',res.data)
          this.$store.dispatch('setMessageBoxShow',true)
          this.$store.dispatch('setSelectNumber',1)
        }
      },
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
      this.getCoinsData()
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true,
      //     scrollbar: {
      //      fade: true,
      //      interactive: false // 1.8.0 新增
      //     }
      //   })
      // })
    },
    created(){
      ipc.on('out_coin', (event, arg) => {
        this.out_coin=parseInt(arg)
        this.$baseFunction.showTotals(this,"购买"+this.out_coin+"币，出币中...")
        console.log(this.out_coin,'我出的币')
      }),
      ipc.on('out_coin_result', (event, arg) => {
        if(parseInt(arg) == 0){
          this.$baseFunction.showTotals(this,"出币完成！")
        }else {
          this.out_coin=parseInt(arg)
          this.modal1=true
        }
      })
    },
    destroyed(){
      this.$store.dispatch('setSelectData1','')
    }
  }
</script>

<style scoped>
#buyCoins{width:100%;height:100%;display: flex;position: relative;flex-direction: column;}
.buyCoins_left{flex: 1;height: 100%;display: flex;flex-direction: column;margin-left: 20px;}
.buyCoins_wrap{flex:1;display: flex;}
.buyCoins_right{width: 340px;height: 100%;margin-left: 20px;}
.coins_header{width: 100%;height: 240px;}
.coins_title{width: 100%;line-height: 36px;margin-top: 10px;text-indent: 20px;font-size: 14px;color: #5F5F68;}
.header_details{width: 100%;height: 60px;line-height: 60px;display: flex;justify-content: row;}
.coins_money,.coins_number{width: 300px;height: 100%;position: relative;margin-left: 20px;}
.coins_number{width: 200px;margin-left: 0px;}
.coins_money .money,.coins_number .number{width: 100%;height: 100%;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;position: absolute;left: 0;top: 0;padding-left: 20px;font-size: 18px;color: #8E8E93;}
.header_details>div:nth-of-type(2){width: 48px;font-size: 20px;color: #303039;text-align:center;line-height: 60px;font-weight: 600;}
.coins_money div,.coins_number div{width: 50px;height: 50px;position: absolute;right: 10px;top: 0;font-size: 18px;color: #303039;}
.coins_number div{width: 40px;height: 20px;position: absolute;right: 10px;top: 0;font-size: 18px;color: #303039;text-align: center;}
.coins_header .line{width: 96%;margin-left: 2%;height: 1px;margin-top: 30px;}
.coins_footer{width: 100%;height: 90px;display: flex;justify-content: space-between;line-height: 90px;}
.coins_meal{flex:1;width: 100%;display: flex;flex-direction: column;background-color: #fff;}
.meal_container{flex:1;overflow-y: hidden;}
.meal_wrap{width: 100%;height: 100%;}
.meal_title{line-height: 48px;font-size: 14px;color: #5F5F68;margin-left: 20px;}
.header_details>div.tibi{width:100px;height:60px;border-radius:6px;background-color:#8BC0FF;color:#fff;text-align:center;line-height:60px;font-size:18px;margin-left:10px;cursor: pointer;}
@media screen and (max-width: 1025px) {
  .coins_money{width: 170px;}
  .coins_number{width: 140px;}
  .coins_footer{height: 130px;display: block;}
}
.modal-backdrop {z-index:1000;position: fixed; top: 20px; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,.3); display: flex; justify-content: center; align-items: center; } .modal {width:150px;height:130px;text-align:center;font-size:16px;background-color: #fff; box-shadow: 2px 2px 20px 1px; overflow-x:auto; display: flex; flex-direction: column; } .modal-header, .modal-footer { padding: 15px; display: flex; } .modal-header { border-bottom: 1px solid #eee; color: #4aae9b; justify-content: space-between; } .modal-footer { border-top: 1px solid #eee; justify-content: flex-end; } .modal-body { position: relative; padding: 20px 10px; }
.btn-close { border: none 0; font-size: 20px; padding: 20px; cursor: pointer; font-weight: bold; color: #4aae9b; background-color: transparent; } .btn-green { color: #fff; background-color: #4aae9b; border: 1px solid #4aae9b; border-radius: 2px; }

</style>
