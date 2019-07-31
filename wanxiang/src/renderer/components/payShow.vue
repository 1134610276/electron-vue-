<template>
  <div  class="payShow">
    <div class="payShowloading" v-if="payType=='loading'">
        <loading></loading>
        <div class="payShowloading_title">等待支付</div>
    </div>
    <div class="payShowloading1" v-if="payType=='no_read_card'">
      <div class="payShowloading_titleTip">请输入卡号</div>
      <input class="payShowloading_input" v-focus v-model="card_num" style="letter-spacing: 0px;" />
      <div class="payShowloading_btn">
          <div class="payShowloading_no" @click="cancle">取消</div>
          <div class="payShowloading_yes" @click="send">完成</div>
      </div>
    </div>
    <div class="payShowloading1" v-if="payType=='card_money'||payType=='coin'||payType=='integral'||payType=='win_ticket'">
        <div class="payShowloading_titleTip">输入支付密码</div>
        <input class="payShowloading_input" type="password" v-model="password" v-focus/>
        <div class="payShowloading_err" v-if="pay_pwd_show">密码错误</div>
        <div class="payShowloading_comfire" @click="enter" @keydown.enter='enter'>确定</div>
    </div>
    <div class="payShowloading2" v-if="payType=='cash'">
        <div class="payShowloading_cashTip">是否现金支付完成</div>
        <span style="font-size:16px;">实收金额：</span><input @blur="getChange" v-model="getMoney" class="getMoney" type="number"/>
        <br/>
        <div style="line-height:20px;font-size:16px;margin-top:20px;">找&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;零：{{change}}</div>
        <div class="payShowloading_btn">
            <div class="payShowloading_no" @click="cancle">取消</div>
            <div class="payShowloading_yes" @click="enter">完成</div>
        </div>
    </div>
    <div class="payShow_footer" v-if="payType!='no_read_card'">
        <div class="payShow_footer_total">总计费用:{{payType=='coin' ? selectData.coin+'币':'￥'+selectData.amount}}</div>
        <input v-model="code"  v-focus @keydown.enter="enter" v-if="payType=='loading'" style="opacity:0" />
        <div class="payShow_footer_cancel" @click="cancle">{{payType=='integral'||payType=='win_ticket'?'取消兑换':'取消支付'}}</div>
    </div>
    <tip v-if="tipShow"></tip>
  </div>
</template>

<script>
    import tip from '@/components/tip.vue';
    import loading from '@/components/loading.vue';
    const {ipcRenderer: ipc} = require('electron');
    export default {
        name: 'payShw',
        components: {loading,tip},
        data(){
            return {
                password:"",
                code:"",
                order_num:"",
                pay_pwd_show:false,
                tipShow:false,
                card_num:"",
                returnCoin:"",
                change:"",   //找零零钱
                getMoney:"",  //实收现金
            }
        },
        computed:{
            tip(){
                return this.$store.state.together.tip
            },
            payType(){
                return this.$store.state.together.payType
            },
            order_num1(){
                return this.$store.state.together.order_num
            },
            selectType(){
                return this.$store.state.together.selectType
            },
            type(){
                return this.$store.state.basic.type
            },
            selectData(){
                return this.$store.state.basic.selectData
            },
        },
        methods:{
            cancle(){
                this.$store.dispatch('setPayshow',false)
            },
            async enter(){
                if(this.type=='tuika'){
                    let baseUrl=await this.$baseFunction.getFileData()
                    let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
                    let res=await this.$request.postData('/order/confirmOrdersReback',{pay_type:'cash',order_num:this.$store.state.together.order_num,user_token:userToken})
                    this.$baseFunction.showTotals(this,res.message)
                    this.$store.dispatch('setPayshow',false)
                    this.$store.dispatch('setMessageBoxShow',false)
                    return 
                }

                this.code=this.$store.state.together.selectType=='cash'?'':this.code
                if(this.payType=='card_money'||this.payType=='coin'||this.payType=='integral'||this.payType=='win_ticket'){
                    this.card_num=this.$store.state.basic.mealInformation.card_num
                }
                let res=await this.$request.postData('/payment/payAction',{card_num:this.card_num,pay_type:this.$store.state.together.selectType,order_num:this.$store.state.together.order_num,pay_code:this.code,pay_password:this.password})
                if(res.level=='success'){
                    this.$baseFunction.showTotals(this,res.message)

                    let number=await this.$baseFunction.buyCoin(this.$store.state.together.order_num)
                    this.returnCoin=number.data
                    console.log(this.returnCoin,22222)
                    if(this.returnCoin>0){
                        this.$store.dispatch('setSendCoinNum',this.returnCoin)
                        ipc.send('getCoin',this.returnCoin)
                    }
                    console.log(this.selectData,'selectData')
                    setTimeout(()=>{
                        if(this.selectData.ticket_num>0){
                            this.$store.dispatch('setPrintTicketShow',true)
                        }else{
                            this.$store.dispatch('setPrintShow',true)
                        }
                        
                        if(this.type=='shopCard'){
                            this.$store.dispatch('setShopCard',[])
                            this.$store.dispatch('setCart_num','')
                        }
                        this.$store.dispatch('setPayshow',false)
                        this.$store.dispatch('setMessageBoxShow',false)
                        if(this.payType=='integral'||this.payType=='win_ticket'){
                            this.$store.dispatch('setDuihuanBoxShow',false)
                        }
                    },2000)   
                }else{
                    this.$store.dispatch('setPayshow',false)
                    this.$baseFunction.showTotals(this,res.message)
                }

            },
            async send(){
                let res=await this.$baseFunction.getCardNumber(this.card_num)
                let tag=res.level=='success'?false:true
                this.$baseFunction.reloadOrder(this,this.card_num)
                this.$store.dispatch('setIsdoka',tag)
                this.$store.dispatch('setMealInformation',res.data)
                this.$store.dispatch('setPayshow',false)
            },
            getChange(){
                
                this.change= (parseFloat(this.getMoney) - parseFloat(this.selectData.amount)).toFixed(2)
                let rebackMoney = this.getMoney
                this.$store.dispatch('setOddChange',rebackMoney)
                if(this.change < 0){
                    this.change = "金额不足"
                }
                let arr={
                    change:rebackMoney,
                    getMoney:this.getMoney,
                    amount:this.selectData.amount
                }
                ipc.send('change',arr);
            }
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },
        async mounted(){
            this.card_num  = this.$store.state.basic.cardId
            this.order_num = this.$store.state.basic.orderNum
            this.password=''
            this.card_num=''
        },
        created(){
          ipc.send('money',this.selectData.amount);
          ipc.on('coin-messages', (event, arg) => {
            var ten = parseInt(arg.substr(6,4),16);
            if(ten!=this.returnCoin&& ten!=0){
                this.$baseFunction.showTotals(this,'币数不够')
            }else if(ten==this.returnCoin&& ten!=0){
                this.$baseFunction.showTotals(this,'出币完成')
            }
          });
        }
    }
