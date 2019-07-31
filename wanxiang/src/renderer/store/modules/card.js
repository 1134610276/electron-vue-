const state={
  informationBoxShow:false,//informationBox的显示问题,如果点击办理会员卡的时候需要填写信息
  information:"",
  xuqiData:"",   //续期返回的续期信息
  member_change_rule_id:"",   //规则id
  newCardId:"",     //新卡卡号
  searson:"",    //换卡原因
  time:"",    //换卡有效期
  memberGradeId:"", //会员等级id
};
const mutations={
  setInformationBoxShow(state,value){
      state.informationBoxShow=value;
  },
  setInformation(state,value){
      state.information=value;
  },
  setXuqiData(state,value){
      state.xuqiData=value;
  },
  setMember_change_rule_id(state,value){
      state.member_change_rule_id=value;
  },
  setNewCardId(state,value){
      state.newCardId=value;
  },
  setSearson(state,value){
      state.searson=value;
  },
  setTime(state,value){
      state.time=value;
  },
  setMemberGradeId(state,value){
        state.memberGradeId=value;
    },
};
const actions={
  setInformationBoxShow(content,value){
      content.commit('setInformationBoxShow',value)
  },
  setInformation(content,value){
      content.commit('setInformation',value)
  },
  setXuqiData(content,value){
      content.commit('setXuqiData',value)
  },
  setMember_change_rule_id(content,value){
      content.commit('setMember_change_rule_id',value)
  },
  setNewCardId(content,value){
      content.commit('setNewCardId',value)
  },
  setSearson(content,value){
      content.commit('setSearson',value)
  },
  setTime(content,value){
      content.commit('setTime',value)
  },
    setMemberGradeId(content,value){
        content.commit('setMemberGradeId',value)
    },
};
 
// 不要忘记把state, mutations等暴露出去。
export default {
  state,
  mutations,
  actions
}