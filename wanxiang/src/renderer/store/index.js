import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex)

//个人信息

import together from './modules/together'

//日常业务
import basic from './modules/basic'

//办卡业务
import card from './modules/card'

//特殊操作/营业结账/奖票优惠券业务
import special from './modules/special'


export default new vuex.Store({
  modules: {
    together:together,
    basic:basic,
    card:card,
    special:special
  }
})