<template>
  <div  class="duihuanBox">
    <div class="printWrap">
        <div class="wrap_title">
            <div><b>打印</b></div>
            <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
        </div>
        <div class='print_title'>是否打印门票</div>
        <ul class="print_list">
            <li @click="confirm">是</li>
            <li @click="closeMessageBox">否</li>
        </ul>
    </div>
    <div v-show="webShow">
      <webview ref="printWebview" :src="webSrc" nodeintegration style="visibility:hidden"/>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
const {ipcRenderer: ipc} = require('electron');
    export default {
        data(){
            return {
                webShow:"",
                webSrc:"",
                printList:"",
                printType:"",
                printDevice:"SOCKET"
            }
        },
        components:{},
        computed: {      

        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setPrintTicketShow1',false)
                // this.$store.dispatch('setPrintShow',true)
            },
            async confirm(){
                if(this.printDevice == "SOCKET"){
                    this.$baseFunction.showTotals(this,'准备打印，请稍等')
                    let res=await this.$request.getData('/ticket/printTicketByOrderNum',{order_num:this.$store.state.together.order_num})
                    if(res.level == "success"){
                        let count = res.data.length
                        for(let [index,value] of res.data.entries()) {
                            setTimeout(()=>{
                                ipc.send('printTicketNew',value.print_info);
                                this.$baseFunction.showTotals(this,'准备打印第'+(parseInt(index)+1)+'张，共'+count+'张')
                            },index * 1500)
                        }
                        let res2=await this.$request.postData('/ticket/printTicketListCheck',{order_num:this.$store.state.together.order_num})
                        setTimeout(()=>{
                            this.$baseFunction.showTotals(this,'打印任务发送完成')
                        },count * (1500))
                        setTimeout(()=>{
                            this.$store.dispatch('setPrintTicketShow1',false)
                        },count * 2500)
                    }else {
                        this.$baseFunction.showTotals(this,res.message)
                    }
                }else {
                    this.webShow=true
                    this.$baseFunction.showTotals(this,'准备打印，请稍等')
                    this.webSrc=`${this.$store.state.basic.domainUrl}/printTicketByOrderItem?order_item_num=${this.$store.state.together.order_num}`
                    this.printType =this.$store.state.together.ticketPrint
                    const webview = this.$refs.printWebview;
                    let res=await this.$baseFunction.printing(webview,this.printType)
                    console.log(res)
                    // this.$store.dispatch('setPrintShow',false)
                    if(res){
                        let res=await this.$request.postData('/ticket/printTicketListCheck',{order_num:this.$store.state.together.order_num})
                        this.webSrc=`#`
                        const webview = this.$refs.printWebview;
                        setTimeout(()=>{
                            this.$baseFunction.showTotals(this,'打印成功')
                        },1500)
                        setTimeout(()=>{
                            this.$store.dispatch('setPrintTicketShow1',false)
                            // this.$store.dispatch('setPrintShow',true)c'n'p'm
                        },2500)
                    }else{
                        setTimeout(()=>{
                            this.$baseFunction.showTotals(this,'打印失败')
                        },1500)
                    }
                }
            },
            async getDevice(){
                let res=await this.$request.getData('/ticket/getPrintDevice',{})
                if(res.level=="success"){
                    this.printDevice = res.data
                }
            }
        },
        mounted(){
            this.getDevice()
        },
    }
</script>
    
<style>
/*.duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}*/
.printWrap{width: 500px;height: 400px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -200px;margin-left: -250px;display: flex;flex-direction: column;}
.print_title{width: 100%;line-height: 100px;text-align: center;color: #3B89E5;font-size: 24px;margin-top: 50px;}
.print_list{width: 300px;height: 50px;margin: 40px auto;display: flex;}
.print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;margin-right: 25px;border-radius: 6px;cursor: pointer;}
</style>