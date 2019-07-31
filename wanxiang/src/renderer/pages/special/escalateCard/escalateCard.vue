<template>
    <div id="updateCard">
        <readCard></readCard>
        <div class="updateCard_content_wrap">
            <div class="updateCard_content_title">
                <ul>
                    <li>升级会员</li>
                </ul>
                <div class="specialDetails_content_btn specialDetails_content_btn1" @click="cancel" v-if="authorizationTag!=''">取消授权</div>
                <div class="specialDetails_content_btn" @click="shou">{{authorizationTag!=''?'保存':'授权修改'}}</div>
            </div>
            <div class="updateCard_contaioner">
                <div class="updateCard_wrap" ref="left">
                    <vue-scroll :ops="ops">
                        <div class="updateCard_scroll">
                            <ul class="clearfloat updateCard_content_ul">
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">新卡号</div>
                                        <input placeholder="请读取新卡号" v-model="cardNumber"/>
                                        <div class="updateCard_ka" @click="doka">读卡</div>
                                    </div>
                                    <div v-if="selectIndex!='0'">
                                        <div class="updateCard_title">换卡原因</div>
                                        <Select style="width:260px;height:50px;" size="large" v-model="card_yuan" @on-change='changeSearson'>
                                            <Option  :value="value.id" style="height:50px;" v-for="(value,index) in searson">{{value.desc}}</Option>
                                        </Select>
                                    </div>
                                    <div v-else>
                                        <div class="updateCard_title">等级更换</div>
                                        <Select style="width:260px;height:50px;" size="large" v-model="card_ji" @on-change='changeCardJi'>
                                            <Option  :value="value.id" style="height:50px;" v-for="(value,index) in gradeClassify">{{value.name}}</Option>
                                        </Select>
                                    </div>
                                </li>
                                <li class="li" v-if="selectIndex!='0'">
                                    <div>
                                        <div class="updateCard_title">等级更换</div>
                                        <div style="width:260px;line-height:50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;">{{dataList==''?'':dataList.member_grade_name}}</div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">卡有效期</div>
                                        <Select style="width:260px;height:50px;" size="large" v-model="card_time" @on-change='changeCardTime'>
                                            <Option  :value="index" style="height:50px;" v-for="(value,index) in qixian" :key="value.name">{{value.name}}</Option>
                                        </Select>
                                    </div>
                                </li>
                                <li class="li" v-if="selectIndex!='0'">
                                    <div>
                                        <div class="updateCard_title">换卡费用</div>
                                        <input v-model="money"/>
                                    </div>
                                </li>
                            </ul>
                            <ul class="clearfloat updateCard_content_ul updateCard_content_ul1">
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">姓名</div>
                                        <div>{{dataList==''?'':dataList.user_info.realname}}</div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">手机号</div>
                                        <div>{{dataList==''?'':dataList.user_info.contact}}</div>
                                    </div>
                                </li>
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">性别</div>
                                        <div v-if="(dataList==''?'':dataList.user_info.sex)==='0'">男</div>
                                        <div v-else-if="(dataList==''?'':dataList.user_info.sex)==='1'">女</div>
                                        <div v-else-if="(dataList==''?'':dataList.user_info.sex)==='2'">保密</div>
                                        <div v-else></div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">出生日期</div>
                                        <div>{{dataList==''||dataList.birth==null?'':dataList.birth.split(' ')[0]}}</div>
                                    </div>
                                </li>
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">身份证号</div>
                                        <div>{{dataList==''?'':dataList.id_card_num}}</div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">币余额</div>
                                        <div>{{dataList==''?'':dataList.coin}}</div>
                                    </div>
                                </li>
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">预存款</div>
                                        <div>{{dataList==''||dataList.money==null?'':(dataList.money.split('.')[0])}}</div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">优惠券</div>
                                        <div>{{dataList==''?'':dataList.win_ticket}}</div>
                                    </div>
                                </li>
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">活动门票</div>
                                        <div>{{dataList==''?'':dataList.win_ticket}}</div>
                                    </div>
                                    <div>
                                        <div class="updateCard_title">积分</div>
                                        <div>{{dataList==''?'':dataList.integral}}</div>
                                    </div>
                                </li>
                                <li class="li">
                                    <div>
                                        <div class="updateCard_title">奖票</div>
                                        <div>{{dataList==''?'':dataList.win_ticket}}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </vue-scroll>
                </div>
            </div>
        </div>
        <cardFooter :type="selectIndex == 0 ? 'escalate_card' : 'change_card'"><span slot="card_money" v-if="selectIndex!=0">换卡费用：{{money}}</span><span slot="card_name" v-if="selectIndex==0">升级</span><span slot="card_name" v-if="selectIndex==1">换卡</span></cardFooter>
    </div>
</template>

