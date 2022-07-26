const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/user_locate',async context=>{
    let {playernum} = context.request.body
    const query = `db.collection("playerinfo").where({playernum:'${playernum}'}).get()`
    try {
        const playerinfo = await new getToken().posteve(SearchURL,query)
        if(playerinfo.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = playerinfo.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()