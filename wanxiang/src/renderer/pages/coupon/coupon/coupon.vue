<template>
  <div id="couponDetails">
    <readCard></readCard>
    <div class="couponDetails_content">
      <div class="couponDetails_content_title">优惠券</div>
      <div class="couponDetails_content_continer">
        <div class="couponDetails_content_wrap" ref="left">
          <vue-scroll :ops="ops">
            <ul>
              <li class="select">
                <div class="couponDetails_content_left">
                  <div class="couponDetails_content_tao">满100元减10元<br/>（仅购币使用）</div>
                  <div class="couponDetails_content_number">P3928922</div>
                </div>
                <div class="couponDetails_content_right">
                  <div class="couponDetails_content_ko">优惠<br/>抵扣</div>
                  <div class="couponDetails_content_time">11月10日-12月10日</div>
                </div>
              </li>
              <li>
                <div class="couponDetails_content_left">
                  <div class="couponDetails_content_tao">满100元减10元<br/>（仅购币使用）</div>
                  <div class="couponDetails_content_number">P3928922</div>
                </div>
                <div class="couponDetails_content_right">
                  <div class="couponDetails_content_ko">优惠<br/>抵扣</div>
                  <div class="couponDetails_content_time">11月10日-12月10日</div>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </div>
    <cardFooter><span slot="card_money">优惠券:满10</span><span slot="card_name">发放</span></cardFooter>
  </div>
</template>

<script>
import cardFooter from '@/components/cardFooter.vue';
import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import readCard from '@/components/readCard.vue';
  export default {
    name: 'landing-page',
    components: { cardFooter ,readCard ,vueScroll},
    data(){
      return {
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
    methods: {
      select(){
        console.log('aaa')
      }
    },
    mounted(){
      // this.$nextTick(()=>{
      //   const scroll=new BScroll(this.$refs.left,{
      //     click:true
      //   })
      //   console.log(scroll)
      // })
    }
  }
</script>

<style scoped>
#couponDetails{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
.couponDetails_content{width: calc(100%-60px;);flex:1;margin:0 30px;display: flex;flex-direction: column;}
.couponDetails_content_title{width: 100%;height: 69px;line-height: 69px;font-size: 18px;color: #5F5F68;text-indent: 20px;}
.couponDetails_content_continer{flex: 1;overflow-y: hidden;}
.couponDetails_content_wrap{width: calc(100%-56px);height: 100%;margin: 0px 28px;}
.couponDetails_content_wrap ul{display: flex;justify-content: row;flex-wrap: wrap;}
.couponDetails_content_wrap ul li{width: 336px;height: 148px;background-image: url('http://file.rzkeji.com/web/wanxiang/icon/coupon1.png');background-repeat: no-repeat;background-position: center;margin: 0px 16px 16px 0px;display: flex;}

.couponDetails_content_wrap ul li.select{background-color: #0D6BDA;background-image: url('http://file.rzkeji.com/web/wanxiang/icon/coupon2.png');}

.couponDetails_content_left{width: 170px;height: 100%;margin-left:30px }
.couponDetails_content_right{flex: 1;}
.couponDetails_content_left div,.couponDetails_content_right div{width: 100%;text-align: center;}
.couponDetails_content_tao{margin: 36px auto 10px;font-size: 18px;color: #FFFFFF;}
.couponDetails_content_number{height: 20px;font-size: 14px;color: #0D6BDA;line-height: 20px;}
.couponDetails_content_ko{margin: 36px auto 10px;font-size: 20px;color: #FFFFFF;}
.couponDetails_content_time{font-size: 12px;line-height: 20px;color: #FFFFFF;}
</style>
