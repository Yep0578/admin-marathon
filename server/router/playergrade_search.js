const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/playergrade_search',async context=>{
    let {id,title,playernum,playername} = context.request.body
    let query
    if(id == 1)
        query = `db.collection("gradeinfo").where({playername:"${playername}",title:"${title}"}).get()`
    else
        query = `db.collection("gradeinfo").where({playernum:"${playernum}",title:"${title}"}).get()`

    try {
        const gradeinfo = await new getToken().posteve(SearchURL,query)
        if(gradeinfo.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = gradeinfo.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()