const state={
  maxTag:true,     //处理btn.vue里面最大最小按钮的图片切换问题

  messageBoxShow:false,   //messageBox的显示问题
  authorizationShow:false,  //管理员帐号密码输入认证
  tip:"",    //tip提示框的提示内容
  tipShow:"",   //tip提示框是否显示
  payType:'',    //支付类型
  payshow:false,   //支付提示框是否显示
  selectType:"",    //选择得支付方式
  order_num:'',   //订单得id,
  domainTag:false,    //域名设置窗口
  banData:"",     //班次信息列表
  printShow:false,   //是否打印窗口显示
  printTypeShow:false,   //是否打印机列表窗口显示
  // printList:"",    //所选打印机
  printTicketShow:false,   //是否门票窗口显示    这个是按主订单号来打印  是购买完成后打印
  printTicketShow1:false,   //是否门票窗口显示     这个是按子订单号来打印  是在订单查询那里打印的
  printWebView_show:false,   //直接打印帐号信息和门票的窗口显示
  startWorkShow:false, //开账页面显示
  endWorkShow:false, //结账页面显示
  ticketNumShow:false, //是否显示输入人数窗口
  endWorkPrint:false,  //是否显示结账打印
  ticketNum:1,         //购买的门票数量
  printSrc:"",        //直接打印帐号信息和门票的窗口的webview   src

  selectPrintTypeShow:"",
  ticketPrint:"",
  moneyPrint:"",
  sendCoinNum:"", //出币数量
  oddChange:"",   //找零金额
};
const mutations={
  setSelectPrintTypeShow(state,value){
      state.selectPrintTypeShow=value;
  },
  setTicketPrint(state,value){
      state.ticketPrint=value;
  },
  setMoneyPrint(state,value){
      state.moneyPrint=value;
  },
  setMaxTag(state,value){
      state.maxTag=value;
  },
  setMessageBoxShow(state,value){
      state.messageBoxShow=value;
  },
  setAuthorizationShow(state,value){
      state.authorizationShow=value;
  },
  setTip(state,value){
      state.tip=value;
  },
  setTipShow(state,value){
      state.tipShow=value;
  },
  setPayType(state,value){
    state.payType=value;
  },
  setPayshow(state,value){
    state.payshow=value;
  },
  setSelectType(state,value){
    state.selectType=value;
  },
  setOrder_num(state,value){
    state.order_num=value;
  },
  setDomainTag(state,value){
    state.domainTag=value;
  },
  setBanData(state,value){
    state.banData=value;
  },
  setPrintShow(state,value){
    state.printShow=value;
  },
  setPrintTypeShow(state,value){
    state.printTypeShow=value;
  },
  setPrintTicketShow(state,value){
    state.printTicketShow=value;
  },
  setPrintTicketShow1(state,value){
    state.printTicketShow1=value;
  },
  setPrintWebView_show(state,value){
    state.printWebView_show=value;
  },
  setPrintSrc(state,value){
    state.printSrc=value;
  },
  setStartWorkShow(state,value){
    state.startWorkShow = value
  },
  setEndWorkShow(state,value){
    state.endWorkShow = value
  },
  setTicketNumShow(state,value){
    state.ticketNumShow = value
  },
  setTicketNum(state,value){
    state.ticketNum = value
  },
  setEndWorkPrint(state,value){
    state.endWorkPrint = value
  },
  setSendCoinNum(state,value){
    state.sendCoinNum = value
  },
  setOddChange(state,value){
    state.oddChange = value
  },
};
const actions={
  setSelectPrintTypeShow(content,value){
      content.commit('setSelectPrintTypeShow',value)
  },
  setTicketPrint(content,value){
      content.commit('setTicketPrint',value)
  },
  setMoneyPrint(content,value){
      content.commit('setMoneyPrint',value)
  },
  setMaxTag(content,value){
      content.commit('setMaxTag',value)
  },
  setMessageBoxShow(content,value){
      content.commit('setMessageBoxShow',value)
  },
  setAuthorizationShow(content,value){
      content.commit('setAuthorizationShow',value)
  },
  setTip(content,value){
      content.commit('setTip',value)
  },
  setTipShow(content,value){
      content.commit('setTipShow',value)
  },
  setPayType(content,value){
      content.commit('setPayType',value)
  },
  setPayshow(content,value){
      content.commit('setPayshow',value)
  },
  setSelectType(content,value){
      content.commit('setSelectType',value)
  },
  setOrder_num(content,value){
      content.commit('setOrder_num',value)
  },
  setDomainTag(content,value){
      content.commit('setDomainTag',value)
  },
  setBanData(content,value){
    content.commit('setBanData',value)
  },
  setPrintShow(content,value){
    content.commit('setPrintShow',value)
  },
  setPrintTypeShow(content,value){
    content.commit('setPrintTypeShow',value)
  },
  setPrintTicketShow(content,value){
    content.commit('setPrintTicketShow',value)
  },
  setPrintTicketShow1(content,value){
    content.commit('setPrintTicketShow1',value)
  },
  setPrintWebView_show(content,value){
    content.commit('setPrintWebView_show',value)
  },
  setPrintSrc(content,value){
    content.commit('setPrintSrc',value)
  },
  setStartWorkShow(content,value){
    content.commit('setStartWorkShow',value)
  },
  setEndWorkShow(content,value){
    content.commit('setEndWorkShow',value)
  },
  setTicketNumShow(content,value){
    content.commit('setTicketNumShow',value)
  },
  setTicketNum(content,value){
    content.commit('setTicketNum',value)
  },
  setEndWorkPrint(content,value){
    content.commit('setEndWorkPrint',value)
  },
  setSendCoinNum(content,value){
    content.commit('setSendCoinNum',value)
  },
  setOddChange(content,value){
    content.commit('setOddChange',value)
  },
};
 
// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions
}