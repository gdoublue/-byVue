<template>
    <div id="login-wapper">
      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/滑稽.png" alt="">
        </div>
        <el-form class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
<!--          名称-->
          <el-form-item prop="username">
            <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username" ></el-input>
          </el-form-item>
<!--          密码-->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima " v-model="loginForm.password" type="password" ></el-input>
          </el-form-item>
<!--          按钮-->
          <el-form-item class="btns">
            <el-button type="success" round @click="login">登录</el-button>
            <el-button type="info" round @click="resetLoginForm">重置</el-button>
          </el-form-item>

          </el-form>
      </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                loginForm:{
                    username:'admin',
                    password:'123456',

                },
                loginFormRules:{
                    username: [
                        { required: true, message: '请输入登录用户名', trigger: 'blur' },
                        { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
                }
            }

        },
        methods:{
            resetLoginForm(){
               this.$refs.loginFormRef.resetFields()
            },
             login(){
                this.$refs.loginFormRef.validate(async (valid)=>{
                    if(!valid)  return;
                  var {data:res}= await this.$http.post('login',this.loginForm)
                    if(res.meta.status !==200)
                        return this.$message.error(res.meta.msg)
                    this.$message.success(res.meta.msg)
                    window.sessionStorage.setItem('token',res.data.token)
                    this.$router.push('/home')
                })
            }
        }

    }
</script>

<style lang="less" scoped>
#login-wapper{
  background-color: #42b983;
  height: 100%;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: aliceblue;
    border-radius: 2%;
    position: absolute;
    left: 50%;
    top:50%;
    transform:translate(-50%,-50%);
  }
  .avatar_box{
    height: 110px;
    width: 110px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-30%);
    background-color: aliceblue;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeee;
    }

  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 90%;
    padding: 0 20px;
  }
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
