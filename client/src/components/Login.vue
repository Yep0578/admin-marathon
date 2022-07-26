<template>
    <div class="bg_color">
        <div class="title">
            <div class="login_box">
                <h2>马拉松管理系统</h2>
                <el-form :model="loginForm" :rules="loginFormRul" ref="loginFormRef"  class="input_box">
                    <el-form-item prop="username">
                        <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="el-icon-lock" type="password" v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login()">登录</el-button>
                        <el-button type="info">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
        //登录表单请求数据
      loginForm:{
            username:'',
            password:''
      },
      loginFormRul:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
      }
    }
  },
  methods:{
      login(){
          this.$refs.loginFormRef.validate(valid=>{
              if(!valid) return;
              else {
                  this.$http.post('/login', {username: this.loginForm.username, password: this.loginForm.password}).then(res=>{
                        console.log(res.data)
                        if(res.data.code == 501)
                            this.$message.error('账号或密码错误！')
                        else if(res.data.code == 200){
                            this.$message.success('登陆成功！')
                            window.sessionStorage.setItem('username', res.data.data.username)
                            //登录成功 跳转到主页
                            this.$router.push('/home')
                        }
                  })
              }
          })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped="scoped">
    .bg_color{
        height: 100%;
        background: rgb(43, 75, 107);
    }
    .login_box{
        width: 500px;
        height: 320px;
        position: absolute;
        background: #fff;
        top: 50%;
        left: 50%;
        margin: -160px 0 0 -250px;
        border-radius: 5px;
    }
    .input_box{
        position: absolute;
        width: 80%;
        margin-top: 8%;
        margin-left: 50px;
    }
</style>
