const router = require('koa-router')()
const result = require('../config/result')
const {getToken, AddURL, SearchURL} = require('../config/databaseapi')

router.post('/user_search',async context=>{
    let {id,playernum,playername} = context.request.body
    let query
    if(id == 2)
        query = `db.collection("playerinfo").where({playername:db.RegExp({
                                                                        regexp: '${playername}',
                                                                        options:'i',
                                                                    })
                                                                }).get()`
    else
        query = `db.collection("playerinfo").where({playernum:db.RegExp({
                                                                        regexp: '${playernum}',
                                                                        options:'i',
                                                                    })
                                                                }).get()`

    try {
        const userinfo = await new getToken().posteve(SearchURL,query)
        if(userinfo.data.length == 0)
            new result(context,'未找到相关比赛',201).answer()
        else {
            let data = userinfo.data.map(item=>{return JSON.parse(item)})
            console.log(data)
            new result(context,'查询成功',200,data).answer()
        }
    } catch (e) {
        throw new result(e,500)
    }
})

module.exports = router.routes()