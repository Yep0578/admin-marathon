const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/grade_search',async context=>{
    let {data,opt,sex,type} = context.request.body
    let query

    if( opt == "1")
        query = `db.collection("gradeinfo").where({title:'${data}'}).limit(50).get()`
    else if( opt == "2")
        query = `db.collection("gradeinfo").where({playernum:'${data}'}).get()`
    else if( opt == "3")
        query = `db.collection("gradeinfo").where({title:'${data}',sex:'${sex}',type:'${type}'}).get()`

    try {
        const gradeinfo = await new getToken().posteve(SearchURL,query)
        if(gradeinfo.data == null)
            new result(context,'未找到相关比赛成绩',201).answer()
        else {
            let data = gradeinfo.data.map(item=>{return JSON.parse(item)})
            console.log(gradeinfo.data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()