 <template>
  <div id="admissionVip">
    <div class="admissionVip_content_wrap" ref="left">
      <vue-scroll :ops="ops">
        <div class="wrapper">
          <div class="admissionVip_content">
            <div class="admissionVip_content_title">
              <b>新增会员资料</b>
            </div>
            <ul class="clearfloat admissionVip_content_ul">
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">卡号/手机号码</div>
                  <input placeholder="请读取新卡号" class="admissionVip_showKa" v-model="card_id" disabled="disabled" />
                  <div class="admissionVip_doKa" @click="doka">读卡</div>
                </div>
                <div>
                  <div class="admissionVip_title">会员等级</div>
                  <Select class="select1" size="large" v-model="card_ji" @on-change='getGradeValue'>
                      <Option  :value="value.id" :key="value.name" style="height:50px;"  v-for="(value,index) in gradeClassify">{{value.name}}</Option>
                  </Select>
                </div>
              </li>
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">会员期限</div>
                  <Select class="select1" size="large" v-model="card_time" @on-change='getGradeTime'>
                      <Option  v-for="(value,index) in dealTime" :value="index" style="height:50px;" :key="index">{{value.name}}</Option>
                  </Select>
                </div>
                <div>
                  <div class="admissionVip_title">入会费用</div>
                  <input class="admissionVip_showDetails" v-model="card_money"/>
                </div>
              </li>
            </ul>
            <ul class="clearfloat admissionVip_content_ul admissionVip_content_ul1">
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">姓名</div>
                  <input class="admissionVip_showDetails" v-model="card_name"/>
                </div>
                <div>
                  <div class="admissionVip_title">手机号码</div>
                  <input class="admissionVip_showDetails" v-model="card_tel" maxlength="11"/>
                </div>
              </li>
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">性别</div>
                  <Select style="width:260px;height:50px;" size="large" v-model="card_sex">
                      <Option  value="男" style="height:50px;">男</Option>
                      <Option  value="女" style="height:50px;">女</Option>
                  </Select>
                </div>
                <div>
                  <div class="admissionVip_title">出生日期</div>
                  <DatePicker type="date" placeholder="请选择时间" style="width: 260px;height:50px;"  @on-change="getBirth"></DatePicker>
                </div>
              </li>
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">身份证号码</div>
                  <input class="admissionVip_showDetails" v-model="card_number" maxlength="18"/>
                </div>
              </li>
            </ul>
            <ul class="clearfloat admissionVip_content_ul admissionVip_content_ul1">
              <li class="admissionVip_content_li">
                <div>
                  <div class="admissionVip_title">密码</div>
                  <input  class="admissionVip_showDetails" v-model="card_password" type="password"/>
                </div>
                <div>
                  <div class="admissionVip_title">确认密码</div>
                  <input class="admissionVip_showDetails" v-model="card_again" type="password"/>
                </div>
              </li>
            </ul>
          </div>
          <div class="admissionVip_upLoad">
            <!-- <img src="" style="width:250px;height:250px;" /> -->
            <div style="height:calc(100% - 50px);width:100% ;border:1px solid gray;text-align:center;line-height:250px;"> 拍摄区域
              <video ref="video" style="width:250px;height:250px;" v-if="isVideo"></video>
              <canvas id="canvas" width="250" height="250" v-if="isCanvas" ></canvas>
        
            </div>
            <div style="width:60px;line-height:30px;text-align:center;background: #3B89E5;border-radius: 8px;color:#fff;cursor:pointer;margin-top:20px;" @click="pai">拍摄</div>
          </div>
        </div>
      </vue-scroll>
      <!-- <img :src="dataURL"/> -->
    </div>
    <cardFooter :newData='newData' type="vip1"><span slot="card_money" >入会费用:{{card_money}}</span><span slot="card_name" @click="next">入会</span></cardFooter>
  </div>
</template>

<script>
import cardFooter from '@/components/cardFooter.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
const {ipcRenderer} = require('electron')
 const {ipcRenderer: ipc} = require('electron');
