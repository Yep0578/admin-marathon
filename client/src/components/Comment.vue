<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top:20px">
            <el-row type="flex" align="middle">
                <el-input placeholder="请输入内容" v-model="search" @keyup.enter.native="comment_search" @input="inputChange" clearable @clear="clear()" class="input-with-select" style="width:500px">
                    <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:150px">
                        <el-option label="openID" value="1"></el-option>
                        <el-option label="微信昵称" value="2"></el-option>
                        <el-option label="详细内容" value="3"></el-option>
                        <el-option label="比赛名称" value="4"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="comment_search"></el-button>
                </el-input>
            </el-row>
            <el-table :data="commentList" border style="width: 100%;margin-top:20px">
                <el-table-column prop="openid" label="openID" width="260"></el-table-column>
                <el-table-column prop="name" label="微信昵称" width="180"></el-table-column>
                <el-table-column prop="img" label="头像" width="180">
                    <template slot-scope="scope">
                        <el-image style="width: 160px; height: 120px" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="title" sortable label="比赛名称" width="180"></el-table-column>
                <el-table-column prop="time" label="评论时间" width="180"></el-table-column>
                <el-table-column prop="detail" :show-overflow-tooltip="true" label="详细内容" width="180"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" @click="opendelete(scope.row._id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
            <span>确认要删除这条评论吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="Delete_comfirm()">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
        this.comment_get()
    },
    data() {
        return {
            select: '1',
            search:'',
            commentList:[],
            deleteDialogVisible: false,
        }
    },
    methods:{
        comment_get() {
            this.$http.post('/comment_get').then(res=>{
                this.commentList = res.data.data
            })
        },
        inputChange() {
            if(this.search == '')
                this.comment_get()
        },
        clear() {
            this.comment_get()
        },
        comment_search() {
            this.$http.post('/comment_search',{id:this.select,openid:this.search,nickname:this.search,detail:this.search,title:this.search}).then(res=>{
                if(res.data.code == 200)
                    this.$message.success('查询成功！')
                else
                    this.$message.error('未查询到相关比赛')
                this.commentList = res.data.data
            })
        },
        opendelete(e) {
            this.deleteDialogVisible = true
            window.sessionStorage.setItem('id', e)
        },
        Delete_comfirm() {
            let id = window.sessionStorage.getItem('id')
            this.$http.post('/comment_del',{id:id}).then(res=>{
                this.comment_get()
            })
            this.$message.success('删除成功！')
            window.sessionStorage.removeItem('id')
            this.deleteDialogVisible = false
        }
    }
}
</script>

<style scoped>

</style>