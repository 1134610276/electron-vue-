<template>
  <ul  class="coinsDetails">
      <li v-for="(value,index) in coninsData" @click="selectData(value)" :class="{select:selectId==value.id?true:false,drag:true}" :key="index">
        <div class="meal_header">
          <img src="http://file.rzkeji.com/web/wanxiang/icon/cionsTag.png"/>
            {{typeTitle}}
        </div>
        <div class="meal_number">
          <div>{{value.amount_money }}<span>元</span></div>
          <img src="http://file.rzkeji.com/web/wanxiang/icon/coinsDetails1.png"/>
          <div v-if="value.type != 'recharge_money'">{{value.coin}}<span>币 </span></div>
          <div v-else>{{value.money}}<span>元 </span></div>
        </div>
        <div class="meal_song">（{{value.desc}}）</div>
        <div class="meal_id">{{value.ssn_num}}</div>
      </li>
  </ul>
</template>

<script>
    export default {
        props:['coninsData','typeTitle'],
        data(){
            return {
              selectId:""
            }
        },
        methods:{
          selectData(value){
            this.selectId=value.id
            this.$store.dispatch('setGoodsId',value.id)
            this.$store.dispatch('setSelectNumber',1)
            this.$store.dispatch('setSelectData1',value)
          }
        },
    }
</script>
    
<style>
.coinsDetails{width: 100%;display: flex;flex-wrap: wrap;margin: 5px 0px 0px 0px;padding-bottom: 30px}
.coinsDetails li.select{border: 4px solid #0D6BDA;}
.meal_header{height: 23px;width: 100%;font-size: 14px;color: #5F5F68;margin-top: 3px;}
@media screen and (min-width:1800px) {
  /* .coinsDetails li{margin-left: 10px;} */
.meal_header img{width: 20px;height: 20px;margin:3px 0px 0px 8px;vertical-align: bottom;}
.meal_number{width: 100%;flex: 1;display: flex;justify-content:center;}
.meal_number div{height: 100%;line-height:70px;font-size: 34px;color: #42424B;text-align: right;}
.meal_number div span{font-size: 20px;}
.meal_number div:nth-of-type(2){text-align: left;}
.meal_number img{width: 40px;height: 40px;margin-top:15px;}
.meal_song{width: 100%;height: 28px;font-size: 20px;color: #3187E9;text-align: center;line-height: 28px;}
.meal_id{width: 60px;height: 20px;font-size: 14px;color: #B2B2B9;margin-left: 180px;}
.coinsDetails li{width: 250px;height: 158px;background: #E7F2FF;border-radius: 6px;margin-top: 10px;cursor: pointer;border: 1px solid #B3D6FF;}
}

@media screen and (max-width: 1800px) {
  .coinsDetails li{margin-left: 10px;}
  .meal_header img{width: 20px;height: 20px;margin:3px 0px 0px 8px;vertical-align: bottom;}
  .meal_number{width: 100%;flex: 1;display: flex;justify-content:center;}
  .meal_number div{height: 100%;line-height:70px;font-size: 14px;color: #42424B;text-align: right;}
  .meal_number div span{font-size: 20px;}
  .meal_number div:nth-of-type(2){text-align: left;}
  .meal_number img{width: 40px;height: 40px;margin-top:15px;}
  .meal_song{width: 100%;height: 28px;font-size: 20px;color: #3187E9;text-align: center;line-height: 28px;}
  .meal_id{width: 60px;height: 20px;font-size: 14px;color: #B2B2B9;margin-left: 110px;}
  .coinsDetails li{width: 180px;height: 158px;background: #E7F2FF;border-radius: 6px;margin-top: 10px;cursor: pointer;border: 1px solid #B3D6FF;}
    
}
@media screen and (min-width:1366px) and (max-width:1920px){
  .coinsDetails li{margin-left: 20px;}
}

</style>