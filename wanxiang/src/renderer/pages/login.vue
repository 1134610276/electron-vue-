<template>
  <div id="login" >
    <div class="login_left">
      <img src="http://file.rzkeji.com/web/wanxiang/icon/companyImg1.jpg"/>
    </div>
    <div class="login_right drag">
      <img src="http://file.rzkeji.com/web/wanxiang/icon/close.png" class="close" @click="click"/>
      <div class="right_title"><b>更专业的游乐场管理系统</b></div>
      <div class="right_company">{{banData.name}} <span style="color:#B2B2B9;cursor:pointer"  @click="setDomain">系统基础设置</span></div>
      <ul class="right_details">
        <li>
          <div>用户名</div>
          <div class="input_Select">
            <Dropdown trigger="click" @on-click ="userSelect" class="drag">
              <a href="javascript:void(0)">
                  <Input  placeholder="请输入用户名"  style="width: 300px" v-model="username" @on-keyup="searchList" />
                  <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                  <DropdownItem :name="value" v-for="(value,index) in userList" :key="index" style="height: 50px;line-height: 36px;">{{value}}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </li>
        <li>
          <div>密码</div>
          <Input  placeholder="请输入密码" clearable style="width: 300px" v-model.lazy="password" type='password' @on-enter='login'/>
        </li>
        <li style="display:flex">
          <div style="flex:1;">
            <div>班次</div>
            <Select  class="name" v-model="banci">
                <Option v-for="item in banData.work_classes" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </div>
        </li>
      </ul>
      <div class="right_tip">当前营业时间：<span>{{dataTime}}</span></div>
      <div class="right_btn">
        <div class="login_btn" @click="login">登录</div>
        <div class="hand_btn">指纹</div>
      </div>
    </div>
    <domain v-if="domainTag"></domain>
  </div>
</template>

