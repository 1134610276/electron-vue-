const state={
  authorizationTag:"",//显示是否授权
  isTuidan:"",    //判断是否退单操作
  dingId:"",     //要退订单的id
};
const mutations={
  setAuthorizationTag(state,value){
      state.authorizationTag=value;
  },
  setIsTuidan(state,value){
      state.isTuidan=value;
  },
  setDingId(state,value){
      state.dingId=value;
  },
};
const actions={
  setAuthorizationTag(content,value){
      content.commit('setAuthorizationTag',value)
  },
  setIsTuidan(content,value){
      content.commit('setIsTuidan',value)
  },
  setDingId(content,value){
      content.commit('setDingId',value)
  },
};
 
// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions
}