<template>
  <div id="totalCheckOut">
    <ul class="orderCheckOut_title" style="margin-top: 20px">
      <li>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">营业总收入</div>
          <div style="display:flex;">
            <input class="orderCheckOut_title_details" v-model="all_amount" />
          </div>
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">现金总收入</div>
          <input class="orderCheckOut_title_details" v-model="all_cash_amount" />
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">结账入账总额</div>
          <input class="orderCheckOut_title_details" v-model="all_summary_amount" />
        </div>
        <div class="orderCheckOut_title_container">
          <div class="orderCheckOut_title_title">结账-现金(差额)</div>
          <input class="orderCheckOut_title_details" v-model="diff_amount" />
        </div>
      </li>
    </ul>
    <div class="totalCheckOut_content_wrap">
      <div class="totalCheckOut_content">
        <div class="totalCheckOut_content_title">
          <b>今日账目总结（{{user_login_info.work_classes_name}}）</b>
          <div class="totalCheckOut_end" @click="endWork">结账</div>
          <div class="totalCheckOut_modify" @click="print">打印</div>
        </div>
        <ul class="totalCheckOut_content_ul">
          <li style="flex:1">收银机名称</li>
          <li style="flex:1">班次</li>
          <li style="flex:1">收银员名称</li>
          <li style="flex:1">收款方式</li>
          <li style="flex:1">总收款</li>
          <li style="flex:1">备注</li>
          <li style="flex:1">操作</li>
        </ul>
        <div class="totalCheckOut_content_container">
          <div class="totalCheckOut_container_wrap" ref="left">
            <vue-scroll :ops="ops">
              <div class="totalCheckOut_container_scorll">
                <ul class="totalCheckOut_content_ul totalCheckOut_content_ul1" v-for="(value,index) in dataList">
                  <li style="flex:1">{{value.cash_register_name}}</li>
                  <li style="flex:1">{{value.work_classes_name}}</li>
                  <li style="flex:1">{{value.manager_user_name}}</li>
                  <li style="flex:1">
                  <div v-if="disabled[index]">{{value.pay_type}}</div>
                  <Select style="width:100%;height:50px;" size="large" v-model="value.pay_type" v-else>
                    <Option  value="wechat" style="height:50px;">微信</Option>
                    <Option  value="alipay" style="height:50px;">支付宝</Option>
                    <Option  value="cash" style="height:50px;">现金</Option>
                    <Option  value="pos" style="height:50px;">POS机</Option>
                  </Select>
                  </li>
                  <li style="flex:1"><input v-model="value.amount" :disabled="disabled[index]"/></li>
                  <li style="flex:1"><input v-model="value.remark" :disabled="disabled[index]"/></li>
                  <li style="flex:1"><div class="totalCheckOut_modify" style="margin:5px auto;" @click="modify(value.id,index)">{{!disabled[index] ?'保存':'修改'}}</div></li>
                </ul>
              </div>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
    <printWebView v-if="printWebView_show"></printWebView>
  </div>
</template>

<script>
  import printWebView from '@/components/printWebView.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
  export default {
    name: 'landing-page',
    components: {printWebView,vueScroll},
    data(){
      return {
        dataList:"",
        user_login_info:"",
        wechat:"wechat",
        disabled:[],
        all_amount:"",
        all_cash_amount:"",
        all_summary_amount:"",
        diff_amount:"",
        userToken:"",
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
    computed: {
      printWebView_show(){
        return this.$store.state.together.printWebView_show
      }
    },
    methods: {
      async print(){
        //打印卡信息
        let baseUrl=await this.$baseFunction.getFileData()
        let work_record_id=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
        this.$store.dispatch('setPrintSrc',`${this.$store.state.basic.domainUrl}/printSummary?work_record_id=${work_record_id}`)
        this.$store.dispatch('setPrintWebView_show',true)
      },
      async endWork(){
        // let baseUrl=await this.$baseFunction.getFileData()
        // let work_record_id=await this.$baseFunction.getCookie(baseUrl,'work_record_id')
        // let res=await this.$request.postData('/special/endWorkClasses',{work_record_id:work_record_id[0],user_token:this.userToken});
        // if(res.level == "success"){
          this.$store.dispatch('setEndWorkShow',true)
        // }else {
        //   this.$baseFunction.showTotals(this,res.message)
        // }
      },
      async getData(){
        let userToken=this.userToken
        let res=await this.$request.getData('/special/getCashRegisterIncome',{user_token:userToken,work_classes_id:this.user_login_info.work_classes_id,cash_register_id:this.user_login_info.cash_register_id})
        this.dataList=res.data
        for(let [index,value] of this.dataList.entries()){
          this.disabled.push(true)
        }

        if(res.level == "success"){
          this.all_amount = res.data_count.all_amount
          this.all_cash_amount = res.data_count.all_cash_amount
          this.all_summary_amount = res.data_count.all_summary_amount
          this.diff_amount = res.data_count.diff_amount
        }
      },
      async modify(id,index){
        console.log(this.disabled)
        if(this.disabled[index]==false){
          let baseUrl=await this.$baseFunction.getFileData()
          let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
          let arr=this.dataList.filter(item =>item.id==id)[0]
          let res=await this.$request.postData('/special/updateWorkClassesSummary',{id:id,pay_type:arr.pay_type,amount:arr.amount,remark:arr.remark,user_token:userToken})
          this.$baseFunction.showTotals(this,res.message)
          // this.$set(this.disabled,index,true)
          this.disabled.splice(index,1,true)
          // console.log(this.disabled)
          return
        }
        this.disabled.splice(index,1,false)
      }
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
      this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')

      let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
       this.user_login_info=JSON.parse(user_login_info)
      this.getData()
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
  }
</script>

<style scoped>
#totalCheckOut{width:100%;height:100%;background-color: #EFEFF4;display: flex;flex-direction: column;}
.totalCheckOut_content_wrap{height: 100%;}
.totalCheckOut_content{margin:0px 30px;height: 100%;display: flex;flex-direction: column;}
.totalCheckOut_content_title{position:relative;height: 60px;font-size: 18px;color: #5F5F68;line-height: 60px;text-indent: 10px;display: flex;justify-content: space-between;margin-top: 30px;background-color: #fff}
.totalCheckOut_modify{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;text-indent: 0px;cursor: pointer;}
.totalCheckOut_end{width: 80px;height: 40px;position: absolute;right: 100px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;text-indent: 0px;cursor: pointer;}
.totalCheckOut_content_ul{width: 100%;height: 50px;display: flex;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;display: flex;justify-content: space-around;}
.totalCheckOut_content_container{width: 100%;flex:1;overflow-y: hidden;background-color: #fff;}
.totalCheckOut_container_wrap{width: 100%;height: 100%;}
.totalCheckOut_container_scorll{width: 100%;padding-bottom: 30px;}
.totalCheckOut_content_ul li{height: 50px;line-height: 50px;text-align:center;border-left: 1px solid #DCDCE5;font-size: 14px;color: #8E8E93;}
.totalCheckOut_content_ul li:nth-of-type(1){border-left: 0;}
.totalCheckOut_content_ul1{background-color: #fff;}
.totalCheckOut_content_ul1 li{color: #303039;}
.totalCheckOut_content_ul1 li input{border: 0px;height: 48px;text-align: center;background-color: #fff;}
</style>
