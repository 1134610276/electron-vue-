const session = require('electron').remote.session;
import baseFunction from './baseFunction'
import axios from 'axios'
import baseConfig from './baseConfig'
import request from './request'
import { ipcRenderer } from 'electron';
const {remote} = require('electron');
const path = require('path');
const fs = require("fs");
const {ipcRenderer: ipc} = require('electron');

export function setCookie(value){  
  session.defaultSession.cookies.set(value, (error) => {
    if (error) console.error(error);
  });
}

export function getCookie(url,name){  
  return new Promise((resolve, reject) =>{ 
    session.defaultSession.cookies.get({'url':url,'name':name}, (error, cookies) => {    
      if(error){
        reject(error)
      }else{
        if(cookies.length!=0){
          resolve(cookies[0].value.split('?'));
        }else{
          resolve(cookies)
        }
      }
    })
  });
}

export function deleteCookie(url){  
  session.defaultSession.cookies.get({url:url},(err,cookies)=>
  {
      for(var i =0;i<cookies.length;i++)//删除cookie需要循环remove
      {
        session.defaultSession.cookies.remove(url, cookies[i].name,(error)=>{
            console.error(error);//判断是否error
        })
      }
  })
}

export async function getCardNumber(value){  
  let userToken=await baseFunction.getCookie(baseConfig.baseUrl,'userTokenCookie')
  return new Promise((resolve, reject) => {
     request.getData(`/member/getMemberInfoByCardNum`, {card_num:value,user_token:userToken})
    .then(res => {
      resolve(res);
    })
    .catch(err =>{
      reject(err)
    })
  });
}

export async function showTotals(_this,value){  
  _this.$store.dispatch('setTipShow',true);
  _this.$store.dispatch('setTip',value);
  setTimeout(()=>{
    _this.$store.dispatch('setTipShow',false);
    _this.$store.dispatch('setTip','');
  },2000)
}

export async function setOrderId(cart_num,card_num,goods_key,num,work_record_id){  //生成商品订单
  return new Promise((resolve, reject) => {
     request.postData(`/order/buildOrders`, {cart_num:cart_num,card_num:card_num,goods_key:goods_key,num:num,work_record_id:work_record_id})
    .then(res => {
      resolve(res);
    })
    .catch(err =>{
      reject(err)
    })
  });
}

export async function setCardOrder(type,member_change_rule_id,card_num,new_card_num,reason){  //生成续期，换卡，升级卡订单
  let userToken=await baseFunction.getCookie(baseConfig.baseUrl,'userTokenCookie')
  return new Promise((resolve, reject) => {
     request.postData(`/member/memberChange`, {user_token:userToken,type:type,member_change_rule_id:member_change_rule_id,
      card_num:card_num,new_card_num:new_card_num,reason:reason})
    .then(res => {
      resolve(res);
    })
    .catch(err =>{
      reject(err)
    })
  });
}

export async function buyCoin(order_num){  //生成续期，换卡，升级卡订单
  return new Promise((resolve, reject) => {
     request.getData(`/coin/getCoinNumByOrderNum`, {order_num:order_num})
    .then(res => {
      resolve(res);
    })
    .catch(err =>{
      reject(err)
    })
  });
}



export async function order(_this,cart_num="",card_num,goods_key='',num=""){   //生成商品订单并且获取商品订单列表的信息
    let baseUrl=await _this.$baseFunction.getFileData()
  let userToken=await baseFunction.getCookie(baseUrl,'userTokenCookie')
  let work_record_id=await baseFunction.getCookie(baseUrl,'work_record_id')
  let res=await _this.$baseFunction.setOrderId(cart_num,card_num,goods_key,num,work_record_id[0])
  if(res.level=='success'){
    //读取卡信息 
    if(_this.$store.state.basic.type == "linshi"){
      let res=await _this.$baseFunction.getCardNumber(card_num)
      let tag=res.level=='success'?false:true
      _this.$store.dispatch('setIsdoka',tag)
      _this.$store.dispatch('setMealInformation',res.data)
    }
    _this.$store.dispatch('setOrder_num',res.data.order_num)
    let data=await _this.$request.getData('/order/getOrderList',{order_num:res.data.order_num,user_token:userToken})
    if(data.level=='success'){
      console.log(data.data)
      ipc.send('orderInformation',data.data); 
      _this.$store.dispatch('setSelectData',data.data)
    }else{
      _this.$store.dispatch('setMessageBoxShow',false)
      _this.$baseFunction.showTotals(_this,res.message)
    }
  }else{
    _this.$store.dispatch('setDuihuanBoxShow',false)
    _this.$store.dispatch('setMessageBoxShow',false)
    _this.$baseFunction.showTotals(_this,res.message)
  }
}




export async function reloadOrder(_this,cardId){    //点击读取卡号时执行刷新订单接口
    let userToken=await baseFunction.getCookie(baseConfig.baseUrl,'userTokenCookie')
    let res=await _this.$request.postData('/order/reloadOrder',{card_num:cardId,user_token:userToken,order_num:_this.$store.state.basic.selectData.order_num})
    if(res.level == "success"){
      ipc.send('orderInformation',res.data); 
        _this.$store.dispatch('setSelectData',res.data)
    }else {
      _this.$baseFunction.showTotals(_this,res.message)
    }
}

export function getPrintList(){
  return new Promise((resolve, reject) =>{
     ipcRenderer.send('getPrinterList');
     ipcRenderer.once('getPrinterList', (event, data) => {
       if(data!=''){
          resolve(data);
        }else{
          reject(data)
        }
     });
  })
}
export function getFileData(){   //读取文件
  return new Promise((resolve, reject) =>{
      let configDir = remote.app.getPath('userData');
      const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
       fs.exists(newFile_path, (exists) => {
        let getInfo = fs.readFileSync(newFile_path)
          console.log(JSON.parse(getInfo).domain)
          resolve(JSON.parse(getInfo).domain)

       })
      
    })
  


}
export function printing(webview,printType){
  return new Promise((resolve, reject) =>{
    webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'webview-print-do') {
          console.log(printType)
        //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
        webview.print(
          {
            //是否是静默打印
            silent: true,
            printBackground: true,
            //打印机的名称，就是本文一开始获得的打印机列表其中一个
            deviceName: printType,
          },
          (data) => {
              webview.removeEventListener('ipc-message',function(){
                  console.log('aaa')
              })
            //这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
            if(data){
              resolve(data);
            }else{
              reject(data)
            }
          },
        );
      }
    });
  })
}

export default{
  setCookie,
  getCookie,
  deleteCookie,
  getCardNumber,
  showTotals,
  setOrderId,
  order,
  reloadOrder,
  setCardOrder,
  printing,
  buyCoin,
  getPrintList,
  getFileData
}
