<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>比赛管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin-top:20px">
            <el-row type="flex" align="middle">
                <el-col :span="8">
                    <el-input placeholder="请输入名称" v-model="searchInfo" @keyup.enter.native="search" @input="inputChange" class="input-with-select" clearable @clear="clear()">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="openadd">添加比赛<i class="el-icon-upload el-icon--right"></i></el-button>
                </el-col>
                <el-col :span="4">
                    <el-radio-group v-model="radio" @change="changeRadio">
                        <el-radio :label="3">全部</el-radio>
                        <el-radio :label="6">已完赛</el-radio>
                        <el-radio :label="9">未完赛</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-table :data="gameList" border style="width: 100%;margin-top:20px">
                <el-table-column type="index" width="180"></el-table-column>
                <el-table-column prop="title" label="比赛名称" width="180"></el-table-column>
                <el-table-column prop="time" sortable label="比赛时间" width="180"></el-table-column>
                <el-table-column prop="img" label="宣传图片" width="190">
                    <template slot-scope="scope">
                        <el-image style="width: 160px; height: 120px" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="比赛类型" width="180" align="center">
                    <template slot-scope="scope">
                        <span v-for="(item) in scope.row.type" :key="item._id">{{item}}<br></span>
                    </template>
                </el-table-column>
                <el-table-column prop="money" width="180" label="报名费用（元）" align="center">
                    <template slot-scope="scope">
                        <span v-for="(item) in scope.row.money" :key="item">{{item}}<br></span>
                    </template>
                </el-table-column>
                <el-table-column prop="detail" :show-overflow-tooltip="true" label="具体事项"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="openedit(scope.row.title)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="opendelete(scope.row.title)"></el-button>
                        <el-tooltip class="item" effect="dark" content="查看成绩" placement="top">
                            <el-button type="warning" icon="el-icon-info" @click="opengrade(scope.row.title,scope.row.type)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加比赛对话框 -->
        <el-dialog title="添加比赛" :visible.sync="addFormVisible">
            <el-form :model="gameform">
                <el-form-item label="比赛名称" :label-width="formLabelWidth">
                    <el-input v-model="gameform.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="比赛类型" :label-width="formLabelWidth" @change="moneyclean">
                    <el-checkbox-group v-model="gameform.type" @change="checkChange">
                        <el-checkbox label="全马"></el-checkbox>
                        <el-checkbox label="半马"></el-checkbox>
                        <el-checkbox label="越野"></el-checkbox>
                        <el-checkbox label="迷你"></el-checkbox>
                        <el-checkbox label="其他"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="报名费用" :label-width="formLabelWidth">
                    <div class="moneybox" v-for="(item,i) in gameform.type" :key="item">
                        <span>{{item}}：</span>
                        <el-input class="moneyinput" v-model="gameform.money[i]"></el-input>
                        <span>元</span>
                    </div>
                </el-form-item>
                <el-form-item label="比赛时间" :label-width="formLabelWidth">
                    <el-input v-model="gameform.time" autocomplete="off" type = "datetime-local"></el-input>
                </el-form-item>
                <el-form-item label="比赛宣传图" :label-width="formLabelWidth" :ladbel-height="formLabelHeight">
                    <el-upload
                    class="avatar-uploader"
                    action="http://localhost:3000/api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccessNew"
                    name="file">
                        <el-image v-if="gameform.img" :src="gameform.img" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="比赛具体事项" :label-width="formLabelWidth">
                    <el-input v-model="gameform.detail" autocomplete="off" type="textarea" :rows="15"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="Add_comfirm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 更新比赛对话框 -->
        <el-dialog title="编辑比赛信息" :visible.sync="editFormVisible">
            <el-form :model="newgameform">
                <el-form-item label="比赛名称" :label-width="formLabelWidth">
                    <el-input v-model="newgameform.title"></el-input>
                </el-form-item>
                <el-form-item label="比赛类型" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="newgameform.type" @change="check">
                        <el-checkbox label="全马"></el-checkbox>
                        <el-checkbox label="半马"></el-checkbox>
                        <el-checkbox label="越野"></el-checkbox>
                        <el-checkbox label="迷你"></el-checkbox>
                        <el-checkbox label="其他"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="报名费用" :label-width="formLabelWidth">
                    <div class="moneybox" v-for="(item,i) in newgameform.type" :key="item">
                        <span>{{item}}：</span>
                        <el-input class="moneyinput" v-model="newgameform.money[i]"></el-input>
                        <span>元</span>
                    </div>
                </el-form-item>
                <el-form-item label="比赛时间" :label-width="formLabelWidth">
                    <el-input v-model="newgameform.time" type = "datetime-local"></el-input>
                </el-form-item>
                <el-form-item label="比赛宣传海报" :label-width="formLabelWidth" :ladbel-height="formLabelHeight"> 
                    <el-upload
                    class="avatar-uploader"
                    action="http://localhost:3000/api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    name="file">
                        <el-image v-if="newgameform.img" :src="newgameform.img" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="比赛具体事项" :label-width="formLabelWidth">
                    <el-input v-model="newgameform.detail" type="textarea" :rows="15"></el-input>
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
            <div class="shaixuan">
                <span class="demonstration">筛选（性别/项目）：</span>
                <el-cascader
                    v-model="value"
                    :options="options"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"
                    clearable></el-cascader>
            </div>
            <el-input placeholder="请输入内容" v-model="grade_search" class="input-with-select" style="width:500px">
                <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:150px">
                    <el-option label="选手名称" value="1"></el-option>
                    <el-option label="选手身份码" value="2"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="PlayerGrade_search()"></el-button>
            </el-input>
            <el-table :data="gradeList" border style="width: 100%;margin-top:20px" :default-sort = "{prop: 'rank'}" height="500">
                <el-table-column prop="rank" label="排名" width="180" sortable></el-table-column>
                <el-table-column prop="playernum" label="选手身份码" width="180"></el-table-column>
                <el-table-column prop="playername" label="选手名称" width="180"></el-table-column>
                <el-table-column prop="sex" label="性别" width="180"></el-table-column>
                <el-table-column prop="type" label="比赛项目" width="180"></el-table-column>
                <el-table-column prop="grade" label="比赛用时"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="gradeDialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="upgradeDialogVisible=true">导入成绩</el-button>
            </span>
        </el-dialog>
        <!-- 上传成绩对话框 -->
        <el-dialog :title="grade_title" :visible.sync="upgradeDialogVisible" center>
            <el-table :data="gradeList" border style="width: 100%;margin-top:20px" height="500">
                <el-table-column prop="playernum" label="选手身份码" width="180"></el-table-column>
                <el-table-column prop="playername" label="选手名称" width="180"></el-table-column>
                <el-table-column prop="sex" label="性别" width="180"></el-table-column>
                <el-table-column prop="type" label="比赛项目" width="180"></el-table-column>
                <el-table-column prop="rank" label="排名">
                    <template slot-scope="scope">
                        <el-input prop="rank" v-model="scope.row.rank"></el-input>
                    </template>    
                </el-table-column>
                <el-table-column prop="grade" label="比赛用时" width="180">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.grade"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upgradeDialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="Grade_upload()">上 传</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created() {
            this.GetGameInfo()
        },
    data() {

        return {
            searchInfo: '',
            grade_title: '',
            gameList: [],
            gradeList: [],
            oldList:[],
            grade_search: '',
            select: '1',
            radio: 3,
            formLabelWidth: '120px',
            formLabelHeight: '50px',
            addFormVisible: false,
            editFormVisible: false,
            deleteDialogVisible: false,
            gradeDialogVisible: false,
            upgradeDialogVisible: false,
            gameform: {
                title: '',
                time: '',
                img: '',
                detail: '',
                money: [],
                type: []
            },
            newgameform: {
                title: '',
                time: '',
                img: '',
                detail: '',
                money: [],
                type: []
            },
            value:[],
            options:[{
                value:'男',
                label:'男子',
                children:[{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                }]
            },{
                value:'女',
                label:'女子',
                children:[{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                }]
            }],
        }
  },

  methods:{
    GetGameInfo() {
        this.$http.post('/game').then(res=>{
            this.gameList = res.data.data
            this.total = res.data.data.length
            console.log(this.gameList)
        })
    },
    search() {
        this.$http.post('/game_search',{title:this.searchInfo}).then(res=>{
            if(res.data.code == 200)
                this.$message.success('查询成功！')
            else
                this.$message.error('未查询到相关比赛')
            this.gameList = res.data.data
            console.log(this.gameList)
        })
    },
    openadd() {
        this.addFormVisible = true
        this.gameform.title = ''
        this.gameform.time = ''
        this.gameform.img = ''
        this.gameform.detail = ''
        this.gameform.money = []
        this.gameform.type = []
    },
    Add_comfirm() {
        this.$http.post('/game_add',{title:this.gameform.title, time:this.gameform.time, img:this.gameform.img, detail:this.gameform.detail, money:JSON.stringify(this.gameform.money), type:JSON.stringify(this.gameform.type)}).then(res=>{
            console.log(res)
            if(res.data.code == 200)
                this.$message.success(res.data.msg)
            else if(res.data.code == 201)
                this.$message.error(res.data.msg)
            this.addFormVisible = false
            this.GetGameInfo()
        })
        this.gameform.title = ''
        this.gameform.time = ''
        this.gameform.img = ''
        this.gameform.detail = ''
        this.gameform.money = []
        this.gameform.type = []
    },
    Edit_comfirm() {
        let id = window.sessionStorage.getItem('id')
        this.$http.post('/game_edit',{id:id, title:this.newgameform.title, time:this.newgameform.time, img:this.newgameform.img, detail:this.newgameform.detail, money:JSON.stringify(this.newgameform.money), type:JSON.stringify(this.newgameform.type)}).then(res=>{
            console.log(res)
            this.GetGameInfo()
        })
        this.$message.success('修改成功！')
        window.sessionStorage.removeItem('id')
        this.editFormVisible = false
    },
    handleAvatarSuccess(res, file) {
        this.newgameform.img = res.data
        console.log(this.newgameform.img)
    },
    handleAvatarSuccessNew(res, file) {
        this.gameform.img = res.data
        console.log(this.gameform.img)
    },
    openedit(title) {
        this.editFormVisible = true
        this.$http.post('/game_locate',{title:title}).then(res=>{
            console.log(res.data)
            window.sessionStorage.setItem('id', res.data.data[0]._id)
            this.newgameform.title = res.data.data[0].title
            res.data.data[0].time = res.data.data[0].time.substring(0,16)
            res.data.data[0].time = res.data.data[0].time.replaceAll(" ","T")
            this.newgameform.time = res.data.data[0].time
            this.newgameform.img = res.data.data[0].img
            this.newgameform.detail = res.data.data[0].detail
            this.newgameform.money = res.data.data[0].money
            this.newgameform.type = res.data.data[0].type
            Object.assign(this.oldList,this.newgameform.type)
        })
    },
    opendelete(title) {
        this.deleteDialogVisible = true
        this.$http.post('/game_locate',{title:title}).then(res=>{
            console.log(res.data)
            window.sessionStorage.setItem('id', res.data.data[0]._id)
        })
    },
    Delete_comfirm() {
        let id = window.sessionStorage.getItem('id')
        this.$http.post('/game_delete',{id:id}).then(res=>{
            this.GetGameInfo()
        })
        this.$message.success('删除成功！')
        window.sessionStorage.removeItem('id')
        this.deleteDialogVisible = false
    },
    opengrade(title,type) {
        this.grade_title = title
        this.gradeDialogVisible = true
        this.gradeList = []
        var len = type.length;
        this.options = [{
                value:'男',
                label:'男子',
                children:[{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                }]
            },{
                value:'女',
                label:'女子',
                children:[{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                },{
                    value:'',
                    label:''
                }]
            }]
        this.value = []
        for(var i = 0;i < len; i++) {
            this.options[0].children[i].label = type[i]
            this.options[0].children[i].value = type[i]
            this.options[1].children[i].label = type[i]
            this.options[1].children[i].value = type[i]
        }
        window.sessionStorage.setItem('title', title)
        this.$http.post('/grade_search',{data:title,opt:"1"}).then(res=>{
            this.gradeList = res.data.data
            console.log(this.gradeList)
        })
    },
    PlayerGrade_search() {
        this.$http.post('/playergrade_search',{id:this.select, title:this.grade_title, playernum:this.grade_search, playername:this.grade_search}).then(res=>{
            console.log(res)
            this.gradeList = res.data.data
        })
    },
    changeRadio(e) {
        var myDate = new Date()
        var i = 0, len = this.gameList.length
        if(this.radio == 6) {
            this.$http.post('/game').then(res=>{
                this.gameList = res.data.data
                len = this.gameList.length
                for(; i<len; i++) {
                    if( Date.parse(this.gameList[i].time) > Date.parse(myDate) ) {
                        this.gameList.splice(i,1)
                        i--
                        len--
                    }
                }
            })
        }
        else if(this.radio == 9) {
            this.$http.post('/game').then(res=>{
                this.gameList = res.data.data
                len = this.gameList.length
                for(; i<len; i++) {
                    if( Date.parse(this.gameList[i].time) < Date.parse(myDate) ) {
                        this.gameList.splice(i,1)
                        i--
                        len--
                    }
                }
            })
        }
        else if(this.radio == 3) {
            this.GetGameInfo()
        }
    },
    Grade_upload() {
        console.log(this.gradeList)
        var i = 0
        var len = this.gradeList.length
        var title = window.sessionStorage.getItem('title')
        for(i,len; i < len; i++) {
            this.$http.post('/grade_upload',{title:title,playernum:this.gradeList[i].playernum, rank:this.gradeList[i].rank, grade:this.gradeList[i].grade}).then(res=>{
                console.log(res)
            })
        }
        this.upgradeDialogVisible = false
    },
    clear() {
        this.GetGameInfo()
    },
    moneyclean() {
        this.gameform.money = []
    },
    inputChange() {
        if(this.searchInfo == '')
            this.GetGameInfo()
    },
    checkChange() {
        this.gameform.money = []
    },
    check() {
        var newList = this.oldList.filter(i => !this.newgameform.type.includes(i))
        if( newList.length != 0 ) {
            newList.forEach(element => {
                var index = element.indexOf(this.oldList)
                this.newgameform.money.splice(index,1)
            });
        }
        this.oldList = [...this.newgameform.type]
    },
    handleChange(value) {
        console.log(value)
        if(value.length != 0) {
            this.$http.post('/grade_search',{data:this.grade_title,opt:"3",sex:value[0],type:value[1]}).then(res=>{
                this.gradeList = res.data.data
                console.log(this.gradeList)
            })
        }else {
            this.$http.post('/grade_search',{data:this.grade_title,opt:"1"}).then(res=>{
                this.gradeList = res.data.data
                console.log(this.gradeList)
            })
        }
        
    },
  }
}
</script>

<style scoped>
    .moneybox {
        display: flex;
        flex-direction: row;
        margin-left: 20px;
    }
    .moneyinput{
        width: 200px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .shaixuan{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        align-items: center;
    }
</style>