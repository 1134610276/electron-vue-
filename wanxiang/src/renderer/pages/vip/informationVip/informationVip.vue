<template>
  <div id="informationVip">
    <div class="informationVip_content_wrap">
      <div class="informationVip_content">
        <div class="informationVip_content_title">
          <b>会员资料</b>
          <div class="informationVip_modify" @click="modify">{{!disabled?'完成':"修改"}}</div>
        </div>
        <ul class="clearfloat informationVip_content_ul">
          <li>
            <div>
              <div class="informationVip_title">卡号/手机号码</div>
              <input placeholder="请读取新卡号" class="informationVip_showKa" v-model="cardId" />
              <div class="informationVip_doKa" @click="doka">读卡</div>
            </div>
            <div>
              <div class="informationVip_title">会员等级</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.member_grade_name" disabled/>
            </div>
          </li>
          <li>
            <div>
              <div class="informationVip_title">会员期限</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card' ||cardInformation.member_end_time==null?'':cardInformation.member_end_time.split(' ')[0]" disabled/>
            </div>
          </li>
        </ul>
        <ul class="clearfloat informationVip_content_ul informationVip_content_ul1">
          <li>
            <div>
              <div class="informationVip_title">姓名</div>
              <input  class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.user_info.realname" :disabled="disabled"/>
            </div>
            <div>
              <div class="informationVip_title">手机号码</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.user_info.contact" :disabled="disabled" maxlength="11" />
            </div>
          </li>
          <li>
            <div>
              <div class="informationVip_title">性别</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.sex" :disabled="disabled" v-if="disabled" />
              <Select style="width:260px;height:50px;" size="large" v-model="cardInformation.sex" v-else>
                  <Option  value="男" style="height:50px;">男</Option>
                  <Option  value="女" style="height:50px;">女</Option>
              </Select>
            </div>
            <div>
              <div class="informationVip_title">出生日期</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.birth" :disabled="disabled" v-if="disabled"/>
              <DatePicker type="date" placeholder="请选择时间" style="width: 260px;height:50px;margin-left: 10px;" v-else @on-change="getBirth"></DatePicker>
            </div>
          </li>
          <li>
            <div>
              <div class="informationVip_title">身份证号码</div>
              <input class="informationVip_showDetails" v-model="cardInformation=='not_card'?'':cardInformation.id_card_num" :disabled="disabled" maxlength="18"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  const {ipcRenderer} = require('electron')
  const {ipcRenderer: ipc} = require('electron');
  export default {
    name: 'landing-page',
    data(){
      return {
        cardId:"",
        cardInformation:'not_card',
        tipShow:false,
        disabled:true,
        gradeClassify:"",
        sex:[
          {
            name:"男",
            id:'1'
          },
          {
            name:"女",
            id:'2'
          },{
            name:"保密",
            id:'0'
          }
        ]
      }
    },
    components: { },
    methods: {
      async doka(){
          var readCardId = ipcRenderer.sendSync('synchronous-message')
          if(readCardId != ""){
              this.cardId = readCardId
          }
        let res=await this.$baseFunction.getCardNumber(this.cardId)
        ipc.send('doka',res.data);
        this.cardInformation=res.data
        if(res.level=='success'){
          this.cardInformation=res.data
          if(this.cardInformation.sex=='0'){
            this.cardInformation.sex='保密'
          }else if(this.cardInformation.sex=='1'){
            this.cardInformation.sex='男'
          }else{
            this.cardInformation.sex='女'
          }
          this.cardInformation.birth=this.cardInformation.birth ==null?'':this.cardInformation.birth.split(' ')[0]
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      },
      async modify(){
        if(this.cardInformation!='not_card'){
          this.disabled=!this.disabled;
          let baseUrl=await this.$baseFunction.getFileData()
          let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
          if(this.disabled){  //点击完成的时候执行
            let res=await this.$request.postData('/member/setMemberInfo',{card_num:this.cardId,name:this.cardInformation.user_info.realname,sex:this.cardInformation.sex=='男'?1:2,phone:this.cardInformation.user_info.contact,birth:this.cardInformation.birth,id_card_num:this.cardInformation.id_card_num,user_token:userToken})
            this.$baseFunction.showTotals(this,res.message)
          }
        }
      },
      async getMemberGrade(){
        let res=await this.$request.getData('/member/getMemberGrade',{})
        this.gradeClassify=res.data
      },
      getBirth(value){
          this.cardInformation.birth=value
      },
    },
    mounted(){
      this.getMemberGrade()
    }
  }
</script>

<style scoped>
#informationVip{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;overflow-y: hidden;}
.informationVip_content_wrap{flex: 1;margin-top: 30px;}
.informationVip_content{background-color: #fff;margin:0px 30px;height: 100%;}
.informationVip_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;line-height: 60px;display: flex;justify-content: space-between;margin:0px 30px;}
.informationVip_modify{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;text-indent: 0px;cursor: pointer;}
.informationVip_content_ul{margin:30px 0px 0px 68px;border-bottom:1px solid  #EFEFF4;width: 760px;}
.informationVip_content_ul:nth-of-type(3){border-bottom: 0;}
.informationVip_content_ul li{width: 720px;height: 50px;display: flex;margin-bottom: 30px;}
.informationVip_content_ul li>div{width: 360px;height: 50px;display: flex;}
.informationVip_doKa{width: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;cursor: pointer;}
.informationVip_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;}
.informationVip_showKa{width: 190px;height: 50px;text-indent: 10px;margin: 0px 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}
.informationVip_showDetails{width: 260px;height: 50px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;text-indent: 10px;margin-left: 10px;}
.admissionVip_showKa,.admissionVip_showDetails{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;margin-left: 10px;}
.admissionVip_showKa{width: 190px;margin-right: 10px;}
.informationVip_content_ul li{width: 260px;}
#app #informationVip .ivu-picker-panel-body{width:260px;}
#app #informationVip .ivu-date-picker-cells{margin: 10px 30px;}
@media screen and (max-width: 1025px) {
  .informationVip_content{margin: 0px 20px;}
  .informationVip_content_ul{width: 690px;margin: 30px 0px 0px 33px;}
  .informationVip_content_ul li>div{width: 330px;}
}
</style>
