<template>
    <div id="orderCheckOut">
        <ul class="orderCheckOut_title">
            <li>
                <div class="orderCheckOut_title_container">
                    <div class="orderCheckOut_title_title">商品名称</div>
                    <input class="orderCheckOut_title_details" v-model="goods_name"/>
                </div>
                <div class="orderCheckOut_title_container">
                    <div class="orderCheckOut_title_title">商品编号/条码</div>
                    <input class="orderCheckOut_title_details" v-model="goods_ssn" @keydown.enter="selectData" />
                </div>
                <div class="orderCheckOut_title_container" style="width: 100px;height: 35px">
                    <div class="orderCheckOut_title_title">商品类型</div>
                    <Select style="height:35px;width: 100px" size="large" v-model="goods_type" class="media" @on-change='getGoodsType'>
                        <Option  value="" style="height:50px;">全部</Option>
                        <Option  value="ticket" style="height:50px;">门票</Option>
                        <Option  value="physical_commodity" style="height:50px;">商品销售</Option>
                        <Option  value="member_card" style="height:50px;">会员卡</Option>
                        <Option  value="give_card" style="height:50px;">赠送卡</Option>
                        <Option  value="interim_card" style="height:50px;">临时卡</Option>
                        <Option  value="entity_coin" style="height:50px;">实体币</Option>
                        <Option  value="invent_coin" style="height:50px;">虚拟币</Option>
                        <Option  value="recharge_money" style="height:50px;">余额充值</Option>
                        <Option  value="gift_convert" style="height:50px;">兑换商品</Option>
                    </Select>
                </div>
                <div class="orderCheckOut_title_container" style="height:50px;width:100px;margin-top:25px;">
                    <div class="orderCheckOut_title_title" style="width:100%;height:100%;line-height:50px;text-align:center;border-radius:6px;background-color:#5CA7FF;color:#fff;cursor:pointer" @click="getData(0)">查询订单</div>
                </div>
            </li>
        </ul>
        <div class="orderCheckOut_content_wrap">
            <div class="orderCheckOut_content" >
                <ul class="orderCheckOut_content_ul">
                    <li style="width:150px;">商品编号</li>
                    <li style="width:150px;">商品条码</li>
                    <li style="width:250px;">商品名称</li>
                    <li style="width:100px;">商品类型</li>
                    <li style="width:100px;">售价</li>
                    <li style="width:100px;">原库存</li>
                    <li style="width:100px;">剩余库存</li>
                </ul>
                <div class="orderCheckOut_content_container">
                    <div class="orderCheckOut_container_wrap" ref="left">
                        <vue-scroll :ops="ops">
                            <div class="orderCheckOut_container_scorll">
                                <ul class="orderCheckOut_content_ul orderCheckOut_content_ul1" v-for="(value,index) in dataList">
                                    <li style="width:150px;border-top:1px solid #DCDCE5;"><input type="text" style="width:150px;background-color:#fff;text-align:center;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;border:0px;" disabled="disabled" v-model="value.ssn_num" :title="value.ssn_num"></li>
                                    <li style="width:150px;border-top:1px solid #DCDCE5;"><input type="text" style="width:150px;background-color:#fff;text-align:center;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;border:0px;" disabled="disabled" v-model="value.bar_code" :title="value.bar_code"></li>
                                    <li style="width:250px;" :title="value.ticket_name">{{value.name}}</li>
                                    <li style="width:100px;" :title="value.type_value">{{value.type_value}}</li>
                                    <li style="width:100px;" :title="value.amount_money">￥{{value.amount_money}}</li>
                                    <li style="width:100px;">{{value.stock}}</li>
                                    <li style="width:100px;color: #80420f">{{value.last_stock}}</li>
                                </ul>
                                <Page :total="totalPage" show-elevator style="margin:20px 400px" @on-change="selectPage"/>
                            </div>
                        </vue-scroll>
                    </div>
                </div>
            </div>
        </div>
        <div  class="payShow" v-if="loading">
            <div class="payShowloading" style="position: relative">
                <loading></loading>
                <div class="payShowloading_title">等待扫描</div>
                <input v-model="ticketKey"  v-focus @keydown.enter="enter" style="opacity:0" />
            </div>
            <div class="payShow_footer_cancels" @click="cancle">取消扫描</div>
        </div>
        <printWebView v-if="printWebView_show"></printWebView>
    </div>
</template>

