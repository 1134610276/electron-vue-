<template>
  <div  class="navSelect" >
    <ul class="right_ul drag">
      <li v-for="(value,index) in navData" @click="select(index)" :class="{select:selectIndex==index?true:false}"><router-link :to='value.routerLink'>{{value.name}}</router-link></li>
    </ul>
  </div>
</template>

<script>
    export default {
        props:['navData'],
        name: 'navSelect',
        data(){
            return {
              selectIndex:0
            }
        },
        computed: {

        },
        methods: {
          select(value){
            this.selectIndex=value
          },
        }
    }
</script>
    
<style>
.right_ul{width: 100%;height:40px;display: flex;}
.right_nav li{width: 160px;line-height: 30px;text-align: center;font-size: 20px;color: #303039;}
.right_nav li a{width:160px;height: 40px;display:block;font-size: 18px;color: #5F5F68;margin-left: 20px;}

.right_nav li.select a{font-weight: 600;color: #303039;border-bottom: 4px solid #3B89E5;}



@media screen and (max-width: 1025px) {
  .right_nav li{width: 160px;}
  .right_nav li a{width: 160px;height: 40px;display:block;font-size: 18px;color: #5F5F68;margin-left: 20px;}
}
</style>