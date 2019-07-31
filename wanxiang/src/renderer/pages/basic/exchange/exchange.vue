<template>
  <div id="exchange" class="drag">
    <div class="exchange_header">
      <div class="exchange_left drag">
        <ul class="exchange_classify clearfloat drag">
          <li :class="{select:selectIndex.name==value.name}" @click="select(value.name,value.id)" v-for="(value,index) in classifyData">{{value.name}}</li>
        </ul>
        <div class="exchange_select drag">
          <div class="exchange_wrap" ref="left">
            <vue-scroll :ops="ops">
              <ul>
                <li v-for="(value,index) in dataList" @click="selectShop(value)" :class="{select:selectId==value.id?true:false}">
                  <div class="exchange_details_left">
                    <div>{{value.ssn_num}}</div>
                    <img :src="value.thumb_url"/>
                  </div>  
                  <div class="exchange_details_right">
                    <div class="details_title">{{value.name}}</div>
                    <div class="details_size">{{value.desc}}</div>
                    <div class="details_money">{{value.amount_money |moneyFromat}}<span>元/</span>{{value.amount_coin}}<span>币</span></div>
                    <div class="details_stock">剩余库存：{{value.last_stock}}</div>
                  </div>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </div>
        <coinsFooter type="shopCard" ><span slot="footer_title">商品费用：</span><span slot="footer_btn">购买商品</span></coinsFooter>
       </div>
       <div class="exchange_right"><shopCard></shopCard></div>
    </div>
  </div>
</template>

<script>
import Titlebtn from '@/components/btn.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import shopCard from '@/components/shopCard.vue'
import coinsFooter from '@/components/coinsFooter.vue';
  export default {
    name: 'landing-page',
    data(){
      return {
        selectIndex:"",
        dataList:"",
        classifyData:"",
        userToken:"",
        selectId:"",
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
    components: { Titlebtn , coinsFooter ,shopCard ,vueScroll},
    computed:{

    },
    methods: {
      select(value,id){  //点击商品分类导航执行切换
        this.selectIndex.name=value;
        this.getDataList(id);
      },
      selectShop(value){
        this.selectId=value.id
        console.log(value)
        this.$store.dispatch('setSelectData1',value)
      },
      async classifyDataList(){  //获取商品的分类列表
        let res=await this.$request.getData('/goods/get-goods-retail-classify',{user_token:this.userToken})
        this.classifyData=res.data;
        this.selectIndex= {name:this.classifyData[0].name,id:this.classifyData[0].id};
        this.getDataList(this.selectIndex.id);
      },
      async getDataList(id){   //获取商品分类对应的数据
        let res=await this.$request.getData('/goods/get-goods-retail-list',{user_token:this.userToken,classify_id:id})
        this.dataList=res.data;
      },
    },
    async mounted(){
      let baseUrl=await this.$baseFunction.getFileData()
            this.userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie');
      this.classifyDataList();
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      // })
    },
    destroyed(){
      this.$store.dispatch('setSelectData1','')
    }
  }
</script>

<style scoped>
#exchange{width:100%;height:100%;background-color: #efeff4;position: relative;}
.exchange_header{display: flex;height: 100%;}
.exchange_left{flex:1;margin:0px 0px 0px 20px;display: flex;flex-direction:column;height: 100%;overflow-y: hidden;}
.exchange_right{width: 340px;height: 100%;margin-left:20px;}
.exchange_classify{width: 100%;margin-top: 20px;}
.exchange_classify li{width: 100px;height: 60px;background: #E3E3EA;font-size: 16px;color: #5F5F68;text-align: center;line-height: 60px;float: left;cursor: pointer;border-bottom: 1px solid #ceced6;margin-bottom: 10px;border-right: 1px solid #ceced6;}
.exchange_classify li.select{background:#fff;}
.exchange_classify li:nth-of-type(1){border-radius: 6px 0px 0px 0px;}
.exchange_classify li:nth-last-of-type(1){border-radius: 0px 6px 0px 0px;}
.exchange_select{width: 100%;background-color: #fff;overflow-y: hidden;flex:1;}
.exchange_wrap{width: 100%;height: 100%;}
@media screen and (min-width:1600px){
  .exchange_select ul{width: 100%;padding-bottom: 30px;display: flex;flex-wrap: wrap;}
.exchange_select ul li{width: 322px;height: 180px;border: 1px solid #CECED6;border-radius: 6px;display: flex;justify-content: row;margin:15px 0px 0px 15px;cursor: pointer;}
.exchange_select ul li.select{border: 3px solid #3B89E5;}
.exchange_details_left{width: 148px;height: 100%;position: relative;border-right: 1px solid #C4C4CA;}
.exchange_details_left div{width: 100%;height: 20px;font-size: 12px;color: #5F5F68;position: absolute;left: 0;top: 3px;text-indent:5px;z-index: 99;}
.exchange_details_left img{width: 100%;height: 100%;position: absolute;left: 0;top: 0;}
.exchange_details_right{flex: 1;height: 100%;position: relative;}
.exchange_details_right div{position: absolute;left: 15px;}
.exchange_details_right .details_number{width: 18px;height: 18px;left: 145px;top: 5px;background: #FF3B30;border-radius: 18px;text-align: center;line-height: 18px;font-size: 12px;color: #FFFFFF;}
.details_title{top: 20px;font-size: 24px;color: #5F5F68;}
.details_size{top: 53px;font-size: 18px;color: #5F5F68;}
.details_stock{top: 115px;font-size: 15px;color: #5F5F68;}
.details_money{top:80px;font-size: 24px;color: #303039;}
.details_money span{font-size: 14px;}
.details_dimension{top: 143px;font-size: 12px;color: #303039;}
}

@media screen and (max-width: 1025px) {
.exchange_classify li{width: 105px;}

}

@media screen and (max-width: 1600px) {
.exchange_select ul{width: 100%;padding-bottom: 30px;display: flex;flex-wrap: wrap;}
.exchange_select ul li{width:22%;height: 280px;border: 1px solid #CECED6;border-radius: 6px;display: flex;flex-wrap:wrap;margin:15px 0px 0px 15px;cursor: pointer;}
.exchange_select ul li.select{border: 3px solid #3B89E5;}
.exchange_details_left{width: 100%;height: 160px;position: relative;border-right: 1px solid #C4C4CA;}
.exchange_details_left div{width: 100%;height: 20px;font-size: 12px;color: #5F5F68;position: absolute;left: 0;top: 3px;text-indent:5px;z-index: 99;}
.exchange_details_left img{width: 100%;height: 100%;position: absolute;left: 0;top: 0;}
.exchange_details_right{flex: 1;height: 100%;margin-top:5px;padding-left:10px;}
.exchange_details_right div{width:100%;}
.exchange_details_right .details_number{width: 18px;height: 18px;left: 145px;top: 5px;background: #FF3B30;border-radius: 18px;text-align: center;line-height: 18px;font-size: 12px;color: #FFFFFF;}
.details_title{top: 20px;font-size: 20px;color: #5F5F68;}
.details_size{top: 53px;font-size: 16px;color: #5F5F68;}
.details_stock{top: 115px;font-size: 12px;color: #5F5F68;}
.details_money{top:80px;font-size: 20px;color: #303039;}
.details_money span{font-size: 12px;}
.details_dimension{top: 143px;font-size: 12px;color: #303039;}
}
</style>
