<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top:20px">
            <el-row type="flex" align="middle">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="user_search" clearable @keyup.enter.native="users_search()" @input="inputChange" @clear="clear()" class="input-with-select" style="width:500px">
                        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:150px">
                            <el-option label="参赛编号" value="1"></el-option>
                            <el-option label="姓名" value="2"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="users_search()"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="userList" border style="width: 100%;margin-top:20px">
                <el-table-column prop="playernum" label="参赛编号" width="180"></el-table-column>
                <el-table-column prop="openid" label="openID" width="260"></el-table-column>
                <el-table-column prop="nickname" label="微信昵称" width="180"></el-table-column>
                <el-table-column prop="playername" label="参赛姓名" width="180"></el-table-column>
                <el-table-column prop="sex" label="性别" width="180"></el-table-column>
                <el-table-column prop="img" label="头像" width="180">
                    <template slot-scope="scope">
                        <el-image style="width: 160px; height: 120px" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="openedit(scope.row.playernum)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="opendelete(scope.row.playernum)"></el-button>
                        <el-tooltip class="item" effect="dark" content="查看成绩" placement="top">
                            <el-button type="warning" icon="el-icon-info" @click="opengrade(scope.row.playernum,scope.row.playername)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 编辑用户信息对话框 -->
            <el-dialog title="编辑用户信息" :visible.sync="editFormVisible">
                <el-form :model="newuserform">
                    <el-form-item label="openID" :label-width="formLabelWidth">
                        <el-input v-model="newuserform.openid" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="参赛编号" :label-width="formLabelWidth">
                        <el-input v-model="newuserform.playernum" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信昵称" :label-width="formLabelWidth">
                        <el-input v-model="newuserform.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="参赛姓名" :label-width="formLabelWidth">
                        <el-input v-model="newuserform.playername"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-input v-model="newuserform.sex"></el-input>
                    </el-form-item>
                    <el-form-item label="头像" :label-width="formLabelWidth" :ladbel-height="formLabelHeight"> 
                        <img v-if="newuserform.img" :src="newuserform.img" class="avatar">
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="Edit_comfirm()">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 确认删除对话框 -->
            <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
                <span>确认要删除这条记录吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button type="danger" @click="Delete_comfirm()">删 除</el-button>
                </span>
            </el-dialog>
            <!-- 比赛成绩对话框 -->
            <el-dialog :title="grade_title" :visible.sync="gradeDialogVisible" center>
                <el-table :data="gradeList" border style="width: 100%;margin-top:20px" :default-sort = "{prop: 'rank'}">
                    <el-table-column prop="title" label="比赛名称" width="220" sortable></el-table-column>
                    <el-table-column prop="rank" label="排名" width="180" sortable></el-table-column>
                    <el-table-column prop="grade" label="比赛用时"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="gradeDialogVisible = false">返 回</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        this.GetUsers()
    },
    data() {
        return {
            userList: [],
            gradeList: [],
            grade_title: '',
            searchInfo: '',
            user_search: '',
            formLabelWidth: '120px',
            formLabelHeight: '50px',
            select: '1',
            editFormVisible: false,
            deleteDialogVisible: false,
            gradeDialogVisible: false,
            gradeDialogVisible: false,
            newuserform: {
                playernum: '',
                playername: '',
                openid: '',
                sex:'',
                nickname:'',
                img: ''
            },
        }
    },
    methods:{
        GetUsers() {
            this.$http.post('/user').then(res=>{
                this.userList = res.data.data
                console.log(this.gameList)
            })
        },
        users_search() {
            this.$http.post('/user_search',{id:this.select, playernum:this.user_search, playername:this.user_search}).then(res=>{
                if(res.data.code == 200)
                    this.$message.success('查询成功！')
                else
                    this.$message.error('未查询到相关比赛')
                this.userList = res.data.data
            })
        },
        clear() {
            this.GetUsers()
        },
        inputChange() {
            if(this.user_search == '')
                this.GetUsers()
        },
        openedit(playernum) {
            this.imageUrl = ''
            this.editFormVisible = true
            this.$http.post('/user_locate',{playernum:playernum}).then(res=>{
                console.log(res.data)
                window.sessionStorage.setItem('id', res.data.data[0]._id)
                this.newuserform.playernum = res.data.data[0].playernum
                this.newuserform.playername = res.data.data[0].playername
                this.newuserform.nickname = res.data.data[0].nickname
                this.newuserform.sex = res.data.data[0].sex
                this.newuserform.openid = res.data.data[0].openid
                this.newuserform.img = res.data.data[0].img
            })
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = res.data
            console.log(this.imageUrl)
        },
        Edit_comfirm() {
            let id = window.sessionStorage.getItem('id')
            this.$http.post('/user_edit',{id:id, playernum:this.newuserform.playernum, playername:this.newuserform.playername, img:this.newuserform.img, nickname:this.newuserform.nickname, openid:this.newuserform.openid,sex:this.newuserform.sex}).then(res=>{
                console.log(res)
                this.GetUsers()
            })
            this.$message.success('修改成功！')
            window.sessionStorage.removeItem('id')
            this.editFormVisible = false
        },
        opendelete(playernum) {
            this.deleteDialogVisible = true
            this.$http.post('/user_locate',{playernum:playernum}).then(res=>{
                console.log(res.data)
                window.sessionStorage.setItem('id', res.data.data[0]._id)
            })
        },
        Delete_comfirm() {
            let id = window.sessionStorage.getItem('id')
            this.$http.post('/user_delete',{id:id}).then(res=>{
                this.GetUsers()
            })
            this.$message.success('删除成功！')
            window.sessionStorage.removeItem('id')
            this.deleteDialogVisible = false
        },
        opengrade(playernum,playername) {
            this.grade_title = playernum + "：" + playername
            this.gradeDialogVisible = true
            this.gradeList = []
            this.$http.post('/grade_search',{data:playernum,opt:"2"}).then(res=>{
                this.gradeList = res.data.data
                console.log(this.gradeList)
            })
        },
    }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>