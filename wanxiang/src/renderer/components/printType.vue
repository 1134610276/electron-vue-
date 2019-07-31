<template>
  <div  class="duihuanBox">
    <div class="printWrap">
        <div class="wrap_title">
            <div><b>打印机列表</b></div>
            <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeMessageBox"/>
        </div>
        <div class='print_title'>请选择打印机</div>
        <ul class="print_radio">
          <li v-for="(value,index) in printList">
            <input type="radio" :value="value.name" name="print" v-model="printType">{{value.name}}
          </li>
        </ul>
        <ul class="print_list">
            <li @click="confirm">是</li>
        </ul>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
const path = require('path');
const fs = require("fs");
const {remote} = require('electron');
    export default {
        data(){
            return {
                printList:"",
                printType:""
            }
        },
        components:{},
        computed: {      

        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setPrintTypeShow',false)
            },
            async confirm(){
              let configDir = remote.app.getPath('userData');
              const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
              fs.exists(newFile_path,  (exists) =>{
                  let getInfo = fs.readFileSync(newFile_path)
                  let result = JSON.parse(getInfo);
                   if(this.$store.state.together.selectPrintTypeShow=='ticket'){
                      this.$store.dispatch('setTicketPrint',this.printType)
                      result.ticketPrint=this.printType
                    }else{
                      this.$store.dispatch('setMoneyPrint',this.printType)
                       result.moneyPrint=this.printType
                    }
                    this.writeConfig(result)
                    this.$store.dispatch('setPrintTypeShow',false)
              });
            },
            writeConfig(result) {
                let configDir = remote.app.getPath('userData');
                const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
                let newData = JSON.stringify(result, null, 4);
                fs.writeFile(newFile_path, newData, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
            },
        },
        async mounted(){
          this.printList=await this.$baseFunction.getPrintList()
        }
    }
</script>
    
<style>
/*.duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}*/
.printWrap{width: 500px;height: 400px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -200px;margin-left: -250px;display: flex;flex-direction: column;}
/*
.duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
.duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
.duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}*/

.print_title{width: 100%;line-height: 100px;text-align: center;color: #3B89E5;font-size: 24px;margin-top: 50px;}
.print_list{width: 300px;height: 50px;margin: 40px auto;display: flex;}
.print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;margin-right: 25px;border-radius: 6px;cursor: pointer;}
</style>