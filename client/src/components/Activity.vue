<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top:20px">
            <el-row type="flex" align="middle">
                    <el-input placeholder="请输入内容" v-model="search" @keyup.enter.native="activity_search" @input="inputChange" clearable @clear="clear()" class="input-with-select" style="width:500px">
                        <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:150px">
                            <el-option label="创建者ID" value="1"></el-option>
                            <el-option label="创建者昵称" value="2"></el-option>
                            <el-option label="活动名称" value="3"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="activity_search"></el-button>
                    </el-input>
            </el-row>
            <el-table :data="activityList" border style="width: 100%;margin-top:20px">
                <el-table-column prop="creatorid" label="创建者ID" width="260"></el-table-column>
                <el-table-column prop="creator" label="创建者昵称" width="130"></el-table-column>
                <el-table-column prop="title" label="活动名称" width="130"></el-table-column>
                <el-table-column prop="type" label="活动项目" width="130"></el-table-column>
                <el-table-column prop="address" label="活动地点" width="260"></el-table-column>
                <el-table-column prop="time" label="活动时间" width="130" sortable></el-table-column>
                <el-table-column prop="detail" :show-overflow-tooltip="true" label="详细内容" width="130"></el-table-column>
                <el-table-column prop="msg" :show-overflow-tooltip="true" label="管理员留言" width="130"></el-table-column>
                <el-table-column prop="condition" label="审核情况" width="112">
                    <template slot-scope="scope">
                        <el-switch 
                        v-model="scope.row.condition" 
                        active-icon-class="el-icon-check" 
                        inactive-icon-class="el-icon-close" 
                        @change="checkon($event,scope.row._id)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="留言" placement="top">
                            <el-button type="primary" icon="el-icon-position" @click="openmsg(scope.row._id)"></el-button>
                        </el-tooltip>
                        <el-button type="danger" icon="el-icon-delete" @click="opendelete(scope.row._id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 确认删除对话框 -->
        <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" center>
            <span>确认要删除这条记录吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="danger" @click="Delete_comfirm()">删 除</el-button>
            </span>
        </el-dialog>
        <!-- 留言对话框 -->
        <el-dialog title="留言" :visible.sync="msgDialogVisible" width="30%" center>
            <el-input v-model="msg" autocomplete="off" type="textarea" :rows="10"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="msgDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="Msg_comfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created() {
        this.getActivity()
    },
    data() {
        return {
            search:'',
            select:'1',
            activityList:[],
            value:false,
            deleteDialogVisible:false,
            msgDialogVisible:false,
            msg:'',
        }
    },
    methods:{
        getActivity() {
            this.$http.post('/activity_get').then(res=>{
                console.log(res.data.data)
                this.activityList = res.data.data
            })
        },
        inputChange() {
            if(this.search == '')
                this.getActivity()
        },
        activity_search() {

        },
        checkon(e,id) {
            this.$http.post('/activity_check',{id:id,condition:e}).then(res=>{
                if(res.data.code == 200) {
                    this.$message.success('操作成功！')
                }
            })
        },
        opendelete(id) {
            this.deleteDialogVisible = true
            window.sessionStorage.setItem('id', id)
        },
        Delete_comfirm() {
            let id = window.sessionStorage.getItem('id')
            this.$http.post('/activity_delete',{id:id}).then(res=>{
                this.getActivity()
                this.$message.success(res.data.msg)
                window.sessionStorage.removeItem('id')
            this.deleteDialogVisible = false
            })
        },
        openmsg(id) {
            this.msgDialogVisible = true
            window.sessionStorage.setItem('id', id)
        },
        Msg_comfirm() {
            let id = window.sessionStorage.getItem('id')
            this.$http.post('/activity_msg',{id:id,msg:this.msg}).then(res=>{
                this.$message.success(res.data.msg)
                this.getActivity()
                this.msgDialogVisible = false
                this.msg = ''
                window.sessionStorage.removeItem('id')
            })
        },
        activity_search() {
            this.$http.post('/activity_search',{id:this.select,creatorid:this.search,creator:this.search,title:this.search}).then(res=>{
                if(res.data.code == 200)
                    this.$message.success('查询成功！')
                else
                    this.$message.error('未查询到相关比赛')
                this.activityList = res.data.data
            })
        },
        clear() {
            this.getActivity()
        },
        inputChange() {
            if(this.search == '')
                this.getActivity()
        },
    }
}
</script>
<style scoped>

</style>