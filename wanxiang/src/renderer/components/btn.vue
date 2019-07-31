<template>
  <div  class="titlebtn"  v-on:click="click">
    <div class="right_set">
        <Dropdown trigger="click" style="width:100%;height:100%;">
            <a href="javascript:void(0)">
                设置
                <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem>锁屏</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
    <img src="http://file.rzkeji.com/web/wanxiang/icon/min.png" @click="click('min')" class="pointer"/>
    <img :src="maxTag?'http://file.rzkeji.com/web/wanxiang/icon/max1.png':'http://file.rzkeji.com/web/wanxiang/icon/max.png'" @click="click('max')" class="pointer"/>
    <img src="http://file.rzkeji.com/web/wanxiang/icon/close.png" @click="click('close')" class="pointer"/>
  </div>
</template>

<script>
    const {ipcRenderer: ipc} = require('electron');
    // const {remote} = require('electron')
    // const {Menu, MenuItem} = remote

    // const menu = new Menu()
    // menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
    // menu.append(new MenuItem({type: 'separator'}))
    // menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))
    export default {
        name: 'Titlebtn',
        data(){
            return {

            }
        },
        computed: {
            maxTag:{
                get: function () {
                    return this.$store.state.together.maxTag
                },
                set: function (newValue) {
                    this.$store.dispatch('setMaxTag',newValue)
                }
            },
        },
        methods: {
            click: function (value) {
                if(value=='max'){
                    this.maxTag=!this.maxTag
                }
                console.log(value)
                ipc.send(value);
            },
            set(e){

            }
        }
    }
</script>
    
<style>
.titlebtn {width: 200px;height: 40px;-webkit-app-region: no-drag;margin-right: 5px;display: flex;justify-content: row;}
.titlebtn img{width: 40px;height: 40px;display: block;}
.right_set{width:80px;height:40px;display: flex;align-items: center;line-height: 40px;}
.right_set a{color: #303039;font-size: 16px;}
.right_set a:hover{color: #303039;}
.titlebtn .ivu-dropdown .ivu-dropdown-rel{width: 100%;height: 100%;}
.titlebtn .ivu-dropdown-rel .ivu-icon{top: 12px;right: 29px;}
.titlebtn .ivu-dropdown .ivu-select-dropdown{width: 100px;}
.titlebtn .ivu-dropdown-menu li{width: 100px;}
</style>