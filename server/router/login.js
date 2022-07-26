const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

//注册接口
router.post('/login', async context=>{

    // //GET添加数据
    // let username = "admin4"
    // let password = "123321"
    // let query = `db.collection("admin").add({data: {username:'${username}', password:'${password}'}})`
    // let res = await new getToken().posteve(AddURL,query)
    // console.log(res)
    
    //POST获取前端字段，字段名name
    let {username, password} = context.request.body
    //console.log(username,password)
    const query = `db.collection("admin").where({username:'${username}', password:'${password}'}).get()`
    try {
        const user = await new getToken().posteve(SearchURL,query)
        //console.log(user)
        if(user.data.length == 0)
            new result(context,'账号或密码错误',501).answer()
        else {
            const OBJ = JSON.parse(user.data[0])
            //console.log(OBJ)
            new result(context,'登陆成功',200,{username:OBJ.username}).answer()
        }
    } catch (error) {
        throw new result(e,500)
    }

})

module.exports = router.routes()