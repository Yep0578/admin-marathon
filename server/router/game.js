const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/game',async context=>{
    const query = `db.collection("gameinfo").limit(20).orderBy("time","desc").get()`
    
    try {
        const game = await new getToken().posteve(SearchURL,query)
        //console.log(game)
        if(game.data.length == 0)
            new result(context,'最近暂无比赛',201).answer()
        else {
                let data = game.data.map(item=>{return JSON.parse(item)})
                //console.log(data)
                new result(context,'查询成功',200,data).answer()
        }
    } catch (error) {
        throw new result(e,500)
    }
})

module.exports = router.routes()