export default {
  name: 'landing-page',
  data(){
    return {
      gradeClassify:"",
      card_id:"",
      card_ji:"请选择",
      card_time:"请选择",
      card_money:"",
      card_name:"",
      card_tel:"",
      card_sex:"",
      card_number:"",
      card_again:"",
      card_password:"",
      card_birth:"",
      userToken:"",
      arr:"",
      tag:true,
      isVideo:true,
      // dataURL:'',
      isCanvas:false,
      ops:{
        vuescroll:{
          detectResize:true
        },
        scrollPanel:{},
        rail:{},
        bar:{background: '#3B89E5',}
      }
    }
  },
  computed:{
    dealTime(){
      return this.arr
    },
    mealInformation(){
      return this.$store.state.basic.mealInformation
    },
    newData(){
      return {
        card_id:this.card_id,
        card_ji:this.card_ji,
        card_time:this.card_time,
        card_money:this.card_money,
        card_name:this.card_name,
        card_tel:this.card_tel,
        card_sex:this.card_sex,
        card_number:this.card_number,
        card_password:this.card_password,
        coin:0,
        amount_integral:0,
        name:'会员办卡',
        amount_money:this.card_money,
        ssn_num:"",
        card_birth:this.card_birth,
        rule_id:true
      }
    }
  },
  components: { cardFooter ,vueScroll},
  methods: {
    pai(){
      var constraints = { audio: true, video: { width: 720, height: 720 } }
      if(this.tag){
        this.isVideo=true
        this.isCanvas=false
        navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
          this.$refs.video.srcObject = mediaStream;
          this.$refs.video.onloadedmetadata = (e)=> {
            this.$refs.video.play();
          };
        })
        .catch(function(err) { console.log(err.name + ": " + err.message); }); 
      }else{
        this.isCanvas=true
        setTimeout(()=>{
          var canvas = document.getElementById("canvas");
          var context = canvas.getContext("2d");
          context.drawImage(this.$refs.video,0,0,250,250);
          console.log(canvas.toDataURL("image/png"))   
          // this.dataURL=canvas.toDataURL("image/png")
          this.isVideo=false
        },1000)
      }
      this.tag=!this.tag
    },
    getBirth(value){
        this.card_birth=value
    },
    async getMemberGrade(){
      let res=await this.$request.getData('/member/getMemberGrade',{})
      this.gradeClassify=res.data
    },
    async doka(){ //读取显卡卡号
        var readCardId = ipcRenderer.sendSync('synchronous-message')
        if(readCardId != ""){
            this.card_id = readCardId
        }
      let res=await this.$baseFunction.getCardNumber(this.card_id);
      if(res.level == "success"){
        ipc.send('doka',res.data);
          this.$store.dispatch('setMealInformation',res.data)
          this.card_id   = res.data.card_num;
          this.card_ji   = res.data.member_grade_id
          this.card_time = res.data.member_end_time
          this.card_name = res.data.user_info != null ? res.data.user_info.realname : ""
          this.card_tel  = res.data.user_info != null ? res.data.user_info.contact : ""
          this.card_sex  = res.data.sex
          this.card_birth = res.data.birth
          this.card_number = res.data.id_card_num
      }
      if(res.level!='success'){
          if(res.data != "not_card"){
              this.$baseFunction.showTotals(this,res.message)
          }
      }
    },
    async getGradeValue(){
      let res=await this.$request.getData('/member/getMemberChangeRule',{user_token:this.userToken,mg_id:this.card_ji,type:"new_member_card"});
      if(res.level == "success"){
          this.arr = res.data
      }
    },
    getGradeTime(){
      let arrData = this.arr
      let key     = this.card_time
      this.card_money = arrData[key].amount_money
      this.rule_id    = arrData[key].id
    },

    async next(){
      let baseUrl=await this.$baseFunction.getFileData()
        let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
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
            let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
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
                rule_id:this.rule_id,
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
  },
    async mounted(){
    this.getMemberGrade()
    let baseUrl=await this.$baseFunction.getFileData()
    this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
    // this.$nextTick(()=>{
    //   const scroll=new BScroll(this.$refs.left,{
    //     click:true
    //   })
    // })
  }
}
</script>

<style>
#admissionVip{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.admissionVip_content_wrap{flex: 1;overflow-y: hidden;background-color: #fff;width: calc(100%-60px);margin:30px 30px 0px;}
.admissionVip_content{padding-bottom: 30px;}
.admissionVip_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;line-height: 60px;text-indent: 10px;}
.admissionVip_content_ul:nth-of-type(4){border-bottom: 0;}
.admissionVip_content_li>div{width: 370px;height: 50px;display: flex;}
.admissionVip_content_li>div input{height: 50px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;color: #303039;line-height: 50px;text-indent: 10px;}
.admissionVip_doKa{width: 60px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;cursor: pointer;}
.admissionVip_showKa,.admissionVip_showDetails{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}
.admissionVip_showKa{width: 190px;margin-right: 10px;}
.admissionVip_content_li>div .ivu-select-dropdown{width: 260px;}
@media (min-width: 1400px){
  .admissionVip_content_ul{border-bottom:1px solid  #EFEFF4;width: 760px;}
  .admissionVip_upLoad{width: 250px;height: 300px;margin-top: 100px;margin-right: 30px;}
  .admissionVip_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 10px;}
  .admissionVip_content_li{width: 740px;height: 50px;display: flex;margin-bottom: 30px;}
  .select1{
    width:260px!important;
    height:50px;
  }
}
@media (max-width:1400px){
  .admissionVip_content_ul{border-bottom:1px solid  #EFEFF4;width: 700px;}
  .admissionVip_upLoad{width: 200px;height: 250px;margin-top: 100px;}
  .admissionVip_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 10px;}
  .admissionVip_content_li>div{width: 330px;}
  .admissionVip_content_li{width: 700px;height: 50px;display: flex;margin-bottom: 30px;}
  .select1{
    width:220px!important;
    height:50px;
  }
}
#app #admissionVip .ivu-date-picker .ivu-select-dropdown{width:260px;}
#app #admissionVip .ivu-date-picker-cells{margin: 10px 30px;}

@media (max-width: 1025px) {
.admissionVip_content{margin:  0px}
.admissionVip_content_ul{width: 690px;margin: 30px 0px 0px 33px;}
.admissionVip_content_li{width: 689px;}
.admissionVip_content_wrap{margin: 30px 20px 0px}
}

.wrapper{
  display: flex;
  width:100%;
  justify-content: space-around
}


</style>
