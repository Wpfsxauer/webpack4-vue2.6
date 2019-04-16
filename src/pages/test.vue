<template>
  <div>
    <h2>这是一个Vue2.6路由+Vuex的测试</h2>
  </div>
</template>

<script>
  import {mapActions,mapState} from 'vuex'
  export default {
    computed:{
      ...mapState(['update'])
    },
    mounted(){
      this.setUpdate('wpf')
    },
    watch:{
      update(val){
        console.log(val);
      }
    },
    methods:{
      ...mapActions(['setUpdate']),
    }
  }
</script>

<style scoped>
h2{
  text-align: center;
  font-weight: 700;
}
</style>