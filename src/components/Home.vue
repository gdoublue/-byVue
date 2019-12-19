<template>
<div>
  HOME
  <el-button @click="logout">退出登录</el-button>
</div>
</template>

<script>
    export default {
        name: "Home",
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped>

</style>
