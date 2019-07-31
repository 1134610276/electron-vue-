<template>
  <div  class="informationBox_messageBox">
    <div class="informationBox_messageWrap">
        <div class="informationBox_wrap_title">
            <div><b>录入会员资料</b></div>
            <img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="closeInformationMessageBox"/>
        </div>
        <div class="informationBox_wrap_readInformation">
            <ul class="clearfloat">
                <li>
                    <div class="informationBox_readInformation_title"><b>IC卡号</b></div>
                    <input type="text" v-model="card_id" disabled="disabled" style="width:170px;" />
                    <div class="informationBox_read_card" @click="doka">读卡</div>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>姓名<span style="color:red;">(必填)</span></b></div>
                    <input type="text" v-model="card_name"/>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>性别</b></div>
                    <Select style="width:240px;height:50px;" size="large" v-model="card_sex">
                        <Option  value="男" style="height:50px;">男</Option>
                        <Option  value="女" style="height:50px;">女</Option>
                    </Select>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>手机号码<span style="color:red;">(必填)</span></b></div>
                    <input type="text" v-model="card_tel" maxlength="11"/>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>生日</b></div>
                    <DatePicker type="date" placeholder="请选择时间" style="width: 240px;height:50px;"  @on-change="getBirth"></DatePicker>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>身份证号<span style="color:red;">(必填)</span></b></div>
                    <input type="text" v-model="card_number" maxlength="18"/>
                </li>
                <li>
                    <div class="informationBox_readInformation_title"><b>有效期</b></div>
                    <div style="width: 240px;height:50px;line-height:50px;border: 1px solid #E5E5EA;border-radius: 6px;text-indent:10px;">{{selectData1.active_time}}</div>
                </li>
            </ul>
            <ul class="clearfloat">
                <li style="margin-bottom:0px;">
                    <div class="informationBox_readInformation_title"><b>密码</b></div>
                    <input type="password" v-model="card_password"/>
                </li>
                <li style="margin-bottom:0px;">
                    <div class="informationBox_readInformation_title"><b>确认密码</b></div>
                    <input type="password" v-model="card_again"/>
                </li>
                <li style="margin-left:90px;" v-if="passwordTag">
                    <div class="informationBox_readInformation_title" style="width:100%;color:red;"><b>两次密码输入不正确</b></div>
                    <!-- <input type="password" v-model="card_again"/> -->
                </li>
            </ul>
        </div>
        <div class="informationBox_next" @click="next">下一步</div>
    </div>
      <tip v-if="tipShow"></tip>
  </div>
</template>

