<template>
  <div id="entryCheckOut">
    <ul class="entryCheckOut_title">
      <li>
        <div class="entryCheckOut_title_container">
          <div class="entryCheckOut_title_title">收银机</div>
          <div class="entryCheckOut_title_details">{{user_login_info.cash_register_name}}</div>
        </div>
        <div class="entryCheckOut_title_container">
          <div class="entryCheckOut_title_title">收银员</div>
          <div class="entryCheckOut_title_details">{{user_login_info.username}}</div>
        </div>
      </li>
      <li>
        <div class="entryCheckOut_title_container">
          <div class="entryCheckOut_title_title">班次</div>
          <div class="entryCheckOut_title_details">{{user_login_info.work_classes_name}}</div>
        </div>
        <div class="entryCheckOut_title_container">
          <div class="entryCheckOut_title_title">营业日期</div>
          <div class="entryCheckOut_title_details">{{user_login_info.work_start_time}}</div>
        </div>
      </li>
      <!--<li>-->
        <!--<div class="entryCheckOut_title_container">-->
          <!--<div class="entryCheckOut_title_title">营业时间结束时间</div>-->
          <!--<div class="entryCheckOut_title_details">{{user_login_info.work_end_time}}</div>-->
        <!--</div>-->
      <!--</li>-->
    </ul>

    <ul class="entryCheckOut_nav">
      <li @click="select('0')" :class="{select:selectIndex=='0'}">实点现金</li>
      <!-- <li @click="select('1')" :class="{select:selectIndex=='1'}">实点优惠券</li> -->
    </ul>
    <div class="entryCheckOut_wrap" ref="left">
      <vue-scroll :ops="ops">
        <ul>
          <li class="entryCheckOut_wrap_li" v-for="(value,index) in dataList">
            <div class="entryCheckOut_wrap_one">
              <div class="entryCheckOut_wrap_title">支付方式</div>
              <Select style="width:260px;height:50px;" size="large" v-model="value.type">
                <Option  value="wechat" style="height:50px;">微信</Option>
                <Option  value="alipay" style="height:50px;">支付宝</Option>
                <Option  value="cash" style="height:50px;">现金</Option>
                <Option  value="pos" style="height:50px;">POS机</Option>
              </Select>
            </div>
            <div class="entryCheckOut_wrap_one">
              <div class="entryCheckOut_wrap_title">实点金额</div>
              <input v-model="value.money" class="entryCheckOut_wrap_content"/>
              <!-- <div class="entryCheckOut_wrap_content">{{value.money}}</div> -->
            </div>
            <div class="entryCheckOut_wrap_btn" @click="add">+</div>
          </li>
          <div class="entryCheckOut_textArea">
            <div class="entryCheckOut_textArea_title">备注</div>
            <textarea v-model="remark"></textarea>
          </div>
          <div class="entryCheckOut_join" @click="comfirm">录入</div>
        </ul>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
  import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
  export default {
    name: 'entryCheckOut',
    data(){
      return {
        selectIndex:'0',
        user_login_info:"",
        dataList:[{
          money:"",
          type:""
        }],
        remark:"",
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
    components: { vueScroll },
    computed:{
    },
    methods: {
      select(value){
        this.selectIndex=value
      },
      add(){
        this.dataList.push({
          money:"",
          type:""
        })
      },
      async comfirm(){
        let res=await this.$request.postData('/special/EntryAccount',{work_classes_id:this.user_login_info.work_classes_id,cash_register_id:this.user_login_info.cash_register_id,manager_user_id:this.user_login_info.manager_user_id,pays:this.dataList,remark:this.remark})
        this.$baseFunction.showTotals(this,res.message)
        if(res.level=='success'){
          this.dataList=[{money:"",type:""}]
          this.remark=''
        }
      }
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
      let user_login_info=await this.$baseFunction.getCookie(baseUrl,'user_login_info')
      this.user_login_info=JSON.parse(user_login_info)
      // console.log(user_login_info);
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    }
  }
</script>

<style scoped>
#entryCheckOut{width: 100%;height: 100%;display: flex;flex-direction: column;}
.entryCheckOut_title{width: calc(100%-60px);margin: 45px 30px 0px;}
.entryCheckOut_title li{width: 100%;height: 74px;display: flex;margin-bottom: 30px;}
.entryCheckOut_title_container{width: 300px;height: 100%;margin-right: 60px;}
.entryCheckOut_title_title{margin-bottom: 4px;line-height: 20px;font-size: 14px;color: #5F5F68;}
.entryCheckOut_title_details{width: 100%;height: 50px;line-height: 50px;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;text-indent: 10px;}
.entryCheckOut_nav{height: 60px;line-height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;display:flex;margin-left: 30px;}
.entryCheckOut_nav li{width: 120px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
.entryCheckOut_nav li.select{border-bottom: 4px solid  #3B89E5;}
.entryCheckOut_wrap{flex: 1;overflow-y: hidden;margin-top: 20px;}
.entryCheckOut_wrap ul{width: calc(100%-80px);margin: 40px 0px 0px 80px;padding-bottom: 30px;}
.entryCheckOut_wrap_li{width: 860px;height: 80px;background: #FFFFFF;border: 1px solid #EFEFF4;box-shadow: 0 1px 3px 0 rgba(0,0,0,0.20);border-radius: 6px;margin-bottom: 10px;display: flex;}
.entryCheckOut_wrap_one{width: 360px;height: 50px;display: flex;margin-top: 15px;}
.entryCheckOut_wrap_title{width: 90px;line-height: 50px;margin-right: 10px;text-align:right;}
.entryCheckOut_wrap_content{width: 260px;height: 50px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;text-indent: 10px;line-height: 50px;}
.entryCheckOut_wrap_btn{width: 40px;height: 40px;background: #9dc4f2;border-radius: 40px;text-align: center;line-height: 40px;font-size: 30px;color: #fff;margin:20px 0px 0px 60px;}
.entryCheckOut_textArea{width: 750px;display: flex;margin:30px 0px 0px 80px;}
.entryCheckOut_textArea_title{width: 90px;height: 35px;font-size: 14px;color: #303039;text-align: right;}
.entryCheckOut_textArea textarea{width: 640px;height: 100px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;margin-left: 10px;font-size: 16px;padding:10px;}
.entryCheckOut_join{width: 140px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin:30px 300px;}
</style>
