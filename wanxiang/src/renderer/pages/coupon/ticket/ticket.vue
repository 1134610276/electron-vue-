<template>
  <div id="ticketDetails">
    <readCard></readCard>
    <div class="ticketDetails_content" > 
      <div class="ticketDetails_content_title">
          <b>存票操作</b>
          <div class="ticketDetails_content_btn" @click="shou">授权手动输入</div>
      </div>
      <div class="ticketDetails_details">
        <ul>
          <li class="ticketDetails_details_li">
            <div class="ticketDetails_details_details">
              <div class="ticketDetails_details_title">存票数量</div>
              <Select style="width:260px;height:50px;margin-left:10px;" size="large">
                <Option  value="男" style="height:50px;">男</Option>
                <Option  value="女" style="height:50px;">女</Option>
              </Select>
            </div>
            <div class="ticketDetails_details_details">
              <div class="ticketDetails_details_title">存票数量</div>
              <div class="ticketDetails_details_content">0</div>
            </div>
          </li>
          <li class="ticketDetails_details_li">
            <div class="ticketDetails_details_details">
              <div class="ticketDetails_details_title">有效日期</div>
              <div class="ticketDetails_details_content">2019-12-11（3年）</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="ticket_btn">确定</div>
    </div>
  </div>
</template>

<script>
import readCard from '@/components/readCard.vue';

  export default {
    name: 'landing-page',
    components: { readCard },
    methods: {
      shou(){
        this.$store.dispatch('setAuthorizationShow',true)
      }
    },
    mounted(){

    }
  }
</script>

<style scoped>
#ticketDetails{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.ticketDetails_content{background-color: #fff;margin:20px 30px 0px 30px;min-width: 1040px;height: 100%;overflow-y: hidden;display: flex;flex-direction: column;}
.ticketDetails_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;line-height: 60px;display: flex;justify-content: space-between;}
.ticketDetails_content_title b{text-indent: 20px;}
.ticketDetails_content_btn{width: 100px;height: 40px;margin: 10px 20px;background: #8BC0FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;cursor: pointer;}
.ticketDetails_details{width: 720px;height: 180px;margin: 40px 68px;}
.ticketDetails_details_li{width: 100%;height: 50px;display: flex;margin-top: 20px;}
.ticketDetails_details_details{width:360px;display: flex;}
.ticketDetails_details_title{width: 90px;line-height: 50px;font-size: 14px;color: #303039;text-align: right;}
.ticketDetails_details_content{flex: 1;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;margin-left: 10px;}
.ticket_btn{width: 100px;height: 50px;background: #3B89E5;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;margin-left: 168px;}
</style>