<script>
    import readCard from '@/components/readCard.vue';
    import cardFooter from '@/components/cardFooter.vue';
    import vueScroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
    const {ipcRenderer} = require('electron')
    export default {
        name: 'landing-page',
        data(){
            return {
                selectIndex:0,
                gradeClassify:"",
                cardNumber:"",
                money:'',
                card_time:"",
                card_yuan:"",
                card_ji:"",
                searson:"",
                qixian:"",
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
        components: { readCard ,cardFooter ,vueScroll},
        computed:{
            xuqiData(){
                return this.$store.state.card.xuqiData
            },
            dataList(){
                if(this.$store.state.basic.mealInformation != 'not_card' || this.$store.state.basic.mealInformation != ''){
                    this.getMoney(this.$store.state.basic.mealInformation.member_grade_id)
                }
                return this.$store.state.basic.mealInformation=='not_card' || this.$store.state.basic.mealInformation==''?'':this.$store.state.basic.mealInformation
            },
        },
        methods: {
            select(value){
                this.selectIndex=value
                let tag=this.selectIndex==0 ? 'escalate_card':'change_card'
                this.$store.dispatch('setReadCardType',tag);
                this.card_num=""
                this.$store.dispatch('setNewCardId',"");
            },
            async getMemberGrade(){
                let res=await this.$request.getData('/member/getMemberGrade',{})
                this.gradeClassify=res.data
            },
            async getRearson(){
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
                let res=await this.$request.getData('/member/getMemberChangeReason',{user_token:userToken})
                this.searson=res.data
            },
            async doka(){
                var readCardId = ipcRenderer.sendSync('synchronous-message')
                if(readCardId != ""){
                    this.cardNumber = readCardId
                }
                this.$store.dispatch('setNewCardId',this.cardNumber);
                //换卡  这里读卡只需要读出个卡号  然后对换卡
            },
            changeCardJi(value){
                //当点击选择会员等级的时候  应该只执行这个函数，可是现在的bug 一起执行了changeCardTime这个函数
                this.getMoney(value)
                this.$store.dispatch('setMemberGradeId',value);
                this.money=0;
                this.card_time=[]
            },
            changeSearson(value){
                this.$store.dispatch('setSearson',value);
            },
            changeCardTime(value){
                this.$store.dispatch('setTime',value);
                this.$store.dispatch('setMember_change_rule_id',this.qixian[value].id);
                this.money=this.qixian[value].amount_money
            },
            async getMoney(value){
                let baseUrl=await this.$baseFunction.getFileData()
                let userToken=await this.$baseFunction.getCookie(baseUrl,'userTokenCookie')
                let data=await this.$request.getData('/member/getMemberChangeRule',{user_token:userToken,mg_id:value,type:'change_card'})
                this.qixian=data.data
            }
        },
        watch:{
            cardNumber(curVal,oldVal){
                this.$store.dispatch('setNewCardId',curVal);
            }
        },
        mounted(){
            this.getMemberGrade()
            this.getRearson()
            this.$store.dispatch('setReadCardType','change_card');
            // this.$nextTick(()=>{
            //     const scroll=new BScroll(this.$refs.left,{
            //         click:true
            //     })
            // })
        },
        destroyed(){
            this.$store.dispatch('setMember_change_rule_id','');
            this.$store.dispatch('setTime','');
            this.$store.dispatch('setSearson','');
        }
    }
</script>

<style scoped>
    #updateCard{width:100%;height:100%;background-color: #efeff4;display: flex;flex-direction: column;}
    .updateCard_content_wrap{width:calc(100%-30px);margin:0px 30px;flex: 1;display: flex;flex-direction: column;background-color: #fff;}
    .updateCard_content_title{height: 60px;font-size: 18px;color: #5F5F68;border-bottom: 1px solid #EFEFF4;}
    .updateCard_contaioner{width: 100%;flex: 1;overflow-y: hidden;}
    .updateCard_wrap{width: 100%;height: 100%;}
    .updateCard_scroll{width: 100%;padding-bottom: 60px;}
    .updateCard_content_title ul{width: 100%;height: 100%;display: flex;justify-content: row;}
    .updateCard_content_title ul li{width: 120px;height: 50px;line-height: 50px;text-align: center;margin-top: 10px;cursor: pointer;}
    .updateCard_content_title ul li.select{border-bottom: 4px solid  #3B89E5;}
    .updateCard_content_ul{margin:40px 0px 0px 68px;border-bottom:1px solid  #EFEFF4;width: 720px;}
    .updateCard_content_ul:nth-of-type(2){border-bottom: 0;}
    .updateCard_content_ul li.li{width: 720px;height: 50px;display: flex;margin-bottom: 20px;}
    .updateCard_content_ul li>div{width: 360px;height: 50px;display: flex;}
    .updateCard_content_ul li>div div.updateCard_ka{width: 60px;background: #8BC0FF;border-radius: 8px;font-size: 18px;color: #FFFFFF;text-align: center;line-height: 50px;cursor: pointer;}
    .updateCard_content_ul li>div div.updateCard_title{width: 100px;line-height: 50px;text-align: right;font-size: 14px;color: #303039;margin-right: 10px;}
    .updateCard_content_ul li:nth-of-type(1)>div:nth-of-type(1) input{width: 190px;margin-right: 10px;}
    .updateCard_content_ul1 li:nth-of-type(1)>div:nth-of-type(1) input{width: 260px;margin-right: 0px;}
    .updateCard_content_ul li>div input,.updateCard_content_ul1 li>div div:nth-of-type(2){width: 260px;height: 50px;line-height: 50px;text-indent: 10px;background: #F8F8FB;border: 1px solid #E5E5EA;border-radius: 6px;}
    .ivu-select .ivu-select-dropdown{width: 260px;}
    .updateCard_content_ul li{width: 260px;}
    @media screen and (max-width: 1025px) {
        .updateCard_content_ul{width: 640px;margin: 40px 0px 0px 30px;}
        .updateCard_content_ul li.li{width: 640px;}
        .updateCard_content_ul li>div{width: 315px;}
    }
</style>
