<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'wanxiang',
  }
</script>

<style>
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,img,input,button,textarea,p,blockquote,th,td { margin:0; padding:0;}
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0} 
.clearfloat{zoom:1} 
.float{float: left}
ul li{list-style: none}
#app{width: 100%;height: 100%;-webkit-user-select: none;-webkit-app-region: drag;}
.drag{-webkit-app-region: no-drag;}
.pointer{cursor: pointer;}
html,body{width: 100%;height: 100%;}
#app .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-placeholder,#app .ivu-select-large.ivu-select-single .ivu-select-selection .ivu-select-selected-value{height: 50px;line-height: 50px;background: #F8F8FB;border:1px solid #E5E5EA;border-radius: 6px;}
#app .ivu-select-large .ivu-select-item{padding: 14px 16px 8px;}
#app .ivu-select-large.ivu-select-single .ivu-select-selection{height: 50px;}
#app .ivu-input-icon{line-height: 50px;}
#app .ivu-input{height: 50px;}
#app .ivu-select-selection{border:0px;}
</style>
