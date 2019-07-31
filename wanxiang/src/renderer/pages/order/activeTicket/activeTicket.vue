<template>
    <div id="orderCheckOut">
        <ul class="orderCheckOut_title">
            <li>
                <div class="orderCheckOut_title_container">
                    <div class="orderCheckOut_title_title">订单号</div>
                    <input class="orderCheckOut_title_details" v-model="order_num"/>
                </div>
                <div class="orderCheckOut_title_container">
                    <div class="orderCheckOut_title_title">门票编号</div>
                    <input class="orderCheckOut_title_details" v-model="ticket_num" @keydown.enter="selectData" />
                </div>
                <div class="orderCheckOut_title_container" style="width: 100px;height: 35px">
                    <div class="orderCheckOut_title_title">门票类型</div>
                    <Select style="height:35px;width: 100px" size="large" v-model="ticket_type" class="media" @on-change='getTicketType'>
                        <Option  value="" style="height:41px;" selected>全部</Option>
                        <Option  value="0" style="height:41px;">普通票</Option>
                        <Option  value="1" style="height:41px;">团体票</Option>
                    </Select>
                </div>
                <div class="orderCheckOut_title_container" style="width: 100px">
                    <div class="orderCheckOut_title_title">门票属性</div>
                    <Select style="height:35px;width: 100px" size="large" v-model="type" class="media" @on-change='getType'>
                        <Option  value="" style="height:41px;" selected>全部</Option>
                        <Option  value="second" style="height:41px;">次票</Option>
                        <Option  value="cycle" style="height:41px;">周期票</Option>
                    </Select>
                </div>
                <div class="orderCh
                eckOut_title_container" style="height:50px;width:100px;margin-top:25px;">
                    <div class="orderCheckOut_title_title" style="width:100%;height:100%;line-height:50px;text-align:center;border-radius:6px;background-color:#5CA7FF;color:#fff;cursor:pointer" @click="getData(0)">查询订单</div>
                </div>
            </li>
        </ul>
        <div class="orderCheckOut_content_wrap">
            <div class="orderCheckOut_content" >
                <ul class="orderCheckOut_content_ul">
                    <li style="width:150px;">购票时间</li>
                    <li style="width:200px;">订单号</li>
                    <li style="width:140px;">门票名称</li>
                    <li style="width:80px;">门票类型</li>
                    <li style="width:80px;">使用属性</li>
                    <li style="width:150px;">有效期</li>
                    <li style="width:70px;">单价</li>
                    <li style="width:87px;">购买渠道</li>
                    <li style="width:150px;">激活码</li>
                    <li style="width:70px;">状态</li>
                    <li style="width:180px;">操作</li>
                </ul>
                <div class="orderCheckOut_content_container">
                    <div class="orderCheckOut_container_wrap" ref="left">
                        <vue-scroll :ops="ops">
                            <div class="orderCheckOut_container_scorll">
                                <ul class="orderCheckOut_content_ul orderCheckOut_content_ul1" v-for="(value,index) in dataList">
                                    <li style="width:150px;" :title="value.created_at">{{value.created_at}}</li>
                                    <li style="width:200px;border-top:1px solid #DCDCE5;"><input type="text" style="width:200px;background-color:#fff;text-align:center;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;border:0px;" disabled="disabled" v-model="value.order.order_num" :title="value.order.order_num"></li>
                                    <!-- <input type="text" style="width:200px" v-model="value.order_num"> -->
                                    <li style="width:140px;" :title="value.ticket_name">{{value.ticket_name}}</li>
                                    <li style="width:80px;color: coral" v-if="value.ticket_type == '0'">普通票</li><li style="width:80px;color: #28b3ff" v-else>团体票</li>
                                    <li style="width:80px;color: #ff3009" v-if="value.type == 'second'">次票</li><li style="width:80px" v-else>周期票</li>
                                    <li style="width:150px;" :title="value.end_time">{{value.end_time}}</li>
                                    <li style="width:70px;" :title="value.order_item.unit_price">{{value.order_item.unit_price}}</li>
                                    <li style="width:87px;color: steelblue" v-if="value.order_item.buy_from_value !== undefined">{{value.order_item.buy_from_value}}</li><li style="width:87px;" v-else>-</li>
                                    <li style="width:150px;">{{value.ticket_key}}</li>
                                    <li style="width:70px;color: #80420f" v-if="value.ticket_key == null || value.ticket_key == ''">未激活</li>
                                    <li style="width:70px;color: green" v-else-if="value.is_use == '0'">未使用</li>
                                    <li style="width:70px;color: #807d7d" v-else-if="value.is_use == '1'">已使用</li>
                                    <li style="width:70px;color: #807d7d" v-else-if="value.is_use == '2'">已过期</li>
                                    <li style="width:180px;display:flex;">
                                        <!--<div v-if="value.ticket_key == null || value.ticket_key == ''" class="tuidan_btn" @click="activeAction(value.id)">激活</div>-->
                                        <div v-if="value.ticket_key == null || value.ticket_key == ''" class="tuidan_btn" @click="activeAction(value.id)">激活</div>
                                        <div class="tuidan_btn" @click="printTicket(value.id)">打印门票</div>
                                    </li>
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
                order_num:"",
                ticket_num:"",
                ticketKey:"",
                ticketId:"",
                ticket_type:"",
                type:"",
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
            printTicket(value){
                this.$store.dispatch('setPrintSrc',`${this.$store.state.basic.domainUrl}/printTicketOne?ticket_key=${value}`)
                this.$store.dispatch('setPrintWebView_show',true)
            },
            async selectData(){
                let ticketStr = this.ticket_num
                if(ticketStr.indexOf("playticket") == -1){
                    this.ticket_num = ticketStr
                }else {
                    this.ticket_num = ticketStr.substring(ticketStr.length-14)
                }
                this.getData(0)
            },
            async enter(){
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
                let ticketKey = this.ticketKey.substring(this.ticketKey.length-14);
                let res=await this.$request.postData('/ticket/activeTicket',{user_token:userToken,ticket_key:ticketKey,id:this.ticketId})
                if(res.level == "success"){
                    this.getData(0)
                }else {
                    this.$baseFunction.showTotals(this,'激活失败')
                }
                this.ticketKey = ""
                this.loading = false
            },
            async getData(page){
                this.$baseFunction.showTotals(this,'载入数据...')
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
                let res=await this.$request.getData('/ticket/getOrderTicketList',{user_token:userToken,type:this.type,ticket_type:this.ticket_type,order_num:this.order_num,ticket_num:this.ticket_num,page:page})
                console.log(res)
                if(res.level=='success'){
                    this.totalPage=parseInt(res.page_count) * 10
                    this.dataList=res.data
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
            getTicketType(value){
                this.ticket_type=value
            },
            getType(value){
                this.type=value
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
    .orderCheckOut_content_ul{height: 50px;border-bottom:1px solid #DCDCE5;background-color: #E5E5EC;width: 1440px;z-index: 100}
    .orderCheckOut_content_ul li{float: left;color: #5F5F68;}
    .orderCheckOut_content_container{height: calc(100% - 50px);background-color: #fff;width: 1440px;}
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