<script>
  const path = require('path');
  const fs = require("fs");
  import domain from '@/components/domain.vue';
  import baseUrl from '@/utils/baseConfig';
  const {ipcRenderer: ipc} = require('electron');
  const {remote} = require('electron');
  const session = require('electron').remote.session;
  export default {
    name: 'login',
    data(){
      return {
        dataTime:"",
        userList: [],
        username: '',
        password: '',
        cookieList:"",
        cashNumber:"",
        banci:"",
        SellerNum:"",
        
      }
    },
    components: { 
      domain
    },
    computed:{
      domainTag(){
        return this.$store.state.together.domainTag
      },
      banData(){
        return this.$store.state.together.banData
      }
    },
    methods: {
      setDomain(){
        this.$store.dispatch('setDomainTag',true)
      },
      click: function () {
          ipc.send('close1');
      },
      async login(){
        if(this.username==''){
          this.$Message.error('请输入用户名');
          return
        }else if(this.password==''){
          this.$Message.error('请输入密码');
          return 
        }else if(this.banci==''){
          this.$Message.error('请选择班次');
          return
        }
        let res=await this.$request.postData('/auth/sign-in',{username:this.username,password:this.password,seller_num:this.banData.seller_num,cash_register_id:this.$store.state.basic.resgiters_id,work_classes_id:this.banci});
        if(res.level=='success'){
          if(this.cookieList.indexOf(this.username)==-1){
            this.cookieList.unshift(this.username)
            let cookieValue=this.cookieList.join('?')
            const userCookie = { //这里是存已经登陆过的帐号名到cookie
              url: this.$store.state.basic.domainUrl,
              value:cookieValue,
              name:'cookieList',
              expirationDate: this.$baseConfig.cookieData.date
            };
            this.$baseFunction.setCookie(userCookie)
            }
          const userTokenCookie = {  //这里是存userToken的id到cookie
            url: this.$store.state.basic.domainUrl,
            value:res.data,
            name:'userTokenCookie',
            expirationDate: this.$baseConfig.cookieData.date
          };
          this.$baseFunction.setCookie(userTokenCookie)
          let id=`${res.work_record_id}`   //这里是存班次的id到cookie
          const work_record_idCookie = {
            url: this.$store.state.basic.domainUrl,
            value:id,
            name:'work_record_id',
            expirationDate: this.$baseConfig.cookieData.date
          };
          this.$baseFunction.setCookie(work_record_idCookie)

           //这里是存用户的登陆信息,例如班次等
          let user_login_infoData=JSON.stringify(res.user_login_info)
          console.log(user_login_infoData)
          const user_login_info = {
            url: this.$store.state.basic.domainUrl,
            value:user_login_infoData,
            name:'user_login_info',
            expirationDate: this.$baseConfig.cookieData.date
          };
          this.$baseFunction.setCookie(user_login_info)
          // let user_login_infos=await this.$baseFunction.getCookie(this.$baseConfig.baseUrl,'user_login_info')
          // user_login_infos=JSON.parse(user_login_infos)
          // console.log(user_login_infos);
          ipc.send('add');
        }else{
          this.$Message.error(res.message);
        }
      },
      userSelect(value){   //这里的value是直接选择项的name值
        this.username=value
      },
      async searchList(){
          this.userList=this.cookieList;    
          let arr=this.userList.filter((value,index,array)=>{
            return value.indexOf(this.username)!=-1
          })
          this.userList=arr;     
      },
      async setName(){
        let cashResgiterId = this.$store.state.basic.resgiters_id
        if(!cashResgiterId || cashResgiterId == ""){
          cashResgiterId = 0
        }
        let res=await this.$request.getData('/cseller/getSellerInfoByNum',{num:this.SellerNum,cash_register_id:cashResgiterId})
        if(res.level=='success'){
          this.name=res.data.name
          this.$store.dispatch('setBanData',res.data)
        }else{
          this.$baseFunction.showTotals(this,res.message)
        }
      },
      async readConfig(){
        let configDir = remote.app.getPath('userData');
        const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
        var _this = this
        fs.exists(newFile_path, (exists) => {
          if (!exists) {
            _this.setDomain()
            return;
          } else {
            let getInfo = fs.readFileSync(newFile_path)
            if(getInfo == ""){
              _this.setDomain()
            }else {
              let result = JSON.parse(getInfo);
              if(result.domain == "" || result.num == ""){
                _this.setDomain()
              }else {
                _this.SellerNum = result.num;
                _this.$store.dispatch('setDomainUrl',result.domain)
                _this.$store.dispatch('setSellerNum',result.num)
                _this.$store.dispatch('setResgiters_id',result.resgiters_id)
                baseUrl.baseUrl = result.domain + "/api"


                _this.setName();
              }
            }
          }
        });
      },
    },
    async mounted(){
      this.readConfig();
      let baseUrl=await this.$baseFunction.getFileData()
      let res=await this.$baseFunction.getCookie(baseUrl,'cookieList')
      this.cookieList=res;
      this.userList=res;
      let date=new Date()
      this.dataTime=date.getFullYear()+"-"+(date.getMonth()+1) +"-"+date.getDate()+" "+(date.getHours() < 10 ? "0" + date.getHours() : date.getHours())+":"+(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())+":"+(date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
    },
    async created(){
      let res=await this.$baseFunction.getFileData()
      console.log(res)
      setInterval(()=>{
         ipc.on('coin-messages', (event, arg) => {
            this.showMessage=arg
         })
      },21000)
    }
  }
</script>

<style>
#login{width: 800px;height:600px;display: flex;justify-content: row;}
.login_left{width: 360px;}
.login_left img{width: 360px;height: 600px;display: block;}
.login_right{flex: 1;}
.close{width: 40px;height: 40px;display: block;float: right;}
.right_title{width: 300px;line-height: 33px;font-size: 24px;color: #303039;margin:60px auto 0px;}
.right_company{width: 300px;line-height: 20px;font-size: 14px;color: #5F5F68;margin:10px auto 0px;}
.right_details{width: 300px;margin: 50px auto 0px;}
.right_details>li{margin-bottom: 10px;font-size: 14px;color: #303039;}
.right_details>li .name,.right_details>li Input,.right_details>li .name div:nth-of-type(1){height: 50px;}
.right_tip{width: 300px;font-size: 14px;color: #5F5F68;line-height: 20px;margin:10px auto 20px;}
.right_tip span{color: #2684ee;}
.right_btn{width: 300px;margin: 30px auto 0px;display: flex;justify-content: row;}
.right_btn div{width:140px;height:50px;font-size: 18px;text-align: center;border-radius: 8px;line-height: 50px;cursor: pointer;}
.right_btn .login_btn{background: #1E7FEE;color: #FFFFFF;}
.right_btn .hand_btn{background: #8BC0FF;color: #303039;margin-left: 15px;}
#login .ivu-dropdown-rel {width: 300px;height: 50px;}
#login .ivu-dropdown-rel .ivu-input-wrapper{position: absolute;}
.ivu-dropdown-rel .ivu-icon{position: absolute;width: 14px;height: 14px;right: 18px;top: 18px;}
#login .ivu-dropdown .ivu-select-dropdown{width: 300px;left: 0;}
 .ivu-dropdown .ivu-select-dropdown{width: 100px;left: 0;}
#login .ivu-select-single .ivu-select-selection .ivu-select-placeholder,#login .ivu-select-single .ivu-select-selection .ivu-select-selected-value{height: 50px;line-height: 50px;border: 1px solid #dcdee2;border-radius: 6px;}
</style>
