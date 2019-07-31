<template>
    <div  class="duihuanBox">
        <div class="printWrap">
            <div class="wrap_title">
                <div><b>开账操作</b></div>
            </div>
            <div class='print_title'>是否开始营业</div>
            <div class='print_title_time'>营业日期（{{dataTime}}）</div>
            <div class='print_title_time'>当前班次（{{user_login_info.work_classes_name}}）</div>
            <ul class="print_list">
                <li @click="startWork">是</li>
                <li @click="closeMessageBox">否</li>
            </ul>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    export default {
        data(){
            return {
                dataTime:"",
                user_login_info:"",
                userToken:""
            }
        },
        components:{},
        computed: {
        },
        methods: {
            closeMessageBox(){
                this.$store.dispatch('setStartWorkShow',false)
                ipc.send("cancellation");
            },
            async startWork(){
                let baseUrl=await this.$baseFunction.getFileData()
                let res=await this.$request.postData('/special/startWork',{user_token:this.userToken,cash_register_id:this.user_login_info.cash_register_id,work_classes_id:this.user_login_info.work_classes_id})
                if(res.level == "success"){
                    this.$store.dispatch('setStartWorkShow',false)
                    let workRecordId = `${res.data}`;
                    const work_record_idCookie = {
                        url: baseUrl,
                        value:workRecordId,
                        name:'work_record_id',
                        expirationDate: this.$baseConfig.cookieData.date
                    };
                    this.$baseFunction.setCookie(work_record_idCookie)
                }
            }
        },
        async mounted(){
            let date=new Date()
            this.dataTime=date.getFullYear()+"-"+(date.getMonth()+1) +"-"+date.getDate()
            let baseUrl=await this.$baseFunction.getFileData()
            let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info');
            this.user_login_info=JSON.parse(user_login_info)
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
            let res=await this.$request.getData('/special/hasStartWork',{user_token:this.userToken})
            if(res.level == "success"){
                if(res.data != false && res.data != "false"){
                    this.$store.dispatch('setStartWorkShow',false)
                }else {
                    this.$store.dispatch('setStartWorkShow',true)
                }
            }
        },
        destroyed(){
            // this.$store.dispatch('setMealInformation','')
            // this.$store.dispatch('setIsdoka',false)
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
    .print_title_time{width: 100%;line-height: 30px;text-align: center;color: #3B89E5;font-size: 18px;}
    .print_list{width: 300px;height: 50px;margin: 40px auto;display: flex;}
    .print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;margin-right: 25px;border-radius: 6px;cursor: pointer;}
</style>