<script>
import tip from '@/components/tip.vue';
const {ipcRenderer} = require('electron')
const {ipcRenderer: ipc} = require('electron');
export default {
    data(){
        return {
            card_id:"",
            card_ji:"",
            card_name:"",
            card_tel:"",
            card_number:"",
            card_password:"",
            card_again:"",
            card_sex:"",
            card_time:"",
            card_birth:"",
            select_goods_id:"",
            userToken:"",
            tipShow:false,
            passwordTag:false
        }
    },
    computed: {   
        dealTime(){
            let date=new Date();
            let month=date.getMonth()+1;
            let day=date.getDate();
            let year
            let arr=[];
            for(let i=0;i<3;i++){
                year=date.getFullYear()+i+1;
                arr.push(`${year}-${month}-${day}(${i+1}年内)`)
            }
            return arr;
        },
        selectData1(){
            return this.$store.state.basic.selectData1
        },
    },
    methods: {
        closeInformationMessageBox(){
            this.$store.dispatch('setInformationBoxShow',false)
        },
        async next(){
          let baseUrl=await this.$baseFunction.getFileData()
         let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
          if(this.card_password==this.card_again){
            if(this.card_name==''){
                this.$baseFunction.showTotals(this,'必须填写姓名');
                return 
            }else if(this.card_tel==''){
                this.$baseFunction.showTotals(this,'必须填写电话号码');
                return 
            }else if(this.card_number==''){
                this.$baseFunction.showTotals(this,'必须填写身份证号码');
                return 
            }
            this.passwordTag=false
            let baseUrl=await this.$baseFunction.getFileData()
            let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
            let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info');
            let work_classes_id=JSON.parse(user_login_info).work_classes_id
            let resPost = await this.$request.postData('/member/recordMemberInfo',{
                card_num:this.card_id,
                name:this.card_name,
                sex:this.card_sex=='男'?1:2,
                phone:this.card_tel,
                birth:this.card_birth,
                id_card_num:this.card_number,
                pay_password:this.card_password,
                user_token:userToken[0],
                member_end_time:this.card_number,
                good_id:this.select_goods_id,
                work_classes_id:work_classes_id
            })
            if(resPost.level == "error"){
                this.$baseFunction.showTotals(this,resPost.message)
            }else {
                if(resPost.data.order_num != ""){
                    let tag
                    let res=await this.$baseFunction.getCardNumber(this.card_id)
                    tag=res.level=='success' ? false :true
                    let information={
                        card_num:this.card_id,
                        name:this.card_name,
                        sex:this.card_sex,
                        phone:this.card_tel,
                        birth:this.card_birth,
                        id_card_num:this.card_number,
                        member_end_time:this.card_number,
                        pay_password:this.card_password,
                    }
                    this.$store.dispatch('setIsdoka',res.level=='success'?false:true)
                    ipc.send('doka',res.data);
                    this.$store.dispatch('setMealInformation',res.data)
                    this.$store.dispatch('setInformation',information)
                    this.$store.dispatch('setMealInformation',res.data)
                    this.$store.dispatch('setInformationBoxShow',false)
                    this.$store.dispatch('setOrder_num',resPost.data.order_num)
                    let data=await this.$request.getData('/order/getOrderList',{order_num:resPost.data.order_num,user_token:userToken})
                    if(data.level=='success'){
                      this.$store.dispatch('setSelectData',data.data)
                      this.$store.dispatch('setMessageBoxShow',true)
                      this.$store.dispatch('setType','vip')
                    }else{
                      this.$store.dispatch('setInformationBoxShow',false)
                      this.$baseFunction.showTotals(this,res.message)
                    }
                }else {
                    this.$baseFunction.showTotals(this,"添加成功")
                    this.$store.dispatch('setInformationBoxShow',false)
                }
            }
          }else{
              this.passwordTag=true
            }
        },
        getBirth(value){
            this.card_birth=value
        },
        getEndTime(value){
            let date=new Date();

            this.card_time=value
        },
        async doka(){
            var readCardId = ipcRenderer.sendSync('synchronous-message')
            // if(readCardId == ""){
            //     readCardId = "15999969374"
            // }
            if(readCardId != ""){
                this.card_id = readCardId
                let res=await this.$baseFunction.getCardNumber(this.card_id)
                if(res.level == "success"){
                    if(res.data.status == "1" || res.data.status =="2"){
                        this.$baseFunction.showTotals(this,'此卡已被使用，不允许开卡！')
                    }
                }
            }else{
                this.$baseFunction.showTotals(this,'读卡失败,请检查读卡器')
                this.$store.dispatch('setMealInformation','')
            }
        }
    },
    async mounted(){
        this.select_goods_id = this.$store.state.basic.goodsId
    },
    components: {tip},
}
</script>
    
<style>
.informationBox_messageBox{width: 100%;height: 100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.7);z-index: 100;}
.informationBox_messageWrap{width: 800px;height: 600px;background: #FFFFFF;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-top: -300px;margin-left: -400px;display: flex;flex-direction: column;}
.informationBox_wrap_title{width: 100%;height: 50px;background: #3B89E5;border-radius: 6px 6px 0px 0px;display: flex;justify-content: space-between;}
.informationBox_wrap_title div{line-height: 50px;margin-left: 10px;font-size: 20px;color: #fff;}
.informationBox_wrap_title img{width: 50px;height: 50px;cursor: pointer;}
.informationBox_wrap_readInformation{width: 800px;height: 320px;margin-top: 30px;}
.informationBox_wrap_readInformation>ul{width: 720px;margin: 0px 0px 0px 20px;}
.informationBox_wrap_readInformation>ul:nth-of-type(1){border-bottom: 1px solid #EFEFF4;margin-bottom: 30px;height: 320px;}
.informationBox_wrap_readInformation>ul>li{width: 360px;height: 50px;display: flex;justify-content: row;margin-bottom: 30px;float: left;}
.informationBox_readInformation_title{width: 110px;text-align: right;font-size: 14px;color: #303039;line-height: 50px;padding-right: 10px;}
.informationBox_wrap_readInformation>ul li input{width: 240px;height: 50px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;line-height: 50px;text-indent: 10px;}
.informationBox_wrap_readInformation>ul li:nth-of-type(n+2) input{width: 240px;}
.informationBox_read_card{width: 60px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin-left: 10px;cursor: pointer;}
.informationBox_next{width: 300px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin:130px 0px 0px 250px; }
</style>