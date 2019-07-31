import axios from 'axios'
const {remote} = require('electron');
import qs from 'qs'//用于把数组对象转换成  'name=hehe&age=10'格式的字符串

import baseUrl from './baseConfig'

axios.default.timeout = 10000;  //设置全局时间

axios.interceptors.response.use(function (response){
   // 处理响应数据
  if (response.status === 200) {      
    return Promise.resolve(response);    
  } else {      
    return Promise.reject(response);    
  }
  }, function (error){
  // 处理响应失败
  return Promise.reject(error);
});




const path = require('path');
const fs = require("fs");

// var fileData

// const newFile_path = path.join(__dirname, '../../../../config.json').replace(/\\/g, "\/");
// fs.exists(newFile_path, function (exists) {
//     let getInfo = fs.readFileSync(newFile_path)
//     let data=getInfo.toString()
//     let fileData=JSON.parse(data)
//     console.log(fileData.domain)
// });












export function getData(url, params){
  // console.log(fileData)
  return new Promise((resolve, reject) =>{
    var fileData
      let configDir = remote.app.getPath('userData');
      const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
    fs.exists(newFile_path, function (exists) {
        let getInfo = fs.readFileSync(newFile_path)
        let data=getInfo.toString()
        let fileData=JSON.parse(data)
        axios.get(`${fileData.domain}/api${url}`, {
          params: params    
        }).then(res => {
          resolve(res.data);
        }).catch(err =>{
          reject(err.data)    
        }) 
    });
  });
}

export function postData(url, params) {
  return new Promise((resolve, reject) => {
    var fileData
    // const newFile_path = path.join(__dirname, '../../../../config.json').replace(/\\/g, "\/");
      let configDir = remote.app.getPath('userData');
      const newFile_path = path.join(configDir,'./AllonyunConfig.json').replace(/\\/g, "\/");
      fs.exists(newFile_path, function (exists) {
        let getInfo = fs.readFileSync(newFile_path)
        let data=getInfo.toString()
        let fileData=JSON.parse(data)
        axios.post(`${fileData.domain}/api${url}`, qs.stringify(params))
        .then(res => {
          resolve(res.data);
        })
        .catch(err =>{
          reject(err.data)
        })
    });
  });
}

export default {
  getData,
  postData
}