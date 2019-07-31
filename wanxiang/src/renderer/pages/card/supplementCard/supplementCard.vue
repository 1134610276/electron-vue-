<template>
  <div id="supplementCard">
    <readCard></readCard>
    <div class="supplementCard_content_wrap">
      <div class="supplementCard_content">
        <div class="supplementCard_content_title">续费信息</div>
        <ul class="clearfloat">
          <li class="supplementCard_li">
            <div>
              <div class="supplementCard_title">续费期限</div>
              <Select style="width:260px;height:50px;" size="large" v-model="qixian" @on-change='change'>
                  <Option  :value="index" style="height:50px;" v-for="(value,index) in xuqiData.qixian" :key="value.name">{{value.name}}</Option>
              </Select>
            </div>
            <div>
              <div class="supplementCard_title">续期费用</div>
              <input type="text" v-model="money" disabled="disabled"/>
            </div>
          </li>
          <li class="supplementCard_li">
            <div>
              <div class="supplementCard_title">续期前有效期</div>
              <input type="text" v-model="xuqiData.start_time" disabled="disabled"/>
            </div>
            <div>
              <div class="supplementCard_title">续期后有效期</div>
              <input type="text" v-model="end_time" disabled="disabled"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <cardFooter type="xuqi" ><span slot="card_money">续期费用:{{money}}</span><span slot="card_name">续期</span></cardFooter>
  </div>
</template>
<script>
import readCard from '@/components/readCard.vue';
import cardFooter from '@/components/cardFooter.vue';
  export default {
    name: 'landing-page',
    data(){
      return {
        money:"",
        nian:"",
        start_time:"",
        qixian:"",
        end_time:""
      }
    },
    components: { readCard ,cardFooter},
    computed:{
      xuqiData(){
        console.log(this.$store.state.card.xuqiData)
        return this.$store.state.card.xuqiData
      },
    },
    mounted(){
      this.$store.dispatch('setReadCardType','renewal_card');
    },
    methods:{
      change(value){
        this.$store.dispatch('setMember_change_rule_id',this.xuqiData.qixian[value].id);
        this.money=this.xuqiData.qixian[value].amount_money
        var now=new Date(this.xuqiData.start_time)
        var years = now.getFullYear();
        var months = now.getMonth()+1;
        var days = now.getDate();
        var hours = now.getHours();
        var NextNow = new Date(months+"/"+days+"/"+years)
        NextNow = NextNow.valueOf()
        NextNow = NextNow + this.xuqiData.qixian[value].active_time * 24 * 60 * 60 * 1000
        NextNow = new Date(NextNow)
        this.end_time=NextNow.getFullYear()+'-'+(NextNow.getMonth()+1)+'-'+NextNow.getDate()+' 23:59:59'
      }
    },
    destroyed(){
      this.$store.dispatch('setXuqiData','')
    }
  }
</script>

<style scoped>
#supplementCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.supplementCard_content_wrap{flex: 1;}
.supplementCard_content{background-color: #fff;margin:0px 30px;height: 100%;}
.supplementCard_content_title{height: 60px;line-height: 60px;text-indent: 10px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;}
.supplementCard_content ul{margin:40px 0px 0px 68px;}
.supplementCard_li{width: 720px;height: 50px;display: flex;margin-bottom:20px; }
.supplementCard_li>div{width: 360px;height: 50px;display: flex;}
.supplementCard_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 5px;}
.supplementCard_li>div input{width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}


@media screen and (max-width: 1025px) {
  .supplementCard_li{width: 630px;}
 .supplementCard_li>div{width: 320px;} 
}
</style>