<script>
    import loading from '@/components/loading.vue';
    import printWebView from '@/components/printWebView.vue';
    import vueScroll from 'vuescroll';
    import 'vuescroll/dist/vuescroll.css';
    const {ipcRenderer} = require('electron')
    export default {
        name: 'landing-page',
        data(){
            return {
                loading:false,
                goods_name:"",
                goods_ssn:"",
                goods_type:"",
                type_list:"",
                dataList:"",
                totalPage:0,
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
        components: {vueScroll,loading,printWebView},
        computed: {
            printWebView_show(){
                return this.$store.state.together.printWebView_show
            }
        },
        methods: {
            cancle(){
                this.loading = false
            },
            activeAction(id){
                this.loading = true
                this.ticketId = id
            },
            async selectData(){
                this.getData(0)
            },
            async getData(page){
                this.$baseFunction.showTotals(this,'载入数据...')
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
                let res=await this.$request.getData('/goods/getGoodsList',{user_token:userToken,type:this.goods_type,ssn:this.goods_ssn,keyword:this.goods_name,page:page})
                console.log(res)
                if(res.level=='success'){
                    this.totalPage=parseInt(res.page_count) * 10
                    this.dataList=res.data.goods_list
                    if(this.dataList.length==0){
                        this.$baseFunction.showTotals(this,'暂无查询到数据')
                    }
                }else{
                    this.$baseFunction.showTotals(this,res.message)
                }
            },
            selectPage(page){
                this.getData(page-1)
            },
            getGoodsType(value){
                // if(value == "0"){
                //     this.goods_type=""
                // }else {
                    this.goods_type=value
                // }

            },
        },
        mounted(){
            this.getData(0)
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus()
                }
            }
        },
    }
</script>

<style scoped>
    #orderCheckOut{width:100%;height:100%;background-color: #EFEFF4;display: flex;flex-direction: column;overflow: hidden;}
    .orderCheckOut_title{width: calc(100%-60px);margin: 10px 30px 10px;}
    .orderCheckOut_title li{width: 100%;height: 60px;display: flex;margin-bottom: 10px;}
    .orderCheckOut_title_container{width: 180px;height: 100%;margin-right: 60px;}
    .orderCheckOut_title_title{margin-bottom: 4px;line-height: 15px;font-size: 14px;color: #5F5F68;}
    .orderCheckOut_title_details{width: 100%;height: 41px;line-height: 41px;background: #FFFFFF;border: 1px solid #E5E5EA;border-radius: 6px;font-size: 18px;color: #303039;text-indent: 10px;}

    .orderCheckOut_content_wrap{width: 100%;overflow: hidden;flex: 1;}
    .orderCheckOut_content{margin:0px 30px;display: flex;flex-direction: column;overflow-x: scroll;position: absolute;width: calc(100% - 60px);height: calc(100% - 80px - 170px);overflow-y: hidden;}
    .orderCheckOut_content_title{height: 60px;font-size: 18px;color: #5F5F68;line-height: 60px;text-indent: 10px;display: flex;justify-content: space-between;margin-top: 30px;background-color: #fff;}

    .orderCheckOut_modify{width: 80px;height: 40px;background: #5CA7FF;border-radius: 6px;font-size: 14px;color: #FFFFFF;text-align: center;line-height: 40px;margin:10px 10px;}
    .orderCheckOut_content_ul{height: 50px;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;width: 1200px;z-index: 100}
    .orderCheckOut_content_ul li{float: left;color: #5F5F68;}
    .orderCheckOut_content_container{height: calc(100% - 50px);background-color: #fff;width: 1200px;}
    .orderCheckOut_container_wrap{width: 100%;height: 100%;overflow-y: scroll;overflow-x: hidden;}
    .orderCheckOut_container_scorll{width: 100%;padding-bottom: 30px;}
    .orderCheckOut_content_ul li{height: 50px;line-height: 50px;text-align:center;border-left: 1px solid #DCDCE5;font-size: 14px;color: #8E8E93;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
    .orderCheckOut_content_ul li:nth-of-type(1){border-left: 0;}
    .orderCheckOut_content_ul1{background-color: #fff;}
    .orderCheckOut_content_ul1:nth-last-of-type(1){}
    .orderCheckOut_content_ul1 li{color: #303039;}
    .media{width: 180px;}
    @media screen and (max-width: 1025px) {
        .orderCheckOut_title_container{width: 125px; }
        .media{width: 125px;}
    }
    .tuidan_btn{width: 80px;height: 40px;background: #3B89E5;border-radius: 6px;line-height: 40px;cursor: pointer;color: #fff;margin: 5px auto;}
    .disable_btn{width: 80px;height: 40px;background: #a9aba8;border-radius: 6px;line-height: 40px;cursor: pointer;color: #fff;margin: 5px auto;}
    .payShow_footer_cancels{width: 160px;height: 50px;line-height: 50px;text-align: center;border: 2px solid #0D6BDA;border-radius: 8px;font-size: 18px;color: #3B89E5;position: absolute;cursor: pointer;left: 40px;top:30px;margin: 330px 303px;}
</style>
