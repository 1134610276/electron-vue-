<template>
    <div  class="duihuanBox">
        <div class="printWrap">
            <div class="wrap_title">
                <div><b>打印</b></div>
                <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
            </div>
            <div class='print_title'>是否打印结账小票</div>
            <ul class="print_list">
                <li @click="confirm">打印</li>
                <li @click="closeMessageBox">下班并退出</li>
            </ul>
        </div>
        <div v-show="webShow">
            <webview ref="printWebview" :src="webSrc" nodeintegration style="visibility:hidden" />
        </div>
    </div>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    export default {
        data(){
            return {
                webShow:"",
                webSrc:"",
                printType:"",
            }
        },
        methods: {
            closeMessageBox(){
                 ipc.send("cancellation");
            },
            async confirm(){
                let baseUrl=await this.$baseFunction.getFileData()
                let work_record_id=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
                this.webSrc = `${this.$store.state.basic.domainUrl}/printSummary?work_record_id=${work_record_id}`
                this.webShow=true
                this.$baseFunction.showTotals(this,'准备打印，请稍等')
                const webview = this.$refs.printWebview;
                this.printType =this.$store.state.together.moneyPrint
                let res=await this.$baseFunction.printing(webview,this.printType)
                if(res){
                    if(this.webSrc.indexOf('ticket_key=') !== -1){   //当是打印门票的时候，应该调用接口减少帐号上刚刚兑换的门票
                        let ticketKey = this.webSrc.split('ticket_key=')[1]
                        let res=await this.$request.postData('/ticket/printTicketCheck',{ticket_key:ticketKey})
                    }
                    this.webSrc=`#`
                    const webview = this.$refs.printWebview;
                    setTimeout(()=>{
                        this.$baseFunction.showTotals(this,'打印成功')
                    },1500)
                    setTimeout(()=>{
                        this.$store.dispatch('setPrintWebView_show',false)
                    },2500)
                }else{
                    setTimeout(()=>{
                        this.$store.dispatch('setPrintWebView_show',false)
                        this.$baseFunction.showTotals(this,'打印失败')
                    },1500)
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
        },
    }
</script>

<style>
    /*!*.duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}*!*/
    /*.printWrap{width: 500px;height: 400px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -200px;margin-left: -250px;display: flex;flex-direction: column;}*/
    /*!**/
    /*.duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}*/
    /*.duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}*/
    /*.duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}*!*/

    /*.print_title{width: 100%;line-height: 100px;text-align: center;color: #3B89E5;font-size: 24px;margin-top: 50px;}*/
    /*.print_list{width: 300px;height: 50px;margin: 40px auto;display: flex;}*/
    /*.print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;margin-right: 25px;border-radius: 6px;cursor: pointer;}*/
</style>