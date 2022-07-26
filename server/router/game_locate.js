const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/game_locate',async context=>{
    let {title} = context.request.body
    const query = `db.collection("gameinfo").where({title:'${title}'}).limit(20).get()`
    try {
        const gameinfo = await new getToken().posteve(SearchURL,query)
        if(gameinfo.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = gameinfo.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()