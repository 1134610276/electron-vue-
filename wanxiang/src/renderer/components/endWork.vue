<template>
    <div  class="duihuanBox">
        <div class="printWrap">
            <div class="wrap_title">
                <div><b>结账完成</b></div>
            </div>
            <div class='print_title'>是否确认结账？</div>
            <div class='print_title_time'>当前班次（{{user_login_info.work_classes_name}}）</div>
            <ul class="print_list">
                <li @click="endWork">确认</li>
                <li @click="cancle">取消</li>
            </ul>
        </div>
    </div>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    export default {
        data(){
            return {
                user_login_info:"",
                userToken:""
            }
        },
        components:{},
        computed: {
        },
        methods: {
            cancle(){
                this.$store.dispatch('setEndWorkShow',false)
            },
            async endWork(){
                let baseUrl=await this.$baseFunction.getFileData()
                let work_record_id=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
                let res=await this.$request.postData('/special/endWorkClasses',{work_record_id:work_record_id[0],user_token:this.userToken});
                if(res.level == "success"){
                    this.$store.dispatch('setEndWorkShow',false)
                    this.$store.dispatch('setEndWorkPrint',true)
                }else {
                    this.$baseFunction.showTotals(this,res.message)
                    if(res.data != undefined && res.data == "had_end_work"){
                        setTimeout(()=>{
                            this.$store.dispatch('setEndWorkShow',false)
                            this.$store.dispatch('setEndWorkPrint',true)
                        },1500)
                    }
                }

            }
        },
        async mounted(){
            let baseUrl=await this.$baseFunction.getFileData()
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
            let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
            this.user_login_info=JSON.parse(user_login_info)
        },
        destroyed(){

        }
    }
</script>

<style scoped>
    /*.duihuanBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}*/
    .printWrap{width: 500px;height: 400px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -200px;margin-left: -250px;display: flex;flex-direction: column;}
    /*
    .duihuanBox .wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;color: #fff;}
    .duihuanBox .wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;}
    .duihuanBox .wrap_title img{width: 50px;height: 50px;cursor: pointer;}*/

    .print_title{width: 100%;line-height: 100px;text-align: center;color: #3B89E5;font-size: 24px;margin-top: 50px;}
    .print_title_time{width: 100%;line-height: 30px;text-align: center;color: #3B89E5;font-size: 18px;}
    .print_list{width: 260px;height: 50px;margin: 40px auto;display: flex;}
    .print_list li{width: 130px;line-height: 50px;background-color: #3B89E5;text-align: center;font-size: 20px;color:#fff;border-radius: 6px;cursor: pointer;}
</style>