<template>
    <div  class="duihuanBox">
        <div class="printWrap">
            <div class="wrap_title">
                <div><b>团体票人数</b></div>
                <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
            </div>
            <div class="input-group">
               <input type="text" class="group-num" placeholder="请输入人数" v-model="number"/>
            </div>
            <ul class="print_list">
                <li @click="setNum">确定</li>
            </ul>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    export default {
        data(){
            return {
                number:""
            }
        },
        components:{},
        computed: {
            selectData(){
                return this.$store.state.basic.selectData1
            },
            cardId(){
                return this.$store.state.basic.cardId
            },
            ticketNum(){
                return this.$store.state.together.ticketNum
            },
        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setTicketNumShow',false)
            },
            async setNum(){
                if(this.ticketNum == 0){
                    this.$store.dispatch('setSelectNumber',this.number)
                    this.$baseFunction.order(this,'',this.cardId,this.selectData.goods_key,this.number)
                    this.$store.dispatch('setMessageBoxShow',true)
                }else {
                    let cart_num = this.$store.state.basic.cart_num
                    let res=await this.$request.postData('/goods/saveShopCart',{cart_num:cart_num,goods_key:this.selectData.goods_key,num:this.number})
                    if(res.level=='error'){
                        alert(res.message,"错误提示")
                    }
                    let shopData=await this.$request.getData('/goods/getShopCartList',{cart_num:cart_num})
                    ipc.send('orderInformation',shopData);
                    this.$store.dispatch('setShopCard',shopData.data)
                }
                this.$store.dispatch('setTicketNumShow',false)
            }
        },
        async mounted(){
        },
        destroyed(){
            // this.$store.dispatch('setMealInformation','')
            // this.$store.dispatch('setIsdoka',false)
        }
    }
</script>

<style scoped>
    .duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 1000;}
    .printWrap{width: 500px;height: 400px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -200px;margin-left: -250px;display: flex;flex-direction: column;}
    .duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
    .duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
    .duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}
    .input-group{margin:100px auto 0;font-size: 20px}
    .group-num{width: 180px;height: 40px}
    .print_list{width: 130px;height: 50px;display: flex;}
    .print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;border-radius: 6px;cursor: pointer;}
</style>