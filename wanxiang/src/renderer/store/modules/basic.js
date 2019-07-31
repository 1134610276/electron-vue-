const state={
//会员套餐
  cardId:"",          //会员套餐读卡读取到的卡号
  coinsDetailsShow:"" ,     //没点击读卡的时候，参套是隐藏的
  coninsData:"",     //获取套餐的内容
  readCardType:"",    //当有值时，读卡会请求后台对应得接口数据，例如会员套餐页面，点击读卡后马上获取信息
  selectIndex:'',    //账单明细查询内容得type
  product_type:"",   //会员套餐查询内容的type
  selectData:"",     //点击套餐 获取信息
  selectData1:"",     //点击套餐   显示在底部
  selectNumber:"",   //套餐的个数
  isdoka:"",         //判断弹出框是否重新读卡
  mealInformation:'',//卡的信息存储,  
  shopCard:[],       //购物车列表
  cart_num:"",       //当前购买人的id
  vipPice:"",        //商品的会员价
  duihuanBoxShow:"", //点击商品兑换的时候触发
  messageBoxTag:"",  //如果弹窗是购物车的话  就把高度增加到633
  huiyuanTag:"",     //如果弹窗是有会员价的话  弹窗的宽度就增加到940
  type:"",           //弹出窗的类型
  goodsId:"",        //商品id
  orderNum:"",       //订单id
  domainUrl:"",       //域名
  sellerNum:"",       //商家编号
  resgiters_id:"",       //收银机号
  work_record_id:"",    //班次的id
  work_class_name:"",   //班次名称
};
const mutations={
//会员套餐
  setCardId(state,value){ //会员套餐读卡读取到的卡号
      state.cardId=value;
  },
  setCoinsDetailsShow(state,value){ //没点击读卡的时候，参套是隐藏的
      state.coinsDetailsShow=value;
  },
  setProduct_type(state,value){//套餐的type
      state.product_type=value;
  },
  async setConinsData(state,value){//套餐的type
    state.coninsData=value;
  },

  setSelectData(state,value){//点击套餐 获取信息
      state.selectData=value;
  },
  setSelectData1(state,value){//点击套餐 获取信息
      state.selectData1=value;
  },
  setIsdoka(state,value){//判断是否重新读卡
      state.isdoka=value;
  },
  setMealInformation(state,value){//卡的信息存储
      state.mealInformation=value;
  },
  setSelectNumber(state,value){//套餐的个数
      state.selectNumber=value;
  },
  setShopCard(state,value){//购物车列表
      state.shopCard=value;
  },
  setMessageBoxTag(state,value){ //   如果时card则代表是点击购物车结算,否则不是
      state.messageBoxTag=value;
  },
  setHuiyuanTag(state,value){ //如果弹窗是有会员价的话  弹窗的宽度就增加到940
      state.huiyuanTag=value;
  },
  setType(state,value){ //弹出窗的类型
      state.type=value;
  },
  setDuihuanBoxShow(state,value){ //点击商品兑换的时候触发
      state.duihuanBoxShow=value;
  },
  setCart_num(state,value){ //当前购买人的id
      state.cart_num=value;
  },
  setGetVipPrice(state,value){ //商品的会员价
      state.vipPice=value;
  },
  setGoodsId(state,value){//选中的商品id
      state.goodsId=value;
  },
  setOrderNum(state,value){//订单编号
      state.orderNum=value;
  },
  setReadCardType(state,value){//订单编号
      state.readCardType=value;
  },
  setSelectIndex(state,value){//订单编号
      state.selectIndex=value;
  },
  setDomainUrl(state,value){//域名
      state.domainUrl=value;
  },
  setSellerNum(state,value){//商家编号
      state.sellerNum=value;
  },
  setResgiters_id(state,value){//收银机号码
      state.resgiters_id=value;
  },
  setWork_record_id(state,value){//收银机号码
      state.work_record_id=value;
  },
    setWork_class_name(state,value){//班次名称
        state.work_class_name=value;
    }
};
const actions={
//会员套餐
  setCardId(content,value){ //会员套餐读卡读取到的卡号
      content.commit('setCardId',value)
  },
  setCoinsDetailsShow(content,value){  //没点击读卡的时候，参套是隐藏的
      content.commit('setCoinsDetailsShow',value)
  },
  setProduct_type(content,value){ //套餐的type
      content.commit('setProduct_type',value)
  },
  setConinsData(content,value){ //套餐的type
      content.commit('setConinsData',value)
  },

  setSelectData(content,value){ //点击套餐 获取信息
      content.commit('setSelectData',value)
  },
  setSelectData1(content,value){ //点击套餐 获取信息
      content.commit('setSelectData1',value)
  },
  setIsdoka(content,value){//判断是否重新读卡
      content.commit('setIsdoka',value)
  },
  setMealInformation(content,value){//卡的信息存储
      content.commit('setMealInformation',value)
  },
  setSelectNumber(content,value){//套餐的个数
      content.commit('setSelectNumber',value)
  },
  setShopCard(content,value){//购物车列表
      content.commit('setShopCard',value)
  },
  setMessageBoxTag(content,value){ //   如果时card则代表是点击购物车结算,否则不是
      content.commit('setMessageBoxTag',value)
  },
  setHuiyuanTag(content,value){ //如果弹窗是有会员价的话  弹窗的宽度就增加到940
      content.commit('setHuiyuanTag',value)
  },
  setType(content,value){ //弹出窗的类型
      content.commit('setType',value)
  },
  setDuihuanBoxShow(content,value){ //点击商品兑换的时候触发
      content.commit('setDuihuanBoxShow',value)
  },
  setCart_num(content,value){ //点击商品兑换的时候触发
      content.commit('setCart_num',value)
  },
  setGetVipPrice(content,value){ //点击商品兑换的时候触发
      content.commit('setGetVipPrice',value)
  },

  setGoodsId(content,value){//选中的商品id
      content.commit('setGoodsId',value)
  },
  setOrderNum(content,value){//订单编号
      content.commit('setOrderNum',value)
  },
  setReadCardType(content,value){//订单编号
      content.commit('setReadCardType',value)
  },
  setSelectIndex(content,value){//订单编号
      content.commit('setSelectIndex',value)
  },
  setDomainUrl(content,value){
      content.commit('setDomainUrl',value)
  },
  setSellerNum(content,value){
      content.commit('setSellerNum',value)
  },
  setResgiters_id(content,value){
      content.commit('setResgiters_id',value)
  },
  setWork_record_id(content,value){
      content.commit('setWork_record_id',value)
  },
    setWork_class_name(content,value){
        content.commit('setWork_class_name',value)
    }
};
 
// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions
}