</script>
    
<style>
.payShow{width: 100%;height:100%;background: rgba(255,255,255,0.8);border-radius: 6px;position: absolute;}
.payShowloading{margin:205px 370px;width: 100px;height: 100px;}
.payShowloading_title{font-size: 24px;color: #0D6BDA;}
.payShow_footer{width: 100%;height: 100px;background: #F4F9FF;border-radius: 0px 0px 6px 6px;position: absolute;left: 0;bottom: 0px;}
.payShow_footer_total{height: 100px;line-height: 100px;text-indent: 30px;font-size: 14px;color: #303039;}
.payShow_footer_cancel{width: 160px;height: 50px;margin-top:25px;line-height: 25px;text-align: center;border: 2px solid #0D6BDA;border-radius: 8px;font-size: 18px;color: #3B89E5;position: absolute;right: 30px;bottom: 25px;line-height: 50px;cursor: pointer;}
.payShowloading1{margin:155px 245px;width: 350px;height: 150px;}
.payShowloading_titleTip{font-size: 18px;color: #3B89E5;}
.payShowloading_input{width: 100%;height: 50px;line-height: 50px;text-indent: 15px; background: #DEEDFF;border: 1px solid #B3D6FF;border-radius: 6px;font-size: 30px;color: #3B89E5;letter-spacing: 20px;margin: 5px 0px;}
.payShowloading_err{width: 100%;line-height: 25px;text-align: center;font-size: 18px;color: #ED475B;}
.payShowloading_comfire{width: 70px;height: 30px;border-radius: 6px;margin-top: 10px;text-align: center;line-height: 30px;background-color: #3B89E5;color: #fff;font-size: 16px;cursor: pointer;}
.payShowloading2{margin:175px 245px;width: 350px;height: 150px;}
.payShowloading_cashTip{text-align: center;line-height: 33px;font-size: 24px;color: #3B89E5;margin-bottom: 15px;}
.payShowloading_btn{width: 100%;display: flex;margin-top: 30px;}
.payShowloading_btn div{width: 140px;height: 50px;text-align: center;line-height: 50px;border-radius: 8px;font-size: 18px;}
.payShowloading_no{border: 2px solid #5CA7FF;color: #3B89E5;margin:0px 10px 0px 20px;}
.payShowloading_yes{color: #fff;background: #3B89E5;}
.getMoney{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 20px;}
.getMoney::-webkit-outer-spin-button,
.getMoney::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
}

/*火狐 下去除type ==  "number"  时 的右侧图标*/
input[type="number"]{-moz-appearance:textfield;}

/*IE下去除 右边的×*/
input::-ms-clear{display:none;}




/*IE下去除 小眼睛*/
.getMoney::-ms-reveal{display:none;}

</style>