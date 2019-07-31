<template>
  <div  class="domain drag" >
    <div class="domain_wrap">
        <div class="domain_title">商家初始化设置<img src="http://file.rzkeji.com/web/wanxiang/icon/closeMessage.png" @click="close()" class="authorization_close"/></div>
        <div class="domain_content">
            <div class="domain_content_user">域名设置</div>
            <input placeholder="填写域名" class="domain_content_userInput" v-model="domain"/>
            <div class="domain_content_password">商户编号</div>
            <input placeholder="输入商户编号" class="domain_content_passwordInput" v-model="num" @blur="setName"/>
            <div class="domain_content_why">商户名称</div>
            <input placeholder="商户名称显示" class="domain_content_passwordInput" v-model="name" disabled/>
            <div class="domain_content_why">收银机号</div>
            <Select  class="name" v-model="cashNumber" style="width:300px;height:50px;margin:0px 0px 20px 60px;" @on-change="changeProduct()">
                <Option v-for="item in cash_resgiters" :value="item.id" :key="item.name"  style="width:300px;line-height:50px;">{{ item.name }}</Option>
            </Select>
        </div>
        <ul class="domain_btn">
            <!-- <li>刷卡</li> -->
            <li @click="confirm">确定</li>
        </ul>
    </div>
  </div>
</template>

<script>
    const path = require('path');
    const fs = require("fs");
    import baseUrl from '@/utils/baseConfig';
    const {remote} = require('electron');
    export default {
        name: 'domain',
        data(){
            return {
                domain:"http://dev-test.allonyun.com",
                num:"",
                name:"",
                cash_resgiters:"",
                cashNumber:"",
                cashName:""
            }
        },
        methods: {
            changeProduct(){
                let cashName =this.cash_resgiters.find(item => item.id === this.cashNumber)['name']
                this.cashName = cashName
            },
            close(){
                this.$store.dispatch('setDomainTag',false)
            },
            async setName(){
                let domain=this.domain+'/api/cseller/getSellerInfoByNum'
                this.$http.get(domain,{params:{num:this.num}}).then(res=>{
                    console.log(res)
                    if(res.data.level=='success'){
                        this.name=res.data.data.name
                        this.cash_resgiters=res.data.data.cash_resgiters
                        this.$store.dispatch('setBanData',res.data.data)
                    }else{
                        alert(res.data.message)
                    }
                })
            },
            confirm(){
                if(this.domain == "" || this.num == ""){
                    alert("域名和商家编号不能为空")
                }else {
                    this.writeConfig()
                    this.$store.dispatch('setDomainTag',false)
                }
            },
            writeConfig() {
                let configDir = remote.app.getPath('userData');
                const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
                let result = {"domain":this.domain,"num":this.num,'resgiters_id':this.cashNumber,'resgiters_name':this.cashName,moneyPrint:"",ticketPrint:""}
                let newData = JSON.stringify(result, null, 4);
                fs.writeFile(newFile_path, newData, (error) => {
                    if (error) {
                        console.error(error);
                    }
                    this.$store.dispatch('setDomainUrl',this.domain)
                    this.$store.dispatch('setSellerNum',this.num)
                    this.$store.dispatch('setResgiters_id',this.cashNumber)
                    console.log(this.$store.state.basic.resgiters_id)
                });
            },
            readMyConfig(){
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
                                _this.domain     = result.domain
                                _this.num        = result.num
                                baseUrl.baseUrl = result.domain + "/api"
                                _this.setName();
                                console.log(result.resgiters_id)
                                _this.cashNumber = result.resgiters_id
                            }
                        }
                    }
                });
            },
            setDomain(){
              this.$store.dispatch('setDomainTag',true)
            },
        },
        mounted(){
            this.readMyConfig()
        }
    }
</script>
    
<style>
.domain {width:100%;height:100%;position: absolute;left: 0;top: 0;background-color: rgba(0,0,0,0.8);z-index: 99;}
.domain_wrap{width: 400px;height: 500px;background-color: #fff;border-radius: 6px;position: absolute;left: 50%;top: 50%;margin-left: -210px;margin-top: -250px;}
.domain_title{width: 100%;height: 50px;line-height: 50px;text-indent: 10px;background: #3B89E5;border-radius: 6px 6px 0px 0px;font-size: 20px;color: #FFFFFF;position: relative;}
.domain_close{width:50px;height:50px;position: absolute;right: 0px;top: 0px;cursor: pointer;}
.domain_content_user,.domain_content_password,.domain_content_why{font-size: 14px;color: #303039;text-indent: 60px;}
.domain_content_user{margin-top: 20px;}
.domain_content_userInput,.domain_content_passwordInput{width: 300px;height: 50px;font-size: 18px;color: #B2B2B9;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 8px;margin:5px 0px 10px 60px;}

.domain_btn{width: 100%;height: 50px;display: flex;justify-content: center;margin-top: 30px;}
.domain_btn li{width: 140px;height: 100%;line-height: 50px;text-align: center;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;cursor: pointer;}
.domain_btn li:nth-of-type(1){background: #8BC0FF;margin-right: 20px;}
.domain_btn li:nth-of-type(2){background: #3B89E5;}
</style>