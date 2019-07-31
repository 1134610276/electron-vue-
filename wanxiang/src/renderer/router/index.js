import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import card from '../pages/card/cardIndex'  //会员卡管理首页
import applyCard from '@/pages/card/applyCard/applyCard.vue';  //会员卡管理的办卡页面
import backCard from '@/pages/card/backCard/backCard.vue';  //会员卡管理的退卡页面
import supplementCard from '@/pages/card/supplementCard/supplementCard.vue';  //会员卡管理的续期页面
import lossCard from '@/pages/card/lossCard/lossCard.vue';  //会员卡管理的丢失页面
import updateCard from '@/pages/card/updateCard/updateCard.vue';  //会员卡管理的丢失页面


import basic from '../pages/basic/basicIndex'  //日常业务的首页页面
import buyCoins from '@/pages/basic/buyCoins/buyCoins.vue';  //日常业务的常规购币页面
import setMeal from '@/pages/basic/setMeal/setMeal.vue';  //日常业务的会员套餐页面
import ticket from '@/pages/basic/ticket/ticket.vue';  //日常业务的活动门票页面
import commodity from '@/pages/basic/commodity/commodity.vue';  //日常业务的商品购买页面
import exchange from '@/pages/basic/exchange/exchange.vue';  //日常业务的商品购买页面


import vip from '../pages/vip/vipIndex'  //会员管理的首页页面
import admissionVip from '@/pages/vip/admissionVip/admissionVip.vue';  //会员管理的会员入会页面
import informationVip from '@/pages/vip/informationVip/informationVip.vue';  //会员管理的会员资料页面
import securityVip from '@/pages/vip/securityVip/securityVip.vue';  //会员管理的安全设置页面
import checkMoneyVip from '@/pages/vip/checkMoneyVip/checkMoneyVip.vue';  //会员管理的余额查询页面
import detailsVip from '@/pages/vip/detailsVip/detailsVip.vue';  //会员管理的账单明细页面


import coupon from '../pages/coupon/couponIndex'  //优惠券奖票的首页
import couponDetails from '@/pages/coupon/coupon/coupon.vue';  //营业总结的总结账单页面
import ticketDetails from '@/pages/coupon/ticket/ticket.vue';  //营业总结的总结账单页面



import special from '../pages/special/specialIndex'  //营业总结的首页页面
import specialDetails from '@/pages/special/special/special.vue';  //营业总结的总结账单页面
import tuidan from '@/pages/special/tuidan/tuidan.vue';  //营业总结的退单页面
import transferCard from '@/pages/special/transferCard/transferCard.vue';  //余额过户
import transformation from '@/pages/special/transformation/transformation.vue';  //余额转换
// import escalateCard from '@/pages/special/escalateCard/escalateCard.vue';  //卡升级


import checkOut from '../pages/checkOut/checkOutIndex'  //营业总结的首页页面
import totalCheckOut from '@/pages/checkOut/totalCheckOut/totalCheckOut.vue';  //营业总结的总结账单总结
import detailsCheckOut from '@/pages/checkOut/detailsCheckOut/detailsCheckOut.vue';  //营业总结的总结账单明细
import entryCheckOut from '@/pages/checkOut/entryCheckOut/entryCheckOut.vue';  //营业总结的总结账单明细


import order from '../pages/order/orderIndex'  //营业总结的首页页面
import orderCheckOut from '@/pages/order/orderCheckOut/orderCheckOut.vue';  //订单查询功能
import goodsCheckOut from '@/pages/order/goodsCheckOut/goodsCheckOut.vue';  //商品查询功能
import activeTicket from '@/pages/order/activeTicket/activeTicket.vue';  //激活门票页面


import index from '@/pages/index.vue';  //首页
import login from '@/pages/login.vue';  //登陆界面
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children:[
        {
          path: 'card',
          name: 'card',
          component: card,
          children:[
            {
              path: 'applyCard',
              name: 'applyCard',
              component: applyCard
            },
            {
              path: 'backCard',
              name: 'backCard',
              component: backCard
            },
            {
              path: 'supplementCard',
              name: 'supplementCard',
              component: supplementCard
            },
            {
              path: 'lossCard',
              name: 'lossCard',
              component: lossCard
            },
            {
              path: 'updateCard',
              name: 'updateCard',
              component: updateCard
            },
          ]
        },
        {
          path: 'basic',
          name: 'basic',
          component: basic,
          children:[
            {
              path: 'buyCoins',
              name: 'buyCoins',
              component: buyCoins
            },
            {
              path: 'setMeal',
              name: 'setMeal',
              component: setMeal
            },
            {
              path: 'commodity',
              name: 'commodity',
              component: commodity
            },
            {
              path: 'ticket',
              name: 'ticket',
              component: ticket
            },
            {
              path: 'exchange',
              name: 'exchange',
              component: exchange
            },
          ]
        },
        {
          path: 'vip',
          name: 'vip',
          component: vip,
          children:[
            {
              path: 'admissionVip',
              name: 'admissionVip',
              component: admissionVip
            },
            {
              path: 'informationVip',
              name: 'informationVip',
              component: informationVip
            },
            {
              path: 'securityVip',
              name: 'securityVip',
              component: securityVip
            },
            {
              path: 'checkMoneyVip',
              name: 'checkMoneyVip',
              component: checkMoneyVip
            },
            {
              path: 'detailsVip',
              name: 'detailsVip',
              component: detailsVip
            },
          ]
        },
        {
          path: 'checkOut',
          name: 'checkOut',
          component: checkOut,
          children:[
            {
              path: 'totalCheckOut',
              name: 'totalCheckOut',
              component: totalCheckOut
            },
            {
              path: 'detailsCheckOut',
              name: 'detailsCheckOut',
              component: detailsCheckOut
            },
            {
              path: 'entryCheckOut',
              name: 'entryCheckOut',
              component: entryCheckOut
            },
          ]
        },
        {
          path: 'order',
          name: 'order',
          component: order,
          children:[
            {
              path: 'orderCheckOut',
              name: 'orderCheckOut',
              component: orderCheckOut
            },
            {
              path: 'activeTicket',
              name: 'activeTicket',
              component: activeTicket
            },
            {
              path: 'goodsCheckOut',
              name: 'goodsCheckOut',
              component: goodsCheckOut
            },
          ]
        },
        {
          path: 'special',
          name: 'special',
          component: special,
          children:[
            {
              path: 'specialDetails',
              name: 'specialDetails',
              component: specialDetails
            },
            {
              path: 'tuidan',
              name: 'tuidan',
              component: tuidan
            },
            {
              path: 'transferCard',
              name: 'transferCard',
              component: transferCard
            },
            {
              path: 'transformation',
              name: 'transformation',
              component: transformation
            },
          ]
        },
        {
          path: 'coupon',
          name: 'coupon',
          component: coupon,
          children:[
            {
              path: 'couponDetails',
              name: 'couponDetails',
              component: couponDetails
            },
            {
              path: 'ticketDetails',
              name: 'ticketDetails',
              component: ticketDetails
            },
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    },
  ]
})