<template>
  <div  class="tip">
    {{tip}}
  </div>
</template>

<script>
    export default {
        name: 'loading',
        data(){
            return {

            }
        },
        computed:{
            tip(){
                return this.$store.state.together.tip
            }
        },
    }
</script>
    
<style>
.tip{position: absolute;width: 400px;height: 200px;background: rgba(0,0,0,0.8);border-radius: 14px;font-size: 22px;color: #FFFFFF;letter-spacing: 0;text-align: center;line-height: 200px;left: 50%;top: 50%;margin-top: -100px;margin-left: -200px;z-index: 101;}
</style>