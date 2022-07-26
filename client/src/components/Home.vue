<template>
    <el-container class="home">
        <el-header>
            <div>
                <i class="el-icon-s-custom"></i>
                <span>马拉松小程序管理系统</span>
            </div>
            <div>
                <el-button type="primary" @click="LoginOut()">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="18%">
                <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
                    <el-menu-item index='/game'>
                        <template slot="title">
                            <i class="el-icon-s-flag"></i>
                            <span>比赛管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index='/users'>
                        <i class="el-icon-s-custom"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index='/activity'>
                        <i class="el-icon-s-opportunity"></i>
                        <span slot="title">活动管理</span>
                    </el-menu-item>
                    <el-menu-item index='/comment'>
                        <i class="el-icon-chat-line-square"></i>
                        <span slot="title">评论管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods:{
        LoginOut() {
            window.sessionStorage.removeItem('username')
            this.$router.push('/')
        },
    }
}
</script>

<style scoped>
    .home{
        height: 100%;
    }
    .el-header{
        background: rgb(55, 61, 65);
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 22px;
        align-items: center;
    }
    .el-aside{
        background: rgb(51, 55, 68);
    }
    .el-main{
        background: rgb(234, 237, 241);
    }
</style>